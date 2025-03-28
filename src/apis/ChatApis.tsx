import ApiService from './ApiService'
import { CreateGroupChatParams, GetAllChatParams, GetAllMsgParams, GetMsgByChatIdParams, GetOneChatParams, UploadChatImagesParams } from './types'
export const CreateGroupChat = async (data: CreateGroupChatParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().post(`/rooms/${data.roomId}/chats`, {
    name: data.name,
    type: data.type,
    members: data.members,
  })
  return response
}

export const GetOneChat = async (data: GetOneChatParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/rooms/${data.roomId}/chats/${data.chatId}`)
  return response
}

export const GetAllChats = async (data: GetAllChatParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/rooms/${data.roomId}/chats`)
  return response
}

export const GetMsgByChatId = async (data: GetMsgByChatIdParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/rooms/${data.roomId}/messages/${data.chatId}`)
  return response
}

export const GetAllChatsWithMessage = async (data: GetAllMsgParams) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/rooms/${data.roomId}/messages`)
  return response
}

export const UploadChatImage = async (data: UploadChatImagesParams) => {
  const response = await ApiService.getInstance().post(`/upload/rooms/${data.roomId}`, data.form)
  return response
}
