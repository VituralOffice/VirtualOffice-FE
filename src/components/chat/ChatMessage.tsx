import { useState } from 'react'
import { IChatMessage } from '../../types/ISpaceState'
import Tooltip from '@mui/material/Tooltip'
import styled from 'styled-components'
import { getColorByString } from '../../utils/util'
import Zoom from 'react-medium-image-zoom'

const MessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0px 2px;

  p {
    margin: 3px;
    text-shadow: 0.3px 0.3px black;
    font-size: 15px;
    font-weight: bold;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  span {
    color: white;
    font-weight: normal;
  }

  .notification {
    color: grey;
    font-weight: normal;
  }

  :hover {
    background: #3a3a3a;
  }
`

interface MessageProps {
  chatMessage: IChatMessage
}

export default function ChatMessage ({ chatMessage }: MessageProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <MessageWrapper
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
    >
      <Tooltip
        open={tooltipOpen}
        title={chatMessage?.createdAt?.toString()}
        placement="right"
        arrow
      >
        <p style={{ color: getColorByString(chatMessage.user?.fullname || '') }}>
          {chatMessage.user?.fullname}:{' '}
          {chatMessage.message?.type === 'text' ? (
            <span>{chatMessage.message?.text}</span>
          ) : chatMessage.message?.type === 'image' ? (
            <div
              style={{
                width: '100px',
                height: '60px',
                margin: '10px',
                position: 'relative',
              }}
            >
              <Zoom>
                <img
                  src={chatMessage.message.path}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </Zoom>
            </div>
          ) : chatMessage.message?.type === 'file' ? (
            <div
              style={{
                height: '30px',
                margin: '10px',
                position: 'relative',
              }}
            >
              <a href={chatMessage.message.path} style={{ color: 'white' }}>
                {chatMessage.message?.fileName}
              </a>
            </div>
          ) : (
            <></>
          )}
        </p>
      </Tooltip>
    </MessageWrapper>
  )
}
