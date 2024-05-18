import { Client, Room } from 'colyseus.js'
import store from '../stores'
import { setSessionId, setPlayerNameMap, removePlayerNameMap } from '../stores/UserStore'
import {
  setLobbyJoined,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
} from '../stores/RoomStore'
import { IMeeting, IOfficeState, IPlayer } from '../types/ISpaceState'
import WebRTC from '../web/WebRTC'
import { GameEvent, phaserEvents } from '../events/EventCenter'
import { IRoomData, RoomType } from '../types/Rooms'
import {
  loadMapChatMessage,
  pushChatMessage,
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
} from '../stores/ChatStore'
import { ItemType } from '../types/Items'
import { Message } from '../types/Messages'
import { ACCESS_TOKEN_KEY } from '../utils/util'
import { API_URL } from '../constant'
import Cookies from 'js-cookie'

export default class Network {
  private static instance: Network | null = null; // Biến static instance

  private client: Client
  private room?: Room<IOfficeState>
  private lobby!: Room
  webRTC?: WebRTC

  mySessionId!: string

  constructor() {
    Network.instance = this;
    console.log('Construct Network')
    const endpoint = API_URL.replace('https', `wss`)
    // const endpoint = API_URL.replace(`http`, `ws`)
    this.client = new Client(endpoint)
    this.client.auth.token = Cookies.get(ACCESS_TOKEN_KEY) as string
    this.joinLobbyRoom().then(() => {
      console.log('Lobby joined')
      store.dispatch(setLobbyJoined(true))
    })

    phaserEvents.on(GameEvent.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(GameEvent.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    phaserEvents.on(GameEvent.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)
  }

  static getInstance(): Network | null {
    return Network.instance;
  }

  public disconnectClient() {
    console.log('Disconnecting client')
    this.room?.leave()
  }

  public disconnectWebRTC() {
    console.log('Disconnecting webRTC')
    this.webRTC?.disconnect()
  }

  /**
   * method to join Colyseus' built-in LobbyRoom, which automatically notifies
   * connected clients whenever rooms with "realtime listing" have updates
   */
  async joinLobbyRoom() {
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)

    this.lobby.onMessage('rooms', (rooms) => {
      store.dispatch(setAvailableRooms(rooms))
    })

    this.lobby.onMessage('+', ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }))
    })

    this.lobby.onMessage('-', (roomId) => {
      store.dispatch(removeAvailableRooms(roomId))
    })
  }

  // method to join the public lobby
  async joinOrCreatePublic() {
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC)
    this.initialize()
  }

  // // method to join a custom room
  // async joinCustomById(roomId: string, password: string | null) {
  //   this.room = await this.client.joinById(roomId, { password })
  //   this.initialize()
  // }

  // method to join a custom room
  async joinCustomById(roomId: string) {
    this.room = await this.client.joinById(roomId)
    this.initialize()
  }

  // method to create a custom room
  async createCustom(roomData: IRoomData) {
    this.room = await this.client.create(RoomType.CUSTOM, roomData)
    console.log('Room created')
    this.initialize()
  }

  // set up all network listeners before the game starts
  async initialize() {
    if (!this.room) return

    console.log('Initilize Network')

    this.lobby.leave()
    this.mySessionId = this.room.sessionId
    store.dispatch(setSessionId(this.room.sessionId))
    this.webRTC = new WebRTC(this.mySessionId, this)

    this.webRTC.checkPreviousPermission()

    // new instance added to the players MapSchema
    this.room.state.players.onAdd = (player: IPlayer, key: string) => {
      if (key === this.mySessionId) return

      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          phaserEvents.emit(GameEvent.PLAYER_UPDATED, field, value, key)

          // when a new player finished setting up player name
          if (field === 'playerName' && value !== '') {
            phaserEvents.emit(GameEvent.PLAYER_JOINED, player, key)
            store.dispatch(setPlayerNameMap({ id: key, name: value }))
            store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    // an instance removed from the players MapSchema
    this.room.state.players.onRemove = (player: IPlayer, key: string) => {
      phaserEvents.emit(GameEvent.PLAYER_LEFT, key)
      this.webRTC?.deleteVideoStream(key)
      this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(pushPlayerLeftMessage(player.playerName))
      store.dispatch(removePlayerNameMap(key))
    }

    // // new instance added to the computers MapSchema
    // this.room.state.meetings.onAdd = (meeting: IMeeting, key: string) => {
    //   // track changes on every child object's connectedUser
    //   meeting.connectedUser.onAdd = (item, index) => {
    //     phaserEvents.emit(GameEvent.ITEM_USER_ADDED, item, key, ItemType.MEETING)
    //   }
    //   meeting.connectedUser.onRemove = (item, index) => {
    //     phaserEvents.emit(GameEvent.ITEM_USER_REMOVED, item, key, ItemType.MEETING)
    //   }
    // }
    this.room.state.mapMessages.onChange = (item, key: string) => {
      console.log(`mapMessages change`, item, key)
    }
    // new instance added to the chatMessages ArraySchema
    this.room.state.mapMessages.onAdd = (item, key: string) => {
      console.log(`mapMessages onAdd`, item, key)
      item.onChange = (changes) => {
        changes.forEach((change) => console.log({ change }))
      }
      store.dispatch(pushChatMessage({ chatId: key, message: item }))
    }

    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      console.log(`// when the server sends room data`)
      console.log({ content })
      store.dispatch(setJoinedRoomData(content))
    })
    // when the server sends room data
    this.room.onMessage(Message.LOAD_CHAT, ({ mapChatMessages }) => {
      ///store.dispatch(setJoinedRoomData(content))
      store.dispatch(loadMapChatMessage(mapChatMessages))
    })
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
    this.room.onMessage(Message.STOP_SCREEN_SHARE, (clientId: string) => {
      const meetingState = store.getState().meeting
      meetingState.shareScreenManager?.onUserLeft(clientId)
    })
  }

  // method to register event listener and call back function when a item user added
  onChatMessageAdded(callback: (playerId: string, content: string) => void, context?: any) {
    phaserEvents.on(GameEvent.UPDATE_DIALOG_BUBBLE, callback, context)
  }

  // method to register event listener and call back function when a item user added
  onItemUserAdded(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.ITEM_USER_ADDED, callback, context)
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
  onMyPlayerReady(callback: (key: string) => void, context?: any) {
    phaserEvents.on(GameEvent.MY_PLAYER_READY, callback, context)
  }

  // method to register event listener and call back function when my video is connected
  onMyPlayerMediaConnected(callback: (key: string) => void, context?: any) {
    phaserEvents.on(GameEvent.MY_PLAYER_VIDEO_CONNECTED, callback, context)
  }

  // method to register event listener and call back function when a player updated
  onPlayerUpdated(
    callback: (field: string, value: number | string, key: string) => void,
    context?: any
  ) {
    phaserEvents.on(GameEvent.PLAYER_UPDATED, callback, context)
  }

  // method to send player updates to Colyseus server
  updatePlayer(currentX: number, currentY: number, currentAnim: string) {
    this.room?.send(Message.UPDATE_PLAYER, { x: currentX, y: currentY, anim: currentAnim })
  }

  // method to send player name to Colyseus server
  updatePlayerName(currentName: string) {
    this.room?.send(Message.UPDATE_PLAYER_NAME, { name: currentName })
  }

  // method to send ready-to-connect signal to Colyseus server
  readyToConnect() {
    this.room?.send(Message.READY_TO_CONNECT)
    phaserEvents.emit(GameEvent.MY_PLAYER_READY)
  }

  // method to send ready-to-connect signal to Colyseus server
  mediaConnected() {
    this.room?.send(Message.VIDEO_CONNECTED)
    phaserEvents.emit(GameEvent.MY_PLAYER_VIDEO_CONNECTED)
  }

  // method to send stream-disconnection signal to Colyseus server
  playerStreamDisconnect(id: string) {
    this.room?.send(Message.DISCONNECT_STREAM, { clientId: id })
    this.webRTC?.deleteVideoStream(id)
  }

  connectToMeeting(id: string) {
    this.room?.send(Message.CONNECT_TO_MEETING, { meetingId: id })
  }

  disconnectFromMeeting(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_MEETING, { meetingId: id })
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

  addChatMessage({ content, chatId }: { content: string; chatId: string }) {
    console.log({ content, chatId })
    this.room?.send(Message.ADD_CHAT_MESSAGE, { content, chatId })
  }
  loadChat() {
    this.room?.send(Message.LOAD_CHAT)
  }
}
