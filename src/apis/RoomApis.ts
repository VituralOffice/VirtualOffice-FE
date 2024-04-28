import ApiService from "./ApiService"
import { CreateRoomParams } from "./types";

export const CreateRoom = async (data: CreateRoomParams) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().post('/rooms', data);
    return response;
}