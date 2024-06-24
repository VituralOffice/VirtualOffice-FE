import Cookies from 'js-cookie'
import { resetUserState } from '../stores/UserStore'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/util'
import ApiService from './ApiService'
import { isApiSuccess, setLocalStorage } from './util'

export const Logout = () => {
  localStorage.removeItem('userData')
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
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
    Cookies.set(ACCESS_TOKEN_KEY, response.result.accessToken)
    Cookies.set(REFRESH_TOKEN_KEY, response.result.refreshToken)
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
    Cookies.remove(REFRESH_TOKEN_KEY)
    Cookies.remove(ACCESS_TOKEN_KEY)
    localStorage.removeItem('userData')
    dispatch(resetUserState())
    navigate('/')
  }

  return signOut
}
