import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RoomAvailable } from 'colyseus.js'
import { IRoomData, IRoomMember } from '../types/Rooms'
import { RootState } from '.'
import { IMapData } from '../types/Rooms'
import Bootstrap from '../scenes/Bootstrap'

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

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    // lobbyJoined: false,
    roomJoined: false,
    networkConstructed: false,
    networkInitialized: false,
    gameCreated: false,
    // gameLoaded: false,
    // roomId: '',
    // roomName: '',
    // roomDescription: '',
    // availableRooms: new Array<RoomAvailable>(),
    // members: new Array<IRoomMember>(),
    roomData: defaultRoomState,
    // onlineMemberMap: new Map<string, IRoomMember>(),
  },
  reducers: {
    // setLobbyJoined: (state, action: PayloadAction<boolean>) => {
    //   state.lobbyJoined = action.payload
    // },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload
    },
    // setRoomId: (state, action: PayloadAction<string>) => {
    //   state.roomId = action.payload
    // },
    setRoomData: (state, action: PayloadAction<IRoomData>) => {
      state.roomData = action.payload
      // if (!state.gameLoaded) {
      //   Bootstrap.getInstance()?.loadTileMap()
      //   Bootstrap.getInstance()?.launchGame()
      // }
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
    // setJoinedRoomData: (state, action: PayloadAction<IRoomData>) => {
    //   console.log(`RoomStore::setRoomData roomData: `, action.payload)
    //   state.roomData = action.payload

    //   // state.onlineMemberMap.clear()
    //   // action.payload.members.forEach((m) => {
    //   //   if (m.online) state.onlineMemberMap.set(m.user._id, m);
    //   // })
    // },
    // setAvailableRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
    //   state.availableRooms = action.payload.filter((room) => isCustomRoom(room))
    // },
    // addAvailableRooms: (state, action: PayloadAction<{ roomId: string; room: RoomAvailable }>) => {
    //   if (!isCustomRoom(action.payload.room)) return
    //   const roomIndex = state.availableRooms.findIndex(
    //     (room) => room.roomId === action.payload.roomId
    //   )
    //   if (roomIndex !== -1) {
    //     state.availableRooms[roomIndex] = action.payload.room
    //   } else {
    //     state.availableRooms.push(action.payload.room)
    //   }
    // },
    // removeAvailableRooms: (state, action: PayloadAction<string>) => {
    //   state.availableRooms = state.availableRooms.filter((room) => room.roomId !== action.payload)
    // },
    // setMembers: (state, action: PayloadAction<IRoomMember[]>) => {
    //   state.members = action.payload
    //   action.payload.forEach((m) => state.onlineMemberMap.set(m.user._id, m))
    // },
    // addMember: (state, action: PayloadAction<IRoomMember>) => {
    //   state.members = [...state.members, action.payload]
    //   state.onlineMemberMap.set(action.payload.user._id, action.payload)
    // },
    // removeMember: (state, action: PayloadAction<IRoomMember>) => {
    //   state.members = state.members.filter((m) => m.user._id !== action.payload.user._id)
    //   state.onlineMemberMap.delete(action.payload.user._id)
    // },
    updateMember: (state, action: PayloadAction<{ member: IRoomMember }>) => {
      const { member } = action.payload
      // console.log(`RoomStore::UpdateMember  update member with id: ${member.user._id}, online: ${member.online}`)
      state.roomData.members = [
        ...state.roomData.members.filter((m) => m.user._id !== member.user._id),
        member,
      ]
      // if (member.online) {
      //   state.onlineMemberMap.set(member.user._id, member)
      // } else if (state.onlineMemberMap.has(member.user._id)) {
      //   state.onlineMemberMap.delete(member.user._id)
      // }
    },
  },
})

export const selectRoomId = (state: RootState) => state.room.roomData._id

export const {
  setRoomJoined,
  // setJoinedRoomData,
  // setAvailableRooms,
  // addAvailableRooms,
  // removeAvailableRooms,
  setNetworkConstructed,
  setNetworkInitialized,
  setGameCreated,
  updateMember,
  // setRoomId,
  setRoomData,
} = roomSlice.actions

export default roomSlice.reducer
