import Phaser from 'phaser'


export enum GameEvent {
  PLAYER_JOINED = 'player-joined',
  PLAYER_UPDATED = 'player-updated',
  PLAYER_LEFT = 'player-left',
  PLAYER_DISCONNECTED = 'player-disconnected',
  MY_PLAYER_READY = 'my-player-ready',
  MY_PLAYER_NAME_CHANGE = 'my-player-name-change',
  MY_PLAYER_TEXTURE_CHANGE = 'my-player-texture-change',
  MY_PLAYER_VIDEO_CONNECTED = 'my-player-video-connected',
  MY_PLAYER_MEETING_STATUS_CHANGE = 'my-player-meeting-status-change',
  ITEM_USER_ADDED = 'item-user-added',
  ITEM_USER_REMOVED = 'item-user-removed',
  UPDATE_DIALOG_BUBBLE = 'update-dialog-bubble',
  CHAIR_CONNECT_USER_CHANGE = 'chair-connected-user-change',
  MY_PLAYER_CHARACTER_ID_CHANGE = 'my-player-character-id-change',
  MEETING_STATE_CHANGE = 'meeting-state-change',
  MEETING_TITLE_CHANGE = 'meeting-title-change',
  MEETING_CHATID_CHANGE = 'meeting-chatid-change',
  MEETING_ADMIN_CHANGE = 'meeting-admin-change',
  MEETING_ISLOCK_CHANGE = 'meeting-islock-change',
}