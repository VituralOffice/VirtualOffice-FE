import Phaser from 'phaser'

const loadBootstrapScene = async () => {
  const BootstrapModule = await import('./scenes/Bootstrap');
  return BootstrapModule.default;
};
const loadGameScene = async () => {
  const GameModule = await import('./scenes/Game');
  return GameModule.default;
};
const loadBackgroundScene = async () => {
  const BackgroundModule = await import('./scenes/Background');
  return BackgroundModule.default;
};

let PhaserGame: Phaser.Game | null = null;

export const InitGame = async () => {
  console.log("Init Phaser Game")

  const Bootstrap = await loadBootstrapScene();
  const Game = await loadGameScene();
  const Background = await loadBackgroundScene();

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    parent: 'phaser-container',
    backgroundColor: '#93cbee',
    pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
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
      target: 45,
      forceSetTimeOut: true
    },
  }

  PhaserGame = new Phaser.Game(config);
  (window as any).game = PhaserGame;

  // // Khởi tạo các scene theo yêu cầu
  // PhaserGame.scene.add('Bootstrap', Bootstrap);
  // PhaserGame.scene.add('Game', Game);
  // PhaserGame.scene.add('Background', Background);
};

export const DestroyGame = () => {
  console.log("Destroy Phaser Game")
  if (PhaserGame) PhaserGame.destroy(true);
  PhaserGame = null;
  (window as any).game = null;
}

export const PhaserGameInstance = async () => {
  if (PhaserGame === null) {
    InitGame();
  }
  return PhaserGame;
}