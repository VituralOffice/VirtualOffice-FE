import ApiService from "./ApiService"
import { callApi } from "./util";

export const LoginByEmail = async (email: string) => callApi(async () => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().post('/auth/login', { email });
    // Kiểm tra xem phản hồi từ API có thành công không
    return response;
});