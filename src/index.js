import Phaser from 'phaser';
import bg from './assets/background.jpg';
class MyGame extends Phaser.Scene
{

    
    constructor ()
    {
        super();
    }
    
    preload ()
    {   this.load.image
        this.load.image('background',bg);
        this.load.image('blackPlatform','./src/assets/platform2.png');
        this.load.atlas('playerIdle','./src/assets/player/idleR.png','./src/assets/player/idleR.json');
        this.load.atlas('playerWalk', './src/assets/player/WalkR.png','./src/assets/player/WalkR.json');
        this.load.atlas('playerJump', './src/assets/player/jumpR.png', './src/assets/player/jumpR.json');
        
    }
      
    create ()
    {
        move = this.input.keyboard.createCursorKeys();
     
        const background = this.add.image(500,300,'background');
        
        platforms = this.physics.add.staticGroup();
        platforms.create(400,500,'blackPlatform');
        startPlatform = this.physics.add.staticSprite(450,780,'blackPlatform');
        //startPlatform.create(450,780,'blackPlatform'); // legg dem heller til som platforms slik at disse kan itereres igjennom for å ødelegges. asdas
        //startPlatform.scaleX(8);
        startPlatform.scaleX = 12;
        startPlatform.setSize(2050,30)
        
        
        
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
        player = this.physics.add.sprite(400,100,'playerIdle') // 90,800
        player.setSize(145,280);
        player.flipX = true;
        player.setScale(0.25);
        player.play('idle');
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player,platforms);
        
        this.physics.add.collider(player,startPlatform);
        
    
        
    }
    update(){
        if(move.left.isDown){
            player.flipX = true;
            player.setVelocityX(-260);
            player.anims.play('walkR',true);
        }
        else if(move.right.isDown){ // springe animasjonan blir ikke spilt av no dunno why, funke om du bruke else if istedet-
            player.flipX = false;
            player.setVelocityX(260);
            player.anims.play('walkR',true);
        }
        else{
            player.setVelocityX(0);
            player.anims.play('idle',true);
        }
        if(move.up.isDown && player.body.touching.down){ // gjør at player ikke kan hoppe utenfor skjerm, merk worldbounds teller ikke som colission.
            player.setVelocityY(-530);
            player.anims.play('jumpR',true);
        }
        


    }
}
var move; 
var player;
var platforms;
var startPlatform;

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1080,
    height: 840,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:1200},
            debug : false
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);

