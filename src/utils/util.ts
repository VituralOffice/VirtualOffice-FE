import Cookies from "js-cookie"

export function sanitizeId(id: string) {
  let sanitized = id

  if (sanitized.length > 9 && sanitized.endsWith('-ss')) {
    sanitized = sanitized.substring(0, sanitized.length - 3)
  }

  return sanitized.replace(/[^0-9a-z]/gi, 'G')
}

export const avatars = [
  { name: 'adam', img: 'assets/login/Adam_login.png' },
  { name: 'ash', img: 'assets/login/Ash_login.png' },
  { name: 'lucy', img: 'assets/login/Lucy_login.png' },
  { name: 'nancy', img: 'assets/login/Nancy_login.png' },
]

export function getAvatarById(id: number) {
  return avatars[Math.max(0, Math.min(id, avatars.length - 1))]
}

export function setTokenToCookie(tokenName: string, tokenValue: any) {
  Cookies.set(tokenName, tokenValue)
}

export const REFRESH_TOKEN_KEY = `refreshToken`
export const ACCESS_TOKEN_KEY = `accessToken`

export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}
