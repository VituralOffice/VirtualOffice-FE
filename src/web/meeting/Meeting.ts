import Network from '../../services/Network'
import store from '../../stores'
import {
  addMeetingUser,
  removeMeetingUser,
  setMeetingIsLocked,
  setAdminUser,
  setChatId,
  setTitle,
  closeMeetingDialog,
} from '../../stores/MeetingStore'
import { setShowCreateMeeting, setCreateMeetingCallback } from '../../stores/UIStore'

export class Meeting {
  id: string
  currentUsers = new Array<string>()
  isOpen: boolean
  title: string
  chatId: string
  isLocked: boolean
  adminUser: string

  constructor(meetingId: string) {
    this.id = meetingId
    this.isOpen = false
    this.title = ''
    this.chatId = ''
    this.isLocked = false
    this.adminUser = ''
    this.currentUsers = []
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
      store.dispatch(addMeetingUser({ meetingId: this.id, user: userId }))
      const userMediaManager = store.getState().meeting.userMediaManager
      const shareScreenManager = store.getState().meeting.shareScreenManager
      userMediaManager?.onUserJoined(userId)
      shareScreenManager?.onUserJoined(userId)
    }
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.includes(userId)) return
    console.log(`Meeting::removeCurrentUser remove user with id: ${userId}`)
    this.currentUsers = this.currentUsers.filter((u) => u !== userId)
    const meetingState = store.getState().meeting
    if (meetingState.activeMeetingId === this.id) {
      store.dispatch(removeMeetingUser({ meetingId: this.id, user: userId }))
      const userMediaManager = store.getState().meeting.userMediaManager
      const shareScreenManager = store.getState().meeting.shareScreenManager
      userMediaManager?.onUserLeft(userId)
      shareScreenManager?.onUserLeft(userId)
    }
  }

  setIsOpen(isOpen: boolean) {
    let wasOpen = this.isOpen
    this.isOpen = isOpen
    if (wasOpen && !isOpen) {
      const meetingState = store.getState().meeting
      if (meetingState.activeMeetingId == this.id) {
        store.dispatch(closeMeetingDialog())
      }
      this.title = ''
      this.chatId = ''
      this.isLocked = false
      this.adminUser = ''
      this.currentUsers = []
    }
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
    network.connectToMeeting(store.getState().user.userId, store.getState().room.roomData._id, this.id)
  }

  createMeeting(network: Network) {
    if (!this.id) return

    const createMeetingCallback = (title: string) => {
      network.connectToMeeting(
        store.getState().user.userId,
        store.getState().room.roomData._id,
        this.id,
        title
      )
    }

    store.dispatch(setCreateMeetingCallback(createMeetingCallback))
    store.dispatch(setShowCreateMeeting(true))
  }
}
