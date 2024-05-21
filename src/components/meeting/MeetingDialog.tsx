import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '../../hook'
import Video from '../videos/Video'
import { closeMeetingDialog } from '../../stores/MeetingStore'
import { CustomToggleButton } from '../buttons/CustomToggleButton'
import { useToggleCamera, useToggleMicrophone } from '../../web/utils'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import { ToolbarButton, ToolbarExitButton } from '../buttons'
import ForumIcon from '@mui/icons-material/Forum'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import store from '../../stores'
import { MeetingChatSidebar } from './chat/MeetingChatSidebar'
import { MeetingNormalView } from './MeetingNormalView'
import { MeetingScreenShareView } from './MeetingScreenShareView'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import ScreenshotMonitorRoundedIcon from '@mui/icons-material/ScreenshotMonitorRounded'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10px;
  background-color: rgb(0, 0, 0, 0.4);
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #222639;
  border-radius: 8px;
  padding: 10px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 0px 5px #0000006f;

  .close {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`

const VideoGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));

  .video-container {
    position: relative;
    background: black;
    border-radius: 8px;
    overflow: hidden;

    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      object-fit: contain;
    }

    .player-name {
      position: absolute;
      bottom: 16px;
      left: 16px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      text-shadow: 0 1px 2px rgb(0 0 0 / 60%), 0 0 2px rgb(0 0 0 / 30%);
      white-space: nowrap;
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

function VideoContainer({ playerName, stream }) {
  return (
    <div className="video-container">
      <Video srcObject={stream} autoPlay></Video>
      {playerName && <div className="player-name">{playerName}</div>}
    </div>
  )
}

// <Button
//             variant="contained"
//             color="secondary"
//             // onClick={() => {
//             //   if (shareScreenManager?.myStream) {
//             //     shareScreenManager?.stopScreenShare()
//             //   } else {
//             //     shareScreenManager?.startScreenShare()
//             //   }
//             // }}
//           >
//             {shareScreenManager?.myStream ? 'Stop sharing' : 'Share Screen'}
//           </Button>

const MeetingHeader = styled.div`
  background-color: rgb(26 29 45);
  padding: 10px;
  border-radius: 8px;
  display: flex;
  width: 100%;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
`

const MeetingTitle = styled.div`
  font-size: 30px;
  font-weight: bold;
`

const ToolbarContainer = styled.div`
  gap: 10px;
  display: flex;
`

const MeetingBody = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 1;
  width: 100%;
`

const MeetingSidebarContainer = styled.div`
  background-color: rgb(26 29 45);
  padding: 8px;
  border-radius: 8px;
  display: flex;
  width: 30%;
  gap: 10px;
`

const MeetingView = styled.div`
  background-color: rgb(26 29 45);
  padding: 8px;
  border-radius: 8px;
  flex: 1;
  display: flex;
  gap: 10px;
`

export default function MeetingDialog() {
  // const dispatch = useAppDispatch()
  // const playerNameMap = useAppSelector((state) => state.user.playerNameMap)
  // const shareScreenManager = useAppSelector((state) => state.meeting.shareScreenManager)
  // const myStream = useAppSelector((state) => state.meeting.myStream)
  // const peerStreams = useAppSelector((state) => state.meeting.peerStreams)
  const user = useAppSelector((state) => state.user)
  const toggleMic = useToggleMicrophone()
  const toggleCam = useToggleCamera()
  const toggetMic = () => {
    const nextState = !user.microphoneON
    toggleMic(nextState)
  }

  const [showChat, setShowChat] = useState(true)
  const [showMeetingInfo, setShowMeetingInfo] = useState(false)
  const [isNormalView, setIsNormalView] = useState(true)

  const toggetCam = () => {
    const nextState = !user.cameraON
    toggleCam(nextState)
  }

  return (
    <Backdrop>
      <Wrapper>
        {/* <IconButton
          aria-label="close dialog"
          className="close"
          // onClick={() => dispatch(closeMeetingDialog())}
        >
          <CloseIcon />
        </IconButton> */}

        <MeetingHeader>
          <MeetingTitle>Meeting title</MeetingTitle>
          <ToolbarContainer>
            <ToolbarButton isEnabled={!isNormalView} onClick={() => setIsNormalView(false)}>
              <div>
                <span>
                  <ScreenshotMonitorRoundedIcon />
                </span>
              </div>
            </ToolbarButton>
            <ToolbarButton isEnabled={isNormalView} onClick={() => setIsNormalView(true)}>
              <div>
                <span>
                  <WidgetsRoundedIcon />
                </span>
              </div>
            </ToolbarButton>
            <SeparateLine />
            <CustomToggleButton
              enabled={user.microphoneON}
              onToggle={toggetMic}
              OnIcon={<MicRoundedIcon />}
              OffIcon={<MicOffRoundedIcon />}
            />
            <CustomToggleButton
              enabled={user.cameraON}
              onToggle={toggetCam}
              OnIcon={<VideocamRoundedIcon />}
              OffIcon={<VideocamOffRoundedIcon />}
            />
            <ToolbarButton onClick={() => setShowChat(!showChat)}>
              <div>
                <span>
                  <ForumIcon />
                </span>
              </div>
            </ToolbarButton>
            <ToolbarButton
              isEnabled={showMeetingInfo}
              onClick={() => setShowMeetingInfo(!showMeetingInfo)}
            >
              <div>
                <span>
                  <PeopleAltIcon />
                </span>
              </div>
            </ToolbarButton>
            <SeparateLine />
            <ToolbarExitButton
              onClick={() => {
                if (shareScreenManager?.myStream) {
                  shareScreenManager?.stopScreenShare()
                } else {
                  shareScreenManager?.startScreenShare()
                }
              }}
            >
              <div>
                <span>
                  <MeetingRoomIcon />
                </span>
              </div>
            </ToolbarExitButton>
          </ToolbarContainer>
        </MeetingHeader>

        <MeetingBody>
          <MeetingView>
            {isNormalView ? <MeetingNormalView /> : <MeetingScreenShareView />}
          </MeetingView>
          {showChat ? (
            <MeetingSidebarContainer>
              <MeetingChatSidebar />
            </MeetingSidebarContainer>
          ) : (
            showMeetingInfo && (
              <MeetingSidebarContainer>
                <MeetingChatSidebar />
              </MeetingSidebarContainer>
            )
          )}
        </MeetingBody>

        {/* <VideoGrid>
          {myStream && <VideoContainer stream={myStream} playerName="You" />}

          {[...peerStreams.entries()].map(([id, { stream }]) => {
            const playerName = playerNameMap.get(id)
            return <VideoContainer key={id} playerName={playerName} stream={stream} />
          })}
        </VideoGrid> */}
      </Wrapper>
    </Backdrop>
  )
}
