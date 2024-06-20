import {
  ContentBody,
  ContentHeader,
  SectionBody,
  SectionHeader,
  SectionMainLabel,
  SectionSubLabel,
} from '.'
import { SpaceDashboardComponentParams } from './type'
import ChangeRoomName from './ChangeRoomName'

export default function SpacePreferences({ room, refreshRoom }: SpaceDashboardComponentParams) {
  return (
    <>
      <ContentHeader>
        <div className="space-name">Space Preferences</div>
      </ContentHeader>
      <ContentBody style={!room?.active ? { pointerEvents: 'none', opacity: '0.5' } : {}}>
        <SectionHeader>Room name</SectionHeader>
        <SectionBody>
          <SectionMainLabel>Change Room Name</SectionMainLabel>
          <SectionSubLabel>Change your room's name</SectionSubLabel>
          <ChangeRoomName room={room} refreshRoom={refreshRoom} />
        </SectionBody>
      </ContentBody>
    </>
  )
}
