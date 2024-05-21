// import store from '../stores'
// import Network from '../services/Network'
// import Item from './Item'
// import { ItemType } from '../types/Items'
// import { openMeetingDialog } from '../stores/MeetingStore'

// export default class Meeting extends Item {
//   id?: string
//   currentUsers = new Set<string>()

//   constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
//     super(scene, x, y, texture, frame)

//     this.itemType = ItemType.MEETING
//   }

//   private updateStatus() {
//     if (!this.currentUsers) return
//     const numberOfUsers = this.currentUsers.size
//     this.clearStatusBox()
//     if (numberOfUsers === 1) {
//       this.setStatusBox(`${numberOfUsers} user`)
//     } else if (numberOfUsers > 1) {
//       this.setStatusBox(`${numberOfUsers} users`)
//     }
//   }

//   onOverlapDialog() {
//     if (this.currentUsers.size === 0) {
//       this.setDialogBox('Press R to use meeting')
//     } else {
//       this.setDialogBox('Press R join')
//     }
//   }

//   addCurrentUser(userId: string) {
//     if (!this.currentUsers || this.currentUsers.has(userId)) return
//     this.currentUsers.add(userId)
//     const meetingState = store.getState().meeting
//     if (meetingState.meetingId === this.id) {
//       meetingState.shareScreenManager?.onUserJoined(userId)
//     }
//     this.updateStatus()
//   }

//   removeCurrentUser(userId: string) {
//     if (!this.currentUsers || !this.currentUsers.has(userId)) return
//     this.currentUsers.delete(userId)
//     const meetingState = store.getState().meeting
//     if (meetingState.meetingId === this.id) {
//       meetingState.shareScreenManager?.onUserLeft(userId)
//     }
//     this.updateStatus()
//   }

//   openDialog(playerId: string, network: Network) {
//     if (!this.id) return
//     store.dispatch(openMeetingDialog({ meetingId: this.id, myUserId: playerId }))
//     network.connectToMeeting(this.id)
//   }
// }
