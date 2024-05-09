import {
  PopupContainer,
  PopupContentHeader,
  PopupContentSelectableItem,
  PopupContentSession,
} from './utils'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { useEffect, useState } from 'react'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import { CustomToggleButton } from '../officeJoin/UserDeviceSettings'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'

export const CameraToggleButton = ({ onVideoStreamChange }) => {
  const [enabled, setEnabled] = useState(false)
  const [cameraMenuShow, setCameraMenuShow] = useState(false)
  // const [videoStream, setVideoStream] = useState<MediaStream | null>(null)

  const [selectedCameraId, setSelectedCameraId] = useState('')
  const [cameraDevices, setCameraDevices] = useState<{ [deviceId: string]: string }>({})

  const handleToggleCam = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    // if (!nextState) {
    //   setVideoStream(null);
    // }
  }

  useEffect(() => {
    if (!cameraMenuShow) return;

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === 'videoinput')

        if (videoDevices.length > 0) {
          const devicesMap = videoDevices.reduce((acc, device) => {
            acc[device.deviceId] = device.label
            return acc
          }, {})
          setCameraDevices(devicesMap)

          const currentDeviceId = videoDevices[0].deviceId
          setSelectedCameraId(currentDeviceId)

          if (!selectedCameraId) {
            const currentCamDeviceId = videoDevices[0].deviceId
            setSelectedCameraId(currentCamDeviceId)
          }
        }
      })
      .catch((error) => {
        console.error('Error enumerating devices:', error)
      })
  }, [cameraMenuShow])

  useEffect(() => {
    if (selectedCameraId) {
      async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCameraId } });

        onVideoStreamChange(stream)
      };
    } else {
      onVideoStreamChange(null);
    }
  }, [selectedCameraId]);

  return (
    <CustomToggleButton
      enabled={enabled}
      onToggle={handleToggleCam}
      OnIcon={<VideocamRoundedIcon />}
      OffIcon={<VideocamOffRoundedIcon />}
      MenuPopup={
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
      }
      onMenuToggle={() => setCameraMenuShow(!cameraMenuShow)}
      menuShow={cameraMenuShow}
    />
  )
}