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
  focused: boolean
  showChat: boolean
  listChats: IChat[]
  privateChats: IChat[]
  publicChats: IChat[]
  groupChats: IChat[]
  chatType: CHAT_TYPE
  mapMessages: Map<string, IMapMessage>
}

const initialState: ChatState = {
  focused: false,
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
        // const mapMessage = {
        //   id: action.payload.chatId,
        //   messages: [
        //     ...(state.mapMessages.get(action.payload.chatId)?.messages || []),
        //     action.payload.message,
        //   ],
        // } as IMapMessage
        // state.mapMessages.set(action.payload.chatId, mapMessage)
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
    // pushPlayerJoinedMessage: (state, action: PayloadAction<string>) => { },
    // pushPlayerLeftMessage: (state, action: PayloadAction<string>) => { },
    loadMapChatMessage: (state, action: PayloadAction<IMapMessage[]>) => {
      action.payload.forEach((mc) =>
        state.mapMessages.set(mc._id, {
          _id: mc._id,
          messages: mc.messages,
        } as IMapMessage)
      )
    },
    setFocused: (state, action: PayloadAction<boolean>) => {
      action.payload ? Game.getInstance()?.disableKeys() : Game.getInstance()?.enableKeys()
      state.focused = action.payload
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
            state.privateChats.push(c)
            break
          case CHAT_TYPE.GROUP:
            state.groupChats.push(c)
            break
          case CHAT_TYPE.PUBLIC:
            state.publicChats.push(c)
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
    // updateMapMessage: (state, action: PayloadAction<IMapMessage>) => {
    //   state.mapMessages.set(action.payload._id, action.payload)
    // },
    // addChat: (state, action: PayloadAction<IChat>) => {
    //   const { _id } = action.payload
    //   const exists = state.listChats.find((c) => c._id === _id)
    //   if (exists) {
    //     const index = state.listChats.findIndex((c) => c._id === _id)
    //     state.listChats[index] = action.payload
    //   } else state.listChats.unshift(action.payload)
    // },
    addChat: (state, action: PayloadAction<{ chat: IChat; mapMessage: IMapMessage }>) => {
      //add chat
      const { _id } = action.payload.chat
      let index = -1
      switch (action.payload.chat.type) {
        case CHAT_TYPE.PRIVATE:
          index = state.privateChats.findIndex((c) => c._id === _id)
          if (index >= 0) {
            state.privateChats[index] = action.payload.chat
          } else state.privateChats.unshift(action.payload.chat)
          break
        case CHAT_TYPE.GROUP:
          index = state.groupChats.findIndex((c) => c._id === _id)
          if (index >= 0) {
            state.groupChats[index] = action.payload.chat
          } else state.groupChats.unshift(action.payload.chat)
          break
        case CHAT_TYPE.PUBLIC:
          index = state.publicChats.findIndex((c) => c._id === _id)
          if (index >= 0) {
            state.publicChats[index] = action.payload.chat
          } else state.publicChats.unshift(action.payload.chat)
          break
        default:
          break
      }

      //add map messages
      state.mapMessages.set(action.payload.mapMessage._id, action.payload.mapMessage)

      // console.log(state.mapMessages.get(action.payload.mapMessage._id))
    },
    updateChat: (state, action: PayloadAction<IChat>) => {
      const chat = action.payload
      const index = state.listChats.findIndex((c) => c._id === chat._id)
      if (index === -1) return
      state.listChats.splice(index, 1)
      state.listChats.unshift(chat)
    },
  },
  extraReducers: {},
})
const fetchMessagesByChatId = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId: number, thunkAPI) => {}
)
export const {
  pushChatMessage,
  setFocused,
  setShowChat,
  setListChat,
  loadMapChatMessage,
  updateChat,
  addChat,
  setMessageMaps,
  setChatType,
} = chatSlice.actions

export default chatSlice.reducer
