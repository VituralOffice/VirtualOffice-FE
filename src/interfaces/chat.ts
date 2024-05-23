import { IUser } from './user'

export interface IChat {
  _id: string
  name?: string
  type: string
  members: IChatMember[]
}
export interface IChatMember {
  role: string
  user: IUser
}
export interface IMessage {
  content: string
  type: string
  path: string
}
