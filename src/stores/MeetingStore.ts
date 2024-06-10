import Peer, { MediaConnection } from 'peerjs'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Game from '../scenes/Game'
import { sanitizeId } from '../utils/util'
import ShareScreenManager from '../web/meeting/ScreenSharingManager'
import UserMediaManager from '../web/meeting/UserMediaManager'
import WebRTC from '../web/WebRTC'
import Network from '../services/Network'
import { toast } from 'react-toastify'

interface MeetingState {
  meetingDialogOpen: boolean
  activeMeetingId: null | string
  isLocked: boolean
  connectedUser: string[]
  adminUser?: string
  myDisplayStream: null | MediaStream
  myCameraStream: null | MediaStream
  peerDisplayStreams: Map<
    string,
    {
      stream: MediaStream
      call: MediaConnection
    }
  >
  peerCameraStreams: Map<
    string,
    {
      stream: MediaStream
      call: MediaConnection
    }
  >
  shareScreenManager: null | ShareScreenManager
  userMediaManager: null | UserMediaManager
}

const initialState: MeetingState = {
  meetingDialogOpen: false,
  activeMeetingId: null,
  isLocked: false,
  connectedUser: [],
  myDisplayStream: null,
  myCameraStream: null,
  peerDisplayStreams: new Map(),
  peerCameraStreams: new Map(),
  shareScreenManager: null,
  userMediaManager: null,
}

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    openMeetingDialog: (state, action: PayloadAction<{ meetingId: string; myUserId: string }>) => {
      state.meetingDialogOpen = true
      state.activeMeetingId = action.payload.meetingId
      if (!state.shareScreenManager) {
        state.shareScreenManager = new ShareScreenManager(action.payload.myUserId)
      }
      if (!state.userMediaManager) {
        state.userMediaManager = new UserMediaManager(action.payload.myUserId)
      }
      Game.getInstance()?.myPlayer.setPlayerIsInMeeting(true)
      Game.getInstance()?.disableKeys()
      state.shareScreenManager.onOpen()
      state.userMediaManager.onOpen()

      let meeting = Game.getInstance()?.meetingMap.get(action.payload.meetingId)
      state.adminUser = meeting?.adminUser
      state.isLocked = meeting?.isLocked!
      state.connectedUser = meeting?.currentUsers!
    },
    createMeeting: (state, action: PayloadAction<{ meetingId: string; myUserId: string }>) => {
      if (!state.shareScreenManager) {
        state.shareScreenManager = new ShareScreenManager(action.payload.myUserId)
      }
      if (!state.userMediaManager) {
        state.userMediaManager = new UserMediaManager(action.payload.myUserId)
      }
      Game.getInstance()?.myPlayer.setPlayerIsInMeeting(true)
      Game.getInstance()?.disableKeys()
      state.shareScreenManager.onOpen()
      state.userMediaManager.onOpen()
      state.meetingDialogOpen = true
      state.connectedUser = []
      state.adminUser = ''
      state.isLocked = false
      state.activeMeetingId = action.payload.meetingId
    },
    closeMeetingDialog: (state) => {
      // Tell server the meeting dialog is closed.
      Game.getInstance()?.enableKeys()
      Network.getInstance()?.disconnectFromMeeting(state.activeMeetingId!)
      Game.getInstance()?.myPlayer.setPlayerIsInMeeting(false)
      Game.getInstance()?.myPlayer.setLeaveCurrentChair(true)
      for (const { call } of state.peerDisplayStreams.values()) {
        call.close()
      }
      for (const { call } of state.peerCameraStreams.values()) {
        call.close()
      }
      state.shareScreenManager?.onClose()
      state.userMediaManager?.onClose()
      state.meetingDialogOpen = false
      state.myDisplayStream = null
      state.myCameraStream = null
      state.activeMeetingId = null
      state.connectedUser = []
      state.adminUser = ''
      state.isLocked = false
      state.peerDisplayStreams.clear()
      state.peerCameraStreams.clear()
    },
    setMyDisplayStream: (state, action: PayloadAction<null | MediaStream>) => {
      state.myDisplayStream = action.payload
    },
    addDisplayStream: (
      state,
      action: PayloadAction<{ id: string; call: MediaConnection; stream: MediaStream }>
    ) => {
      state.peerDisplayStreams.set(sanitizeId(action.payload.id), {
        call: action.payload.call,
        stream: action.payload.stream,
      })
    },
    removeDisplayStream: (state, action: PayloadAction<string>) => {
      state.peerDisplayStreams.delete(sanitizeId(action.payload))
    },
    setMyCameraStream: (state, action: PayloadAction<null | MediaStream>) => {
      state.myCameraStream = action.payload
    },
    addCameraStream: (
      state,
      action: PayloadAction<{ id: string; call: MediaConnection; stream: MediaStream }>
    ) => {
      state.peerCameraStreams.set(sanitizeId(action.payload.id), {
        call: action.payload.call,
        stream: action.payload.stream,
      })
    },
    removeCameraStream: (state, action: PayloadAction<string>) => {
      state.peerCameraStreams.delete(sanitizeId(action.payload))
    },
    disconnectMeeting: (state) => {
      //Network.getInstance()?.disconnectFromMeeting(state.activeMeetingId!)
      for (const { call } of state.peerDisplayStreams.values()) {
        call.close()
      }
      for (const { call } of state.peerCameraStreams.values()) {
        call.close()
      }
      state.shareScreenManager?.onClose()
      state.userMediaManager?.onClose()
      state.meetingDialogOpen = false
      state.myDisplayStream = null
      state.myCameraStream = null
      state.activeMeetingId = null
      state.connectedUser = []
      state.adminUser = ''
      state.isLocked = false
      state.peerDisplayStreams.clear()
      state.peerCameraStreams.clear()
    },
    // updateMeetingLock: (state, action: PayloadAction<{ meetingId: string; isLocked: boolean }>) => {
    //   if (state.activeMeetingId === action.payload.meetingId) state.isLocked = action.payload.isLocked
    // },
    // updateMeetingAdmin: (
    //   state,
    //   action: PayloadAction<{ meetingId: string; adminUser: string }>
    // ) => {
    //   if (state.activeMeetingId === action.payload.meetingId) state.adminUser = action.payload.adminUser
    // },
    addMeetingUser: (state, action: PayloadAction<{ meetingId: string; user: string }>) => {
      // console.log(`MeetingStore::addMeetingUser state.activeMeetingId: ${state.activeMeetingId}, action.payload.meetingId: ${action.payload.meetingId}`)
      if (state.activeMeetingId === action.payload.meetingId)
        state.connectedUser = [
          ...state.connectedUser.filter((u) => u != action.payload.user),
          action.payload.user,
        ]
    },
    removeMeetingUser: (state, action: PayloadAction<{ meetingId: string; user: string }>) => {
      if (state.activeMeetingId === action.payload.meetingId)
        state.connectedUser = state.connectedUser.filter((u) => u != action.payload.user)
    },
    // setMeetingState: (
    //   state,
    //   action: PayloadAction<{
    //     connectedUser: Set<string>
    //     adminUser: string
    //     isLocked: boolean
    //   }>
    // ) => {
    //   state.adminUser = action.payload.adminUser
    //   state.connectedUser = [...action.payload.connectedUser.values()]
    //   state.isLocked = action.payload.isLocked
    // },
  },
})

export const {
  closeMeetingDialog,
  openMeetingDialog,
  setMyDisplayStream,
  addDisplayStream,
  removeDisplayStream,
  setMyCameraStream,
  addCameraStream,
  removeCameraStream,
  disconnectMeeting,
  createMeeting,
  // updateMeetingLock,
  // updateMeetingAdmin,
  addMeetingUser,
  removeMeetingUser,
  // setMeetingState,
} = meetingSlice.actions

export default meetingSlice.reducer
