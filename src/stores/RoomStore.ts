import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RoomAvailable } from 'colyseus.js'
import { IRoomData, IRoomMember } from '../types/Rooms'
import { RootState } from '.'
import { IMapData } from '../types/Rooms'

// interface RoomInterface extends RoomAvailable {
//   name?: string
// }

/**
 * Colyseus' real time room list always includes the public lobby so we have to remove it manually.
 */
// const isCustomRoom = (room: RoomInterface) => {
//   return room.name === RoomType.CUSTOM
// }

const defaultMapData: IMapData = {
  _id: '',
  active: false,
  capacity: 0,
  createdAt: '',
  default: false,
  icon: '',
  id: '',
  json: '',
  name: '',
  style: '',
  totalChair: 0,
  totalMeeting: 0,
  totalWhiteboard: 0,
  preview: '',
}

const defaultRoomState: IRoomData = {
  _id: '',
  name: '',
  private: false,
  active: false,
  autoDispose: false,
  creator: '',
  map: defaultMapData,
  members: [],
}

const initialState = {
  roomJoined: false,
  networkConstructed: false,
  networkInitialized: false,
  gameCreated: false,
  roomData: defaultRoomState,
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload
    },
    setRoomData: (state, action: PayloadAction<IRoomData>) => {
      state.roomData = action.payload
    },
    setNetworkConstructed: (state, action: PayloadAction<boolean>) => {
      state.networkConstructed = action.payload
    },
    setNetworkInitialized: (state, action: PayloadAction<boolean>) => {
      state.networkInitialized = action.payload
    },
    setGameCreated: (state, action: PayloadAction<boolean>) => {
      state.gameCreated = action.payload
    },
    updateMember: (state, action: PayloadAction<{ member: IRoomMember }>) => {
      const { member } = action.payload
      state.roomData.members = [
        ...state.roomData.members.filter((m) => m.user._id !== member.user._id),
        member,
      ]
    },
    resetRoomStore: () => initialState,
  },
})

export const selectRoomId = (state: RootState) => state.room.roomData._id

export const {
  setRoomJoined,
  setNetworkConstructed,
  setNetworkInitialized,
  setGameCreated,
  updateMember,
  setRoomData,
  resetRoomStore,
} = roomSlice.actions

export default roomSlice.reducer
