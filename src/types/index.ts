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