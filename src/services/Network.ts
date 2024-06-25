import { Client, Room } from 'colyseus.js'
import store from '../stores'
import { setSessionId } from '../stores/UserStore'
import {
  removeMember,
  setNetworkConstructed,
  setNetworkInitialized,
  updateMemberOnlineStatus,
  updateMemberOnlineStatusThunk,
} from '../stores/RoomStore'
import { IChair, IMeeting, IOfficeState, IPlayer, IWhiteboard } from '../types/ISpaceState'
import WebRTC from '../web/WebRTC'
import { GameEvent, phaserEvents } from '../events/EventCenter'
import { IRoomData, RoomType, IMessagePayload, ICreateCustomRoomParams } from '../types/Rooms'
import { addChat, loadMapChatMessage, pushChatMessage } from '../stores/ChatStore'
import { ItemType } from '../types/Items'
import { Message } from '../types/Messages'
import { ACCESS_TOKEN_KEY } from '../utils/util'
import { API_URL } from '../constant'
import Cookies from 'js-cookie'
import { disconnectMeeting, openMeetingDialog } from '../stores/MeetingStore'
import { GetMsgByChatId, GetOneChat } from '../apis/ChatApis'
import { isApiSuccess } from '../apis/util'
import { setWhiteboardUrls } from '../stores/WhiteboardStore'
import { toast } from 'react-toastify'
import { IChat } from '../interfaces/chat'

export default class Network {
  private static instance: Network | null = null // Biến static instance

  private client: Client
  room?: Room<IOfficeState>
  // private lobby!: Room
  webRTC?: WebRTC

  mySessionId!: string

  constructor() {
    Network.instance = this
    console.log('Network::constructor Construct Network')
    // const endpoint = API_URL.replace('https', `wss`)
    const endpoint = API_URL.replace(`http`, `ws`)
    this.client = new Client(endpoint)
    this.client.auth.token = Cookies.get(ACCESS_TOKEN_KEY) as string

    phaserEvents.on(GameEvent.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(GameEvent.MY_PLAYER_MEETING_STATUS_CHANGE, this.updatePlayerMeetingStatus, this)
    phaserEvents.on(GameEvent.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    phaserEvents.on(GameEvent.MY_PLAYER_CHARACTER_ID_CHANGE, this.updatePlayerCharacterId, this)
    phaserEvents.on(GameEvent.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)

    store.dispatch(setNetworkConstructed(true))
  }

  static getInstance(): Network | null {
    return Network.instance
  }

  public disconnectNetwork() {
    console.log('Network::disconnectNetwork Disconnecting network')
    this.room?.leave()
  }

  public disconnectWebRTC() {
    console.log('Network::disconnectWebRTC Disconnecting webRTC')
    this.webRTC?.disconnect()
  }

  public disconnectMeeting() {
    console.log('Network::disconnectMeeting Disconnecting meeting')
    store.dispatch(disconnectMeeting())
    let activeMeetingId = store.getState().meeting.activeMeetingId
    this.disconnectFromMeeting(activeMeetingId || '')
  }

  // method to join the public lobby
  async joinOrCreatePublic() {
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC)
    this.initialize()
  }

  // method to join a custom room
  async joinCustomById(roomId: string) {
    this.room = await this.client.joinById(roomId)
    this.initialize()
  }

  // method to create a custom room
  async createCustom(params: ICreateCustomRoomParams) {
    this.room = await this.client.create(RoomType.CUSTOM, params)
    console.log('Network::createCustom Room created')
    this.initialize()
  }

  // set up all network listeners before the game starts
  async initialize() {
    if (!this.room) return

    console.log('Network::initialize Initilize Network')

    // this.lobby?.leave()
    this.mySessionId = this.room.sessionId
    store.dispatch(setSessionId(this.room.sessionId))
    this.webRTC = new WebRTC(this.mySessionId, this)

    this.webRTC.checkPreviousPermission()

    //temp: update user online status to true
    store.dispatch(updateMemberOnlineStatusThunk(store.getState().user.userId, true))
    // new instance added to the players MapSchema
    this.room.state.players.onAdd = (player: IPlayer, key: string) => {
      if (key === this.mySessionId) return
      store.dispatch(updateMemberOnlineStatusThunk(player._id, true))
      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          phaserEvents.emit(GameEvent.PLAYER_UPDATED, field, value, key)

          // when a new player finished setting up player name
          if (field === 'playerName' && value !== '') {
            phaserEvents.emit(GameEvent.PLAYER_JOINED, player, key)
            // store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    // an instance removed from the players MapSchema
    this.room.state.players.onRemove = (player: IPlayer, key: string) => {
      phaserEvents.emit(GameEvent.PLAYER_LEFT, key)
      this.webRTC?.deleteVideoStream(key)
      this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(updateMemberOnlineStatus({ memberId: player._id, online: false }))
      // store.dispatch(pushPlayerLeftMessage(player.playerName))
      // store.dispatch(updateMember({ member: { online: false, role: 'user', user: player, lastJoinedAt: '' } }))
    }

    this.room.state.chairs.onAdd = (chair: IChair, key: string) => {
      chair.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          if (field === 'connectedUser') {
            phaserEvents.emit(GameEvent.CHAIR_CONNECT_USER_CHANGE, value, key, ItemType.CHAIR)
          }
        })
      }
    }

    // new instance added to the meetings MapSchema
    this.room.state.meetings.onAdd = (meeting: IMeeting, key: string) => {
      // track changes on every child object's connectedUser
      meeting.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(GameEvent.ITEM_USER_ADDED, item, key, ItemType.MEETING)
      }
      meeting.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(GameEvent.ITEM_USER_REMOVED, item, key, ItemType.MEETING)
      }
      meeting.onChange = (changes) => {
        changes.forEach((c) => {
          if (c.field === 'isOpen') {
            phaserEvents.emit(GameEvent.MEETING_STATE_CHANGE, c.value, key, ItemType.MEETING)
          }
          if (c.field === 'title') {
            phaserEvents.emit(GameEvent.MEETING_TITLE_CHANGE, c.value, key, ItemType.MEETING)
          }
          if (c.field === 'chatId') {
            // console.log('Network:: GameEvent.MEETING_CHATID_CHANGE', c.value)
            phaserEvents.emit(GameEvent.MEETING_CHATID_CHANGE, c.value, key, ItemType.MEETING)
          }
          if (c.field === 'isLocked') {
            if (meeting.connectedUser.has(this.mySessionId)) {
              if (c.value === true) toast(`The meeting is locked`)
              else toast(`The meeting is locked`)
            }
            phaserEvents.emit(GameEvent.MEETING_ISLOCK_CHANGE, c.value, key, ItemType.MEETING)
          }
          if (c.field === 'adminUser') {
            if (c.value === this.mySessionId) toast(`You're now admin of the meeting`)
            phaserEvents.emit(GameEvent.MEETING_ADMIN_CHANGE, c.value, key, ItemType.MEETING)
          }
        })
      }
    }

    // new instance added to the whiteboards MapSchema
    this.room.state.whiteboards.onAdd = (whiteboard: IWhiteboard, key: string) => {
      store.dispatch(
        setWhiteboardUrls({
          whiteboardId: key,
          roomId: whiteboard.roomId,
        })
      )
      // track changes on every child object's connectedUser
      whiteboard.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(GameEvent.ITEM_USER_ADDED, item, key, ItemType.WHITEBOARD)
      }
      whiteboard.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(GameEvent.ITEM_USER_REMOVED, item, key, ItemType.WHITEBOARD)
      }
    }

    // when the server sends room data
    // this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
    //   console.log(`Network::onMessage SEND_ROOM_DATA`, { content })
    //   store.dispatch(setJoinedRoomData(content))
    // })
    // when the server sends room data
    // this.room.onMessage(Message.LOAD_CHAT, ({ mapChatMessages }) => {
    //   ///store.dispatch(setJoinedRoomData(content))
    //   store.dispatch(loadMapChatMessage(mapChatMessages))
    // })
    // when a user sends a message
    this.room.onMessage(Message.ADD_CHAT_MESSAGE, ({ clientId, chatId, message }) => {
      //
      store.dispatch(
        pushChatMessage({
          chatId,
          message,
        })
      )
      phaserEvents.emit(GameEvent.UPDATE_DIALOG_BUBBLE, clientId, message.message.text)
    })

    // when a peer disconnects with myPeer
    this.room.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
      this.webRTC?.deleteOnCalledVideoStream(clientId)
    })

    // when a meeting user stops sharing screen
    this.room.onMessage(Message.MEETING_STOP_CAMERA_SHARE, (clientId: string) => {
      const meetingState = store.getState().meeting
      meetingState.userMediaManager?.onUserLeft(clientId)
    })

    // when a meeting user stops sharing screen
    this.room.onMessage(Message.STOP_SCREEN_SHARE, (clientId: string) => {
      const meetingState = store.getState().meeting
      meetingState.shareScreenManager?.onUserLeft(clientId)
    })

    // when a meeting user stops sharing screen
    this.room.onMessage(Message.MEMBER_LEAVE, (message: { userId: string }) => {
      store.dispatch(removeMember(message.userId))
    })

    this.room.onMessage(Message.ADD_CHAT, async (chat: IChat) => {
      console.log(`Network::onMessgae ADD_CHAT ${chat._id}`)
      const msgResponse = await GetMsgByChatId({
        roomId: store.getState().room.roomData._id,
        chatId: chat._id,
      })
      if (isApiSuccess(msgResponse)) {
        store.dispatch(addChat({ chat: chat, mapMessage: msgResponse.result }))
      }
    })

    // when receive info from server when join a new meeting
    this.room.onMessage(
      Message.CONNECT_TO_MEETING,
      async (message: { meetingId: string; title: string }) => {
        console.log(
          `Network::onMessage CONNECT_TO_MEETING: meetingId: ${message.meetingId}, title: ${message.title}`
        )
        this.webRTC?.disconnect()

        const microphoneON = store.getState().user.microphoneON
        const cameraON = store.getState().user.cameraON
        store.dispatch(
          openMeetingDialog({
            meetingId: message.meetingId,
            myPlayerId: this.mySessionId,
            microphoneON,
            cameraON,
          })
        )
      }
    )
    this.room.onMessage(Message.ROOM_DISPOSE, async (msg: { message: string }) => {
      toast(msg.message)
      setTimeout(() => {
        window.location.href = `/app`
      }, 5000)
    })
    // // receive meeting state when join
    // this.room.onMessage(
    //   Message.MEETING_RECEIVE,
    //   ({
    //     connectedUser,
    //     adminUser,
    //     isLocked,
    //   }: {
    //     connectedUser: Set<string>
    //     adminUser: string
    //     isLocked: boolean
    //   }) => {
    //     store.dispatch(setMeetingState({ connectedUser, adminUser, isLocked }))
    //   }
    // )

    store.dispatch(setNetworkInitialized(true))
  }

  // #region on events

  // method to register event listener and call back function when a item user added
  onChatMessageAdded(callback: (playerId: string, content: string) => void, context?: any) {
    phaserEvents.on(GameEvent.UPDATE_DIALOG_BUBBLE, callback, context)
  }

  onChairConnectedUserChange(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.CHAIR_CONNECT_USER_CHANGE, callback, context)
  }

  // method to register event listener and call back function when a item user added
  onItemUserAdded(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.ITEM_USER_ADDED, callback, context)
  }

  onSetMeetingState(
    callback: (isOpen: boolean, itemId: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.MEETING_STATE_CHANGE, callback, context)
  }

  onSetMeetingTitle(
    callback: (title: string, itemId: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.MEETING_TITLE_CHANGE, callback, context)
  }

  onSetMeetingChatId(
    callback: (chatId: string, itemId: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.MEETING_CHATID_CHANGE, callback, context)
  }

  onSetMeetingAdmin(
    callback: (adminId: string, itemId: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.MEETING_ADMIN_CHANGE, callback, context)
  }

  onSetMeetingIsLock(
    callback: (isLock: boolean, itemId: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.MEETING_ISLOCK_CHANGE, callback, context)
  }

  // method to register event listener and call back function when a item user removed
  onItemUserRemoved(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.ITEM_USER_REMOVED, callback, context)
  }

  // method to register event listener and call back function when a player joined
  onPlayerJoined(callback: (Player: IPlayer, key: string) => void, context?: any) {
    phaserEvents.on(GameEvent.PLAYER_JOINED, callback, context)
  }

  // method to register event listener and call back function when a player left
  onPlayerLeft(callback: (key: string) => void, context?: any) {
    phaserEvents.on(GameEvent.PLAYER_LEFT, callback, context)
  }

  // method to register event listener and call back function when myPlayer is ready to connect
  onMyPlayerReady(callback: (ready: boolean) => void, context?: any) {
    phaserEvents.on(GameEvent.MY_PLAYER_READY, callback, context)
  }

  // method to register event listener and call back function when my video is connected
  onMyPlayerMediaConnected(callback: (connected: boolean) => void, context?: any) {
    phaserEvents.on(GameEvent.MY_PLAYER_VIDEO_CONNECTED, callback, context)
  }

  // method to register event listener and call back function when a player updated
  onPlayerUpdated(
    callback: (field: string, value: number | string, key: string) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.PLAYER_UPDATED, callback, context)
  }
  // #endregion on events

  // #region send events
  // method to send player updates to Colyseus server
  updatePlayer(currentX: number, currentY: number, currentAnim: string) {
    this.room?.send(Message.UPDATE_PLAYER, { x: currentX, y: currentY, anim: currentAnim })
  }

  // method to send player name to Colyseus server
  updatePlayerName(currentName: string) {
    this.room?.send(Message.UPDATE_PLAYER_NAME, { name: currentName })
  }

  updatePlayerCharacterId(id: string) {
    this.room?.send(Message.UPDATE_PLAYER_CHARACTER_ID, { id })
  }

  // method to send player name to Colyseus server
  updatePlayerMeetingStatus(isInMeeting: boolean) {
    this.room?.send(Message.UPDATE_PLAYER_MEETING_STATUS, { isInMeeting: isInMeeting })
  }

  // method to send ready-to-connect signal to Colyseus server
  readyToConnect(ready: boolean) {
    this.room?.send(Message.READY_TO_CONNECT, { ready })
    phaserEvents.emit(GameEvent.MY_PLAYER_READY, ready)
  }

  // method to send ready-to-connect signal to Colyseus server
  mediaConnected(connected: boolean) {
    this.room?.send(Message.MEDIA_CONNECTED, { connected })
    phaserEvents.emit(GameEvent.MY_PLAYER_VIDEO_CONNECTED, connected)
  }

  // method to send stream-disconnection signal to Colyseus server
  playerStreamDisconnect(id: string) {
    this.room?.send(Message.DISCONNECT_STREAM, { clientId: id })
    this.webRTC?.deleteVideoStream(id)
  }

  connectToChair(id: string) {
    this.room?.send(Message.CONNECT_TO_CHAIR, { chairId: id })
  }

  disconnectFromChair(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_CHAIR, { chairId: id })
  }

  connectToMeeting(userId: string, roomId: string, meetingId: string, title?: string) {
    this.room?.send(Message.CONNECT_TO_MEETING, {
      roomId,
      userId,
      meetingId,
      title,
    })
  }
  lockMeeting(id: string) {
    this.room?.send(Message.MEETING_LOCK, { meetingId: id })
  }
  unlockMeeting(id: string) {
    this.room?.send(Message.MEETING_UNLOCK, { meetingId: id })
  }

  disconnectFromMeeting(id: string) {
    if (!id) return
    console.log('Network::disconnectFromMeeting DISCONNECT_FROM_MEETING, id: ' + id)
    this.room?.send(Message.DISCONNECT_FROM_MEETING, { meetingId: id })
    this.webRTC?.checkPreviousPermission()
  }

  connectToWhiteboard(id: string) {
    this.room?.send(Message.CONNECT_TO_WHITEBOARD, { whiteboardId: id })
  }

  disconnectFromWhiteboard(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_WHITEBOARD, { whiteboardId: id })
  }

  onStopScreenShare(id: string) {
    this.room?.send(Message.STOP_SCREEN_SHARE, { meetingId: id })
  }

  onStopCameraShare(id: string) {
    this.room?.send(Message.MEETING_STOP_CAMERA_SHARE, { meetingId: id })
  }

  addChatMessage(payload: IMessagePayload) {
    console.log('Network::addChatMessage send messgae', payload)
    this.room?.send(Message.ADD_CHAT_MESSAGE, payload)
  }
  // #endregion send events
}
