import { CHAT_TYPE } from '../constants/constant'

export type CreateRoomParams = {
  map: string
  name: string
  private: boolean
  plan: string
}

export type ChangeRoomSettingParams = {
  map?: string
  name?: string
  private?: boolean
  active?: boolean
}

export type RemoveRoomMemberParams = {
  user: string
}

export type GetRoomParams = {
  _id: string
}

export type InviteUserParams = {
  roomId: string
  email: string
}

export type JoinRoomByTokenParams = {
  roomId: string
  token: string
}

export type JoinRoomParams = {
  roomId: string
}

export type CreateGroupChatParams = {
  roomId: string
  name?: string
  type: CHAT_TYPE
  member: string[]
}

export type GetAllChatParams = {
  roomId: string
}

export type GetOneChatParams = {
  roomId: string
  chatId: string
}

export type GetMsgByChatIdParams = {
  roomId: string
  chatId: string
}

export type GetAllMsgParams = {
  roomId: string
}

export type UploadChatImagesParams = {
  roomId: string
  form: FormData
}
