export const API_URL = import.meta.env.VITE_API_URL
export const PEER_HOST = import.meta.env.VITE_PEER_HOST
export const PEER_CONNECT_OPTIONS = {
  host: PEER_HOST,
  secure: true,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }, // Example STUN server
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.services.mozilla.com' },
    ],
  },
}
export const UNKNOWN_ERROR = `An error ocurred`
export const SENDTRY_DSN = import.meta.env.VITE_SENDTRY_DSN
