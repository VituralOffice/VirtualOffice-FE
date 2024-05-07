import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { BackgroundMode } from '../types/BackgroundMode'
import { sanitizeId } from '../utils/util'
import { UserData } from '../types'

export function getInitialBackgroundMode() {
    const currentHour = new Date().getHours()
    return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        backgroundMode: getInitialBackgroundMode(),
        sessionId: '',
        videoConnected: false,
        playerNameMap: new Map<string, string>(),
        showJoystick: window.innerWidth < 650,
        
        //user info
        userId: '',
        username: 'Anonymous',
        email: '',
        role: 'user',
        character_id: 0,
        isVerified: false,
        loggedIn: false,

        playerName: 'Anonymous',
    },
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
        setVideoConnected: (state, action: PayloadAction<boolean>) => {
            state.videoConnected = action.payload
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
        setCharacterId: (state, action: PayloadAction<number>) => {
            state.character_id = action.payload
        },
        setIsVerified: (state, action: PayloadAction<boolean>) => {
            state.isVerified = action.payload
        },

        setPlayerName: (state, action: PayloadAction<string>) => {
            state.playerName = action.payload
        },

        setUserInfo: (state, action: PayloadAction<UserData>) => {
            state.userId = action.payload._id;
            state.email = action.payload.email;
            if (!action.payload.fullname)
                state.username = action.payload.email.split('@')[0]
            else state.username = action.payload.fullname;
            state.playerName = state.username;
            state.role = action.payload.role ? action.payload.role : 'user';
            state.character_id = action.payload.character_id ? action.payload.character_id : 0;
            state.isVerified = action.payload.isVerified;
        },

        resetUserState: (state) => {
            state.backgroundMode = getInitialBackgroundMode();
            state.sessionId = '';
            state.videoConnected = false;
            state.loggedIn = false;
            state.playerNameMap = new Map<string, string>();
            state.showJoystick = window.innerWidth < 650;

            state.userId = '';
            state.username = 'Anonymous';
            state.email = '';
            state.role = 'user';
            state.character_id = 0;
            state.isVerified = false;

            state.playerName = state.username;
        },
    },
})

export const {
    toggleBackgroundMode,
    setSessionId,
    setVideoConnected,
    setLoggedIn,
    setPlayerNameMap,
    removePlayerNameMap,
    setShowJoystick,
    setUserId,
    setUsername,
    setPlayerName,
    setEmail,
    setCharacterId,
    setIsVerified,
    setUserInfo,
    resetUserState,
} = userSlice.actions

export default userSlice.reducer
