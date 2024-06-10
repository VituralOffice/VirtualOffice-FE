import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { BackgroundMode } from '../types/BackgroundMode'
import { sanitizeId } from '../utils/util'
import { UserData } from '../types'
import WebRTC from '../web/WebRTC'
import { ICharacter } from '../interfaces/character'
import Network from '../services/Network'

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours()
  return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}
interface UserState {
  [key: string | number]: any
  character: ICharacter | null
}
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    backgroundMode: getInitialBackgroundMode(),
    sessionId: '',
    mediaConnected: false,
    playerNameMap: new Map<string, string>(),
    playerAvatarMap: new Map<string, number>(),
    showJoystick: window.innerWidth < 650,
    //user info
    userId: '',
    username: 'Anonymous',
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
    setPlayerNameMap: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.playerNameMap.set(sanitizeId(action.payload.id), action.payload.name)
    },
    removePlayerNameMap: (state, action: PayloadAction<string>) => {
      state.playerNameMap.delete(sanitizeId(action.payload))
    },
    setPlayerAvatarMap: (state, action: PayloadAction<{ id: string; characterId: number }>) => {
      state.playerAvatarMap.set(sanitizeId(action.payload.id), action.payload.characterId)
    },
    removePlayerAvatarMap: (state, action: PayloadAction<string>) => {
      state.playerAvatarMap.delete(sanitizeId(action.payload))
    },
    setShowJoystick: (state, action: PayloadAction<boolean>) => {
      state.showJoystick = action.payload
    },

    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
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
      if (!action.payload.fullname) state.username = action.payload.email.split('@')[0]
      else state.username = action.payload.fullname
      state.playerName = state.username
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
      state.playerNameMap = new Map<string, string>()
      state.playerAvatarMap = new Map<string, number>()
      state.showJoystick = window.innerWidth < 650

      state.userId = ''
      state.username = 'Anonymous'
      state.email = ''
      state.role = 'user'
      state.character_id = 0
      state.isVerified = false

      state.playerName = state.username
      state.microphoneON = false
      state.cameraON = false
    },
  },
})

export const {
  toggleBackgroundMode,
  setSessionId,
  setMediaConnected,
  setLoggedIn,
  setPlayerNameMap,
  removePlayerNameMap,
  setPlayerAvatarMap,
  removePlayerAvatarMap,
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
