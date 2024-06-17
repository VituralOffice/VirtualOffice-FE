import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { BackgroundMode } from '../types/BackgroundMode'
import { sanitizeId } from '../utils/util'
import { UserData } from '../types'
import { ICharacter } from '../interfaces/character'
import { RootState } from '.'

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours()
  return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}
interface UserState {
  backgroundMode: BackgroundMode
  sessionId: string
  mediaConnected: boolean
  showJoystick: boolean
  userId: string
  fullname: string
  email: string
  role: string
  characterId: string
  character: ICharacter | null
  isVerified: boolean
  loggedIn: boolean
  playerName: string
  microphoneON: boolean
  cameraON: boolean
}
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    backgroundMode: getInitialBackgroundMode(),
    sessionId: '',
    mediaConnected: false,
    showJoystick: window.innerWidth < 650,
    //user info
    userId: '',
    fullname: 'Anonymous',
    email: '',
    role: 'user',
    characterId: '',
    character: null,
    isVerified: false,
    loggedIn: false,
    playerName: 'Anonymous',
    microphoneON: false,
    cameraON: false,
  } as UserState,
  reducers: {
    toggleBackgroundMode: (state) => {
      const newMode =
        state.backgroundMode === BackgroundMode.DAY ? BackgroundMode.NIGHT : BackgroundMode.DAY

      state.backgroundMode = newMode
      //   const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      //   bootstrap.changeBackgroundMode(newMode)
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setMediaConnected: (state, action: PayloadAction<boolean>) => {
      state.mediaConnected = action.payload
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload
    },
    setShowJoystick: (state, action: PayloadAction<boolean>) => {
      state.showJoystick = action.payload
    },

    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.fullname = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setCharacter: (state, action: PayloadAction<ICharacter | undefined>) => {
      if (action.payload) state.character = action.payload
    },
    setIsVerified: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload
    },
    setMicrophoneON: (state, action: PayloadAction<boolean>) => {
      // console.log("set microphone : ", action.payload)
      state.microphoneON = action.payload
    },
    setCameraON: (state, action: PayloadAction<boolean>) => {
      // console.log("set camera : ", action.payload)
      state.cameraON = action.payload
    },

    setUserInfo: (state, action: PayloadAction<UserData>) => {
      state.userId = action.payload._id
      state.email = action.payload.email
      if (!action.payload.fullname) state.fullname = action.payload.email.split('@')[0]
      else state.fullname = action.payload.fullname
      state.playerName = state.fullname
      state.role = action.payload.role ? action.payload.role : 'user'
      state.characterId = action.payload.character._id
      state.character = action.payload.character
      state.isVerified = action.payload.isVerified
    },

    resetUserState: (state) => {
      state.backgroundMode = getInitialBackgroundMode()
      state.sessionId = ''
      state.mediaConnected = false
      state.loggedIn = false
      state.showJoystick = window.innerWidth < 650

      state.userId = ''
      state.fullname = 'Anonymous'
      state.email = ''
      state.role = 'user'
      state.characterId = ''
      state.isVerified = false

      state.playerName = state.fullname
      state.microphoneON = false
      state.cameraON = false
    },
  },
})

export const selectUserId = (state: RootState) => state.user.userId

export const {
  toggleBackgroundMode,
  setSessionId,
  setMediaConnected,
  setLoggedIn,
  setShowJoystick,
  setUserId,
  setUsername,
  setPlayerName,
  setEmail,
  setCharacter,
  setIsVerified,
  setMicrophoneON,
  setCameraON,
  setUserInfo,
  resetUserState,
} = userSlice.actions

export default userSlice.reducer
