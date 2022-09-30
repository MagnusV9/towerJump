import Phaser from 'phaser';
import bg from './assets/background.jpg';
class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        
        this.load.image('background',bg);
        this.load.atlas('playerIdle','./src/assets/player/idleR.png','./src/assets/player/idleR.json');
    }
      
    create ()
    {
     
        const background = this.add.image(500,300,'background');
        const player = this.add.sprite(500,500,'playerIdle');
        this.anims.create({
            framerate:30,
            frames: this.anims.generateFrameNumbers('playerIdle',{start:1, end: 8}),
            repeat: -1
        });
      player.play('playerIdle');
        
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1080,
    height: 840,
    scene: MyGame
};

const game = new Phaser.Game(config);
