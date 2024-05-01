export type CreateRoomParams = {
    map: string,
    name: string,
    private: boolean
}

export type GetRoomParams = {
    roomId: string,
}

export type GetRoomByUserIdParams = {
    userId: string,
}