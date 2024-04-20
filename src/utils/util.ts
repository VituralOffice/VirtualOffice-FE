export function sanitizeId(id: string) {
  let sanitized = id

  if (sanitized.length > 9 && sanitized.endsWith('-ss')) {
    sanitized = sanitized.substring(0, sanitized.length - 3)
  }

  return sanitized.replace(/[^0-9a-z]/gi, 'G')
}

export const avatars = [
  'assets/login/Adam_login.png',
  'assets/login/Ash_login.png',
  'assets/login/Lucy_login.png',
  'assets/login/Nancy_login.png',
]

export function getAvatarById(id: number) {
  return avatars[Math.max(0, Math.min(id, avatars.length - 1))]
}

export function setTokenToCookie(tokenName: string, tokenValue: any) {
  document.cookie = `${tokenName}=${tokenValue}; path=/`
}
export function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
  return ``
}
export const REFRESH_TOKEN_KEY = `refreshToken`
export const ACCESS_TOKEN_KEY = `accessToken`
