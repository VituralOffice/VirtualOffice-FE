import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Game from '../scenes/Game'
import Network from '../services/Network'

interface WhiteboardState {
  whiteboardDialogOpen: boolean
  whiteboardId: null | string
  whiteboardUrl: null | string
  urls: Map<string, string>
}

const initialState: WhiteboardState = {
  whiteboardDialogOpen: false,
  whiteboardId: null,
  whiteboardUrl: null,
  urls: new Map(),
}

export const whiteboardSlice = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    openWhiteboardDialog: (state, action: PayloadAction<string>) => {
      state.whiteboardDialogOpen = true
      state.whiteboardId = action.payload
      const url = state.urls.get(action.payload)
      if (url) state.whiteboardUrl = url
      Game.getInstance()?.disableKeys()
    },
    closeWhiteboardDialog: (state) => {
      Game.getInstance()?.enableKeys()
      Network.getInstance()?.disconnectFromWhiteboard(state.whiteboardId!)
      state.whiteboardDialogOpen = false
      state.whiteboardId = null
      state.whiteboardUrl = null
    },
    setWhiteboardUrls: (state, action: PayloadAction<{ whiteboardId: string; roomId: string }>) => {
      state.urls.set(
        action.payload.whiteboardId,
        `https://wbo.ophir.dev/boards/sky-office-${action.payload.roomId}`
      )
    },
    resetWhiteBoardStore: (state) => {
      state.whiteboardDialogOpen = false
      state.whiteboardId = null
      state.whiteboardUrl = null
      state.urls = new Map()
    },
  },
})

export const { openWhiteboardDialog, closeWhiteboardDialog, setWhiteboardUrls, resetWhiteBoardStore } =
  whiteboardSlice.actions

export default whiteboardSlice.reducer
