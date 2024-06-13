import styled from 'styled-components'
import SpaceDashboardSidebar from '../components/sidebars/SpaceDashboardSidebar'
import { useEffect, useState } from 'react'
import SpacePreferences from '../components/spacedashboard/SpacePreferences'
import ShutDownOrDelete from '../components/spacedashboard/ShutDownOrDelete'
import UserRoles from '../components/spacedashboard/UserRoles'
import SpaceAccess from '../components/spacedashboard/SpaceAccess'
import { useParams } from 'react-router-dom'
import { GetRoomById } from '../apis/RoomApis'
import { isApiSuccess } from '../apis/util'
import { IRoomData } from '../types/Rooms'

const PageContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background-color: rgb(51, 58, 100);
`

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  padding-right: 32px;
  width: 100%;
  max-width: 832px;
`

export default function SpaceDashboardPage() {
  const { roomId } = useParams()
  const [menuId, setMenuId] = useState(0)
  const [room, setRoom] = useState<IRoomData>()

  const refreshRoom = async () => {
    const response = await GetRoomById({ _id: roomId! })
    if (isApiSuccess(response)) {
      console.log(response.result)
      setRoom(response.result)
    }
  }

  const contents = [
    <SpacePreferences room={room!} refreshRoom={refreshRoom} />,
    <SpaceAccess room={room!} refreshRoom={refreshRoom} />,
    <UserRoles room={room!} refreshRoom={refreshRoom} />,
    <ShutDownOrDelete room={room!} refreshRoom={refreshRoom} />,
  ]

  useEffect(() => {
    refreshRoom()
  }, [])

  return (
    <PageContainer>
      <SpaceDashboardSidebar menuId={menuId} setMenuId={setMenuId} />
      <div style={{ display: 'flex', flex: '1 1 0%', overflow: 'auto' }}>
        <PageContent>{contents[menuId]}</PageContent>
      </div>
    </PageContainer>
  )
}
