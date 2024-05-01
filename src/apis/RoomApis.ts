import ApiService from "./ApiService"
import { CreateRoomParams, GetRoomByUserIdParams, GetRoomParams } from "./types";

export const CreateRoom = async (data: CreateRoomParams) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().post('/rooms', data);
    return response;
}

export const GetRoomData = async (data: GetRoomParams) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().get(`/rooms/${data.roomId}`);
    return response;
}

export const GetRoomsByUserId = async (data: GetRoomByUserIdParams) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().get(`/rooms/${data.userId}`);
    return response;
}