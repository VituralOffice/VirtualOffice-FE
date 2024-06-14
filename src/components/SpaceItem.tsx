import styled from 'styled-components'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { useRef, useState } from 'react'
import { ButtonProps } from '../interfaces/Interfaces'
import SpaceOptionPopup from './popups/SpaceOptionPopup'
import { IRoomData } from '../types/Rooms'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setRoomData } from '../stores/RoomStore'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const DetailsDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SpaceName = styled.span`
  color: rgb(255, 255, 255);
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const SpaceLink = styled.a`
  color: #000;
  text-decoration: none;
`

const SpaceMapInside = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 16px;
  aspect-ratio: 16 / 9;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 12px 12px;
  background-color: rgb(0, 0, 0);
  background-image: url(https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/SBpyJwUS7MorgvE4/9vAI8FK7tgsEpO134jorPf);
`

const SpaceMapTopDetails = styled.div`
  display: flex;
  position: absolute;
  justify-content: space-between;
  top: 0px;
  width: 100%;
  padding: 2px;
`

const OnlineUsersDetail = styled.div`
  display: flex;
  margin: 8px;
  padding: 4px 8px;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 24px;
  border: none;
  background: rgba(0, 0, 0, 0.7);
`

const EnterSpaceContainer = styled.div`
  display: flex;
  opacity: 0;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 200ms ease 0s;
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const MapDisplay = styled.div`
  border: 3px solid transparent;
  cursor: pointer;
  height: 80%;
  margin-bottom: 8px;
  border-radius: 16px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  &:hover {
    background: rgb(84, 92, 143);
  }
`

const EnterSpaceButton = styled.button`
  display: flex;
  position: relative;
  box-sizing: border-box;
  outline: none;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  cursor: pointer;
  opacity: 1;
  overflow: hidden;
  background-color: transparent;
  border: 2px solid transparent;
  padding: 0px;
  width: 48px;
  max-width: 100%;
  height: 48px;
  border-radius: 16px;
  font-size: 15px;
  text-decoration: underline;
  color: rgb(255, 255, 255) !important;
  > span {
    display: flex;
    width: 32px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    > svg {
      width: 100%;
      height: auto;
    }
  }
`

const LastVisitedSpan = styled.span`
  color: rgb(189, 189, 189);
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const DetailsOptionButton = styled.button<ButtonProps>`
  width: auto;
  height: auto;
  border-radius: 8px;
  display: flex;
  position: relative;
  box-sizing: border-box;
  outline: none;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  cursor: pointer;
  opacity: 1;
  overflow: hidden;
  background-color: transparent;
  border: 2px solid transparent;
  padding: 0px;
  max-width: 100%;
  border-radius: 12px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;
  background-color: ${(props) => (props.isEnabled ? 'rgb(84, 92, 143)' : 'transparent')};

  &:hover {
    background: rgb(84, 92, 143);
  }

  & > span {
    display: flex;
    width: 24px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    & > svg {
      width: 100%;
      height: auto;
    }
  }
`

interface SpaceItemProps {
  room: IRoomData // Declare room as type IRoomData
  isOptionPopupShow: boolean
  setOptionPopupShow: React.Dispatch<React.SetStateAction<string>>
  refreshRoom: any
}

export const SpaceItem: React.FC<SpaceItemProps> = ({
  room,
  isOptionPopupShow,
  setOptionPopupShow,
  refreshRoom
}) => {
  const [isEnterSpaceVisible, setEnterSpaceVisible] = useState(false)
  const navigate = useNavigate()

  const handleButtonClick = (event) => {
    event.stopPropagation()
    setOptionPopupShow(room._id)
  }

  return (
    <Container>
      <MapDisplay
        onMouseEnter={() => setEnterSpaceVisible(true)}
        onMouseLeave={() => setEnterSpaceVisible(false)}
        onClick={() => {
          navigate(`/room/${room._id}`)
        }}
      >
        <SpaceLink>
          <SpaceMapInside />
        </SpaceLink>
        <SpaceMapTopDetails>
          <OnlineUsersDetail>
            <FiberManualRecordRoundedIcon
              style={{ width: '18px', height: '18px', marginRight: '4px', color: 'rgb(6,214,160)' }}
            />
            <span
              style={{
                color: 'rgb(255, 255, 255)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '18px',
              }}
            >
              {room.members.filter((m) => m.online).length}
            </span>
          </OnlineUsersDetail>
        </SpaceMapTopDetails>
        <EnterSpaceContainer style={{ opacity: isEnterSpaceVisible ? 1 : 0 }}>
          <EnterSpaceButton>
            <span>
              <LoginRoundedIcon />
            </span>
          </EnterSpaceButton>
        </EnterSpaceContainer>
      </MapDisplay>
      <DetailsDisplay>
        <SpaceName>{room.name}</SpaceName>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LastVisitedSpan>yesterday</LastVisitedSpan>
          <div
            style={{
              display: 'flex',
              marginLeft: '4px',
            }}
          >
            <DetailsOptionButton isEnabled={isOptionPopupShow} onClick={handleButtonClick}>
              <span>
                <MoreVertRoundedIcon />
              </span>
            </DetailsOptionButton>
          </div>
        </div>
        {isOptionPopupShow && <SpaceOptionPopup room={room} refreshRoom={refreshRoom} />}
      </DetailsDisplay>
    </Container>
  )
}
