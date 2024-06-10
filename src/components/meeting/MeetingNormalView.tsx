import styled from 'styled-components'
import Video from '../videos/Video'
import { useAppSelector } from '../../hook'
import { useEffect, useState } from 'react'
import { ButtonProps } from '../../interfaces/Interfaces'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap'
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap'
import { getAvatarById, getAvatarByTexture } from '../../utils/util'
import Game from '../../scenes/Game'

const VideoGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
`

const VideoContainerComponent = styled.div<ButtonProps>`
  ${(props) =>
    props.isEnabled &&
    `
    &:hover {
      background-color: rgb(255, 255, 255, 0.3);

      &>svg{
        opacity: 1;
      }
    }
  `}

  position: relative;
  background: black;
  border-radius: 8px;
  overflow: hidden;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    object-fit: contain;
  }

  .player-name {
    position: absolute;
    bottom: 16px;
    left: 16px;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 2px rgb(0 0 0 / 60%), 0 0 2px rgb(0 0 0 / 30%);
    white-space: nowrap;
  }

  & > svg {
    opacity: 0;
    color: white;
    font-size: 30px;
    position: absolute;
    left: 10px;
    top: 10px;
  }

  transition: all 0.2s;
`

const AvatarContainer = styled.div`
  max-width: 100%;
  max-height: 100%;
  width: 50%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  position: relative;
  user-select: none;
  flex-shrink: 0;
`

const AvatarBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: rgb(34, 34, 34);
`

const AvatarImg = styled.img`
  object-position: 0px -2px;
  object-fit: contain;
  object-position: 0px 8px;
  width: 100%;
  height: 150%;
  transform: scale(0.75);
  image-rendering: pixelated;
  position: relative;
  top: -10px;
`

interface VideoProps {
  playerName: string
  avatarLink?: string
  stream: MediaStream
  onClick?: () => void
  canZoomIn: boolean
  canInteract: boolean
}

function VideoContainer({
  playerName,
  avatarLink,
  stream,
  onClick,
  canZoomIn,
  canInteract,
}: VideoProps) {
  return (
    <VideoContainerComponent onClick={canInteract ? onClick : undefined} isEnabled={canInteract}>
      {stream.getVideoTracks()[0] ? (
        <Video srcObject={stream} autoPlay></Video>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AvatarContainer>
            <AvatarBackground>
              <AvatarImg src={avatarLink} />
            </AvatarBackground>
          </AvatarContainer>
        </div>
      )}
      {playerName && <div className="player-name">{playerName}</div>}
      {canInteract && (canZoomIn ? <ZoomInMapIcon /> : <ZoomOutMapIcon />)}
    </VideoContainerComponent>
  )
}

export const MeetingNormalView = () => {
  const myStream = useAppSelector((state) => state.meeting.myCameraStream)
  const peerStreams = useAppSelector((state) => state.meeting.peerCameraStreams)
  const playerNameMap = useAppSelector((state) => state.user.playerNameMap)
  // const playerAvatarMap = useAppSelector((state) => state.user.playerAvatarMap)
  const user = useAppSelector((state) => state.user)

  const [activeScreenIndex, setActiveScreenIndex] = useState(-1)
  const [totalDisplays, setTotalDisplays] = useState(0)

  const handleVideoContainerClick = (index) => {
    setActiveScreenIndex(index)
  }

  const renderAllVideos = () => (
    <VideoGrid>
      {myStream && (
        <VideoContainer
          stream={myStream}
          playerName="You"
          avatarLink={user.character?.avatar}
          onClick={() => handleVideoContainerClick(0)}
          canInteract={totalDisplays > 1}
          canZoomIn={false}
        />
      )}
      {[...peerStreams.entries()].map(([id, { stream }], index) => {
        const playerName = playerNameMap.get(id)
        console.log(Game.getInstance()?.otherPlayerMap.get(id)?.playerNameText.text)
        return (
          <VideoContainer
            key={id}
            playerName={playerName!}
            avatarLink={user.character?.avatar}
            stream={stream}
            onClick={() => handleVideoContainerClick(index + 1)}
            canInteract={totalDisplays > 1}
            canZoomIn={false}
          />
        )
      })}
    </VideoGrid>
  )

  const renderSingleVideo = () => {
    if (activeScreenIndex === 0 && myStream) {
      return (
        <VideoGrid>
          <VideoContainer
            stream={myStream}
            playerName="You"
            avatarLink={getAvatarById(user.character_id).img}
            canInteract={totalDisplays > 1}
            canZoomIn={true}
            onClick={() => setActiveScreenIndex(-1)}
          />
        </VideoGrid>
      )
    } else if (activeScreenIndex > 0) {
      const peerStreamEntry = [...peerStreams.entries()][activeScreenIndex - 1]
      if (peerStreamEntry) {
        const [id, { stream }] = peerStreamEntry
        const playerName = playerNameMap.get(id)
        return (
          <VideoGrid>
            <VideoContainer
              key={id}
              playerName={playerName!}
              avatarLink={user.character?.avatar}
              stream={stream}
              canInteract={totalDisplays > 1}
              canZoomIn={true}
              onClick={() => setActiveScreenIndex(-1)}
            />
          </VideoGrid>
        )
      }
    }
    return null
  }

  useEffect(() => {
    let total = 0
    total += myStream ? 1 : 0
    total += peerStreams.size
    setTotalDisplays(total)
  }, [myStream, peerStreams])

  return <>{activeScreenIndex === -1 ? renderAllVideos() : renderSingleVideo()}</>
}
