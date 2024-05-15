// import {
//   PopupContainer,
//   PopupContentHeader,
//   PopupContentSelectableItem,
//   PopupContentSession,
// } from './utils'

// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
// import { useEffect, useState } from 'react'
// import { CustomToggleButton } from '../officeJoin/UserDeviceSettings'

export const MicToggleButton = ({ onAudioInputActive }) => {
  // const [enabled, setEnabled] = useState(false)

  // const [audioMenuShow, setAudioMenuShow] = useState(false)
  // const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  // const [selectedMicId, setSelectedMicId] = useState('')
  // const [micDevices, setMicDevices] = useState<{ [deviceId: string]: string }>({})

  // const handleToggleMic = () => {
  //   const nextState = !enabled;
  //   setEnabled(nextState);
  //   // if (!nextState) {
  //   //   setAudioStream(null);
  //   // }
  // }

  // useEffect(() => {
  //   if (!audioMenuShow) return;

  //   navigator.mediaDevices
  //     .enumerateDevices()
  //     .then(async (devices) => {
  //       const mics = devices.filter((device) => device.kind === 'audioinput')

  //       if (mics.length > 0) {
  //         const micDevicesMap = mics.reduce((acc, device) => {
  //           acc[device.deviceId] = device.label
  //           return acc
  //         }, {})
  //         setMicDevices(micDevicesMap)

  //         if (!selectedMicId) {
  //           const currentMicDeviceId = mics[0].deviceId
  //           setSelectedMicId(currentMicDeviceId)
  //         }
  //       }
  //     })
  // }, [audioMenuShow])

  // let analyserNode: AnalyserNode | null = null;

  // const cleanupAudioContext = () => {
  //   if (analyserNode) {
  //     analyserNode.disconnect();
  //     analyserNode = null; // Clear reference for GC
  //   }
  // };

  // useEffect(() => {
  //   if (enabled) {
  //     async () => {
  //       const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: selectedMicId } });

  //       // Create AudioContext and AnalyserNode after getting stream
  //       const audioCtx = new AudioContext();
  //       const sourceNode = audioCtx.createMediaStreamSource(stream);

  //       analyserNode = audioCtx.createAnalyser();
  //       analyserNode.fftSize = 2048; // adjust fftSize as needed

  //       sourceNode.connect(analyserNode);

  //       const updateAudioLevel = () => {
  //         if (!analyserNode) return;

  //         const frequencyBinCount = analyserNode.frequencyBinCount;
  //         const dataArray = new Uint8Array(frequencyBinCount);
  //         analyserNode.getByteTimeDomainData(dataArray);

  //         const averageLevel = dataArray.reduce((acc, val) => acc + val, 0) / frequencyBinCount;

  //         onAudioInputActive(averageLevel);

  //         requestAnimationFrame(updateAudioLevel);
  //       };

  //       updateAudioLevel();
  //     };
  //   } else {
  //     cleanupAudioContext();
  //   }
  // }, [enabled]);

  // return (
  //   <CustomToggleButton
  //     enabled={enabled}
  //     onToggle={handleToggleMic}
  //     OnIcon={<MicRoundedIcon />}
  //     OffIcon={<MicOffRoundedIcon />}
  //     MenuPopup={
  //       <PopupContainer>
  //         <PopupContentSession>
  //           <PopupContentHeader icon={<MicRoundedIcon />} title="Select microphone" />
  //           {Object.entries(micDevices).map(([deviceId, label]) => (
  //             <PopupContentSelectableItem
  //               key={deviceId}
  //               title={label}
  //               icon={<CheckCircleRoundedIcon />}
  //               selected={selectedMicId === deviceId}
  //               onSelect={() => setSelectedMicId(deviceId)}
  //             />
  //           ))}
  //         </PopupContentSession>
  //       </PopupContainer>
  //     }
  //     onMenuToggle={() => setAudioMenuShow(!audioMenuShow)}
  //     menuShow={audioMenuShow}
  //   />
  // )
}