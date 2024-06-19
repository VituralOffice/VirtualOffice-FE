import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../hook';

const AudioContainer = styled.div`
  display: none;
`;

const AudioComponent = ({ stream }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = stream;
      audioRef.current.play();
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay />;
};

const MeetingAudioManager = () => {
  const myCameraStream = useAppSelector((state) => state.meeting.myCameraStream);
  const peerCameraStreams = useAppSelector((state) => state.meeting.peerCameraStreams);
  const myDisplayStream = useAppSelector((state) => state.meeting.myDisplayStream);
  const peerDisplayStreams = useAppSelector((state) => state.meeting.peerDisplayStreams);

  return (
    <AudioContainer>
      {/* {myCameraStream && <AudioComponent stream={myCameraStream} />} */}
      {[...peerCameraStreams.values()].map(({ stream }, index) => (
        <AudioComponent key={`peer-camera-${index}`} stream={stream} />
      ))}
      {/* {myDisplayStream && <AudioComponent stream={myDisplayStream} />} */}
      {[...peerDisplayStreams.values()].map(({ stream }, index) => (
        <AudioComponent key={`peer-display-${index}`} stream={stream} />
      ))}
    </AudioContainer>
  );
};

export default MeetingAudioManager;
