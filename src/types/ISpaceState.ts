import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'
import { IUser } from '../interfaces/user'

export interface IPlayer extends IUser, Schema {
  x: number
  y: number
  anim: string
  readyToConnect: boolean
  videoConnected: boolean
}

export interface IChatMessage extends Schema {
  author: string
  createdAt: number
  content: string
}

export interface IMeeting extends Schema {
  connectedUser: SetSchema<string>
}

export interface IOfficeState extends Schema {
  players: MapSchema<IPlayer>
  meetings: MapSchema<IMeeting>
  chatMessages: ArraySchema<IChatMessage>
}
