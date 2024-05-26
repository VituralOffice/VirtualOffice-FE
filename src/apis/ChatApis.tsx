import ApiService from './ApiService'
import { CreateGroupChatParams } from './types'
export const CreateGroupChat = async (data: CreateGroupChatParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().post(`/rooms/${data.roomId}/chats`, {
    name: data.name,
    type: data.type,
    member: data.member,
  })
  return response
}
