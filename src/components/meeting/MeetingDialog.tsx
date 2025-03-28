import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hook'
import { closeMeetingDialog, setCameraONThunk, setMicrophoneONThunk } from '../../stores/MeetingStore'
import { CustomToggleButton } from '../buttons/CustomToggleButton'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import { ToolbarButton, ToolbarExitButton } from '../buttons'
import ForumIcon from '@mui/icons-material/Forum'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { MeetingNormalView } from './MeetingNormalView'
import { MeetingScreenShareView } from './MeetingScreenShareView'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import ScreenshotMonitorRoundedIcon from '@mui/icons-material/ScreenshotMonitorRounded'
import PresentToAllIcon from '@mui/icons-material/PresentToAll'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import MeetingChatSidebar from './chat/MeetingChatSidebar'
import { MeetingInfoSidebar } from './chat/MeetingInfoSidebar'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import Network from '../../services/Network'
import { YesNoPopup } from '../popups/YesNoPopup'
import { decreaseOpeningCount, increaseOpeningCount } from '../../stores/UIStore'
import MeetingAudioManager from './MeetingAudioManager'

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

const SeparateLine = styled.div`
  height: 32px;
  width: 2px;
  margin: auto 4px;
  background-color: rgb(51, 58, 100);
  border-radius: 8px;
`

// <Button
//             variant="contained"
//             color="secondary"
//
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
  const dispatch = useAppDispatch()
  const shareScreenManager = useAppSelector((state) => state.meeting.shareScreenManager)
  const userMediaManager = useAppSelector((state) => state.meeting.userMediaManager)
  const user = useAppSelector((state) => state.user)
  const peerDisplayStreams = useAppSelector((state) => state.meeting.peerDisplayStreams)
  const myPeerDisplayStream = useAppSelector((state) => state.meeting.myDisplayStream)
  const meeting = useAppSelector((state) => state.meeting)
  const [showChat, setShowChat] = useState(true)
  const [showMeetingInfo, setShowMeetingInfo] = useState(false)
  const [activeMeetingView, setActiveMeetingView] = useState(0)
  const [shareScreenAvailable, setShareScreenAvailable] = useState(false)
  const [showLeavePopup, setShowLeavePopup] = useState(false)

  const handleLockMeeting = () => {
    if (meeting.isLocked) Network.getInstance()?.unlockMeeting(meeting.activeMeetingId as string)
    else Network.getInstance()?.lockMeeting(meeting.activeMeetingId as string)
  }
  //  show when this player is admin
  const showLockButton = () => {
    return Network.getInstance()?.mySessionId.toString() == meeting.adminUser
  }
  // hide when room's locked and user's not in `meeting.connectedUser`
  const hideMeetingDialog = () => {
    if (!meeting.isLocked) return false
    if (
      meeting.isLocked &&
      meeting.connectedUser.includes(Network.getInstance()?.mySessionId.toString() || '')
    )
      return false
    return true
  }

  const toggetMic = () => {
    dispatch(setMicrophoneONThunk())
  }
  const toggetCam = () => {
    dispatch(setCameraONThunk())
  }

  useEffect(() => {
    if (peerDisplayStreams.size == 0 && myPeerDisplayStream == null) {
      setShareScreenAvailable(false)
      setActiveMeetingView(0)
    } else {
      setShareScreenAvailable(true)
    }
    // console.log(peerDisplayStreams.size, myPeerDisplayStream != null)
  }, [peerDisplayStreams, myPeerDisplayStream])

  useEffect(() => {
    dispatch(increaseOpeningCount())

    return () => {
      dispatch(decreaseOpeningCount())
    }
  }, [])

  // //TODO: optimize this: temp delay first start camera because userMediaManager hasn't been initialized yet
  // const isFirstRun = useRef(true);
  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     setTimeout(() => {
  //       if (!user.microphoneON && !user.cameraON) {
  //         userMediaManager!.stopCameraShare();
  //       } else {
  //         userMediaManager!.startCameraShare(user.cameraON, user.microphoneON);
  //       }
  //       isFirstRun.current = false;
  //     }, 1000);
  //   } else {
  //     if (!user.microphoneON && !user.cameraON) {
  //       userMediaManager!.stopCameraShare();
  //     } else {
  //       userMediaManager!.startCameraShare(user.cameraON, user.microphoneON);
  //     }
  //   }
  // }, [user.microphoneON, user.cameraON, userMediaManager]);

  return (
    <>
      <Backdrop hidden={hideMeetingDialog()}>
        <Wrapper>
          {/* <IconButton
          aria-label="close dialog"
          className="close"
          // 
        >
          <CloseIcon />
        </IconButton> */}

          <MeetingHeader>
            <MeetingTitle>{meeting.title || 'No Title'}</MeetingTitle>

            <ToolbarContainer>
              {shareScreenAvailable && (
                <ToolbarButton
                  isEnabled={activeMeetingView == 1}
                  onClick={() => setActiveMeetingView(1)}
                >
                  <div>
                    <span>
                      <ScreenshotMonitorRoundedIcon />
                    </span>
                  </div>
                </ToolbarButton>
              )}
              {shareScreenAvailable && (
                <ToolbarButton
                  isEnabled={activeMeetingView == 0}
                  onClick={() => setActiveMeetingView(0)}
                >
                  <div>
                    <span>
                      <WidgetsRoundedIcon />
                    </span>
                  </div>
                </ToolbarButton>
              )}
              {shareScreenAvailable && <SeparateLine />}
              {showLockButton() && (
                <ToolbarButton onClick={handleLockMeeting}>
                  <div>
                    <span>{meeting.isLocked ? <LockIcon /> : <LockOpenIcon />}</span>
                  </div>
                </ToolbarButton>
              )}
              <ToolbarButton
                onClick={async () => {
                  if (shareScreenManager?.myStream) {
                    shareScreenManager?.stopScreenShare();
                    // setActiveMeetingView(0);
                  } else {
                    let success = await shareScreenManager?.startScreenShare()
                    // console.log(success)
                    if (success) setActiveMeetingView(1);
                  }
                }}
              >
                <div>
                  <span>
                    {myPeerDisplayStream ? <CancelPresentationIcon /> : <PresentToAllIcon />}
                  </span>
                </div>
              </ToolbarButton>
              <CustomToggleButton
                enabled={meeting.microphoneON}
                onToggle={toggetMic}
                OnIcon={<MicRoundedIcon />}
                OffIcon={<MicOffRoundedIcon />}
              />
              <CustomToggleButton
                enabled={meeting.cameraON}
                onToggle={toggetCam}
                OnIcon={<VideocamRoundedIcon />}
                OffIcon={<VideocamOffRoundedIcon />}
              />
              <SeparateLine />
              <ToolbarButton
                isEnabled={showChat}
                onClick={() => {
                  setShowMeetingInfo(false)
                  setShowChat(!showChat)
                }}
              >
                <div>
                  <span>
                    <ForumIcon />
                  </span>
                </div>
              </ToolbarButton>
              <ToolbarButton
                isEnabled={showMeetingInfo}
                onClick={() => {
                  setShowChat(false)
                  setShowMeetingInfo(!showMeetingInfo)
                }}
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
                  if (meeting.adminUser == Network.getInstance()?.mySessionId)
                    setShowLeavePopup(true)
                  else {
                    dispatch(closeMeetingDialog())
                    Network.getInstance()?.disconnectFromMeeting(meeting.activeMeetingId!)
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
              {activeMeetingView == 0 ? (
                <MeetingNormalView />
              ) : (
                activeMeetingView == 1 && <MeetingScreenShareView />
              )}
            </MeetingView>
            {showChat ? (
              <MeetingSidebarContainer>
                <MeetingChatSidebar />
              </MeetingSidebarContainer>
            ) : (
              showMeetingInfo && (
                <MeetingSidebarContainer>
                  <MeetingInfoSidebar />
                </MeetingSidebarContainer>
              )
            )}
          </MeetingBody>
        </Wrapper>
      </Backdrop>
      <MeetingAudioManager />
      {showLeavePopup && (
        <YesNoPopup
          title="Warning"
          text="You are the admin meeting. If you leave the meeting will end. Do you want to continue?"
          submitText="Leave"
          onSubmit={() => {
            dispatch(closeMeetingDialog())
            Network.getInstance()?.disconnectFromMeeting(meeting.activeMeetingId!)
          }}
          onClosePopup={() => setShowLeavePopup(false)}
        />
      )}
    </>
  )
}
