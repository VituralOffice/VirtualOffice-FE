import axios, { AxiosError, AxiosInstance } from 'axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_LS_KEY } from '../utils/util'
import { API_URL } from '../constant'
import Cookies from 'js-cookie'
import { removeLocalStorage } from './util'

class ApiService {
  private static instance: ApiService | null = null // Biến static để lưu trữ instance của ApiService
  private axiosInstance: AxiosInstance
  private isRefreshingToken: boolean = false
  private requestQueue: (() => void)[] = []
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
        if (status === 401 && errorMessage === 'token expired' && !originalRequest._retry) {
          originalRequest._retry = true
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true
            const refreshFromCookie = Cookies.get(REFRESH_TOKEN_KEY)
            if (!refreshFromCookie) return error
            try {
              const { accessToken, refreshToken } = await this.refreshToken(refreshFromCookie)
              this.requestQueue.forEach((req) => req())
              this.isRefreshingToken = false
              this.requestQueue = []
              Cookies.set(REFRESH_TOKEN_KEY, refreshToken)
              Cookies.set(ACCESS_TOKEN_KEY, accessToken)
              return this.axiosInstance.request(originalRequest)
            } catch (error) {
              // call refresh token error
              Cookies.remove(REFRESH_TOKEN_KEY)
              Cookies.remove(ACCESS_TOKEN_KEY)
              removeLocalStorage(USER_LS_KEY)
              // navigate to /signin
              window.location.href = '/signin'
            }
          } else {
            return new Promise((resolve) => {
              this.requestQueue.push(() => resolve(this.axiosInstance.request(originalRequest)))
            })
          }
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
        accessToken: data.result.accessToken,
        refreshToken: data.result.refreshToken,
      }
    } catch (error) {
      throw error
    }
  }
}

export default ApiService
