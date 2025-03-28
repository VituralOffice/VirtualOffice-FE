import { ICharacter } from './character'

export interface IUser {
  _id: string
  email: string
  fullname: string
  avatar: string
  role: string
  online: boolean
  password: string
  character: ICharacter
}
