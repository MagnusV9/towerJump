export{Player}
class Player {
    
    constructor(game){
        this.game = game;
        this.sprite = game.physics.add.sprite(400,700,'playerIdle');
        
    }
    loadPlayer(game){
        game.load.atlas('this.spriteIdle','./src/assets/player/idleR.png','./src/assets/this.sprite/idleR.json');
        game.load.atlas('this.spriteWalk', './src/assets/player/WalkR.png','./src/assets/this.sprite/WalkR.json');
        game.load.atlas('this.spriteJump', './src/assets/player/jumpR.png', './src/assets/this.sprite/jumpR.json');
    }

    createAnims(game){
        game.anims.create({
            key: 'idle',
            frames: 'this.spriteIdle',
            framerate:30,
            repeat: -1
        });
        game.anims.create({
            key: 'walkR',
            frames: 'this.spriteWalk',
            framerate: 30, 
            repeat: -1
        });
        game.anims.create({
            key: 'jumpR',
            frames: 'this.spriteJump',
            framerate: 30, 
            repeat: -1
        });
    }

    createPlayer(game){
        this.sprite = this.physics.add.sprite(400,700,'spriteIdle') // 90,800 I think this.sprite can jump 2*108 - 20 px
        this.sprite.setSize(145,280);
        this.sprite.flipX = true;
        this.sprite.setScale(0.25);
        this.sprite.play('idle');
        this.sprite.setBounce(0.2); // NBNBNB dette gjør at du ikke kan hoppe med engang, spill test for å se om dette bør endre til en mindre verdi.
        this.sprite.setCollideWorldBounds(true);
    }

    movePlayer(move){
        if(this.move.left.isDown){
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-260);
            this.sprite.anims.play('walkR',true);
        }
        else if(this.move.right.isDown){ 
            this.sprite.flipX = false;
            this.sprite.setVelocityX(260);
            this.sprite.anims.play('walkR',true);
        }
        else{
            this.sprite.setVelocityX(0);
            this.sprite.anims.play('idle',true);
        }
        if(this.move.up.isDown && this.sprite.body.touching.down){ // gjør at this.sprite ikke kan hoppe utenfor skjerm, merk worldbounds teller ikke som colission.
            this.sprite.setVelocityY(-530);
            this.sprite.anims.play('jumpR',true);
        }
    }

}
