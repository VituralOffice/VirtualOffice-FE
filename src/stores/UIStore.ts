import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showCreateMeeting: false,
  },
  reducers: {
    setShowCreateMeeting: (state, action: PayloadAction<boolean>) => {
      state.showCreateMeeting = action.payload
    },

    resetUIState: (state) => {
      state.showCreateMeeting = false
    },
  },
})

export const { setShowCreateMeeting, resetUIState } = uiSlice.actions

export default uiSlice.reducer
