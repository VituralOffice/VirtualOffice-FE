import { RoomQueryParam } from '../types/Rooms'
import ApiService from './ApiService'
import {
  ChangeRoomSettingParams,
  CreateRoomParams,
  GetRoomParams,
  InviteUserParams,
  JoinRoomParams,
  RemoveRoomMemberParams,
} from './types'

export const CreateRoom = async (data: CreateRoomParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().post('/rooms', data)
  return response
}

export const GetRoomById = async (data: GetRoomParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/rooms/${data._id}`)
  return response
}

export const GetRoomsByUserId = async (param: RoomQueryParam) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/rooms`, param)
  return response
}

export const InviteUserToRoom = async (data: InviteUserParams) => {
  const response = await ApiService.getInstance().post(`/rooms/${data.roomId}/invite`, {
    email: data.email,
  })
  return response
}

export const JoinRoom = async (data: JoinRoomParams) => {
  const response = await ApiService.getInstance().post(`/rooms/${data.roomId}/join`, {
    token: data.token,
  })
  return response
}

export const ChangeRoomSetting = async (roomId: string, data: ChangeRoomSettingParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().post(`/rooms/${roomId}/setting`, data)
  return response
}

export const DeleteRoom = async (roomId: string) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().delete(`/rooms/${roomId}`)
  return response
}

export const RemoveMember = async (roomId: string, data: RemoveRoomMemberParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().post(`/rooms/${roomId}/remove`, data)
  return response
}
