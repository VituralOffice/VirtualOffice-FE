import styled from 'styled-components'
import { useState } from 'react'
import store from '../../stores'
import { setMediaConnected } from '../../stores/UserStore'
import { User } from '../../types'
import { useAppSelector } from '../../hook'
import { ButtonProps } from '../../interfaces/Interfaces'
import { CustomToggleButton } from '../buttons/CustomToggleButton'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import ForumIcon from '@mui/icons-material/Forum'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import OfficeLogoMenuPopup from '../popups/OfficeLogoMenuPopup'
import { OfficeParticipantSidebar } from '../sidebars/office/OfficeParticipantSidebar'

const LayoutContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  height: 60px;
  padding: 10px 10px;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(32, 37, 64);
  border-radius: 8px;
}
`

const LogoButton = styled.button<ButtonProps>`
  height: 40px;
  width: 40px;
  border-radius: 8px;
  background-color: ${(props) => (props.isActive ? 'rgb(88, 130, 247)' : 'rgb(67, 88, 216)')};
  border-color: ${(props) => (props.isActive ? 'rgb(144, 173, 255)' : 'transparent')};
  &:hover {
    background-color: rgb(88, 130, 247);
    border-color: rgb(144, 173, 255);
  }
  border-style: solid;
  border-width: 2px;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  cursor: pointer;
  & > span {
    display: flex;
    width: 28px;
    height: 28px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    & > svg {
      width: 100%;
      height: auto;
    }
  }
`

const ToolbarButton = styled.button<ButtonProps>`
  height: 40px;
  padding: 8px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.isActive ? 'rgb(51, 58, 100)' : 'transparent')};
  &:hover {
    background-color: rgb(51, 58, 100);
  }
  transition: background-color 200ms ease 0s;
  cursor: pointer;
  position: relative;
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    & > span {
      display: flex;
      width: 24px;
      color: rgb(224, 224, 224);
      flex-shrink: 0;
      & > svg {
        width: 100%;
        height: auto;
      }
    }
  }
`

const SeparateLine = styled.div`
  height: 32px;
  width: 2px;
  margin: auto 4px;
  background-color: rgb(51, 58, 100);
  border-radius: 8px;
`

const ExitButton = styled(ToolbarButton)`
  background-color: ${(props) => (props.isActive ? 'rgb(221, 41, 63)' : 'rgb(51, 58, 100)')};
  &:hover {
    background-color: rgb(221, 41, 63);
  }
`

const OfficeToolbar = () => {
  const [micEnabled, setMicEnabled] = useState(false)
  const [camEnabled, setCamEnabled] = useState(false)
  const user = useAppSelector((state) => state.user)
  const [showLogoMenu, setShowLogoMenu] = useState(false)
  const [showParticipantSidebar, setShowParticipantSidebar] = useState(false)

  const toggetMic = () => {
    const nextState = !micEnabled
    if (!nextState) {
      setMicEnabled(false)
    } else {
      // getMicMS()
      setMicEnabled(true)
    }
  }

  const toggetCam = () => {
    const nextState = !camEnabled
    if (!nextState) {
      setCamEnabled(false)
    } else {
      // getCamMS()
      setCamEnabled(true)
    }
  }

  return (
    <>
      <LayoutContainer>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            height: '100%',
          }}
        >
          <LogoButton isActive={showLogoMenu} onClick={() => setShowLogoMenu(!showLogoMenu)}>
            <span>
              <img src="/logo_transparent.svg" alt="" />
            </span>
            {showLogoMenu && <OfficeLogoMenuPopup />}
          </LogoButton>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              height: '100%',
            }}
          >
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
            <ToolbarButton>
              <div>
                <span>
                  <ForumIcon />
                </span>
              </div>
            </ToolbarButton>
            <ToolbarButton onClick={() => setShowParticipantSidebar(!showParticipantSidebar)}>
              <div>
                <span>
                  <PeopleAltIcon />
                </span>
              </div>
            </ToolbarButton>
            <SeparateLine />
            <ExitButton>
              <div>
                <span>
                  <MeetingRoomIcon />
                </span>
              </div>
            </ExitButton>
          </div>
        </div>
      </LayoutContainer>
      {showParticipantSidebar && (
        <OfficeParticipantSidebar onClose={() => setShowParticipantSidebar(false)} />
      )}
    </>
  )
}
export default OfficeToolbar
