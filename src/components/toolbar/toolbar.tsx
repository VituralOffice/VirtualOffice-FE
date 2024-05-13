import styled from 'styled-components'
import { IPlayer } from '../../types/ISpaceState'
import MainMenu from './menus/Main'
import { useState } from 'react'
import { PlayerMenu } from './menus/Player'
import MicMenu from './menus/Mic'
import VideoMenu from './menus/Video'
import ChatMenu from './menus/Chat'
import MemberMenu from './menus/Member'
import LeaveRoomMenu from './menus/LeaveRoom'
import MainModal from './modals/main'
import UserDeviceSettings from '../officeJoin/UserDeviceSettings'
import store from '../../stores'
import { setVideoConnected } from '../../stores/UserStore'

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
  player: IPlayer
  handleOpenMic: () => void
  handleOpenVideo: () => void
}
const Toolbar = ({ player }: ToolbarProps) => {
  const [showModalMainMenu, setShowModalMainMenu] = useState(false)
  const [showModalPlayerMenu, setShowModalPlayerMenu] = useState(false)
  const [showModalMicMenu, setShowModalMicMenu] = useState(false)
  const [showModalVideoMenu, setShowModalVideoMenu] = useState(false)
  const [showModalChatMenu, setShowModalChatMenu] = useState(false)

  const handleClickMainMenu = () => {
    setShowModalMainMenu(true)
  }
  const handleClickPlayerMenu = () => {}
  const handleClickMicMenu = () => {}
  const handleClickVideoMenu = () => {
    store.dispatch(setVideoConnected(!player.videoConnected))
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
        <PlayerMenu onClick={handleClickPlayerMenu} player={player}></PlayerMenu>
        <div style={{ display: 'flex', gap: 8 }} />
        <MicMenu onClick={handleClickMicMenu} isMicConnected={player.videoConnected}></MicMenu>
        <VideoMenu
          onClick={handleClickVideoMenu}
          isVideoConnected={player.videoConnected}
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
