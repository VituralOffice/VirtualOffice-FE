import { CHAT_TYPE } from "../constants/constant"

export type CreateRoomParams = {
    map: string,
    name: string,
    private: boolean
}

export type GetRoomParams = {
    _id: string,
}

export type InviteUserParams = {
    roomId: string,
    email: string,
}

export type JoinRoomParams = {
    roomId: string,
    token: string,
}

export type CreateGroupChatParams = {
    roomId: string,
    name?:string,
    type: CHAT_TYPE,
    member: string[]
}

export type GetAllChatParams = {
    roomId: string,
    id: string
}

export type GetOneChatParams = {
    roomId: string,
    chatId: string,
}

export type UploadChatImagesParams = {
    roomId: string,
    form: FormData,
}