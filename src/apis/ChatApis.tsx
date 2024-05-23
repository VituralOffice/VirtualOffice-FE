import ApiService from "./ApiService"
export const CreateGroupChat = async (data: CreateRoomParams) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().post('/rooms', data);
    return response;
}
const res = await ApiService.getInstance().get(
    `/rooms/${roomId}/chats?sort=desc&sortBy=lastModifiedAt`
  )