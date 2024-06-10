import Network from '../../services/Network'
import store from '../../stores'
import {
  openMeetingDialog,
  addMeetingUser,
  removeMeetingUser,
  closeMeetingDialog,
  setMeetingIsLocked,
  setAdminUser,
  setChatId,
  setTitle,
} from '../../stores/MeetingStore'
import { setShowCreateMeeting, setCreateMeetingCallback } from '../../stores/UIStore'

export class Meeting {
  id: string
  currentUsers = new Array<string>()
  isOpen: boolean
  title: string
  chatId: string
  isLocked: boolean
  adminUser?: string

  constructor(meetingId: string) {
    this.id = meetingId
    this.isOpen = false
    this.title = ''
    this.chatId = ''
    this.isLocked = false
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.includes(userId)) return
    // assume admin is first user join meeting
    // handle lock on player press R
    if (this.isLocked) return
    if (this.currentUsers.length === 0) this.adminUser = userId
    this.currentUsers = [...this.currentUsers, userId]
    const meetingState = store.getState().meeting
    console.log(`Meeting::addCurrentUser add user ${userId}`)
    if (meetingState.activeMeetingId === this.id) {
      meetingState.shareScreenManager?.onUserJoined(userId)
      meetingState.userMediaManager?.onUserJoined(userId)
      store.dispatch(addMeetingUser({ meetingId: this.id, user: userId }))
    }
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.includes(userId)) return
    this.currentUsers = this.currentUsers.filter((u) => u !== userId)
    // give authority to random user when admin left
    if (this.adminUser === userId) this.adminUser = this.currentUsers[this.currentUsers.keys[0]]
    const meetingState = store.getState().meeting
    if (meetingState.activeMeetingId === this.id) {
      meetingState.shareScreenManager?.onUserLeft(userId)
      meetingState.userMediaManager?.onUserLeft(userId)
      store.dispatch(removeMeetingUser({ meetingId: this.id, user: userId }))
    }
  }

  setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen
  }

  setTitle(title: string) {
    this.title = title
    store.dispatch(setTitle({ meetingId: this.id, title: title }))
  }

  setChatId(chatId: string) {
    this.chatId = chatId
    store.dispatch(setChatId({ meetingId: this.id, chatId: chatId }))
  }

  setAdminId(adminId: string) {
    this.adminUser = adminId
    store.dispatch(setAdminUser({ meetingId: this.id, adminUser: adminId }))
  }

  setIsLock(isLock: boolean) {
    this.isLocked = isLock
    store.dispatch(setMeetingIsLocked({ meetingId: this.id, isLocked: isLock }))
  }

  openDialog(network: Network) {
    if (!this.id) return
    store.dispatch(openMeetingDialog({ meetingId: this.id, myUserId: network.mySessionId }))
    network.connectToMeeting(this.id)
  }

  createMeeting(network: Network) {
    if (!this.id) return

    const createMeetingCallback = (title: string) => {
      store.dispatch(openMeetingDialog({ meetingId: this.id, myUserId: network.mySessionId }))
      network.connectToMeeting(this.id!, title)
    }

    store.dispatch(setCreateMeetingCallback(createMeetingCallback))
    store.dispatch(setShowCreateMeeting(true))
  }
}
