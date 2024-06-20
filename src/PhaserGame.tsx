import Phaser from 'phaser'
import Bootstrap from './scenes/Bootstrap'
import store from './stores'
import {
  resetRoomStore,
  setGameCreated,
  setNetworkConstructed,
  setNetworkInitialized,
} from './stores/RoomStore'
import Game from './scenes/Game'
import Network from './services/Network'
import { resetChatStore } from './stores/ChatStore'
import { resetMeetingStore } from './stores/MeetingStore'
import { resetUIStore } from './stores/UIStore'
import { resetWhiteBoardStore } from './stores/WhiteboardStore'

const loadBootstrapScene = async () => {
  const BootstrapModule = await import('./scenes/Bootstrap')
  return BootstrapModule.default
}
export const loadGameScene = async () => {
  const GameModule = await import('./scenes/Game')
  return GameModule.default
}
const loadBackgroundScene = async () => {
  const BackgroundModule = await import('./scenes/Background')
  return BackgroundModule.default
}

let PhaserGame: Phaser.Game | null = null
let bootstrapCreatedResolver: (() => void) | null = null

export const InitPhaserGame = async () => {
  console.log('PhaserGame::InitGame Init Phaser Game')

  const Bootstrap = await loadBootstrapScene()
  const Game = await loadGameScene()
  const Background = await loadBackgroundScene()

  // Create a promise that will be resolved when the Bootstrap scene is created
  const bootstrapCreatedPromise = new Promise<void>((resolve) => {
    bootstrapCreatedResolver = resolve
  })

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    parent: 'phaser-container',
    backgroundColor: '#93cbee',
    pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: '90%',
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    autoFocus: true,
    scene: [Bootstrap, Background, Game],
    fps: {
      target: 15,
      forceSetTimeOut: true,
    },
  }

  PhaserGame = new Phaser.Game(config)
  ;(window as any).game = PhaserGame

  // Wait for Bootstrap scene to be created before continuing
  return bootstrapCreatedPromise

  // // Khởi tạo các scene theo yêu cầu
  // PhaserGame.scene.add('Bootstrap', Bootstrap);
  // PhaserGame.scene.add('Game', Game);
  // PhaserGame.scene.add('Background', Background);
}

export const DestroyGame = () => {
  try {
    // Bootstrap.getInstance()?.network.disconnectPlayer()
    Network.getInstance()?.disconnectMeeting()
    Network.getInstance()?.disconnectWebRTC()
    Network.getInstance()?.disconnectNetwork()
    if (PhaserGame) PhaserGame.destroy(true)
    store.dispatch(setNetworkInitialized(false))
    store.dispatch(setNetworkConstructed(false))
    store.dispatch(setGameCreated(false))
    store.dispatch(resetChatStore())
    store.dispatch(resetMeetingStore())
    store.dispatch(resetRoomStore())
    store.dispatch(resetUIStore())
    store.dispatch(resetWhiteBoardStore())
    console.log('PhaserGame::DestroyGame Destroy Phaser Game')
  } catch (error) {
    console.log(`PhaserGame::DestroyGame Destroy game error:`, error)
  }
}
