import styled from 'styled-components'
import { useAppSelector } from '../../../hook'
import { SearchBar } from '../../inputs/SearchBar'
import { useEffect, useRef, useState } from 'react'
import { ParticipantDropdown } from '../../dropdowns/ParticipantDropdown'
import Network from '../../../services/Network'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
`

const SidebarHeader = styled.div`
  padding-bottom: 8px;
  max-width: 256px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  min-height: 32px;
  box-sizing: content-box;
  & > div {
    display: flex;
    padding-left: 16px;
    padding-right: 8px;
    & > span {
      color: white;
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;
      overflow-wrap: anywhere;
    }
  }
`

const ParticipantContentLayout = styled.div`
  display: flex;
  position: relative;
  overflow: hidden auto;
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-direction: column;
  padding-left: 12px;
  padding-right: 4px;
  & > div {
    display: flex;
    -webkit-box-flex: 1;
    flex-grow: 1;
    width: 100%;
    flex-direction: column;
  }
`

export const MeetingInfoSidebar = () => {
  const [searchUserTxt, setSearchUserTxt] = useState<string>('')
  const meeting = useAppSelector((state) => state.meeting)
  const [connectedUser, setConnectedUser] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const players = Network.getInstance()?.room?.state.players
    let allMem = meeting.connectedUser.map((sessionId) => {
      return {
        online: true,
        user: players?.get(sessionId)!,
        role: meeting.adminUser === sessionId ? 'admin' : 'user',
      }
    })
    // allMem = allMem.filter((m) => m?.online || false)
    setConnectedUser(allMem)
  }, [meeting.connectedUser])

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(() => {
      const filtered = connectedUser.filter((mem) => 
        mem.user.fullname.toLowerCase().includes(searchUserTxt.toLowerCase())
      )
      setFilteredUsers(filtered)
    }, 300)
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchUserTxt, connectedUser])

  return (
    <Wrapper>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '16px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <SearchBar search={searchUserTxt} setSearch={setSearchUserTxt} />
      </div>
      <ParticipantContentLayout>
        <ParticipantDropdown
          key={1}
          title="Members"
          members={filteredUsers}
          enabledByDefault={true}
        />
      </ParticipantContentLayout>
    </Wrapper>
  )
}
