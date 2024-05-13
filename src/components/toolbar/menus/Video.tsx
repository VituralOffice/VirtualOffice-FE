import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
interface VideoMenuProps {
  isVideoConnected: boolean
  onClick: () => void
  toggle: () => void
}
export const VideoMenu = ({ isVideoConnected, onClick, toggle }: VideoMenuProps) => {
  return (
    <span
      className="video-container"
      style={{ display: 'flex', margin: 'auto', position: 'relative' }}
    >
      <span>
        <button
          style={{
            height: 40,
            width: 60,
            padding: 8,
            display: 'flex',
            MozBoxAlign: 'center',
            alignItems: 'center',
            MozBoxPack: 'start',
            justifyContent: 'flex-start',
            border: 'medium',
            borderRadius: 20,
            backgroundColor: isVideoConnected ? 'rgba(6, 214, 160, 0.4)' : 'rgba(255, 48, 73, 0.2)',
            transition: 'background-color 200ms',
            cursor: 'pointer',
            position: 'relative',
          }}
          type="button"
          className="css-oau38"
          aria-label="Microphone"
        >
          <span
            onClick={onClick}
            style={{
              display: 'flex',
              width: 24,
              color: isVideoConnected ? 'rgb(6, 214, 160)' : 'rgb(255, 48, 73)',
              flexShrink: 0,
            }}
          >
            {isVideoConnected ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}
          </span>
        </button>
      </span>
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 10,
          borderRadius: 8,
          width: 2,
          height: 20,
          backgroundColor: isVideoConnected ? 'rgb(6, 214, 160)' : 'rgb(255, 48, 73)',
        }}
      />
      <div
        style={{
          display: 'flex',
          MozBoxAlign: 'center',
          alignItems: 'center',
          MozBoxPack: 'start',
          justifyContent: 'flex-start',
          position: 'absolute',
          paddingLeft: 2,
          left: 36,
          width: 24,
          height: '100%',
          borderRadius: '0px 20px 20px 0px',
          transition: 'background-color 200ms',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            display: 'flex',
            width: 16,
            color: isVideoConnected ? 'rgb(6, 214, 160)' : 'rgb(255, 48, 73)',
            flexShrink: 0,
          }}
          width="16px"
        >
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.515 5.165l4.555 4.554c.22.22.22.576 0 .796l-.532.531a.563.563 0 01-.794.001l-3.627-3.61-3.627 3.61a.562.562 0 01-.794 0l-.532-.532a.562.562 0 010-.796L7.72 5.164c.22-.22.576-.22.796 0z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </span>
  )
}
export default VideoMenu
