import { BackgroundMode } from "./BackgroundMode"

export type UserData = {
    _id: string,
    email: string,
    fullname: string,
    role: string,
    isVerified: boolean,
    character_id: number,
}

export type LoginResponse = {
    accessToken: string,
    refreshToken: string,
    user: {
        _id: string,
        email: string,
        provider: string,
        fullname: string,
        role: string,
        isVerified: boolean,
        createdAt: Date
    }
}

export type User = {
    backgroundMode: BackgroundMode,
    sessionId: string,
    mediaConnected: boolean,
    playerNameMap: Map<string, string>,
    showJoystick: boolean,

    userId: string,
    username: string,
    email: string,
    role: string,
    character_id: number,
    isVerified: false,
    loggedIn: false,

    playerName: string,
    microphoneON: boolean,
    cameraON: boolean,
}