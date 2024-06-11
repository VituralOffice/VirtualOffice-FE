import styled from 'styled-components'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import { getAvatarById } from '../../utils/util'
import { ButtonProps } from '../../interfaces/Interfaces'
import { IUser } from '../../interfaces/user'
import { ICharacter } from '../../interfaces/character'
import { IPlayer } from '../../types/ISpaceState'

const LayoutContainer = styled.div<ButtonProps>`
  height: 56px;
  border-radius: 16px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 0px 10px 0px 8px;
  cursor: pointer;
  gap: 12px;
  position: relative;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  opacity: ${(props) => (props.isActive ? '1' : '0.5')};
`

const Avatar = styled.div<{ isOnline: boolean }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  & > div {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    user-select: none;
    .background {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      background-color: rgb(34, 34, 34);
      & > img {
        position: absolute;
        object-position: 0px -2px;
        object-fit: contain;
        object-position: 0px 8px;
        width: 100%;
        height: 150%;
        transform: scale(0.75);
        image-rendering: pixelated;
        top: -10px;
      }
    }
    .status-dot {
      display: flex;
      position: absolute;
      bottom: 0px;
      right: 0px;
      & > svg {
        width: 15px;
        height: 15px;
        margin-bottom: -1px;
        flex-shrink: 0;
        color: ${(props) => (props.isOnline ? 'green' : 'none')};
      }
    }
  }
`

const Username = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  min-width: 0px;
  & > div {
    display: flex;
    gap: 4px;
    align-items: center;
    & > span {
      color: rgb(224, 224, 224);
      font-weight: 500;
      font-size: 13px;
      line-height: 17px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    & > img {
      width: 20px;
      height: 20px;
    }
  }
`

interface Props {
  user: any
  isOnline: boolean
  isKing: boolean
}

export const ParticipantItem = ({ user, isOnline, isKing }: Props) => {
  return (
    <LayoutContainer isActive={isOnline}>
      <Avatar isOnline={isOnline}>
        <div>
          <div className="background">
            {/* <img src={'/' + getAvatarById(user.character_id).img} /> */}
            <img src={user.character.avatar} />
          </div>
          <div className="status-dot">
            <FiberManualRecordRoundedIcon />
          </div>
        </div>
      </Avatar>
      <Username>
        <div>
          <span>{user.fullname}</span>
          {isKing && <img src="/icons/crown.png" />}
        </div>
      </Username>
    </LayoutContainer>
  )
}
