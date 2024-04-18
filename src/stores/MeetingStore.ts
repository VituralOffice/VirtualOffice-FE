import Peer, { MediaConnection } from 'peerjs'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { sanitizeId } from '../utils/util'
import ShareScreenManager from '../web/ScreenSharingManager'

interface MeetingState {
  meetingDialogOpen: boolean
  meetingId: null | string
  myStream: null | MediaStream
  peerStreams: Map<
    string,
    {
      stream: MediaStream
      call: MediaConnection
    }
  >
  shareScreenManager: null | ShareScreenManager
}

const initialState: MeetingState = {
  meetingDialogOpen: false,
  meetingId: null,
  myStream: null,
  peerStreams: new Map(),
  shareScreenManager: null,
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
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
      state.shareScreenManager.onOpen()
      state.meetingDialogOpen = true
      state.meetingId = action.payload.meetingId
    },
    closeMeetingDialog: (state) => {
      // Tell server the meeting dialog is closed.
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      game.network.disconnectFromMeeting(state.meetingId!)
      for (const { call } of state.peerStreams.values()) {
        call.close()
      }
      state.shareScreenManager?.onClose()
      state.meetingDialogOpen = false
      state.myStream = null
      state.meetingId = null
      state.peerStreams.clear()
    },
    setMyStream: (state, action: PayloadAction<null | MediaStream>) => {
      state.myStream = action.payload
    },
    addVideoStream: (
      state,
      action: PayloadAction<{ id: string; call: MediaConnection; stream: MediaStream }>
    ) => {
      state.peerStreams.set(sanitizeId(action.payload.id), {
        call: action.payload.call,
        stream: action.payload.stream,
      })
    },
    removeVideoStream: (state, action: PayloadAction<string>) => {
      state.peerStreams.delete(sanitizeId(action.payload))
    },
  },
})

export const {
  closeMeetingDialog,
  openMeetingDialog,
  setMyStream,
  addVideoStream,
  removeVideoStream,
} = meetingSlice.actions

export default meetingSlice.reducer
