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
  const [selectCameraIndex, setSelectCameraIndex] = useState(0)
  const [cameraDeviceNames, setCameraDeviceNames] = useState<string[]>([])

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
            setCameraDeviceNames(videoDevices.map((device) => device.label))

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
        {cameraDeviceNames.map((value, index) => (
          <PopupContentSelectableItem
            key={index}
            title={value}
            icon={<CheckCircleRoundedIcon />}
            selected={index == selectCameraIndex}
            onSelect={() => setSelectCameraIndex(index)}
          />
        ))}
      </PopupContentSession>
    </PopupContainer>
  )
}
