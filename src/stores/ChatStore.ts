import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import Game from '../scenes/Game'
import { IChatMessage, IMapMessage } from '../types/ISpaceState'
import { IChat } from '../interfaces/chat'

export enum MessageType {
  PLAYER_JOINED,
  PLAYER_LEFT,
  REGULAR_MESSAGE,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    focused: false,
    showChat: true,
    listChats: [] as IChat[],
    mapMessages: new Map<string, IMapMessage>(),
  },
  reducers: {
    pushChatMessage: (state, action: PayloadAction<{ chatId: string; message: IChatMessage }>) => {
      console.log(`new message coming`)
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
} = chatSlice.actions

export default chatSlice.reducer
