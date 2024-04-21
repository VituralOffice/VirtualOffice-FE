import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { onRequestSuccess, onResponseError, onResponseSuccess } from './AxiosIntercepter';


class ApiService {
    private static instance: ApiService | null = null; // Biến static để lưu trữ instance của ApiService
    private axiosInstance: AxiosInstance;

    private constructor(baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
        });
        this.axiosInstance.interceptors.request.use(onRequestSuccess);
        this.axiosInstance.interceptors.response.use(onResponseSuccess, onResponseError);
    }

    // Hàm static để truy cập instance của ApiService
    static getInstance(): ApiService {
        // Kiểm tra xem ApiService đã được khởi tạo hay chưa
        if (!ApiService.instance) {
            // Nếu chưa được khởi tạo, tạo một instance mới
            // ApiService.instance = new ApiService(process.env.BASE_API_URL!);
            ApiService.instance = new ApiService("https://api.voffice.space/v1");
        }
        // Trả về instance đã có hoặc mới tạo
        return ApiService.instance;
    }

    async get(endpoint: string) {
        try {
            const response = await this.axiosInstance.get(endpoint);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async post(endpoint: string, data: any) {
        try {
            const response = await this.axiosInstance.post(endpoint, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async patch(endpoint: string, data: any) {
        try {
            const response = await this.axiosInstance.patch(endpoint, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async delete(endpoint: string) {
        try {
            const response = await this.axiosInstance.delete(endpoint);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    async sendRequest(config: AxiosRequestConfig) {
        try {
            const response = await this.axiosInstance(config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default ApiService;
