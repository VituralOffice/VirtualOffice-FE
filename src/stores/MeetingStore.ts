import Peer, { MediaConnection } from 'peerjs'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Game from '../scenes/Game'
import { sanitizeId } from '../utils/util'
import ShareScreenManager from '../web/meeting/ScreenSharingManager'
import UserMediaManager from '../web/meeting/UserMediaManager'
import WebRTC from '../web/WebRTC'

interface MeetingState {
  meetingDialogOpen: boolean
  meetingId: null | string
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
  meetingId: null,

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
    openMeetingDialog: (
      state,
      action: PayloadAction<{ meetingId: string; myUserId: string }>
    ) => {
      if (!state.shareScreenManager) {
        state.shareScreenManager = new ShareScreenManager(action.payload.myUserId)
      }
      if (!state.userMediaManager) {
        state.userMediaManager = new UserMediaManager(action.payload.myUserId)
      }
      Game.getInstance()?.disableKeys()
      state.shareScreenManager.onOpen()
      state.userMediaManager.onOpen()
      state.meetingDialogOpen = true
      state.meetingId = action.payload.meetingId
    },
    closeMeetingDialog: (state) => {
      // Tell server the meeting dialog is closed.
      Game.getInstance()?.enableKeys()
      Game.getInstance()?.network.disconnectFromMeeting(state.meetingId!)
      WebRTC?.getInstance()?.checkPreviousPermission();
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
      state.meetingId = null
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
} = meetingSlice.actions

export default meetingSlice.reducer
