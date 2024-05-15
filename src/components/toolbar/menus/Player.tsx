import { useEffect, useState } from 'react'
import store from '../../../stores'
import { setVideoConnected } from '../../../stores/UserStore'
import { IPlayer } from '../../../types/ISpaceState'

interface PlayerMenuProps {
  onClick: () => void
  player: IPlayer
}
export const PlayerMenu = ({ onClick, player }: PlayerMenuProps) => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const startVideoStream = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === 'videoinput')
        if (videoDevices.length === 0) {
          throw new Error('No video input devices found.')
        }
        const videoDevice = videoDevices[0]
        if (videoDevice) {
          const constraints = {
            video: { deviceId: { exact: videoDevice.deviceId } },
          }
          return navigator.mediaDevices.getUserMedia(constraints)
        }
      })
      .then((stream) => {
        if (stream) setVideoStream(stream)
      })
      .catch((error) => {
        console.error('Error starting video stream:', error)
      })
  }
  // Function to stop video stream
  const stopVideoStream = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop())
      setVideoStream(null)
    }
  }
  useEffect(() => {
    // Stop video stream when component unmounts
    return () => stopVideoStream()
  }, [videoStream])
  useEffect(() => {
    if (player.videoConnected === true) startVideoStream()
    else stopVideoStream()
  }, [player.videoConnected])
  return (
    <div className="user-menu" style={{ display: 'flex' }}>
      {player.videoConnected ? (
        <video
          style={{
            position: 'relative',
            width: 60,
            display: 'flex',
            MozBoxAlign: 'center',
            alignItems: 'center',
            MozBoxPack: 'center',
            justifyContent: 'center',
            borderRadius: '8px 0px 0px 8px',
            cursor: 'pointer',
            objectFit: 'cover',
          }}
          playsInline
          webkit-playsinline=""
          preload="auto"
          autoPlay
          ref={(videoRef) => {
            if (videoRef && videoStream) {
              videoRef.srcObject = videoStream
            }
          }}
        ></video>
      ) : (
        <div
          style={{
            position: 'relative',
            width: 60,
            display: 'flex',
            MozBoxAlign: 'center',
            alignItems: 'center',
            MozBoxPack: 'center',
            justifyContent: 'center',
            borderRight: '1px solid rgb(70, 75, 104)',
            borderRadius: '8px 0px 0px 8px',
            cursor: 'pointer',
            backgroundColor: 'rgb(51, 58, 100)',
          }}
        >
          <div
            style={{
              display: 'flex',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                position: 'relative',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              <div
                className="css-1gcv3qi"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'rgb(34, 34, 34)',
                }}
              >
                <img
                  loading="lazy"
                  size={24}
                  src="https://dynamic-assets.gather.town/v2/sprite-profile/avatar-XKiK1zaPbBlf0d3FJGoi.IxFn4Is3OJFEuIQqAEKY.6lc6LksrQBu_YmRwgodl.yzrkwnOBThC3VfHSlGQ0.UJy0fOWWJ9sdtdTfnVDz.kNxsCad0RQNKB2G0kOTb.png?d=."
                  style={{
                    objectFit: 'cover',
                    objectPosition: '0px -14px',
                    width: '100%',
                    height: '200%',
                    transform: 'scale(1.25)',
                    imageRendering: 'crisp-edges',
                  }}
                />
              </div>
            </div>
          </div>
          <div
            color="transparent"
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              borderRadius: '8px 0px 0px 8px',
            }}
          />
        </div>
      )}
      <span aria-expanded="false" aria-haspopup="dialog">
        <span>
          <button
            data-tutorial-tooltip-id="player-settings-name-container"
            aria-label="Personal menu"
            style={{
              width: 144,
              height: '100%',
              borderRadius: '0px 8px 8px 0px',
              backgroundColor: 'rgb(51, 58, 100)',
              transition: 'background-color 200ms',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              MozBoxAlign: 'start',
              alignItems: 'start',
              MozBoxPack: 'center',
              justifyContent: 'center',
              padding: '4px 6px',
              border: 'medium',
              outline: 'none',
              position: 'relative',
            }}
            onClick={onClick}
          >
            <div
              className="Layout"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                className="Layout"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div
                  className="Layout"
                  style={{ display: 'flex', flexGrow: 1, minWidth: 0, gap: 2 }}
                >
                  <span
                    fontWeight={500}
                    fontSize={12}
                    fontFamily="DM Sans, sans-serif"
                    color="white"
                    className="css-1n1bhhn"
                  >
                    HOÀNG ĐỨC
                  </span>
                </div>
                <span
                  width="16px"
                  color="#bdbdbd"
                  style={{
                    display: 'flex',
                    width: 16,
                    color: 'rgb(189, 189, 189)',
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.191 6.42l4.39 4.389-9.532 9.53-3.913.433a.823.823 0 01-.908-.91l.435-3.915 9.528-9.528zm7.104-.654l-2.06-2.061a1.647 1.647 0 00-2.329 0l-1.939 1.939 4.39 4.389 1.938-1.939a1.647 1.647 0 000-2.328z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="Layout" style={{ display: 'flex', maxWidth: '100%' }}>
              <span
                fontWeight={500}
                fontSize={12}
                fontFamily="DM Sans, sans-serif"
                color="#bdbdbd"
                style={{
                  color: 'rgb(189, 189, 189)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500,
                  fontSize: 12,
                  lineHeight: 16,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                Available
              </span>
            </div>
            <div
              style={{
                lineHeight: 0,
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                borderRadius: '50%',
                border: '3px solid rgb(32, 37, 64)',
                backgroundColor: 'green',
                width: 10,
                height: 10,
              }}
            />
          </button>
        </span>
      </span>
    </div>
  )
}
