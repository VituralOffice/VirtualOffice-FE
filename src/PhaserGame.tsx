import Phaser from 'phaser'
import Game from './scenes/Game'
import Background from './scenes/Background'
import Bootstrap from './scenes/Bootstrap'

// const config: Phaser.Types.Core.GameConfig = {
//   type: Phaser.AUTO,
//   parent: 'phaser-container',
//   backgroundColor: '#93cbee',
//   pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
//   scale: {
//     mode: Phaser.Scale.ScaleModes.RESIZE,
//     width: window.innerWidth,
//     height: window.innerHeight,
//   },
//   physics: {
//     default: 'arcade',
//     arcade: {
//       gravity: { x: 0, y: 0 },
//       debug: false,
//     },
//   },
//   autoFocus: true,
//   scene: [Bootstrap, Background, Game],
// }

// const phaserGame = new Phaser.Game(config);

// (window as any).game = phaserGame;

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

const initGame = async () => {
  const Bootstrap = await loadBootstrapScene();
  const Game = await loadGameScene();
  const Background = await loadBackgroundScene();
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
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
  }

  const phaserGame = new Phaser.Game(config);
  (window as any).game = phaserGame;
  return phaserGame;
};

export default initGame().then((game) => {
  return game;
});