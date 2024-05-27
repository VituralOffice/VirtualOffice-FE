import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { MessageType, setFocused } from '../../../stores/ChatStore'
import { useAppDispatch, useAppSelector } from '../../../hook'
import Game from '../../../scenes/Game'
import InputBase from '@mui/material/InputBase'
import { useDispatch } from 'react-redux'
import { Message } from './Message'

const Backdrop = styled.div`
  position: fixed;
  bottom: 60px;
  left: 0;
  height: 400px;
  width: 500px;
  max-height: 50%;
  max-width: 100%;
`

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const FabWrapper = styled.div`
  margin-top: auto;
`

const ChatHeader = styled.div`
  position: relative;
  height: 35px;
  background: rgb(51 58 100);
  border-radius: 10px 10px 0px 0px;

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
  background-color: rgb(26 29 45);
  padding: 8px;
`

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 54px;
  right: 16px;
`

const InputWrapper = styled.form`
  box-shadow: 10px 10px 10px #00000018;
  border: 1px solid rgb(88 97 159);
  border-radius: 0px 0px 10px 10px;
  display: flex;
  flex-direction: row;
  background: linear-gradient(rgb(26 29 45), rgb(34 38 57));
`

const InputTextField = styled(InputBase)`
  border-radius: 0px 0px 10px 10px;
  padding-left: 5px;
  input {
    padding: 5px;
  }
`

interface PasteItem {
  file: File
  preview: string
}

export default function MeetingChatSidebar() {
  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mapMessages = useAppSelector((state) => state.chat.mapMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showChat = useAppSelector((state) => state.chat.showChat)
  const activeChat = useAppSelector((state) => state.chat.activeChat)
  const [images, setImages] = useState<PasteItem[]>([])
  const [files, setFiles] = useState<File[]>([])

  const dispatch = useDispatch()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    // inputRef.current?.blur()

    const val = inputValue.trim()
    setInputValue('')
    if (val) {
      Game.getInstance()?.network.addChatMessage({ content: val, chatId: activeChat?._id! })
      Game.getInstance()?.myPlayer.updateDialogBubble(val)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    scrollToBottom()
  }, [mapMessages, showChat])

  return (
    <Wrapper>
      <ChatHeader>
        <h3>Chat</h3>
      </ChatHeader>
      <ChatBox>
        {mapMessages.get(activeChat?._id || '')?.messages?.map((chatMessage, index) => (
          <Message chatMessage={chatMessage} key={index} />
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
        <InputTextField
          inputRef={inputRef}
          autoFocus={focused}
          fullWidth
          placeholder="Press Enter to chat"
          value={inputValue}
          // onKeyDown={handleKeyDown}
          onChange={handleChange}
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
        <IconButton aria-label="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <InsertEmoticonIcon />
        </IconButton>
      </InputWrapper>
    </Wrapper>
  )
}
