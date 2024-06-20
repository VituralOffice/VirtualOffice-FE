import { SpaceDashboardComponentParams } from './type'
import {
  ContentHeader,
  ContentBody,
  SectionHeader,
  SectionBody,
  SectionMainLabel,
  SectionSubLabel,
} from '.'
import AddMember from './AddMember'
import ManageMembers from './ManageMembers'

export default function UserRoles({ room, refreshRoom }: SpaceDashboardComponentParams) {
  return (
    <>
      <ContentHeader>
        <div className="space-name">User Roles</div>
      </ContentHeader>
      <ContentBody style={!room?.active ? { pointerEvents: 'none', opacity: '0.5' } : {}}>
        <SectionHeader>Add Member</SectionHeader>
        <SectionBody>
          <SectionMainLabel>Add Room Member</SectionMainLabel>
          <SectionSubLabel>Add member to your room</SectionSubLabel>
          <AddMember room={room} refreshRoom={refreshRoom} />
        </SectionBody>

        <SectionHeader>Space members</SectionHeader>
        <SectionBody>
          <SectionMainLabel>Manage Members</SectionMainLabel>
          <SectionSubLabel>Manage Members and Member roles.</SectionSubLabel>
          <ManageMembers room={room} refreshRoom={refreshRoom} />
        </SectionBody>
      </ContentBody>
    </>
  )
}
