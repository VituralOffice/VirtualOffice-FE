import { resetUserState } from '../stores/UserStore'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/util'
import ApiService from './ApiService'
import { callApi, isApiSuccess, setCookie, setLocalStorage } from './util'

export const Logout = () => {
  localStorage.removeItem('userData')
}

export const LoginByEmail = async (email: string) => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().post('/auth/login', { email })
  return response
}

export const VerifyOtpLogin = async (email: string, otp: string) => {
  const response = await ApiService.getInstance().post('/auth/verify', { email, otp })
  if (isApiSuccess(response)) {
    setLocalStorage('userData', response.result.user)
    setCookie(ACCESS_TOKEN_KEY, response.result.accessToken, 7)
    setLocalStorage(REFRESH_TOKEN_KEY, response.result.refreshToken)
  }
  return response
}

export const RefreshToken = async (refreshToken) => {
  let result: any
  return result
}

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const useSignOut = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const signOut = async () => {
    await ApiService.getInstance().post('/auth/logout', {})
    localStorage.removeItem('userData')
    dispatch(resetUserState())
    navigate('/')
  }

  return signOut
}
