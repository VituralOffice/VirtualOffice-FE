import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RoomAvailable } from 'colyseus.js'
import { IRoomData, IRoomMember } from '../types/Rooms'
import { AppThunk, RootState } from '.'
import { IMapData } from '../types/Rooms'
import { GetRoomById } from '../apis/RoomApis'

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
    updateMemberOnlineStatus: (
      state,
      action: PayloadAction<{ memberId: string; online: boolean }>
    ) => {
      const { memberId, online } = action.payload
      const memberIndex = state.roomData.members.findIndex((m) => m.user._id == memberId)
      if (memberIndex >= 0) state.roomData.members[memberIndex].online = online
      // state.roomData.members = state.roomData.members.map(member =>
      //   member.user._id === memberId ? { ...member, online } : member
      // );
      // else {
      // }
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.roomData.members = state.roomData.members.filter(
        (m) => m.user._id != action.payload
      )
    },
    resetRoomStore: () => initialState,
  },
})

// Define the thunk for updating member online status
export const updateMemberOnlineStatusThunk =
  (memberId: string, online: boolean): AppThunk =>
  async (dispatch, getState) => {
    const state = getState()
    const memberIndex = state.room.roomData.members.findIndex((m) => m.user._id === memberId)

    if (memberIndex >= 0) {
      // Member found, update the online status
      dispatch(roomSlice.actions.updateMemberOnlineStatus({ memberId, online }))
    } else {
      // Member not found, fetch room data from API
      try {
        const response = await GetRoomById({ _id: state.room.roomData._id }) // Replace with your API endpoint
        const roomData = response.result
        dispatch(roomSlice.actions.setRoomData(roomData))
      } catch (error) {
        console.error('Failed to fetch room data:', error)
      }
    }
  }

export const selectRoomId = (state: RootState) => state.room.roomData._id

export const {
  setRoomJoined,
  setNetworkConstructed,
  setNetworkInitialized,
  setGameCreated,
  updateMember,
  updateMemberOnlineStatus,
  setRoomData,
  resetRoomStore,
  removeMember,
} = roomSlice.actions

export default roomSlice.reducer
