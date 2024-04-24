import {
  PopupContainer,
  PopupContentHeader,
  PopupContentSelectableItem,
  PopupContentSession,
} from './utils'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { useEffect, useState } from 'react'

export const MicOptionsPopups = () => {
  const [selectedMicId, setSelectedMicId] = useState('')
  const [micDevices, setMicDevices] = useState<{ [deviceId: string]: string }>({})
  const [selectedSpeakerId, setSelectedSpeakerId] = useState('')
  const [speakerDevices, setSpeakerDevices] = useState<{ [deviceId: string]: string }>({})

  useEffect(() => {
    // Request permission to access media devices
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // After permission is granted, enumerate devices
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const audios = devices.filter((device) => device.kind === 'audioinput')
            const speakers = devices.filter((device) => device.kind === 'audiooutput')

            const micDevicesMap = audios.reduce((acc, device) => {
              acc[device.deviceId] = device.label
              return acc
            }, {})

            setMicDevices(micDevicesMap)
            const speakerDevicesMap = speakers.reduce((acc, device) => {
              acc[device.deviceId] = device.label
              return acc
            }, {})

            setSpeakerDevices(speakerDevicesMap)

            // Find the deviceId of the current audio devices in use
            const audioTracks = stream.getAudioTracks()
            if (audioTracks.length > 0) {
              const currentMicDeviceId = audioTracks[0].getSettings().deviceId
              if (currentMicDeviceId) setSelectedMicId(currentMicDeviceId)
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
        <PopupContentHeader icon={<MicRoundedIcon />} title="Select microphone" />
        {Object.entries(micDevices).map(([deviceId, label]) => (
          <PopupContentSelectableItem
            key={deviceId}
            title={label}
            icon={<CheckCircleRoundedIcon />}
            selected={selectedMicId === deviceId}
            onSelect={() => setSelectedMicId(deviceId)}
          />
        ))}
      </PopupContentSession>
      <PopupContentSession>
        <PopupContentHeader icon={<MicRoundedIcon />} title="Select speaker" />
        {Object.entries(speakerDevices).map(([deviceId, label]) => (
          <PopupContentSelectableItem
            key={deviceId}
            title={label}
            icon={<CheckCircleRoundedIcon />}
            selected={selectedSpeakerId === deviceId}
            onSelect={() => setSelectedSpeakerId(deviceId)}
          />
        ))}
      </PopupContentSession>
    </PopupContainer>
  )
}
