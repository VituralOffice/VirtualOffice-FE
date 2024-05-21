import styled from "styled-components"
import Video from "../videos/Video"
import { useAppSelector } from "../../hook"

const VideoGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));

  .video-container {
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
  }
`

function VideoContainer({ playerName, stream }) {
    return (
        <div className="video-container">
            <Video srcObject={stream} autoPlay></Video>
            {playerName && <div className="player-name">{playerName}</div>}
        </div>
    )
}

export const MeetingScreenShareView = () => {
    const myStream = useAppSelector((state) => state.meeting.myDisplayStream)
    const peerStreams = useAppSelector((state) => state.meeting.peerDisplayStreams)
    const playerNameMap = useAppSelector((state) => state.user.playerNameMap)
    return (
        <VideoGrid>
            {myStream && <VideoContainer stream={myStream} playerName="You" />}

            {[...peerStreams.entries()].map(([id, { stream }]) => {
                const playerName = playerNameMap.get(id)
                return <VideoContainer key={id} playerName={playerName} stream={stream} />
            })}
        </VideoGrid>
    )
}