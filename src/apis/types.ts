export type CreateRoomParams = {
    map: string,
    name: string,
    private: boolean
}

export type GetRoomParams = {
    _id: string,
}

export type InviteUserParams = {
    roomId: string,
    email: string,
}

export type JoinRoomParams = {
    roomId: string,
    token: string,
}