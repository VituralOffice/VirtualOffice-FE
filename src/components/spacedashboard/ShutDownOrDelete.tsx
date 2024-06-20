import { ButtonSetting, ContentBody, ContentHeader, SectionBody, SectionHeader } from '.'
import { SpaceDashboardComponentParams } from './type'
import ShutDownSpaceButton from './ShutdownSpaceButton'
import DeleteSpaceButton from './DeleteSpaceButton'

export default function ShutDownOrDelete({ room, refreshRoom }: SpaceDashboardComponentParams) {
  return (
    <>
      <ContentHeader>
        <div className="space-name">Shut Down or Delete</div>
      </ContentHeader>
      <ContentBody>
        <SectionHeader>Shut down</SectionHeader>
        <SectionBody style={!room?.active ? { pointerEvents: 'none', opacity: '0.5' } : {}}>
          <ButtonSetting>
            <div className="info">
              <div className="main-label">
                <div>Temporarily shut down this space</div>
              </div>
              <div className="desc">Temporarily shut down this space, so no one can access it.</div>
            </div>
            <div className="button">
              <ShutDownSpaceButton room={room} refreshRoom={refreshRoom} />
            </div>
          </ButtonSetting>
        </SectionBody>
        <SectionHeader>Delete Space</SectionHeader>
        <SectionBody>
          <ButtonSetting>
            <div className="info">
              <div className="main-label">
                <div>Permanently delete this space</div>
              </div>
              <div className="desc">This will remove everything.</div>
            </div>
            <div className="button">
              <DeleteSpaceButton room={room} refreshRoom={refreshRoom} />
            </div>
          </ButtonSetting>
        </SectionBody>
      </ContentBody>
    </>
  )
}
