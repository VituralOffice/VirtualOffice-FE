import { ICharacter } from './character'

export interface IUser {
  id: string
  _id?: string
  email: string
  fullname: string
  avatar: string
  role: string
  online: boolean
  password: string
  character: string | ICharacter
}
