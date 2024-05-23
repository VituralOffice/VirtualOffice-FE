export enum RoomType {
  LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
  CUSTOM = 'custom',
}

export interface IRoomData {
  _id: string
  name: string
  private: boolean
  autoDispose: boolean
  map: string
}
export interface IMessagePayload {
  content: string
  type: string
  path: string
  chatId: string
}
