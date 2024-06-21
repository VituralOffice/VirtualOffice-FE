import Cookies from 'js-cookie'

export function sanitizeId(id: string) {
  let sanitized = id

  if (sanitized.length > 9 && (sanitized.endsWith('-ss') || sanitized.endsWith('-um'))) {
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

export function getAvatarByTexture(texture: string) {
  return avatars.find((a) => a.name == texture.toLowerCase())
}

export function setTokenToCookie(tokenName: string, tokenValue: any) {
  Cookies.set(tokenName, tokenValue)
}

export const REFRESH_TOKEN_KEY = `refreshToken`
export const ACCESS_TOKEN_KEY = `accessToken`
export const USER_LS_KEY = `userData`
export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}

export async function addStopAllTrackBeforeUnloadEvent() {
  const func = async () => {
    console.log('unload')
    const stream = await navigator.mediaDevices?.getUserMedia({
      audio: true,
      video: true,
    })
    stream.getTracks().forEach((t) => t.stop())
    window.removeEventListener('unload', func)
  }
  window.addEventListener('unload', func)
}
const colorArr = [
  '#7bf1a8',
  '#ff7e50',
  '#9acd32',
  '#daa520',
  '#ff69b4',
  '#c085f6',
  '#1e90ff',
  '#5f9da0',
]
export function getColorByString(string: string) {
  return colorArr[Math.floor(string.charCodeAt(0) % colorArr.length)]
}

export function castObject<A extends object, B extends object>(source: A): B {
  const result = {} as B
  Object.keys(source).forEach((key) => {
    const sourceKey = key as keyof A
    const targetKey = key as keyof B
    result[targetKey] = source[sourceKey] as unknown as B[keyof B]
  })
  return result
}

const AWS_S3_ENDPOINT = 'https://storage.voffice.space/voffice'
export function getResourceUrl(url?: string): string {
  if (!url) return ''
  if (url.startsWith(AWS_S3_ENDPOINT!)) {
    return url
  } else {
    return `${AWS_S3_ENDPOINT}/${url}`
  }
}
