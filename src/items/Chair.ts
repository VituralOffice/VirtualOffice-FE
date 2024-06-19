import Game from '../scenes/Game'
import Network from '../services/Network'
import { ItemType } from '../types/Items'
import Item from './Item'

export default class Chair extends Item {
  chairId?: string
  groupId?: string
  itemDirection?: string
  connectedUser?: string

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.CHAIR
    this.groupId = '-1';
  }

  onOverlapDialog() {
    if (!this.connectedUser) this.setDialogBox('Press E to sit')
  }

  sit(network: Network) {
    console.log('Sit on chair with index: ' + this.chairId)
    // this.connectedUser = playerId
    this.clearDialogBox()
    let meeting = Game.getInstance()?.meetingMap.get(this.groupId!);
    if (meeting?.isOpen && !meeting?.isLocked) {
      this.setDialogBox('Press R to join meeting\nPress E to leave')
    } else if(this.groupId !== '-1' && !meeting?.isLocked) {
      this.setDialogBox('Press R to hold a meeting\nPress E to leave')
    } else {
      this.setDialogBox('This meeting is being locked!\nPress E to leave')
    }
    network.connectToChair(this.chairId!)
  }

  leave(network: Network) {
    // console.log('Leave chair with index: ' + this.chairId)
    this.clearDialogBox()
    network.disconnectFromChair(this.chairId!)
  }

  setConnectedUser(userId: string) {
    this.connectedUser = userId
    // console.log("Set chair " + this.chairId + " 's user: " + this.connectedUser)
  }
}
