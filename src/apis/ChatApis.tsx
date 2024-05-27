import ApiService from './ApiService'
import { CreateGroupChatParams, GetChatParams } from './types'
export const CreateGroupChat = async (data: CreateGroupChatParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().post(`/rooms/${data.roomId}/chats`, {
    name: data.name,
    type: data.type,
    member: data.member,
  })
  return response
}

export const GetChat = async (data: GetChatParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/rooms/${data.roomId}/chats/${}`, {
    name: data.name,
    type: data.type,
    member: data.member,
  })
  return response
}
