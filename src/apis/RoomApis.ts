import ApiService from "./ApiService"
import { CreateRoomParams, GetRoomParams, InviteUserParams, JoinRoomParams } from "./types";

export const CreateRoom = async (data: CreateRoomParams) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().post('/rooms', data);
    return response;
}

export const GetRoomById = async (data: GetRoomParams) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().get(`/rooms/${data._id}`);
    return response;
}

export const GetRoomsByUserId = async () => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().get(`/rooms`);
    return response;
}

export const InviteUserToRoom = async (data: InviteUserParams) => {
    const response = await ApiService.getInstance().post(`/rooms/${data.roomId}/invite`, { email: data.email });
    return response;
}

export const JoinRoom = async (data: JoinRoomParams) => {
    const response = await ApiService.getInstance().post(`/rooms/${data.roomId}/join`, { token: data.token });
    return response;
}