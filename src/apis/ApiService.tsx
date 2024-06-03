import axios, { AxiosInstance } from 'axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/util'
import { API_URL } from '../constant'
import Cookies from 'js-cookie'

class ApiService {
  private static instance: ApiService | null = null // Biến static để lưu trữ instance của ApiService
  private axiosInstance: AxiosInstance

  private constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
    })
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY) // Implement getAccessToken() to retrieve token

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
      },
      (error) => {
        // Handle request errors (optional)
        return Promise.reject(error)
      }
    )
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config
        const status = error?.response?.status
        const errorMessage = error?.response?.data?.message
        if (status === 401 && errorMessage === 'token expired') {
          const refreshFromCookie = Cookies.get(REFRESH_TOKEN_KEY)
          if (!refreshFromCookie) return error
          // call refresh token and save to cookie
          const { accessToken, refreshToken } = await this.refreshToken(refreshFromCookie)
          Cookies.set(REFRESH_TOKEN_KEY, refreshToken)
          Cookies.set(ACCESS_TOKEN_KEY, accessToken)
          originalRequest.headers['Authorization'] = 'Bearer ' + accessToken
          // retry pre failed request
          return this.axiosInstance.request(originalRequest)
        }
        return Promise.reject(error)
      }
    )
  }

  // Hàm static để truy cập instance của ApiService
  static getInstance(): ApiService {
    // Kiểm tra xem ApiService đã được khởi tạo hay chưa
    if (!ApiService.instance) {
      // Nếu chưa được khởi tạo, tạo một instance mới
      // ApiService.instance = new ApiService(process.env.BASE_API_URL!);
      ApiService.instance = new ApiService(API_URL + '/v1')
    }
    // Trả về instance đã có hoặc mới tạo
    return ApiService.instance
  }

  async get(endpoint: string, params: any = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await this.axiosInstance.post(endpoint, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async patch(endpoint: string, data: any) {
    try {
      const response = await this.axiosInstance.patch(endpoint, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await this.axiosInstance.delete(endpoint)
      return response.data
    } catch (error) {
      throw error
    }
  }
  async refreshToken(token: string) {
    try {
      const { data } = await this.axiosInstance.post('/auth/refresh', { refreshToken: token })
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }
    } catch (error) {
      throw error
    }
  }
}

export default ApiService
