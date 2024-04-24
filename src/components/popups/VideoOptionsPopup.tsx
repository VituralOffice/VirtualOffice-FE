import {
  PopupContainer,
  PopupContentHeader,
  PopupContentSelectableItem,
  PopupContentSession,
} from './utils'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { useEffect, useState } from 'react'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'

export const VideoOptionsPopups = () => {
  const [selectedCameraId, setSelectedCameraId] = useState('')
  const [cameraDevices, setCameraDevices] = useState<{ [deviceId: string]: string }>({})

  useEffect(() => {
    // Request permission to access video devices
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // After permission is granted, enumerate devices
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === 'videoinput')

            // Create an object with deviceId as key and deviceLabel as value
            const devicesMap = videoDevices.reduce((acc, device) => {
              acc[device.deviceId] = device.label
              return acc
            }, {})

            setCameraDevices(devicesMap)

            // Find the deviceId of the current video device in use
            const videoTracks = stream.getVideoTracks()
            if (videoTracks.length > 0) {
              const currentDeviceId = videoTracks[0].getSettings().deviceId
              if (currentDeviceId) {
                setSelectedCameraId(currentDeviceId)
              }
            }

            // Stop all tracks after getting device labels
            stream.getTracks().forEach((track) => track.stop())
          })
          .catch((error) => {
            console.error('Error enumerating devices:', error)
          })
      })
      .catch((error) => {
        // Handle the error if the user doesn't grant permission
        console.error('Permission denied for media devices:', error)
      })
  }, [])

  return (
    <PopupContainer>
      <PopupContentSession>
        <PopupContentHeader icon={<VideocamRoundedIcon />} title="Select camera" />
        {Object.entries(cameraDevices).map(([deviceId, label]) => (
          <PopupContentSelectableItem
            key={deviceId}
            title={label}
            icon={<CheckCircleRoundedIcon />}
            selected={selectedCameraId === deviceId}
            onSelect={() => setSelectedCameraId(deviceId)}
          />
        ))}
      </PopupContentSession>
    </PopupContainer>
  )
}
