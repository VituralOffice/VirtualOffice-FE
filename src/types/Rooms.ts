import { IUser } from '../interfaces/user'

export enum RoomType {
  // LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
  CUSTOM = 'custom',
}

export interface ICreateCustomRoomParams {
  name: string
  map: IMapData
  _id: string
  private?: boolean
  active?: boolean
  description?: string
  password?: string
  autoDispose?: boolean
  creator?: string
  members?: IRoomMember[]
}

export interface IRoomData {
  _id: string
  name: string
  private: boolean
  active: boolean
  autoDispose: boolean
  creator: string
  map: IMapData
  members: IRoomMember[]
}
export interface IMapData {
  _id: string
  active: boolean
  capacity: number
  createdAt: string
  default: boolean
  icon: string
  id: string
  json: string
  name: string
  style: string
  totalChair: number
  totalMeeting: number
  totalWhiteboard: number
  preview: string
}
export interface RoomQueryParam {
  active?: boolean
  owner?: boolean
  name?: string
}
export interface IRoomMember {
  online: boolean
  user: IUser
  role: string
  lastJoinedAt: string
}
export interface IMessagePayload {
  content: string
  type: string
  path: string
  chatId: string
  filename?: string
}
