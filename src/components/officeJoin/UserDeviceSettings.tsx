import { LegacyRef, RefObject, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ButtonProps } from '../../interfaces/Interfaces'
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import store from '../../stores'
import { setVideoConnected } from '../../stores/UserStore'

import { MicToggleButton } from '../popups/MicOptionsPopup'
import { CameraToggleButton } from '../popups/VideoOptionsPopup'
import { addStopAllTrackBeforeUnloadEvent } from '../../utils/util'

const BodyLeftContent = styled.div`
  width: 100%;
  max-width: 345px;
  margin: auto 0px auto auto;
  position: relative;
`

const CameraDisplay = styled.div<ButtonProps>`
  position: relative;
  height: 0px;
  border-radius: 16px;
  overflow: hidden;
  background-color: rgb(17, 17, 17);
  padding-bottom: 66%;
  border: ${(props) =>
    props.isActive ? '2px solid rgb(6, 214, 160)' : '2px solid rgb(63, 71, 118)'};
  .video-display {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    & > div {
      width: 100%;
      height: 100%;
      & > video {
        transform: scale(-1, 1);
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .camera-status-text {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      & > div {
        padding: 4px 12px;
        border-radius: 16px;
        width: 100%;
        max-width: 300px;
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        color: rgb(255, 255, 255);
        text-align: center;
        margin: 0px 7px;
        white-space: pre-wrap;
      }
    }
  }
`
const CameraOptionButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  position: absolute;
  width: 100%;
  & > div {
    display: flex;
    gap: 8px;
  }
`

const OptionButton = styled.div<ButtonProps>`
  display: flex;
  position: relative;
  .button-icon {
    height: 40px;
    width: 50px;
    padding: 8px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border: none;
    border-radius: 20px;
    background-color: ${(props) =>
      props.isEnabled ? 'rgba(6, 214, 160, 0.2)' : 'rgba(255, 48, 73, 0.2)'};
    transition: background-color 200ms ease 0s;
    cursor: pointer;
    position: relative;
    &:hover {
      background-color: ${(props) =>
        props.isEnabled ? 'rgba(6, 214, 160, 0.4)' : 'rgba(255, 48, 73, 0.4)'};
    }
    & > span {
      display: flex;
      width: 24px;
      color: ${(props) => (props.isEnabled ? 'rgb(6, 214, 160)' : 'rgb(255, 48, 73)')};
      flex-shrink: 0;
      & > svg {
        width: 100%;
        height: auto;
      }
    }
  }
  .line {
    position: absolute;
    left: 34px;
    top: 10px;
    border-radius: 8px;
    width: 2px;
    height: 20px;
    background-color: ${(props) =>
      props.isEnabled ? 'rgb(6, 214, 160)' : 'rgba(255, 48, 73, 0.2)'};
  }
`

const OptionMenuToggleButton = styled.div<ButtonProps>`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  position: absolute;
  padding-left: 2px;
  left: 36px;
  width: 24px;
  height: 100%;
  border-radius: 0px 20px 20px 0px;
  transition: background-color 200ms ease 0s;
  cursor: pointer;

  & > span {
    display: flex;
    width: 16px;
    color: ${(props) => (props.isActive ? 'rgb(6, 214, 160)' : 'rgb(255, 48, 73)')};
    flex-shrink: 0;
    transform: ${(props) => (props.isEnabled ? 'rotate(180deg)' : 'rotate(0deg)')};
    & > svg {
      width: 100%;
      height: auto;
    }
  }

  background-color: ${(props) =>
    props.isActive
      ? props.isEnabled
        ? 'rgba(6, 214, 160, 0.4)'
        : 'transparent'
      : props.isEnabled
      ? 'rgba(255, 48, 73, 0.4)'
      : 'transparent'};

  &:hover {
    background-color: ${(props) =>
      props.isActive ? 'rgba(6, 214, 160, 0.4)' : 'rgba(255, 48, 73, 0.4)'};
  }
`

export function CustomToggleButton({ enabled, onToggle, OnIcon, OffIcon }) {
  const handleToggle = (e) => {
    e.stopPropagation()
    onToggle()
  }

  return (
    <>
      <OptionButton isEnabled={enabled} onClick={handleToggle}>
        <button className="button-icon">
          <span>{enabled ? OnIcon : OffIcon}</span>
        </button>
        {/* <div className="line"></div>
        <OptionMenuToggleButton
          isActive={enabled}
          isEnabled={menuShow}
          onClick={handleToggleOpenMenu}
        >
          <span>
            <KeyboardArrowDownRoundedIcon />
          </span>
        </OptionMenuToggleButton> */}
      </OptionButton>
      {/* {menuShow && MenuPopup} */}
    </>
  )
}

export default function UserDeviceSettings() {
  const [micEnabled, setMicEnabled] = useState(false)
  const [camEnabled, setCamEnabled] = useState(false)

  const [hasSoundInput, setHasSoundInput] = useState(false)

  const [camMS, setCamMS] = useState<MediaStream | null>(null)
  const [micMS, setMicMS] = useState<MediaStream | null>(null)

  // const [micId, setMidId] = useState<string>('');
  // const [camId, setCamId] = useState<string>('');

  //const videoRef = useRef<HTMLVideoElement>(null)

  const toggetMic = () => {
    const nextState = !micEnabled
    if (!nextState) {
      if (micMS) micMS.getTracks().forEach((track) => track.stop())
      setMicEnabled(false)
      store.dispatch(setVideoConnected(false))
    } else {
      getMicMS()
      store.dispatch(setVideoConnected(true))
    }
  }

  const toggetCam = () => {
    const nextState = !camEnabled
    if (!nextState) {
      console.log({ camMS })
      if (camMS) camMS.getTracks().forEach((track) => track.stop())
      setCamEnabled(false)
      store.dispatch(setVideoConnected(false))
    } else {
      getCamMS()
      store.dispatch(setVideoConnected(true))
    }
  }

  const getCamMS = (alertOnError = true) => {
    navigator.mediaDevices
      ?.getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        //if (videoRef.current) videoRef.current.srcObject = stream
        setCamMS(stream)
        setCamEnabled(true)
      })
      .catch((error) => {
        console.log(error)
        if (alertOnError) window.alert('No webcam found, or permission is blocked')
        setCamMS(null)
        setCamEnabled(false)
      })
  }

  // let audioContext: AudioContext | null;
  // let audioSource: MediaStreamAudioSourceNode | null;
  // let audioWorkletNode: AudioWorkletNode | null;
  // let audioInitialized = false;

  // const hehe = (hihi: boolean) => {
  //   console.log(hihi)
  //   setHasSoundInput(hihi)
  // }
  // const handleProcessVolumeEvent = async (event: MessageEvent<any>) => {
  //   // Check if the audio level is above a certain threshold
  //   if (event.data.volume > 0.01) {
  //     hehe(true);
  //   } else {
  //     hehe(false);
  //   }
  // };

  // useEffect(() => {
  //   console.log(hasSoundInput); // This will log whenever hasSoundInput changes
  // }, [hasSoundInput]);
  const getMicMS = async (alertOnError = true) => {
    navigator.mediaDevices
      ?.getUserMedia({
        audio: true,
        video: false,
      })
      .then(async (stream) => {
        // if (!audioInitialized) {
        //   audioContext = new AudioContext();
        //   await audioContext.audioWorklet.addModule('/worklets/audioMeter.js');

        //   // Load the worklet
        //   audioWorkletNode = new AudioWorkletNode(audioContext, 'audioMeter');

        //   audioWorkletNode.port.onmessage = handleProcessVolumeEvent;

        //   audioInitialized = true;
        // } else {
        //   audioSource?.disconnect(audioWorkletNode!)
        //   if (audioSource?.mediaStream) {
        //     audioSource.mediaStream.getTracks().forEach(track => track.stop());
        //   }
        //   audioSource = null;

        //   // audioWorkletNode!.port.onmessage = () => {};
        //   // audioWorkletNode?.port.close();
        //   audioWorkletNode?.disconnect(audioContext!.destination);
        // }

        // // Create the Audio Context
        // audioSource = audioContext!.createMediaStreamSource(stream);

        // // Connect the audio pipeline - this will start the processing
        // audioSource.connect(audioWorkletNode!).connect(audioContext!.destination);
        setMicMS(stream)
        setMicEnabled(true)
      })
      .catch((error) => {
        console.log(error)
        if (alertOnError) window.alert('No microphone found, or permission is blocked')
        setMicMS(null)
        setMicEnabled(false)
      })
  }

  const UnregisterMicrophoneEvents = () => {
    // console.log(micMS != null)
    // if (micMS) {
    //   console.log("hihi")
    //   const trackPromises = micMS.getTracks().map(track => track.stop());
    //   await Promise.all(trackPromises);
    // }
    micMS?.getTracks().forEach((track) => track.stop())
    // if (audioWorkletNode) {
    //   audioWorkletNode.port.close(); // Disconnect worklet port
    //   audioWorkletNode.disconnect(); // Disconnect worklet from pipeline
    // }
    // if (audioSource) {
    //   audioSource.disconnect(); // Disconnect audio source from pipeline
    // }
    // if (audioContext) {
    //   await audioContext.close(); // Close audio context
    // }
    // audioSource = null;
    // audioWorkletNode = null;
    // audioContext = null;
  }
  const UnregisterCameraEvents = () => {
    // console.log(camMS != null)
    // if (camMS) {
    //   console.log("haha")
    //   const trackPromises = camMS.getTracks().map(track => track.stop());
    //   await Promise.all(trackPromises);
    // }
    camMS?.getTracks().forEach((track) => track.stop())
    setCamMS(null)
  }
  useEffect(() => {
    const initialize = async () => {
      getCamMS()
      getMicMS()
    }

    initialize()

    // Hàm dọn dẹp trước khi trang unload
    const handleBeforeUnload = async () => {
      UnregisterMicrophoneEvents()
      UnregisterCameraEvents()
      // console.log("stop all")
    }

    // addStopAllTrackBeforeUnloadEvent();

    return () => {
      // window.alert('No microphone found, or permission is blocked')
      handleBeforeUnload()
    }

    // window.addEventListener('beforeunload', async (event) => {
    //   event.preventDefault(); // Prevent the default behavior (e.g., showing a confirmation dialog)

    //   // Call your cleanup functions
    //   await UnregisterMicrophoneEvents();
    //   await UnregisterCameraEvents();
    // });
  }, [])

  return (
    <BodyLeftContent>
      <CameraDisplay isActive={hasSoundInput}>
        <div className="video-display">
          <div>
            <video
              playsInline
              webkit-playsinline=""
              preload="auto"
              autoPlay
              ref={(videoRef) => {
                if (videoRef) videoRef.srcObject = camMS
              }}
            ></video>
          </div>
        </div>
        {!camEnabled && (
          <div className="camera-status-text">
            <div>
              <div>Your camera is off</div>
            </div>
          </div>
        )}
      </CameraDisplay>
      <CameraOptionButtonGroup>
        <div>
          <CustomToggleButton
            enabled={micEnabled}
            onToggle={toggetMic}
            OnIcon={<MicRoundedIcon />}
            OffIcon={<MicOffRoundedIcon />}
          />
          <CustomToggleButton
            enabled={camEnabled}
            onToggle={toggetCam}
            OnIcon={<VideocamRoundedIcon />}
            OffIcon={<VideocamOffRoundedIcon />}
          />
        </div>
      </CameraOptionButtonGroup>
    </BodyLeftContent>
  )
}
