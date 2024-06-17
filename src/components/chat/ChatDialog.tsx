import React, { useRef, useState, useEffect, ChangeEvent, ClipboardEvent } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import CloseIcon from '@mui/icons-material/Close'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { setChatType, setFocused, setListChat, setShowChat } from '../../stores/ChatStore'
import { useAppDispatch, useAppSelector } from '../../hook'
import Game from '../../scenes/Game'
import { useParams } from 'react-router-dom'
import ApiService from '../../apis/ApiService'
import { IChat } from '../../interfaces/chat'
import { SearchBar } from '../inputs/SearchBar'
import { IMessagePayload } from '../../types/Rooms'
import 'react-medium-image-zoom/dist/styles.css'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Network from '../../services/Network'
import ChatMessage from './ChatMessage'
import { ButtonProps } from '../../interfaces/Interfaces'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import MenuIconDropdown from '../dropdowns/MenuIconDropdown'
import { CHAT_TYPE } from '../../constants/constant'
import { toast } from 'react-toastify'
import { CreateGroupChatPopup } from '../popups/CreateGroupChatPopup'

const Backdrop = styled.div`
  position: fixed;
  bottom: 150px;
  left: 0;
  width: 900px;
  height: 604px;
  max-height: 100%;
  max-width: 100%;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const ChatHeader = styled.div`
  position: relative;
  background: rgba(51, 58, 100, 0.9);
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
  overflow-y: auto;
  background: rgb(38, 44, 77);
  padding: 5px;
  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(51, 58, 100);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(255, 255, 255, 0.3);
    border-radius: 10px;
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgb(255, 255, 255, 0.5);
  }
`

const ListChat = styled(Box)`
  width: 100%;
  height: 100%;
  background: rgb(38, 44, 77);
  border-right: 2px solid rgb(51, 58, 100);
  display: flex;
  flex-direction: column;
  .list {
    overflow-y: auto;
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;

    /* Custom scrollbar styles */
    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: rgb(51, 58, 100);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgb(255, 255, 255, 0.3);
      border-radius: 10px;
      cursor: pointer;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: rgb(255, 255, 255, 0.5);
    }
  }
`

const ChatContainer = styled.div<ButtonProps>`
  margin: 0 10px;
  padding: 10px;
  background: ${(props) =>
    props.isEnabled ? 'rgb(255, 255, 255, 0.25)' : 'rgb(255, 255, 255, 0.07)'};
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background: rgb(255, 255, 255, 0.25);
  }
`

const InputWrapper = styled.form`
  display: flex;
  flex-direction: column;
  background: linear-gradient(rgb(26 29 45), rgb(34 38 57));
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
  z-index: 10;
`

const AddChatButton = styled.span<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 4px;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 255, 255, 0.2);
  }
`

interface PasteItem {
  file: File
  preview: string
}

export default function ChatDialog() {
  const { roomId } = useParams()
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const draggableRef = useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [currentChat, setCurrentChat] = useState<IChat | null>(null)
  const [inputType, setInputType] = useState<'text' | 'image'>('text')
  const [images, setImages] = useState<PasteItem[]>([])
  const [files, setFiles] = useState<File[]>([])
  const MAX_FILES = 5
  const MAX_SIZE_MB = 10
  const [error, setError] = useState<string | null>(null)
  const [searchChatTxt, setSearchChatTxt] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showAddChatPopup, setShowAddChatPopup] = useState(false)

  const listChats = useAppSelector((state) => state.chat.listChats)
  const chatType = useAppSelector((state) => state.chat.chatType)
  const focused = useAppSelector((state) => state.chat.focused)
  const showChat = useAppSelector((state) => state.chat.showChat)
  const mapMessages = useAppSelector((state) => state.chat.mapMessages)

  const handleSelectedChatType = (index: number) => {
    switch (index) {
      case 0:
        dispatch(setChatType(CHAT_TYPE.PRIVATE))
        break
      case 1:
        dispatch(setChatType(CHAT_TYPE.GROUP))
        break
      case 2:
        dispatch(setChatType(CHAT_TYPE.PUBLIC))
        break
      default:
        break
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    const rect = draggableRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && draggableRef.current) {
      draggableRef.current.style.left = `${e.clientX - dragOffset.x}px`
      draggableRef.current.style.top = `${e.clientY - dragOffset.y}px`
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (isDragging && draggableRef.current) {
  //       draggableRef.current.style.left = `${e.clientX - dragOffset.x}px`
  //       draggableRef.current.style.top = `${e.clientY - dragOffset.y}px`
  //     }
  //   }

  //   const handleMouseUp = () => {
  //     setIsDragging(false)
  //   }

  //   document.addEventListener('mousemove', handleMouseMove)
  //   document.addEventListener('mouseup', handleMouseUp)

  //   return () => {
  //     document.removeEventListener('mousemove', handleMouseMove)
  //     document.removeEventListener('mouseup', handleMouseUp)
  //   }
  // }, [isDragging, dragOffset])

  useEffect(() => {
    getListChats()
  }, [])

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentChat, mapMessages.get(currentChat?._id || '')?.messages.length])

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!currentChat) return

    const file = event.target.files?.[0]
    if (!file) return

    const totalSizeMB = [...files, ...images.map((image) => image.file), file].reduce(
      (acc, curr) => acc + curr.size / 1024 / 1024,
      0
    )

    if (totalSizeMB > MAX_SIZE_MB) {
      toast('Total file size exceeds 10MB')
      return
    }

    if (file.type.includes('image')) {
      if (images.length >= MAX_FILES) {
        toast('You can only select up to 5 images')
        return
      }
      setImages([...images, { preview: URL.createObjectURL(file), file }])
    } else {
      if (files.length >= MAX_FILES) {
        toast('You can only select up to 5 files')
        return
      }
      setFiles([...files, file])
    }
  }

  const handleUploadImage = async (files: File[]) => {
    const paths = await Promise.all(
      files.map(async (file) => {
        try {
          const form = new FormData()
          form.append('file', file)
          const {
            result: { path },
          } = await ApiService.getInstance().post(`/upload/rooms/${roomId}`, form)
          return path as string
        } catch {
          return ''
        }
      })
    )
    return paths
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      inputRef.current?.blur()
      dispatch(setShowChat(false))
    }
  }

  const handleChangeChat = (chat: IChat) => {
    setCurrentChat(chat)
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (!currentChat) return

    const items = e.clipboardData?.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              setInputType('image')
              setImages([...images, { file, preview: reader.result as string }])
            }
            reader.readAsDataURL(file)
            setError(null)
            return
          }
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
    setImages([])
    setFiles([])
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentChat) return
    if (!readyToSubmit) {
      setReadyToSubmit(true)
      return
    }

    const val = inputValue.trim()
    setInputValue('')
    let messages: IMessagePayload[] = []

    if (images.length > 0) {
      const paths = await handleUploadImage(images.map((i) => i.file))
      messages.push(
        ...paths.map((p) => ({
          content: '',
          type: 'image',
          path: p,
          chatId: currentChat?._id || '',
        }))
      )
    }

    if (files.length > 0) {
      const paths = await handleUploadImage(files)
      messages.push(
        ...files.map((f, i) => ({
          content: '',
          type: 'file',
          path: paths[i],
          filename: f.name,
          chatId: currentChat?._id || '',
        }))
      )
    }

    if (val) messages.push({ content: val, chatId: currentChat?._id || '', type: 'text', path: '' })

    if (messages.length > 0) {
      messages.forEach((m) => {
        Network.getInstance()?.addChatMessage(m)
        if (m.content) Game.getInstance()?.myPlayer?.updateDialogBubble(m.content)
      })
      handleReset()
    }
  }

  const getListChats = async () => {
    try {
      const res = await ApiService.getInstance().get(
        `/rooms/${roomId}/chats?sort=desc&sortBy=lastModifiedAt`
      )
      dispatch(setListChat(res.result || []))
      setCurrentChat(listChats[0])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setCurrentChat(listChats[0])
  }, [listChats])

  return (
    <Backdrop
      ref={draggableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Wrapper>
        {showChat && (
          <div style={{ height: '100%', display: 'flex' }}>
            <div
              style={{
                width: '30%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ChatHeader
                style={{
                  height: '9%',
                  borderRadius: '10px 0 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <h3>Chats</h3>
                <MenuIconDropdown
                  items={[
                    { icon: <PersonRoundedIcon />, label: 'Private' },
                    { icon: <GroupsRoundedIcon />, label: 'Group' },
                    { icon: <LanguageRoundedIcon />, label: 'Public' },
                  ]}
                  defaultValue={
                    chatType == CHAT_TYPE.PRIVATE ? 0 : chatType == CHAT_TYPE.GROUP ? 1 : 2
                  }
                  handleSelect={handleSelectedChatType}
                />
              </ChatHeader>
              <ListChat style={{ height: '91%', borderRadius: '0 0 0 10px', paddingRight: 5 }}>
                <div
                  className="header"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderRadius: 4,
                    padding: '10px 10px 0 10px',
                  }}
                >
                  <SearchBar search={searchChatTxt} setSearch={setSearchChatTxt} />
                  <AddChatButton onClick={() => setShowAddChatPopup(true)}>
                    <AddCircleOutlineRoundedIcon />
                  </AddChatButton>
                </div>
                <div className="list">
                  {listChats.map((chat) => (
                    <ChatContainer
                      isEnabled={currentChat?._id == chat._id}
                      key={chat._id}
                      onClick={() => handleChangeChat(chat)}
                    >
                      <p style={{ margin: 0, color: 'white' }}>{chat.name}</p>
                    </ChatContainer>
                  ))}
                </div>
              </ListChat>
            </div>
            <div style={{ width: '75%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <ChatHeader
                style={{
                  height: '9%',
                  borderRadius: '0 10px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <h3>{currentChat?.name || ''}</h3>
                {/* {currentChat && (
                  <MenuDropdown
                    items={[{ icon: <ExitToAppRoundedIcon />, label: 'Leave chat' }]}
                    handleSelect={() => {}}
                  />
                )} */}
                <IconButton
                  aria-label="close dialog"
                  className="close"
                  onClick={() => dispatch(setShowChat(false))}
                  size="small"
                  style={{ top: '5px', right: '5px' }}
                >
                  <CloseIcon />
                </IconButton>
              </ChatHeader>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '91%',
                  borderRadius: '0px 0px 10px 0px',
                  overflow: 'hidden',
                }}
              >
                <ChatBox>
                  {mapMessages.get(currentChat?._id || '')?.messages?.map((message, index) => (
                    <ChatMessage chatMessage={message} key={index} />
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
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <p style={{ color: 'white' }}>{file.name}</p>
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
                  {currentChat && (
                    <div style={{ display: 'flex' }}>
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
                        <AttachFileIcon style={{ color: 'white' }} />
                      </div>
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
                  )}
                </InputWrapper>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
      {showAddChatPopup && <CreateGroupChatPopup onClosePopup={() => setShowAddChatPopup(false)} />}
    </Backdrop>
  )
}
