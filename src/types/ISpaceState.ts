import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'
import { IUser } from '../interfaces/user'

export interface IPlayer extends IUser, Schema {
  playerName: string
  x: number
  y: number
  anim: string
  readyToConnect: boolean
  mediaConnected: boolean
}
export interface IMessage extends Schema {
  type: string
  text: string
  filename: string
  fileType: string
  path: string
}
export interface IChatMessage extends Schema {
  createdAt: string
  chat: string
  user: IPlayer
  message: IMessage
}
export interface IMapMessage extends Schema {
  id: string
  messages: IChatMessage[]
}

export interface IMeeting extends Schema {
  connectedUser: SetSchema<string>
}

export interface IChair extends Schema {
  connectedUser: string
}

export interface IOfficeState extends Schema {
  players: MapSchema<IPlayer>
  chairs: MapSchema<IChair>
  meetings: MapSchema<IMeeting>
  mapMessages: MapSchema<IChatMessage>
}
