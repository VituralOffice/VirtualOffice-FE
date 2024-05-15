import styled from 'styled-components'
import MainMenu from './menus/Main'
import MainModal from './modals/Main'
import { useState } from 'react'
import { PlayerMenu } from './menus/Player'
import MicMenu from './menus/Mic'
import VideoMenu from './menus/Video'
import ChatMenu from './menus/Chat'
import MemberMenu from './menus/Member'
import LeaveRoomMenu from './menus/LeaveRoom'
import UserDeviceSettings from '../officeJoin/UserDeviceSettings'
import store from '../../stores'
import { setMicConnected, setVideoConnected } from '../../stores/UserStore'
import { User } from '../../types'

const LayoutContainer = styled.div`
width: 100%;
height: 8%;
padding: 10px 24px;
display: flex;
-moz-box-pack: justify;
justify-content: space-between;
-moz-box-align: center;
align-items: center;
background-color: rgb(32, 37, 64);
border-top: 1px solid rgb(70, 75, 104);
padding: 10px 24px;
bottom: 0;
position: absolute;
}
`
interface ToolbarProps {
  user?: User
  handleOpenMic: () => void
  handleOpenVideo: () => void
}
const Toolbar = ({ user: player }: ToolbarProps) => {
  const [showModalMainMenu, setShowModalMainMenu] = useState(false)
  const [showModalPlayerMenu, setShowModalPlayerMenu] = useState(false)
  const [showModalMicMenu, setShowModalMicMenu] = useState(false)
  const [showModalVideoMenu, setShowModalVideoMenu] = useState(false)
  const [showModalChatMenu, setShowModalChatMenu] = useState(false)

  const handleClickMainMenu = () => {
    setShowModalMainMenu(true)
  }
  const handleClickPlayerMenu = () => {}
  const handleClickMicMenu = () => {
    store.dispatch(setMicConnected(!player?.micConnected))
  }
  const handleClickVideoMenu = () => {
    store.dispatch(setVideoConnected(!player?.videoConnected))
  }
  const handleClickChatMenu = () => {}
  const handleClickMemberMenu = () => {}
  const handleClickLeaveMenu = () => {}

  return (
    <LayoutContainer>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          height: '100%',
        }}
      >
        <MainMenu onClick={handleClickMainMenu}></MainMenu>
        <PlayerMenu onClick={handleClickPlayerMenu} user={player}></PlayerMenu>
        <div style={{ display: 'flex', gap: 8 }} />
        <MicMenu
          onClick={handleClickMicMenu}
          isMicConnected={player?.micConnected || false}
        ></MicMenu>
        <VideoMenu
          onClick={handleClickVideoMenu}
          isVideoConnected={player?.videoConnected || false}
        ></VideoMenu>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <ChatMenu onClick={handleClickChatMenu}></ChatMenu>
        <MemberMenu onClick={handleClickChatMenu}></MemberMenu>
        <LeaveRoomMenu onClick={handleClickChatMenu}></LeaveRoomMenu>
      </div>
      <MainModal
        onCancel={() => {
          setShowModalMainMenu(false)
        }}
        show={showModalMainMenu}
      ></MainModal>
    </LayoutContainer>
  )
}
export default Toolbar
