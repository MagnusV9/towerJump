import Phaser from "phaser";
import {PlayScreen} from "./assets/scenes/gameSceen";

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
/**
 * Spawns multiple platforms in a row.
 * @param pxSizePlatform how many pixels the platform is
 * @param height the height of where to spawn
 * @param start from where to spawn
 * @param end to where to spawn
 * @param platform the staticGroup of platforms to spawn from.
 * @param {String} image used for spawning platform
 */

const game = new Phaser.Game(config);
