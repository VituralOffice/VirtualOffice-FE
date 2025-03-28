import { ICharacter } from "../interfaces/character"
import { BackgroundMode } from './BackgroundMode'

export type UserData = {
  _id: string
  email: string
  fullname: string
  role: string
  isVerified: boolean
  character: ICharacter
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: {
    _id: string
    email: string
    provider: string
    fullname: string
    role: string
    isVerified: boolean
    createdAt: Date
  }
}

export type User = {
  backgroundMode: BackgroundMode
  sessionId: string
  mediaConnected: boolean
  showJoystick: boolean

  userId: string
  fullname: string
  email: string
  role: string
  characterId: number
  isVerified: false
  loggedIn: false

  playerName: string
  microphoneON: boolean
  cameraON: boolean
}
