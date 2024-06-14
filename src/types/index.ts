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
  playerNameMap: Map<string, string>
  playerAvatarMap: Map<string, number>
  showJoystick: boolean

  userId: string
  fullname: string
  email: string
  role: string
  character_id: number
  isVerified: false
  loggedIn: false

  playerName: string
  microphoneON: boolean
  cameraON: boolean
}
