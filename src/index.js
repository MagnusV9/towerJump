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
        
        const animConfig= {
            key: 'idle',
            frames: 'playerIdle',
            framerate:30,
            repeat: -1
        };
        this.anims.create(animConfig);
        const player = this.add.sprite(90,800,'playerIdle');
        player.setScale(0.25);
        player.play('idle');
        
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
