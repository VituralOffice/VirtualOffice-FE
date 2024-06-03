import { IUser } from '../interfaces/user'

export enum RoomType {
  LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
  CUSTOM = 'custom',
}

export interface IRoomData {
  _id: string
  name: string
  private: boolean
  autoDispose: boolean
  map: string
  members: IRoomMember[]
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
}
export interface IMessagePayload {
  content: string
  type: string
  path: string
  chatId: string
  filename?: string
}
