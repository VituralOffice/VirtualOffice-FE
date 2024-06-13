import { ContentHeader, ContentBody, SectionHeader, SectionBody, ButtonSetting } from '.'
import RoomPrivateToggle from './RoomPrivateTogge'
import { SpaceDashboardComponentParams } from './type'

export default function SpaceAccess({ room, refreshRoom }: SpaceDashboardComponentParams) {
  return (
    <>
      <ContentHeader>
        <div className="space-name">Space Preferences</div>
      </ContentHeader>
      <ContentBody>
        <SectionHeader>Privacy</SectionHeader>
        <SectionBody>
          <ButtonSetting>
            <div className="info">
              <div className="main-label">
                <div>Enable public check in</div>
              </div>
              <div className="desc">
                Everyone can join in your room as long as they have the room's url.
              </div>
            </div>
            <div className="button">
              <RoomPrivateToggle room={room} refreshRoom={refreshRoom} />
            </div>
          </ButtonSetting>
        </SectionBody>
      </ContentBody>
    </>
  )
}
