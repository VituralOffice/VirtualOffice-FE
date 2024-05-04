import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { getLocalStorage, setLocalStorage } from './util'
import { Logout, RefreshToken } from './AuthApis'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/util'
import Cookies from 'js-cookie'

export const onRequestSuccess = (config: AxiosRequestConfig) => {
  const accessToken = Cookies.get('accessToken')
  config.timeout = 10000
  if (accessToken) {
    config.headers = {
      Authorization: 'Bearer ' + accessToken,
    }
  }
  return config as InternalAxiosRequestConfig // Type cast to expected type
}

export const onResponseSuccess = (response: AxiosResponse) => {
  return response
}
export const onResponseError = (error: AxiosError) => {
  if (error.response?.status !== 401) {
    const errMessage = error.response?.data || error?.response || error
    return Promise.reject(errMessage)
  }
  return refreshToken(error, Logout) // gọi hàm để refresh token.
}

// hàm để refresh token
const refreshToken = async (error: AxiosError, logout: Function) => {
  const refreshToken = getLocalStorage('refreshToken')
  if (!refreshToken) {
    logout()
    return
  }
  try {
    const result = await (await RefreshToken(refreshToken)).result
    Cookies.set(REFRESH_TOKEN_KEY, result.refreshToken)
    Cookies.set(ACCESS_TOKEN_KEY, result.accessToken)
    const newConfig: AxiosRequestConfig = { ...error.config }
    newConfig.headers = {
      ...newConfig.headers,
      Authorization: 'Bearer ' + result.accessToken,
    }
    // return ApiService.getInstance().sendRequest(newConfig);
  } catch (error) {
    logout()
    return
  }
}
