import Phaser from 'phaser';
import bg from './assets/background.jpg';
let move;

let player;

let platforms;

let startPlatforms;

let time = Date.now();

let speed = 0.2; 

let numPlatforms = 2; 

let score;

let playerIsDead = false;

let backgroundImg = []
for(let i = 1; i < 16; i++){
    backgroundImg.push({background:`background${i}`,path:`./src/assets/backgrounds/Background${i}.png`})
}

let background;
// abstraher bort scene slik at du har en gamescene, menue scene osv..

class MyGame extends Phaser.Scene
{

    
    constructor ()
    {
        super();
    }
    
    preload ()
    {
        backgroundImg.forEach((background) => {
            this.load.image(background.background, background.path);
        });
        this.load.image('blackPlatform','./src/assets/platform2.png');
        this.load.atlas('playerIdle','./src/assets/player/idleR.png','./src/assets/player/idleR.json');
        this.load.atlas('playerWalk', './src/assets/player/WalkR.png','./src/assets/player/WalkR.json');
        this.load.atlas('playerJump', './src/assets/player/jumpR.png', './src/assets/player/jumpR.json');
        
    }
      
    create (){
        move = this.input.keyboard.createCursorKeys();
     
        background = this.add.image(500,350,backgroundImg[0].background);
    
        startPlatforms = this.physics.add.staticGroup();
        platforms = this.physics.add.staticGroup();

        //platforms.create(400,500,'blackPlatform');
        spawnRandomPlatform(400,700,platforms,'blackPlatform'); 
        spawnMultiplePlatformsInRow(108,780,1080,startPlatforms,'blackPlatform'); // blackPlatform is 108 px
        
        score = this.add.text(10, 10, `Survival time: ${(Date.now()-time) /1000}`, { font: '25px Arial', fill: '#000000' });
         
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
        player.setBounce(0.2); 
        player.setCollideWorldBounds(true);
        
        this.physics.add.collider(player,platforms);
        this.physics.add.collider(player,startPlatforms);
        
        
        
    }
    update(){
            
        // må abstraheres ut til en player klasse
        
        if(player.y >= 805 || playerIsDead){
            playerIsDead = true;
            killPlayer(player);
            return;
        }

        if(move.left.isDown){
            player.flipX = true;
            player.setVelocityX(-260);
            player.anims.play('walkR',true);
        }
        else if(move.right.isDown){ 
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

         // formelen her funke (Math.floor((Date.now()-time)/10000) ) % backgroundImg.length ))
        if(Date.now() - time > 1000){
            score.setText(`Survival time: ${Math.round((Date.now()-time) /1000)}`)
            background.setTexture(backgroundImg[Math.floor((Date.now()-time)/10000)  % backgroundImg.length ].background);
           
        }

        
            
      
        //Math.round((Date.now()-time) /1000) % 10 +1 == numPlatforms gjør at man kunn increase speed og platform en gang
        if(Math.round((Date.now()-time) /1000) % 11 == 0 && numPlatforms < 8 && Math.round((Date.now()-time) /1000) % 10 +1 == numPlatforms){
            speed = speed + 0.2; 
            numPlatforms ++;
        }

    
        /**
         * start med 0.2 og for hvert 10 sekund øk med 0.2 og legg til en platform til.
         */
        moveStaticGroup(platforms,speed)
        moveStaticGroup(startPlatforms,speed)
        destroyUnreachablePlatforms(platforms)
        destroyUnreachablePlatforms(startPlatforms)
        
        /**
         * kan start med 2 også kan det økes basert på kor lang tid det tar, kan også øk hastigheta dem bevege sæ med en linær faktor basert på kor mang platforma som finnes
         */
        while(platforms.getChildren().length < numPlatforms){ 
            let sizeChildren = platforms.getChildren().length 
            let lastPlatform = platforms.getChildren()[sizeChildren-1]
         
            if(sizeChildren == 0) 
                spawnRandomPlatform(player.x, player.y, platforms, 'blackPlatform');
            else 
                spawnRandomPlatform(lastPlatform.x, lastPlatform.y, platforms,'blackPlatform');
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

 let moveStaticGroup = (group, speed) =>{
    group.getChildren().forEach(platform => {
        platform.body.y = platform.body.y + speed;
    });
    
    group.incY(speed)
}

let spawnMultiplePlatformsInRow = (pxSizePlatform, height, end, platform, image) => {
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

let destroyUnreachablePlatforms = (group) =>{
    group.getChildren().forEach(platform => {
        if(platform.y > 855 )
            platform.destroy(); 
    })
}
/**
* Spawns a random platform in a distance that is possible to jump to.
* @param posX the current x position of player.
* @param posY the current y posiotn of playet.
* @param platforms the platform group to spawn to.
* @param image the image to be used;
*/
let spawnRandomPlatform = (posX,posY, platforms, image) => { // funksjon her må skrives om for å få tids tellinga til å funk...
        let leftOrRight = (Math.floor(Math.random() * 2) ) < 1 ? 1 : -1;
        let randx = (randomIntFromInterval(1.3,1.5) * (150) * leftOrRight) + posX ; // dette burde være mer riktig men gir stack overflow....
    
        if (randx < 54)
            spawnRandomPlatform(posX,posY, platforms, image);
        else if(randx > 1080-54)
            spawnRandomPlatform(posX,posY, platforms, image);
        else
            platforms.create(randx + 5,posY-45,image);
}
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

let killPlayer = (player) => {
    player.rotation += 0.08;
    player.x += 5;
    player.y -=8;
    player.body.enable = false;
    player.setScale(player.scaleX +0.01, player.scaleY +0.01);
}

const game = new Phaser.Game(config);