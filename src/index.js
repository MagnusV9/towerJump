import Phaser from 'phaser';
import bg from './assets/background.jpg';
let move;

let player;

let platforms;

let startPlatform;

class MyGame extends Phaser.Scene
{

    
    constructor ()
    {
        super();
    }
    
    preload ()
    {
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
        spawnMultiplePlatforms(108,780,0,1080,platforms,'blackPlatform'); // blackPlatform is 108 px

        
        
        
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
/**

 * @param pxSizePlatform how many pixels the platform is
 * @param height the height of where to spawn
 * @param start from where to spawn
 * @param end to where to spawn
 * @param platform the staticGroup of platforms to spawn from.
 * @param {String} image used for spawning platform
 */
function spawnMultiplePlatforms(pxSizePlatform,height, start, end, platform, image){
    var middle = pxSizePlatform / 2;
    var currPosition = middle;
    while(currPosition < end){
        if(currPosition === middle){
            platform.create(middle,height,image);
            currPosition += pxSizePlatform;
            continue;
        }
        platform.create(currPosition, height, image);
        currPosition += pxSizePlatform;
    }




}

const game = new Phaser.Game(config);

