import styled from 'styled-components'
import { ButtonProps } from '../../interfaces/Interfaces'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import NotInterestedRoundedIcon from '@mui/icons-material/NotInterestedRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useState } from 'react'
import DashboardUserMenuPopup from '../popups/DashboardUserMenuPopup'
import { useAppSelector } from '../../hook'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(40, 45, 78);
  width: 256px;
  min-width: 256px;
  max-width: 256px;
`

const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  padding-left: 16px;
  padding-right: 16px;
`

const DashboardTitle = styled.div`
  margin: 24px 0px;
  font-size: 20px;
  font-weight: 700;
  line-height: 26px;
  color: rgb(255, 255, 255);
`

const NavMenuItem = styled.a<ButtonProps>`
  padding: 10px;
  margin-bottom: 8px;
  color: ${(props) => (props.isEnabled ? 'rgb(255, 255, 255)' : 'rgb(224, 224, 224)')};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => (props.isEnabled ? 'rgb(84, 92, 143)' : 'rgba(84, 92, 143, 0)')};
  text-decoration: none;

  &:hover {
    background-color: rgba(84, 92, 143, 0.3);
  }

  .icon {
    display: flex;
    width: 22px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    & > svg {
      width: 100%;
      height: auto;
    }
  }

  .title {
    display: flex;
    margin-left: 8px;
  }
`

const UserBottomInfo = styled.div`
  cursor: pointer;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 16px;
  border-top: 1px solid rgb(51, 58, 100);
  position: relative;

  &:hover {
    cursor: pointer;
    background-color: rgb(32, 37, 64);
  }
`

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;

  & > div {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    position: relative;
    user-select: none;
    & > div {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      background-color: rgb(34, 34, 34);
      & > img {
        object-fit: cover;
        object-position: 0px 8px;
        width: 100%;
        height: 150%;
        transform: scale(0.75);
        image-rendering: pixelated;
        position: relative;
        top: -10px;
      }
    }
  }
`

const Username = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  justify-content: center;
  & > div {
    color: rgb(255, 255, 255);
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    flex: 1 1 0%;
  }
`

const DropdownIcon = styled.div<ButtonProps>`
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.isEnabled ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transition: background-color 200ms ease 0s;
  }
  & > span {
    display: flex;
    width: 24px;
    color: rgb(255, 255, 255);
    & > svg {
      width: 100%;
      height: auto;
      transform: ${(props) => (props.isEnabled ? 'rotate(180deg)' : 'rotate(0deg)')};
    }
  }
`

export default function SpaceDashboardSidebar({ menuId, setMenuId }) {
  const [isUserMenuShow, setUserMenuShow] = useState(false)
  const user = useAppSelector((state) => state.user)

  const navItems = [
    { icon: <SettingsRoundedIcon />, title: 'Space Preferences' },
    { icon: <TextSnippetRoundedIcon />, title: 'Space Access' },
    { icon: <PeopleAltRoundedIcon />, title: 'User Roles' },
    { icon: <DeleteRoundedIcon />, title: 'Shut Down or Delete' },
  ]

  return (
    <Container>
      <Dashboard>
        <DashboardTitle>Space dashboard</DashboardTitle>
        {navItems.map((item, idx) => {
          return (
            <NavMenuItem key={idx} isEnabled={menuId == idx} onClick={() => setMenuId(idx)}>
              <span className="icon">{item.icon}</span>
              <div className="title">{item.title}</div>
            </NavMenuItem>
          )
        })}
      </Dashboard>
      <div style={{ position: 'relative' }}>
        <UserBottomInfo>
          <UserAvatar>
            <div>
              <div>
                <img src="/assets/login/Adam_login.png" />
              </div>
            </div>
          </UserAvatar>
          <Username>
            <div>{user.fullname}</div>
          </Username>
          <DropdownIcon isEnabled={isUserMenuShow} onClick={() => setUserMenuShow(!isUserMenuShow)}>
            <span>
              <KeyboardArrowDownRoundedIcon />
            </span>
          </DropdownIcon>
        </UserBottomInfo>
        {isUserMenuShow && <DashboardUserMenuPopup />}
      </div>
    </Container>
  )
}
