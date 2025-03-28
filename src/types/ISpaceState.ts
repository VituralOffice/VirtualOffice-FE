import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'
import { IUser } from '../interfaces/user'

export interface IPlayer extends IUser, Schema {
  id : string
  email : string
  password : string
  avatar : string
  role : string
  online : boolean
  provider : string
  isVerified : boolean
  fullname : string
  playerName : string
  x : number
  y : number
  anim : string
  readyToConnect : boolean
  mediaConnected : boolean
  isInMeeting : boolean
  characterId : string
  characterAvatar : string
}
export interface IMessage extends Schema {
  type: string
  text: string
  fileName: string
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
  _id: string
  messages: IChatMessage[]
}

export interface IMeeting extends Schema {
  connectedUser: SetSchema<string>
  isOpen: boolean
}

export interface IChair extends Schema {
  connectedUser: string
}

export interface IWhiteboard extends Schema {
  roomId: string
  connectedUser: SetSchema<string>
}

export interface IOfficeState extends Schema {
  players: MapSchema<IPlayer>
  chairs: MapSchema<IChair>
  meetings: MapSchema<IMeeting>
  whiteboards: MapSchema<IWhiteboard>
  // mapMessages: MapSchema<IChatMessage>
}
