import Phaser from "phaser";
import { PlayScreen } from "./assets/scenes/gameSceen";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1080,
  height: 840,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: false,
    },
  },
  scene: new PlayScreen(),
};

const game = new Phaser.Game(config);
