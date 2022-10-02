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
        this.load.atlas('playerWalk', './src/assets/player/WalkR.png','./src/assets/player/WalkR.json');
        this.load.atlas('playerJump', './src/assets/player/jumpR.png', './src/assets/player/jumpR.json');
    }
      
    create ()
    {
        move = this.input.keyboard.createCursorKeys();
     
        const background = this.add.image(500,300,'background');
        
        
        this.anims.create({
            key: 'idle',
            frames: 'playerIdle',
            framerate:30,
            repeat: -1
        });
        this.anims.create({
            key: 'walkR',
            frames: 'playerWalk',
            framerate: 30, 
            repeat: -1
        });
        this.anims.create({
            key: 'jumpR',
            frames: 'playerJump',
            framerate: 30, 
            repeat: -1
        });
        player = this.physics.add.sprite(90,800,'playerIdle') // tatt fra file:///home/magnus/.cache/.fr-m4FJaK/part10.html
        player.setScale(0.25);
        player.play('idle');
        
    }
    update(){
        if(move.left.isDown){
            player.setVelocityX(-160);
            player.anims.play('walkR',true);
        }
        else if(move.right.isDown){
            player.setVelocityX(160);
            player.anims.play('walkR',true);
        }
        else if(move.up.isDown){
            player.setVelocityY(-330);
            player.anims.play('jumpR',true);
        }



    }
}
var move; 
var player;

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1080,
    height: 840,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:300},
            debug : false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);

