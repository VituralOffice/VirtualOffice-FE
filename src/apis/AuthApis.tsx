import ApiService from "./ApiService"
import { callApi } from "./util";

export const LoginByEmail = async (email: string) => {
    // Gọi API đăng nhập
    const response = await ApiService.getInstance().post('/auth/login', { email });
    return response;
}

export const VerifyOtpLogin = async (email: string, otp: string) => {
    const response = await ApiService.getInstance().post('/auth/verify', { email, otp });
    return response;
}