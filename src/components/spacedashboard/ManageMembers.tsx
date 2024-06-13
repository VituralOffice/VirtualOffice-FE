import styled from 'styled-components'
import { SearchBar } from '../inputs/SearchBar'
import { useState } from 'react'
import { SpaceDashboardComponentParams } from './type'
import { IRoomMember } from '../../types/Rooms'
import MenuDropdown from '../dropdowns/MenuDropdown'
import PersonRemoveAlt1RoundedIcon from '@mui/icons-material/PersonRemoveAlt1Rounded'
import { RemoveMember } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../../constant'

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 55px;
  margin-bottom: 8px;
  & > span {
    color: rgb(255, 255, 255);
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
`

const Line = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
`

const MemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 20px;
`

const MemberItemContainer = styled.div`
  display: flex;
  height: 44px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    flex-direction: column;
    max-width: 320px;
    .name {
      color: rgb(255, 255, 255);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .email {
      color: rgb(189, 189, 189);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .right {
    display: flex;
    gap: 8px;
    align-items: center;
    position: relative;
    .label-member {
      border: 1px solid rgb(88, 130, 247);
      background: rgba(88, 130, 247, 0.2);
      padding: 4px 8px;
      border-radius: 14px;
      height: fit-content;
      display: flex;
      align-items: center;
      & > span {
        color: rgb(255, 255, 255);
        font-family: 'DM Sans', sans-serif;
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
      }
    }
    .label-admin {
      border: 1px solid rgb(6, 214, 160);
      background: rgba(6, 214, 160, 0.2);
      padding: 4px 8px;
      border-radius: 14px;
      height: fit-content;
      display: flex;
      align-items: center;
      & > span {
        color: rgb(255, 255, 255);
        font-family: 'DM Sans', sans-serif;
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
`

const MemberOptionButton = styled.div`
  display: flex;
  width: 32px;
  flex-shrink: 0;
`

interface IMemberItem {
  member: IRoomMember
  removeMember: any
}

const MemberItem = ({ member, removeMember }: IMemberItem) => {
  const [showMemberOptionMenu, setShowMemberOptionMenu] = useState(false)
  return (
    <MemberItemContainer>
      <div className="left">
        <span className="name">{member.user.fullname}</span>
        <span className="email">{member.user.email}</span>
      </div>
      <div className="right">
        {member.role == 'admin' ? (
          <div className="label-admin">
            <span>Admin</span>
          </div>
        ) : (
          <div className="label-member">
            <span>Member</span>
          </div>
        )}
        <MemberOptionButton onClick={() => setShowMemberOptionMenu(!showMemberOptionMenu)}>
          {member.role != 'admin' && (
            <MenuDropdown
              isOpen={showMemberOptionMenu && member.role != 'admin'}
              setIsOpen={setShowMemberOptionMenu}
              items={[{ icon: <PersonRemoveAlt1RoundedIcon />, label: 'Remove Member' }]}
              handleSelect={() => removeMember(member)}
            />
          )}
        </MemberOptionButton>
      </div>
    </MemberItemContainer>
  )
}

export default function ManageMembers({ room, refreshRoom }: SpaceDashboardComponentParams) {
  const [searchName, setSearchName] = useState('')

  const removeMember = async (member: IRoomMember) => {
    if (!room || !member) return
    try {
      if (room?._id) {
        const response = await RemoveMember(room._id, { user: member.user._id })
        if (isApiSuccess(response)) {
          refreshRoom()
          toast('Invite user success!')
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 8 }}>
        <SearchBar search={searchName} setSearch={setSearchName} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <LabelContainer>
          <span>name</span>
          <span>role</span>
        </LabelContainer>
        <Line />
        <MemberContainer>
          {room?.members.map((item, idx) => {
            return <MemberItem key={idx} member={item} removeMember={removeMember} />
          })}
        </MemberContainer>
      </div>
    </div>
  )
}
