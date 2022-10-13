import Phaser from 'phaser';
import bg from './assets/background.jpg';
let move;

let player;

let platforms;

let startPlatforms;

let gameStarted = true;

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
        startPlatforms = this.physics.add.staticGroup();
        platforms = this.physics.add.staticGroup();
        // tror du burd lag en klasse for alle staticGroup slik at du kan ha kontroll over kor mange platforma som finnes.


        //platforms.create(400,500,'blackPlatform');
        spawnRandomPlatform(400,700,platforms,'blackPlatform'); // I think this spawns all platforms ontop of eachother. need parameter for how big platform is.
        spawnMultiplePlatformsInRow(108,780,0,1080,startPlatforms,'blackPlatform'); // blackPlatform is 108 px
        
        
        
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
        player = this.physics.add.sprite(400,700,'playerIdle') // 90,800 I think player can jump 2*108 - 20 px
        player.setSize(145,280);
        player.flipX = true;
        player.setScale(0.25);
        player.play('idle');
        player.setBounce(0.3);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player,platforms);
        this.physics.add.collider(player,startPlatforms);
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
        
        if(gameStarted){
            /*
            her kan vi få verdenen til å "falle"
            */
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
 * Spawns multiple platforms in a row.
 * @param pxSizePlatform how many pixels the platform is
 * @param height the height of where to spawn
 * @param start from where to spawn
 * @param end to where to spawn
 * @param platform the staticGroup of platforms to spawn from.
 * @param {String} image used for spawning platform
 */
function spawnMultiplePlatformsInRow(pxSizePlatform, height, start, end, platform, image){
    const middle = pxSizePlatform / 2;
    let currPosition = middle;
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
/**
* Spawns a random platform in a distance that is possible to jump to.
* @param playerPositonX the current x position of player.
* @param playerPostionY the current y posiotn of playet.
* @param platforms the platform group to spawn to.
* @param image the image to be used;
*/
function spawnRandomPlatform(playerPositonX,playerPostionY, platforms, image){ // noe rart her
        let leftOrRight = (Math.floor(Math.random() * 2) ) < 1 ? 1 : -1;
        let randx = Math.floor( (Math.random() * 190 + 108) * leftOrRight) + playerPositonX;
        let randy = playerPostionY - Math.floor(Math.random() * 30);
        if(playerPostionY < 420)
            platforms.create(randx,playerPostionY,image);
        else
            platforms.create(randx,randy,image);

}

const game = new Phaser.Game(config);

