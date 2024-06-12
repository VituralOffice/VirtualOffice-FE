import { useState } from 'react'
import { IChatMessage } from '../../types/ISpaceState'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import styled from 'styled-components'
import { getColorByString } from '../../utils/util'
import Zoom from 'react-medium-image-zoom'

const MessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0px 2px;
  border-radius: 5px;
  padding: 3px;

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
    background: rgb(255, 255, 255, 0.1);
  }
`

interface MessageProps {
  chatMessage: IChatMessage
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .${tooltipClasses.tooltip} {
    color: white;
    font-size: 12px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`

export default function ChatMessage({ chatMessage }: MessageProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <MessageWrapper
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
    >
      <CustomTooltip
        open={tooltipOpen}
        title={chatMessage?.createdAt?.toString()}
        placement="right"
        arrow
      >
        <div style={{display: 'flex', justifyContent: 'flex-start', gap: '10px', alignItems: 'flex-end'}}>
          <span style={{ fontWeight: 'bold', color: getColorByString(chatMessage.user?.fullname || '') }}>{chatMessage.user?.fullname}:{' '}</span>
          {chatMessage.message?.type === 'text' ? (
            <span>{chatMessage.message?.text}</span>
          ) : chatMessage.message?.type === 'image' ? (
            <div
              style={{
                width: '100px',
                height: '60px',
                margin: '10px',
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
              }}
            >
              <a href={chatMessage.message.path} style={{ color: 'white' }}>
                {chatMessage.message?.fileName}
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </CustomTooltip>
    </MessageWrapper>
  )
}
