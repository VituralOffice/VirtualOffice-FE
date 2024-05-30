import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RoomAvailable } from 'colyseus.js'
import { IRoomMember, RoomType } from '../types/Rooms'

interface RoomInterface extends RoomAvailable {
  name?: string
}

/**
 * Colyseus' real time room list always includes the public lobby so we have to remove it manually.
 */
const isCustomRoom = (room: RoomInterface) => {
  return room.name === RoomType.CUSTOM
}

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    lobbyJoined: false,
    roomJoined: false,
    roomId: '',
    roomName: '',
    roomDescription: '',
    availableRooms: new Array<RoomAvailable>(),
    members: new Array<IRoomMember>(),
  },
  reducers: {
    setLobbyJoined: (state, action: PayloadAction<boolean>) => {
      state.lobbyJoined = action.payload
    },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },
    setJoinedRoomData: (
      state,
      action: PayloadAction<{
        id: string
        name: string
        description: string
        members: IRoomMember[]
      }>
    ) => {
      state.roomId = action.payload.id
      state.roomName = action.payload.name
      state.roomDescription = action.payload.description
      state.members = action.payload.members
    },
    setAvailableRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms = action.payload.filter((room) => isCustomRoom(room))
    },
    addAvailableRooms: (state, action: PayloadAction<{ roomId: string; room: RoomAvailable }>) => {
      if (!isCustomRoom(action.payload.room)) return
      const roomIndex = state.availableRooms.findIndex(
        (room) => room.roomId === action.payload.roomId
      )
      if (roomIndex !== -1) {
        state.availableRooms[roomIndex] = action.payload.room
      } else {
        state.availableRooms.push(action.payload.room)
      }
    },
    removeAvailableRooms: (state, action: PayloadAction<string>) => {
      state.availableRooms = state.availableRooms.filter((room) => room.roomId !== action.payload)
    },
    setMembers: (state, action: PayloadAction<IRoomMember[]>) => {
      state.members = action.payload
    },
    addMember: (state, action: PayloadAction<IRoomMember>) => {
      state.members = [...state.members, action.payload]
    },
    removeMember: (state, action: PayloadAction<IRoomMember>) => {
      state.members = state.members.filter((m) => m.user.id !== action.payload.user.id)
    },
    updateMember: (state, action: PayloadAction<IRoomMember>) => {
      state.members = [
        ...state.members.filter((m) => m.user._id !== action.payload.user?.id),
        action.payload,
      ]
    },
  },
})

export const {
  setLobbyJoined,
  setRoomJoined,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
  setMembers,
  addMember,
  removeMember,
  updateMember,
  setRoomId,
} = roomSlice.actions

export default roomSlice.reducer
