import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type CreateMeetingCallback = ((title: string, chatId: string) => void) | null

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showCreateMeeting: false,
    createMeetingCallback: null as CreateMeetingCallback,
  },
  reducers: {
    setShowCreateMeeting: (state, action: PayloadAction<boolean>) => {
      state.showCreateMeeting = action.payload
    },

    setCreateMeetingCallback: (state, action: PayloadAction<CreateMeetingCallback>) => {
      state.createMeetingCallback = action.payload
    },

    resetUIState: (state) => {
      state.showCreateMeeting = false
      state.createMeetingCallback = null
    },
  },
})

export const { setShowCreateMeeting, setCreateMeetingCallback, resetUIState } = uiSlice.actions

export default uiSlice.reducer
