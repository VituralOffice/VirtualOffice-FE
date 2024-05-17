import React, { useRef, useState, useEffect, ChangeEvent, ClipboardEvent } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { MessageType, setFocused, setListChat, setShowChat } from '../../stores/ChatStore'
import { useAppDispatch, useAppSelector } from '../../hook'
import { getColorByString } from '../../utils/util'
import Game from '../../scenes/Game'
import { PhaserGameInstance } from '../../PhaserGame'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ApiService from '../../apis/ApiService'
import { IChat } from '../../interfaces/chat'
import { IChatMessage } from '../../types/ISpaceState'

const Backdrop = styled.div`
  position: fixed;
  bottom: 150px;
  left: 0;
  height: 700px;
  width: 700px;
  max-height: 50%;
  max-width: 100%;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const FabWrapper = styled.div`
  margin-top: auto;
`

const ChatHeader = styled.div`
  position: relative;
  background: #000000a7;
  h3 {
    color: #fff;
    margin: 7px;
    font-size: 17px;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
`

const ChatBox = styled(Box)`
  height: 100%;
  width: 100%;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
`
const ListChat = styled(Box)`
  height: 100%;
  width: 100%;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
`
const ChatContainer = styled.div`
  border: '1px solid white';
  margin: 14px;
  cursor: 'pointer';
`
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

const InputWrapper = styled.form`
  box-shadow: 10px 10px 10px #00000018;
  border: 1px solid #42eacb;
  border-radius: 0px 0px 10px 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #000000c1, #242424c0);
`
const InputTextField = styled(InputBase)`
  border-radius: 0px 0px 10px 10px;
  input {
    padding: 5px;
  }
`
const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 54px;
  right: 16px;
`
const dateFormatter = new Intl.DateTimeFormat('en', {
  timeStyle: 'short',
  dateStyle: 'short',
})
interface MessageProps {
  chatMessage: IChatMessage
}
interface PasteItem {
  file: File
  preview: string
}
const Message = ({ chatMessage }: MessageProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  return (
    <MessageWrapper
      onMouseEnter={() => {
        setTooltipOpen(true)
      }}
      onMouseLeave={() => {
        setTooltipOpen(false)
      }}
    >
      <Tooltip
        open={tooltipOpen}
        title={chatMessage?.createdAt?.toString()}
        placement="right"
        arrow
      >
        <p
          style={{
            color: getColorByString(chatMessage.user?.fullname || ''),
          }}
        >
          {chatMessage.user?.fullname}: <span>{chatMessage.message?.text}</span>
        </p>
      </Tooltip>
    </MessageWrapper>
  )
}
export default function Chat() {
  let { roomId } = useParams()
  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listChats = useAppSelector((state) => state.chat.listChats)
  const focused = useAppSelector((state) => state.chat.focused)
  const showChat = useAppSelector((state) => state.chat.showChat)
  const mapMessages = useAppSelector((state) => state.chat.mapMessages)
  const [currentChat, setCurrentChat] = useState<IChat | null>(null)
  const [inputType, setInputType] = useState<'text' | 'image'>('text')
  const [images, setImages] = useState<PasteItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  let game: Game
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }
  const loadPhaserGame = async () => {
    game = (await PhaserGameInstance())?.scene.keys.game as Game
    game.network?.loadChat()
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      // move focus back to the game
      inputRef.current?.blur()
      dispatch(setShowChat(false))
    }
  }
  const handleChangeChat = (chat: IChat) => {
    setCurrentChat(chat)
  }
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputType('text')
    setInputValue(e.target.value)
  }
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e?.clipboardData?.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setInputType('image')
            setImages([
              ...images,
              {
                file,
                preview: reader.result as string,
              },
            ])
          }
          reader.readAsDataURL(file)
          setError(null)
          return
        }
      }
    }
    setError('Pasted content is not an image.')
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setInputType('image')
        //setImage(file)
        ///setImagePreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    } else {
      setError('Selected file is not an image.')
    }
  }
  const handleReset = () => {
    setInputType('text')
    setInputValue('')
    //setImage(null)
    //setImagePreviewUrl(null)
    setError(null)
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // this is added because without this, 2 things happen at the same
    // time when Enter is pressed, (1) the inputRef gets focus (from
    // useEffect) and (2) the form gets submitted (right after the input
    // gets focused)
    if (!readyToSubmit) {
      setReadyToSubmit(true)
      return
    }
    // move focus back to the game
    inputRef.current?.blur()

    const val = inputValue.trim()
    setInputValue('')
    if (val) {
      console.log({ game })
      if (!game) {
        await loadPhaserGame()
        game.network.addChatMessage({ content: val, chatId: currentChat?._id })
        game.myPlayer.updateDialogBubble(val)
      }
    }
  }
  const getListChats = async () => {
    try {
      const res = await ApiService.getInstance().get(
        `/rooms/${roomId}/chats?sort=desc&sortBy=lastModifiedAt`
      )
      dispatch(setListChat(res.result || []))
      setCurrentChat(res.result[0])
    } catch (error) {}
  }
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    loadPhaserGame()
    getListChats()
  }, [])
  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])
  useEffect(() => {
    scrollToBottom()
  }, [mapMessages.get(currentChat?._id)?.messages, showChat])
  return (
    <Backdrop>
      <Wrapper>
        {showChat ? (
          <div style={{ height: '100%', display: 'flex' }}>
            {
              <div
                style={{
                  width: '25%',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ChatHeader style={{ borderRadius: '10px 0 0 0' }}>
                  <h3>Chats</h3>
                </ChatHeader>
                <ListChat style={{ borderRadius: '0 0 0 10px' }}>
                  {listChats.map((chat) => (
                    <ChatContainer key={chat._id}>
                      <p
                        style={{ color: 'white' }}
                        key={chat._id}
                        onClick={() => {
                          console.log({ chat })
                          setCurrentChat(chat)
                        }}
                      >
                        {chat.name}
                      </p>
                    </ChatContainer>
                  ))}
                </ListChat>
              </div>
            }
            <div style={{ width: '75%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <ChatHeader style={{ borderRadius: '0 10px 0 0' }}>
                <h3>{currentChat?.name || ''}</h3>
                <IconButton
                  aria-label="close dialog"
                  className="close"
                  onClick={() => dispatch(setShowChat(false))}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </ChatHeader>
              <ChatBox>
                {mapMessages.get(currentChat?._id)?.messages?.map((message, index) => (
                  <Message chatMessage={message} key={index} />
                ))}
                <div ref={messagesEndRef} />
                {showEmojiPicker && (
                  <EmojiPickerWrapper>
                    <Picker
                      theme="dark"
                      showSkinTones={false}
                      showPreview={false}
                      onSelect={(emoji) => {
                        setInputValue(inputValue + emoji.native)
                        setShowEmojiPicker(!showEmojiPicker)
                        dispatch(setFocused(true))
                      }}
                      exclude={['recent', 'flags']}
                    />
                  </EmojiPickerWrapper>
                )}
              </ChatBox>
              <InputWrapper onSubmit={handleSubmit}>
                {inputType === 'image' && images.length > 0 && (
                  <div style={{ width: '100%', display: 'flex' }}>
                    {images.map((image, idx) => (
                      <div
                        style={{
                          width: '100px',
                          height: '100px',
                          margin: '10px',
                          position: 'relative',
                        }}
                      >
                        <img src={image.preview} alt="Preview" style={{ width: '100%' }} />
                        <IconButton
                          aria-label="close dialog"
                          className="close"
                          onClick={() => setImages([...images.filter((_, i) => i !== idx)])}
                          size="small"
                          style={{ position: 'absolute', right: '0' }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex' }}>
                  <InputTextField
                    inputRef={inputRef}
                    autoFocus={focused}
                    fullWidth
                    placeholder="Press Enter to chat"
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    inputProps={{ accept: 'image/*' }}
                    onFocus={() => {
                      if (!focused) {
                        dispatch(setFocused(true))
                        setReadyToSubmit(true)
                      }
                    }}
                    onBlur={() => {
                      dispatch(setFocused(false))
                      setReadyToSubmit(false)
                    }}
                  />
                  <IconButton
                    aria-label="emoji"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <InsertEmoticonIcon />
                  </IconButton>
                </div>
              </InputWrapper>
            </div>
          </div>
        ) : (
          <FabWrapper>
            <Fab
              color="secondary"
              aria-label="showChat"
              onClick={() => {
                dispatch(setShowChat(true))
                dispatch(setFocused(true))
              }}
            >
              <ChatBubbleOutlineIcon />
            </Fab>
          </FabWrapper>
        )}
      </Wrapper>
    </Backdrop>
  )
}
