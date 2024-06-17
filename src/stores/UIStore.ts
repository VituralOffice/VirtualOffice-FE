import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type CreateMeetingCallback = ((title: string) => void) | null

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showCreateMeeting: false,
    openingUIs: 0,
    createMeetingCallback: null as CreateMeetingCallback,
  },
  reducers: {
    setShowCreateMeeting: (state, action: PayloadAction<boolean>) => {
      state.showCreateMeeting = action.payload
    },

    setCreateMeetingCallback: (state, action: PayloadAction<CreateMeetingCallback>) => {
      state.createMeetingCallback = action.payload
    },

    resetUIStore: (state) => {
      state.openingUIs = 0
      state.showCreateMeeting = false
      state.createMeetingCallback = null
    },

    increaseOpeningCount: (state) => {
      state.openingUIs++
      console.log("increase UI count", state.openingUIs)
    },
    
    decreaseOpeningCount: (state) => {
      state.openingUIs--
      console.log("decrease UI count", state.openingUIs)
    },
  },
})

export const { setShowCreateMeeting, setCreateMeetingCallback, resetUIStore, increaseOpeningCount, decreaseOpeningCount } = uiSlice.actions

export default uiSlice.reducer
