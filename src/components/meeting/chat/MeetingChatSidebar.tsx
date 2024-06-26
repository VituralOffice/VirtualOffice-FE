import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { useAppSelector } from '../../../hook'
import InputBase from '@mui/material/InputBase'
import { useDispatch } from 'react-redux'
import { Message } from './Message'
import Network from '../../../services/Network'
import { IMessagePayload } from '../../../types/Rooms'
import { UploadChatImage } from '../../../apis/ChatApis'
import { isApiSuccess } from '../../../apis/util'
import { useParams } from 'react-router-dom'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloseIcon from '@mui/icons-material/Close'
import { formatFileName } from '../../../utils/util'

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
  flex-direction: column;
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
  let { roomId } = useParams()
  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mapMessages = useAppSelector((state) => state.chat.mapMessages)
  const showChat = useAppSelector((state) => state.chat.showChat)
  // const chat = useAppSelector((state) => state.chat)
  const meeting = useAppSelector((state) => state.meeting)
  const [images, setImages] = useState<PasteItem[]>([])
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      if (file && file.type.includes(`image`)) {
        setImages([...images, { preview: URL.createObjectURL(file), file }])
      } else {
        setFiles([...files, file])
      }
    }
  }
  const handleUploadImage = async (files: File[]) => {
    const filePaths = await Promise.all(
      files.map(async (file) => {
        try {
          const form = new FormData()
          form.append('file', file)
          const response = await UploadChatImage({ roomId: roomId!, form })
          if (isApiSuccess(response)) {
            return response.result.path as string
          }
        } catch (error) {
          return ``
        }
      })
    )
    return filePaths
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(meeting.chatId)
    event.preventDefault()

    if (!readyToSubmit) {
      setReadyToSubmit(true)
      return
    }
    // move focus back to the game
    // inputRef.current?.blur()

    const val = inputValue.trim()
    setInputValue('')
    let messages: IMessagePayload[] = []
    // handle send images
    if (images.length > 0) {
      const paths = await handleUploadImage(images.map((i) => i.file))
      messages.push(
        ...paths.map((p) => ({
          content: ``,
          type: 'image',
          path: p!,
          chatId: meeting.chatId || '',
        }))
      )
    }
    if (files.length > 0) {
      const paths = await handleUploadImage(files)
      const fileObjs = files.map((f, i) => ({ file: f, path: paths[i] }))
      messages.push(
        ...fileObjs.map((p) => ({
          content: ``,
          type: 'file',
          path: p.path!,
          filename: p.file.name,
          chatId: meeting.chatId || '',
        }))
      )
    }
    // handle send text
    if (val) messages.push({ content: val, chatId: meeting.chatId || '', type: 'text', path: '' })
    //
    if (messages.length > 0) {
      messages.map((m) => {
        Network.getInstance()?.addChatMessage(m)
        // if (m.content) Game.getInstance()?.myPlayer.updateDialogBubble(m.content)
      })
      setImages([])
      setFiles([])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mapMessages, showChat])

  return (
    <Wrapper>
      <ChatHeader>
        <h3>Chat</h3>
      </ChatHeader>
      <ChatBox>
        {mapMessages.get(meeting.chatId || '')?.messages?.map((chatMessage, index) => (
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
              }}
              exclude={['recent', 'flags']}
            />
          </EmojiPickerWrapper>
        )}
      </ChatBox>
      <InputWrapper onSubmit={handleSubmit}>
        {images.length > 0 && (
          <div style={{ width: '100%', display: 'flex' }}>
            {images.map((image, idx) => (
              <div
                key={idx}
                style={{
                  width: '100px',
                  height: '100px',
                  margin: '10px',
                  background: 'rgb(255, 255, 255, 0.2)',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <img
                  src={image.preview}
                  alt="Preview"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
                <IconButton
                  aria-label="close dialog"
                  className="close"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  size="small"
                  style={{ position: 'absolute', right: '0', top: '0' }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ))}
          </div>
        )}
        {files.length > 0 && (
          <div style={{ width: '100%', display: 'flex' }}>
            {files.map((file, idx) => (
              <div
                key={idx}
                style={{
                  width: '100px',
                  height: '100px',
                  margin: '10px',
                  position: 'relative',
                  background: 'rgb(255, 255, 255, 0.2)',
                  borderRadius: '5px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <p style={{ color: 'white' }}>{formatFileName(file.name)}</p>
                <IconButton
                  aria-label="close dialog"
                  className="close"
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  size="small"
                  style={{ position: 'absolute', right: '0', top: '0' }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleFileClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <AttachFileIcon style={{ color: 'white' }}> </AttachFileIcon>
          </div>
          <InputTextField
            inputRef={inputRef}
            fullWidth
            placeholder="Press Enter to chat"
            value={inputValue}
            // onKeyDown={handleKeyDown}
            onChange={handleChange}
            onFocus={() => {
              setReadyToSubmit(true)
            }}
            onBlur={() => {
              setReadyToSubmit(false)
            }}
          />
          <IconButton aria-label="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <InsertEmoticonIcon />
          </IconButton>
        </div>
      </InputWrapper>
    </Wrapper>
  )
}
