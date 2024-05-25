import styled from 'styled-components'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useState } from 'react'
import { ParticipantItem } from '../items/ParticipantItem'
import { IRoomMember } from '../../types/Rooms'

const ParticipantsBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 16px;
  position: relative;
  .headerNav {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    user-select: none;
    & > div {
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon-dropdown {
        display: flex;
        padding-right: 8px;
        & > span {
          display: flex;
          width: 20px;
          color: rgb(255, 255, 255);
          flex-shrink: 0;
          & > svg {
            width: 100%;
            height: auto;
          }
        }
      }
      .title {
        color: rgb(255, 255, 255);
        font-family: 'DM Sans', sans-serif;
        font-weight: 700;
        font-size: 12px;
        line-height: 16px;
        text-transform: uppercase;
        letter-spacing: initial;
      }
      .online-numbers {
        display: flex;
        padding-left: 8px;
        & > span {
          padding: 3px 6px;
          background-color: rgba(84, 92, 143, 0.3);
          line-height: 12px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          border-radius: 5px;
        }
      }
    }
  }
`

interface DropdownProps {
  members: IRoomMember[]
  title: string
}

export const ParticipantDropdown = ({ members, title }: DropdownProps) => {
  const [enabled, setEnabled] = useState<boolean>(false)

  return (
    <ParticipantsBox>
      <div className="headerNav">
        <div>
          <div className="icon-dropdown" onClick={() => setEnabled(!enabled)}>
            <span>
              <KeyboardArrowDownRoundedIcon
                style={{ transform: enabled ? 'rotate(0deg)' : 'rotate(-90deg)' }}
              />
            </span>
          </div>
          <span className="title">{title}</span>
          <div className="online-numbers">
            <span>{members.length}</span>
          </div>
        </div>
      </div>
      {enabled && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {members.map((m, i) => (
            <ParticipantItem
              key={i}
              isOnline={m.online}
              isKing={m.role === 'admin'}
              user={m.user}
            />
          ))}
        </div>
      )}
    </ParticipantsBox>
  )
}
