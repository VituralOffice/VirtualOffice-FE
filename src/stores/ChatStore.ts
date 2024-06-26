import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import Game from '../scenes/Game'
import { IChatMessage, IMapMessage } from '../types/ISpaceState'
import { IChat } from '../interfaces/chat'
import { CHAT_TYPE } from '../constants/constant'

export enum MessageType {
  PLAYER_JOINED,
  PLAYER_LEFT,
  REGULAR_MESSAGE,
}

interface ChatState {
  // focused: boolean
  showChat: boolean
  listChats: IChat[]
  privateChats: IChat[]
  publicChats: IChat[]
  groupChats: IChat[]
  chatType: CHAT_TYPE
  mapMessages: Map<string, IMapMessage>
}

const initialState: ChatState = {
  // focused: false,
  showChat: false,
  listChats: [] as IChat[],
  privateChats: [] as IChat[],
  publicChats: [] as IChat[],
  groupChats: [] as IChat[],
  chatType: CHAT_TYPE.PRIVATE,
  mapMessages: new Map<string, IMapMessage>(),
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    pushChatMessage: (state, action: PayloadAction<{ chatId: string; message: IChatMessage }>) => {
      if (state.mapMessages.get(action.payload.chatId)) {
        const mapMessage = state.mapMessages.get(action.payload.chatId)
        if (mapMessage && mapMessage.messages) {
          mapMessage.messages.push(action.payload.message)
        } else {
          const newMapMessage = {
            _id: action.payload.chatId,
            messages: [action.payload.message],
          }
          state.mapMessages.set(action.payload.chatId, newMapMessage as IMapMessage)
        }
      } else {
        const newMapMessage = {
          _id: action.payload.chatId,
          messages: [action.payload.message],
        } as IMapMessage
        state.mapMessages.set(action.payload.chatId, newMapMessage)
      }
    },
    loadMapChatMessage: (state, action: PayloadAction<IMapMessage[]>) => {
      action.payload.forEach((mc) =>
        state.mapMessages.set(mc._id, {
          _id: mc._id,
          messages: mc.messages,
        } as IMapMessage)
      )
    },
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload
    },
    setChatType: (state, action: PayloadAction<CHAT_TYPE>) => {
      state.chatType = action.payload
      switch (action.payload) {
        case CHAT_TYPE.PRIVATE:
          state.listChats = state.privateChats
          break
        case CHAT_TYPE.GROUP:
          state.listChats = state.groupChats
          break
        case CHAT_TYPE.PUBLIC:
          state.listChats = state.publicChats
          break
        default:
          break
      }
    },
    setListChat: (state, action: PayloadAction<IChat[]>) => {
      state.privateChats = []
      state.publicChats = []
      state.groupChats = []
      action.payload.forEach((c) => {
        switch (c.type) {
          case CHAT_TYPE.PRIVATE:
            state.privateChats.unshift(c)
            break
          case CHAT_TYPE.GROUP:
            state.groupChats.unshift(c)
            break
          case CHAT_TYPE.PUBLIC:
            state.publicChats.unshift(c)
            break
          default:
            break
        }
      })
      switch (state.chatType) {
        case CHAT_TYPE.PRIVATE:
          state.listChats = state.privateChats
          break
        case CHAT_TYPE.GROUP:
          state.listChats = state.groupChats
          break
        case CHAT_TYPE.PUBLIC:
          state.listChats = state.publicChats
          break
        default:
          break
      }
    },
    setMessageMaps: (state, action: PayloadAction<IMapMessage[]>) => {
      action.payload.forEach((m) => {
        state.mapMessages.set(m._id, m)
      })
    },
    addChat: (state, action: PayloadAction<{ chat: IChat; mapMessage: IMapMessage }>) => {
      //add chat
      const { chat } = action.payload
      let index = -1
      switch (chat.type) {
        case CHAT_TYPE.PRIVATE:
          index = state.privateChats.findIndex((c) => c._id === chat._id)
          if (index >= 0) {
            state.privateChats[index] = chat
          } else state.privateChats.unshift(chat)
          break
        case CHAT_TYPE.GROUP:
          index = state.groupChats.findIndex((c) => c._id === chat._id)
          if (index >= 0) {
            state.groupChats[index] = chat
          } else state.groupChats.unshift(chat)
          break
        case CHAT_TYPE.PUBLIC:
          index = state.publicChats.findIndex((c) => c._id === chat._id)
          if (index >= 0) {
            state.publicChats[index] = chat
          } else state.publicChats.unshift(chat)
          break
        default:
          break
      }

      if (state.chatType == chat.type)
        state.listChats =
          chat.type == CHAT_TYPE.PRIVATE
            ? state.privateChats
            : chat.type == CHAT_TYPE.GROUP
            ? state.groupChats
            : state.publicChats

      //add map messages
      state.mapMessages.set(action.payload.mapMessage._id, action.payload.mapMessage)
    },
    updateChat: (state, action: PayloadAction<IChat>) => {
      const chat = action.payload
      const index = state.listChats.findIndex((c) => c._id === chat._id)
      if (index === -1) return
      state.listChats.splice(index, 1)
      state.listChats.unshift(chat)
    },
    resetChatStore: () => initialState,
  },
  extraReducers: {},
})

export const {
  pushChatMessage,
  setShowChat,
  setListChat,
  loadMapChatMessage,
  updateChat,
  addChat,
  setMessageMaps,
  setChatType,
  resetChatStore,
} = chatSlice.actions

export default chatSlice.reducer
