import { useState } from 'react'
import styled from 'styled-components'
import { ButtonProps } from '../../interfaces/Interfaces'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import { MicOptionsPopups } from '../popups/MicOptionsPopup'
import { VideoOptionsPopups } from '../popups/VideoOptionsPopup'

const BodyLeftContent = styled.div`
  width: 100%;
  max-width: 345px;
  margin: auto 0px auto auto;
  position: relative;
`

const CameraDisplay = styled.div`
  position: relative;
  height: 0px;
  border-radius: 16px;
  overflow: hidden;
  background-color: rgb(17, 17, 17);
  padding-bottom: 66%;
  border: 2px solid rgb(63, 71, 118);
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
        background: rgba(17, 17, 17, 0.7);
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
    width: 60px;
    padding: 8px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
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

function CustomToggleButton({ onToggle, onMenuToggle, OnIcon, OffIcon, MenuPopup, menuShow }) {
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  const handleToggle = (e) => {
    e.stopPropagation()
    onToggle(!isButtonEnabled)
    setIsButtonEnabled(!isButtonEnabled)
  }

  const handleToggleOpenMenu = (e) => {
    e.stopPropagation()
    onMenuToggle()
  }

  return (
    <>
      <OptionButton isEnabled={isButtonEnabled} onClick={handleToggle}>
        <button className="button-icon">
          <span>{isButtonEnabled ? OnIcon : OffIcon}</span>
        </button>
        <div className="line"></div>
        <OptionMenuToggleButton
          isActive={isButtonEnabled}
          isEnabled={menuShow}
          onClick={handleToggleOpenMenu}
        >
          <span>
            <KeyboardArrowDownRoundedIcon />
          </span>
        </OptionMenuToggleButton>
      </OptionButton>
      {menuShow && MenuPopup}
    </>
  )
}

export default function UserDeviceSettings() {
  const [audioMenuShow, setAudioMenuShow] = useState(false)
  const [cameraMenuShow, setCameraMenuShow] = useState(false)

  const handleToggleMenu = (setFunction: () => void) => {
    setCameraMenuShow(false)
    setAudioMenuShow(false)
    setFunction()
  }

  return (
    <BodyLeftContent>
      <CameraDisplay>
        <div className="video-display">
          <div>
            <video playsInline webkit-playsinline="" preload="auto" autoPlay></video>
          </div>
        </div>
        <div className="camera-status-text">
          <div>
            <div>Your camera is off</div>
          </div>
        </div>
      </CameraDisplay>
      <CameraOptionButtonGroup>
        <div>
          <CustomToggleButton
            onToggle={() => {}}
            OnIcon={<MicRoundedIcon />}
            OffIcon={<MicOffRoundedIcon />}
            MenuPopup={<MicOptionsPopups />}
            onMenuToggle={() => handleToggleMenu(() => setAudioMenuShow(!audioMenuShow))}
            menuShow={audioMenuShow}
          />
          <CustomToggleButton
            onToggle={() => {}}
            OnIcon={<VideocamRoundedIcon />}
            OffIcon={<VideocamOffRoundedIcon />}
            MenuPopup={<VideoOptionsPopups />}
            onMenuToggle={() => handleToggleMenu(() => setCameraMenuShow(!cameraMenuShow))}
            menuShow={cameraMenuShow}
          />
        </div>
      </CameraOptionButtonGroup>
    </BodyLeftContent>
  )
}
