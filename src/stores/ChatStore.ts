import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import Game from '../scenes/Game'
import { IChatMessage, IMapMessage } from '../types/ISpaceState'
import { IChat } from '../interfaces/chat'

export enum MessageType {
  PLAYER_JOINED,
  PLAYER_LEFT,
  REGULAR_MESSAGE,
}

interface ChatState {
  focused: boolean
  showChat: boolean
  listChats: IChat[]
  activeChat: null | IChat
  mapMessages: Map<string, IMapMessage>
}

const initialState: ChatState = {
  focused: false,
  showChat: false,
  listChats: [] as IChat[],
  activeChat: null,
  mapMessages: new Map<string, IMapMessage>(),
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    pushChatMessage: (state, action: PayloadAction<{ chatId: string; message: IChatMessage }>) => {
      if (state.mapMessages.get(action.payload.chatId)) {
        const mapMessage = {
          id: action.payload.chatId,
          messages: [
            ...(state.mapMessages.get(action.payload.chatId)?.messages || []),
            action.payload.message,
          ],
        } as IMapMessage
        state.mapMessages.set(action.payload.chatId, mapMessage)
        //state.mapMessages[action.payload.chatId].messages.push({
        //  messageType: MessageType.REGULAR_MESSAGE,
        //  chatMessage: action.payload.message,
        //})
      } else {
        const newMapMessage = {
          id: action.payload.chatId,
          messages: [action.payload.message],
        } as IMapMessage
        state.mapMessages.set(action.payload.chatId, newMapMessage)
      }
    },
    pushPlayerJoinedMessage: (state, action: PayloadAction<string>) => {},
    pushPlayerLeftMessage: (state, action: PayloadAction<string>) => {},
    loadMapChatMessage: (state, action: PayloadAction<IMapMessage[]>) => {
      action.payload.forEach((mc) =>
        state.mapMessages.set(mc.id, {
          id: mc.id,
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
    setListChat: (state, action: PayloadAction<IChat[]>) => {
      state.listChats = action.payload
    },
    addChat: (state, action: PayloadAction<IChat>) => {
      const { _id } = action.payload
      const exists = state.listChats.find((c) => c._id === _id)
      if (exists) {
        const index = state.listChats.findIndex((c) => c._id === _id)
        state.listChats[index] = action.payload
      } else state.listChats.unshift(action.payload)
    },
    updateChat: (state, action: PayloadAction<IChat>) => {
      const chat = action.payload
      const index = state.listChats.findIndex((c) => c._id === chat._id)
      state.listChats.splice(index, 1)
      state.listChats.unshift(chat)
    },
    setActiveChat: (state, action: PayloadAction<IChat>) => {
      state.activeChat = action.payload
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
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
  setFocused,
  setShowChat,
  setListChat,
  loadMapChatMessage,
  setActiveChat,
  addChat,
  updateChat,
} = chatSlice.actions

export default chatSlice.reducer
