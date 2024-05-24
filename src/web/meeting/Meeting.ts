import Network from '../../services/Network'
import store from '../../stores'
import { openMeetingDialog } from '../../stores/MeetingStore'

export class Meeting {
  id?: string
  currentUsers = new Set<string>()
  isOpen: boolean

  constructor(meetingId: string) {
    this.id = meetingId
    this.isOpen = false
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return
    this.currentUsers.add(userId)
    const meetingState = store.getState().meeting
    if (meetingState.meetingId === this.id) {
      meetingState.shareScreenManager?.onUserJoined(userId)
      meetingState.userMediaManager?.onUserJoined(userId)
    }
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return
    this.currentUsers.delete(userId)
    const meetingState = store.getState().meeting
    if (meetingState.meetingId === this.id) {
      meetingState.shareScreenManager?.onUserLeft(userId)
      meetingState.userMediaManager?.onUserLeft(userId)
    }
    if (this.currentUsers.size == 0) this.isOpen = false
  }

  openDialog(playerId: string, network: Network) {
    if (!this.id) return
    store.dispatch(openMeetingDialog({ meetingId: this.id, myUserId: playerId }))
    network.connectToMeeting(this.id)
    this.isOpen = true
  }
}
