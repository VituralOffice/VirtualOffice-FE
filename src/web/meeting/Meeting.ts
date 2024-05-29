import Network from '../../services/Network'
import store from '../../stores'
import { openMeetingDialog, createMeeting } from '../../stores/MeetingStore'
import { setShowCreateMeeting, setCreateMeetingCallback } from '../../stores/UIStore'

export class Meeting {
  id?: string
  currentUsers = new Set<string>()
  isOpen: boolean
  title: string
  chatId: string

  constructor(meetingId: string) {
    this.id = meetingId
    this.isOpen = false
    this.title = ''
    this.chatId = ''
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return
    this.currentUsers.add(userId)
    const meetingState = store.getState().meeting
    if (meetingState.activeMeetingId === this.id) {
      meetingState.shareScreenManager?.onUserJoined(userId)
      meetingState.userMediaManager?.onUserJoined(userId)
    }
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return
    this.currentUsers.delete(userId)
    const meetingState = store.getState().meeting
    if (meetingState.activeMeetingId === this.id) {
      meetingState.shareScreenManager?.onUserLeft(userId)
      meetingState.userMediaManager?.onUserLeft(userId)
    }
  }

  setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen
  }

  setTitle(title: string) {
    this.title = title
  }

  setChatId(chatId: string) {
    this.chatId = chatId
  }

  openDialog(playerId: string, network: Network) {
    if (!this.id) return

    store.dispatch(openMeetingDialog({ meetingId: this.id, myUserId: playerId }))
    network.connectToMeeting(this.id)
  }

  createMeeting(playerId: string, network: Network) {
    if (!this.id) return

    const createMeetingCallback = (title: string) => {
      store.dispatch(createMeeting({ meetingId: this.id!, myUserId: playerId }))
      network.connectToMeeting(this.id!, title)
      // network.changeMeetingInfo(this.id!, title, chatId)
      // this.title = title
    }

    store.dispatch(setCreateMeetingCallback(createMeetingCallback))
    store.dispatch(setShowCreateMeeting(true))
  }
}
