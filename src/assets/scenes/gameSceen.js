import Phaser from "phaser";
import { Player } from "../player/player";
export { PlayScreen };


let player;

let platforms;

let startPlatforms;

let time = Date.now();

let speed = 0.2;

let numPlatforms = 2;

let score;

let playerIsDead = false;

let retry;

//let restartButton;

let submitButton;

let backgroundImg = [];
for (let i = 1; i < 16; i++) {
  backgroundImg.push({
    background: `background${i}`,
    path: `./src/assets/backgrounds/Background${i}.png`,
  });
}

let background;
// abstraher bort scene slik at du har en gamescene, menue scene osv.. 
class PlayScreen extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    backgroundImg.forEach((background) => {
      this.load.image(background.background, background.path);
    });
    this.load.image("blackPlatform", "./src/assets/platform2.png");
    this.load.atlas(
      "playerIdle",
      "./src/assets/player/idleR.png",
      "./src/assets/player/idleR.json"
    );
    this.load.atlas(
      "playerWalk",
      "./src/assets/player/WalkR.png",
      "./src/assets/player/WalkR.json"
    );
    this.load.atlas(
      "playerJump",
      "./src/assets/player/jumpR.png",
      "./src/assets/player/jumpR.json"
    );
    this.load.image("restartButton", "./src/assets/button_restart.png");

    this.load.image("submitButton", "./src/assets/button_submit-score.png");
    this.load.image("restartButton", "./src/assets/button_restart.png");
    this.load.image("restartButtonOver","./src/assets/button_restart_over.png")
    this.load.image("submitButtonOver","./src/assets/button_submit-score_over.png")
  }

  create() {
/*
    restartButton = this.add.button(this.scene.centerX - 95, 400, 'restartButton', actionOnClick, this, 2, 1, 0);

    submitButton = this.add.button(this.scene.centerX-95, 200, 'submitButton', actionOnClick, this, 2,1,0);
*/
    background = this.add.image(500, 350, backgroundImg[0].background);

    startPlatforms = this.physics.add.staticGroup();
    platforms = this.physics.add.staticGroup();

    //platforms.create(400,500,'blackPlatform');
    spawnRandomPlatform(400, 700, platforms, "blackPlatform");
    spawnMultiplePlatformsInRow(
      108,
      780,
      1080,
      startPlatforms,
      "blackPlatform"
    ); // blackPlatform is 108 px

    score = this.add.text(
      10,
      10,
      `Survival time: ${(Date.now() - time) / 1000}`,
      { font: "25px Arial", fill: "#000000" }
    );
    
      submitButton = this.add.image(
        this.cameras.main.centerX,
        this.cameras.main.centerY-80,
        "submitButton"
      )
      submitButton.setInteractive();
      submitButton.on("pointerdown", ()=>{
        console.log("hello")
      })
      .on('pointerover', () => {submitButton.setTexture("submitButtonOver")
      submitButton.x = submitButton.x + 44; 
      submitButton.y = submitButton.y + 38; 
        })
      .on('pointerout', () => {submitButton.setTexture("submitButton")
      submitButton.x = submitButton.x - 44; 
      submitButton.y = submitButton.y - 38; 
    });
      submitButton.visible = false;

    retry = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "restartButton"
    );
    retry.setInteractive()
  
    retry.on('pointerdown', ()=> {
      window.location.reload(); 
      })
    .on('pointerover', () => retry.setTexture("restartButtonOver"))
    .on('pointerout', () => retry.setTexture("restartButton"));

    retry.visible = false;

    //retry.setBackgroundColor("#ffdaaf")
    player = new Player(
      this,
      400,
      700,
      "playerIdle",
      this.input.keyboard.createCursorKeys()
    );

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, startPlatforms);
  }

  update() {
    if (player.y >= 805 || playerIsDead) {
      playerIsDead = true;
      killPlayer(player);
      tryAgain();
      return;
    }
    else 
      player.movePlayer();

    
    if (Date.now() - time > 1000) {
      score.setText(`Survival time: ${Math.round((Date.now() - time) / 1000)}`);
      background.setTexture(
        backgroundImg[
          Math.floor((Date.now() - time) / 10000) % backgroundImg.length
        ].background
      );
    }

    //Math.round((Date.now()-time) /1000) % 10 +1 == numPlatforms gjør at man kunn increase speed og platform en gang
    if (
      Math.round((Date.now() - time) / 1000) % 11 == 0 &&
      numPlatforms < 8 &&
      (Math.round((Date.now() - time) / 1000) % 10) + 1 == numPlatforms
    ) {
      speed = speed + 0.2;
      numPlatforms++;
    }

    moveStaticGroup(platforms, speed);
    moveStaticGroup(startPlatforms, speed);
    destroyUnreachablePlatforms(platforms);
    destroyUnreachablePlatforms(startPlatforms);

    while (platforms.getChildren().length < numPlatforms) {
      let sizeChildren = platforms.getChildren().length;
      let lastPlatform = platforms.getChildren()[sizeChildren - 1];

      if (sizeChildren == 0)
        spawnRandomPlatform(player.x, player.y, platforms, "blackPlatform");
      else
        spawnRandomPlatform(
          lastPlatform.x,
          lastPlatform.y,
          platforms,
          "blackPlatform"
        );
    }
  }
}

/**
 * Spawns multiple platforms in a row.
 * @param pxSizePlatform how many pixels the platform is
 * @param height the height of where to spawn
 * @param start from where to spawn
 * @param end to where to spawn
 * @param platform the staticGroup of platforms to spawn from.
 * @param {String} image used for spawning platform
 */

let moveStaticGroup = (group, speed) => {
  group.getChildren().forEach((platform) => {
    platform.body.y = platform.body.y + speed;
  });

  group.incY(speed);
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
let spawnMultiplePlatformsInRow = (
  pxSizePlatform,
  height,
  end,
  platform,
  image
) => {
  const middle = pxSizePlatform / 2;
  let currPosition = middle;
  while (currPosition < end) {
    if (currPosition === middle) {
      platform.create(middle, height, image);
      currPosition += pxSizePlatform;
      continue;
    }
    platform.create(currPosition, height, image);
    currPosition += pxSizePlatform;
  }
};

let destroyUnreachablePlatforms = (group) => {
  group.getChildren().forEach((platform) => {
    if (platform.y > 855) platform.destroy();
  });
};
/**
 * Spawns a random platform in a distance that is possible to jump to.
 * @param posX the current x position of player.
 * @param posY the current y posiotn of playet.
 * @param platforms the platform group to spawn to.
 * @param image the image to be used;
 */
let spawnRandomPlatform = (posX, posY, platforms, image) => {
  let leftOrRight = Math.floor(Math.random() * 2) < 1 ? 1 : -1;
  let randx = randomIntFromInterval(1.3, 1.5) * 150 * leftOrRight + posX;

  if (randx < 54) spawnRandomPlatform(posX, posY, platforms, image);
  else if (randx > 1080 - 54) spawnRandomPlatform(posX, posY, platforms, image);
  else platforms.create(randx + 5, posY - 45, image);
};
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
}

let killPlayer = (player) => {
  player.rotation += 0.08;
  player.x += 5;
  player.y -= 8;
  player.body.enable = false;
  player.setScale(player.scaleX + 0.01, player.scaleY + 0.01);
};

let tryAgain = () => {
  retry.visible = true; 
  submitButton.visible = true;
}


let reset = () => {
  this.scene.restart();
  time = Date.now; 
  speed = 0.2; 
  numPlatforms = 2; 
  platforms = [];
}