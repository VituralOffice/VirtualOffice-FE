import Phaser from 'phaser'

import { createCharacterAnims } from '../anims/CharacterAnims'

import '../characters/MyPlayer'
import '../characters/OtherPlayer'
import MyPlayer from '../characters/MyPlayer'
import OtherPlayer from '../characters/OtherPlayer'
import PlayerSelector from '../characters/PlayerSelector'
import Network from '../services/Network'

import store from '../stores'
import { setFocused, setShowChat } from '../stores/ChatStore'
import { Keyboard, NavKeys } from '../types/KeyboardState'
import Chair from '../items/Chair'
import Item from '../items/Item'
import { PlayerBehavior } from '../types/PlayerBehaviour'
import { IPlayer } from '../types/ISpaceState'
import { ItemType } from '../types/Items'
import { Meeting } from '../web/meeting/Meeting'
import Whiteboard from '../items/WhiteBoard'
import { closeMeetingDialog, openMeetingDialog } from '../stores/MeetingStore'

export default class Game extends Phaser.Scene {
  private static instance: Game | null = null // Biến static instance

  network!: Network
  private cursors!: NavKeys
  private keyE!: Phaser.Input.Keyboard.Key
  private keyR!: Phaser.Input.Keyboard.Key
  private map!: Phaser.Tilemaps.Tilemap
  myPlayer!: MyPlayer
  private playerSelector!: Phaser.GameObjects.Zone
  private otherPlayers!: Phaser.Physics.Arcade.Group
  otherPlayerMap = new Map<string, OtherPlayer>()
  meetingMap = new Map<string, Meeting>()
  chairMap = new Map<string, Chair>()
  chairGroups = new Map<string, Array<Chair>>()
  whiteboardMap = new Map<string, Whiteboard>()

  constructor() {
    super('game')
    console.log('Construct Game')
    Game.instance = this
  }

  static getInstance(): Game | null {
    return Game.instance
  }

  registerKeys() {
    this.cursors = {
      ...this.input.keyboard!.createCursorKeys(),
      ...(this.input.keyboard!.addKeys('W,S,A,D') as Keyboard),
    }

    // maybe we can have a dedicated method for adding keys if more keys are needed in the future
    this.keyE = this.input.keyboard!.addKey('E')
    this.keyR = this.input.keyboard!.addKey('R')
    this.input.keyboard!.disableGlobalCapture()
    this.input.keyboard!.on('keydown-ENTER', (event) => {
      store.dispatch(setShowChat(true))
      store.dispatch(setFocused(true))
    })
    this.input.keyboard!.on('keydown-ESC', (event) => {
      store.dispatch(setShowChat(false))
    })
  }

  disableKeys() {
    this.input.keyboard!.enabled = false
  }

  enableKeys() {
    this.input.keyboard!.enabled = true
  }

  create(data: { network: Network }) {
    if (!data.network) {
      throw new Error('server instance missing')
    } else {
      this.network = data.network
    }

    createCharacterAnims(this.anims)
    // console.log('create character anims')

    this.map = this.make.tilemap({ key: 'tilemap' })
    const FloorAndGround = this.map.addTilesetImage('FloorAndGround', 'tiles_wall')

    const groundLayer = this.map.createLayer('Ground', FloorAndGround!)
    groundLayer!.setCollisionByProperty({ collides: true })

    // debugDraw(groundLayer, this)

    this.myPlayer = this.add.myPlayer(
      this.map.widthInPixels / 2,
      this.map.heightInPixels / 2,
      'adam',
      this.network.mySessionId
    )
    this.playerSelector = new PlayerSelector(this, 0, 0, 16, 16)

    // import chair objects from Tiled map to Phaser
    const chairs = this.physics.add.staticGroup({ classType: Chair })
    const chairLayer = this.map.getObjectLayer('Chair')
    chairLayer!.objects.forEach((chairObj, index) => {
      const item = this.addObjectFromTiled(chairs, chairObj, 'chairs', 'chair') as Chair
      item.itemDirection = chairObj.properties[0].value
      item.chairId = index.toString()
      if (chairObj.properties[1]) {
        const chairGroupID = chairObj.properties[1].value
        item.groupId = chairGroupID
        if (!this.chairGroups.has(chairGroupID)) {
          this.chairGroups.set(chairGroupID, [])
        }
        this.chairGroups.get(chairGroupID)!.push(item)
      }

      this.chairMap.set(String(index), item)
    })

    // import whiteboards objects from Tiled map to Phaser
    const whiteboards = this.physics.add.staticGroup({ classType: Whiteboard })
    const whiteboardLayer = this.map.getObjectLayer('Whiteboard')
    whiteboardLayer!.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(
        whiteboards,
        obj,
        'whiteboards',
        'whiteboard'
      ) as Whiteboard
      const id = `${i}`
      item.id = id
      this.whiteboardMap.set(id, item)
    })

    // init meeting manager
    for (let i = 0; i < 5; i++) {
      this.meetingMap.set(String(i), new Meeting(String(i)))
    }

    // import other objects from Tiled map to Phaser
    this.addGroupFromTiled('Wall', 'tiles_wall', 'FloorAndGround', false)
    this.addGroupFromTiled('ObjectsOnCollide', 'office', 'Modern_Office_Black_Shadow', true)
    this.addGroupFromTiled('Objects', 'office', 'Modern_Office_Black_Shadow', false)
    this.addGroupFromTiled('GenericObjectsOnCollide', 'generic', 'Generic', true)
    this.addGroupFromTiled('GenericObjects', 'generic', 'Generic', false)
    this.addGroupFromTiled('BasementOnCollide', 'basement', 'Basement', true)
    this.addGroupFromTiled('Basement', 'basement', 'Basement', false)
    this.addGroupFromTiled('VendingMachine', 'vendingmachines', 'vendingmachine', true)

    this.otherPlayers = this.physics.add.group({ classType: OtherPlayer })

    this.cameras.main.zoom = 1.5
    this.cameras.main.startFollow(this.myPlayer, true)

    this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], groundLayer!)

    this.physics.add.overlap(
      this.playerSelector,
      // [chairs, meetings],
      [chairs, whiteboards],
      this.handleItemSelectorOverlap,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.myPlayer,
      this.otherPlayers,
      this.handlePlayersOverlap,
      undefined,
      this
    )

    // register network event listeners
    this.network.onPlayerJoined(this.handlePlayerJoined, this)
    this.network.onPlayerLeft(this.handlePlayerLeft, this)
    this.network.onMyPlayerReady(this.handleMyPlayerReady, this)
    this.network.onMyPlayerMediaConnected(this.handleMyMediaConnected, this)
    this.network.onPlayerUpdated(this.handlePlayerUpdated, this)
    this.network.onItemUserAdded(this.handleItemUserAdded, this)
    this.network.onSetMeetingState(this.handleSetMeetingState, this)
    this.network.onSetMeetingTitle(this.handleMeetingTitleChange, this)
    this.network.onSetMeetingChatId(this.handleMeetingChatIdChange, this)
    this.network.onSetMeetingAdmin(this.handleMeetingAdminChange, this)
    this.network.onSetMeetingIsLock(this.handleMeetingIsLockChange, this)
    this.network.onItemUserRemoved(this.handleItemUserRemoved, this)
    this.network.onChatMessageAdded(this.handleChatMessageAdded, this)
    this.network.onChairConnectedUserChange(this.handleChairUserConnectedChange, this)

    // this.registerKeys();
    // this.myPlayer.setPlayerName(store.getState().user.playerName);
    // this.myPlayer.setPlayerTexture(avatars[store.getState().user.character_id].name);
    // this.network.readyToConnect();
  }

  private handleItemSelectorOverlap(playerSelector, selectionItem) {
    const currentItem = playerSelector.selectedItem as Item
    // currentItem is undefined if nothing was perviously selected
    if (currentItem) {
      // if the selection has not changed, do nothing
      if (currentItem === selectionItem || currentItem.depth >= selectionItem.depth) {
        return
      }
      // if selection changes, clear pervious dialog
      if (this.myPlayer.playerBehavior !== PlayerBehavior.SITTING) currentItem.clearDialogBox()
    }

    // set selected item and set up new dialog
    playerSelector.selectedItem = selectionItem
    selectionItem.onOverlapDialog()
  }

  private addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    const actualX = object.x! + object.width! * 0.5
    const actualY = object.y! - object.height! * 0.5
    const obj = group
      .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName)!.firstgid)
      .setDepth(actualY)
    return obj
  }

  private addGroupFromTiled(
    objectLayerName: string,
    key: string,
    tilesetName: string,
    collidable: boolean
  ) {
    const group = this.physics.add.staticGroup()
    const objectLayer = this.map.getObjectLayer(objectLayerName)
    objectLayer!.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5
      const actualY = object.y! - object.height! * 0.5
      group
        .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName)!.firstgid)
        .setDepth(actualY)
    })
    if (this.myPlayer && collidable)
      this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], group)
  }

  // function to add new player to the otherPlayer group
  private handlePlayerJoined(newPlayer: IPlayer, id: string) {
    const otherPlayer = this.add.otherPlayer(
      newPlayer.x,
      newPlayer.y,
      'adam',
      id,
      newPlayer.playerName
    )
    this.otherPlayers.add(otherPlayer)
    this.otherPlayerMap.set(id, otherPlayer)
  }

  // function to remove the player who left from the otherPlayer group
  private handlePlayerLeft(id: string) {
    if (this.otherPlayerMap.has(id)) {
      const otherPlayer = this.otherPlayerMap.get(id)
      if (!otherPlayer) return
      this.otherPlayers.remove(otherPlayer, true, true)
      this.otherPlayerMap.delete(id)
    }
  }

  private handleMyPlayerReady(ready: boolean) {
    this.myPlayer.readyToConnect = ready
  }

  private handleMyMediaConnected(connected: boolean) {
    this.myPlayer.mediaConnected = connected
  }

  // function to update target position upon receiving player updates
  private handlePlayerUpdated(field: string, value: number | string, id: string) {
    const otherPlayer = this.otherPlayerMap.get(id)
    otherPlayer?.updateOtherPlayer(field, value)
  }

  private handlePlayersOverlap(myPlayer, otherPlayer) {
    otherPlayer.makeCall(myPlayer, this.network?.webRTC)
  }

  private handleItemUserAdded(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.MEETING) {
      const meeting = this.meetingMap.get(itemId)
      meeting?.addCurrentUser(playerId)
    } else if (itemType === ItemType.WHITEBOARD) {
      const whiteboard = this.whiteboardMap.get(itemId)
      whiteboard?.addCurrentUser(playerId)
    }
  }

  private handleSetMeetingState(isOpen: boolean, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.MEETING) {
      const meeting = this.meetingMap.get(itemId)
      meeting?.setIsOpen(isOpen)
    }
  }

  private handleChairUserConnectedChange(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.CHAIR) {
      const chair = this.chairMap.get(itemId)
      chair?.setConnectedUser(playerId)
    }
  }

  private handleMeetingTitleChange(title: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.MEETING) {
      const meeting = this.meetingMap.get(itemId)
      meeting?.setTitle(title)
    }
  }

  private handleMeetingChatIdChange(chatId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.MEETING) {
      const meeting = this.meetingMap.get(itemId)
      meeting?.setChatId(chatId)
    }
  }

  private handleMeetingAdminChange(adminId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.MEETING) {
      const meeting = this.meetingMap.get(itemId)
      meeting?.setAdminId(adminId)
    }
  }

  private handleMeetingIsLockChange(isLock: boolean, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.MEETING) {
      const meeting = this.meetingMap.get(itemId)
      meeting?.setIsLock(isLock)
    }
  }

  private handleItemUserRemoved(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.MEETING) {
      const meeting = this.meetingMap.get(itemId)
      meeting?.removeCurrentUser(playerId)
    } else if (itemType === ItemType.WHITEBOARD) {
      const whiteboard = this.whiteboardMap.get(itemId)
      whiteboard?.removeCurrentUser(playerId)
    }
  }

  private handleChatMessageAdded(playerId: string, content: string) {
    const otherPlayer = this.otherPlayerMap.get(playerId)
    otherPlayer?.updateDialogBubble(content)
  }

  async handleSitOnChair(chair: Chair) {
    // const chairGroupID = chair.groupId!;
    // if (!this.meetingMap.has(chairGroupID)) {
    //   // No meeting exists for this group, create one
    //   const meeting = await createMeeting(chairGroupID);
    //   this.meetingMap.set(chairGroupID, meeting);
    //   // Update all chairs in the group with the new meeting ID
    //   const chairGroup = this.chairGroups.get(chairGroupID)!;
    //   chairGroup.forEach(chair => {
    //     chair.meetingID = meeting._id;
    //   });
    //   console.log(`Created new meeting with ID: ${meeting.id} for chair group: ${chairGroupID}`);
    // } else {
    //   // Meeting already exists, join the meeting
    //   const meeting = this.meetingMap.get(chairGroupID)!;
    //   console.log(`Joining existing meeting with ID: ${meeting.id} for chair group: ${chairGroupID}`);
    // }
  }

  update(t: number, dt: number) {
    if (this.myPlayer && this.network) {
      this.playerSelector.update(this.myPlayer, this.cursors)
      this.myPlayer.update(this.playerSelector, this.cursors, this.keyE, this.keyR, this.network)
    }
  }
}
