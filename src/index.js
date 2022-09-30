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
        this.load.multiatlas('playerIdle','./assets/idleR.png','assets');
    }
      
    create ()
    {
     
        const background = this.add.image(500,300,'background');
        
      
        
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
