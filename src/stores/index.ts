import { enableMapSet } from 'immer'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserStore'
import meetingReducer from './MeetingStore'
import chatReducer from './ChatStore'
import roomReducer from './RoomStore'
import whiteboardReducer from './WhiteboardStore'
import uiReducer from './UIStore'
import mapReducer from './MapStore'

enableMapSet()

const store = configureStore({
  reducer: {
    user: userReducer,
    meeting: meetingReducer,
    whiteboard: whiteboardReducer,
    chat: chatReducer,
    room: roomReducer,
    ui: uiReducer,
    map: mapReducer,
  },
  // Temporary disable serialize check for redux as we store MediaStream in MeetingStore.
  // https://stackoverflow.com/a/63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
