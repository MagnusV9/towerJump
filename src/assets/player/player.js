export { Player };

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    
    this.player = super(scene, x, y, texture);
    super.anims.create({
        key: "idle",
        frames: "playerIdle",
        framerate: 30,
        repeat: -1,
      });
      super.anims.create({
        key: "walkR",
        frames: "playerWalk",
        framerate: 30,
        repeat: -1,
      });
      super.anims.create({
        key: "jumpR",
        frames: "playerJump",
        framerate: 30,
        repeat: -1,
      });
    this.scene = scene;
  }

  setPlayerProperties() {
    player.setSize(145, 280);
    player.flipX = true;
    player.setScale(0.25);
    player.play("idle");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  }

  movePlayer(){
    if (player.y >= 805 || playerIsDead) {
        playerIsDead = true;
        killPlayer(player);
        return;
      }
  
      if (move.left.isDown) {
        player.flipX = true;
        player.setVelocityX(-260);
        player.anims.play("walkR", true);
      } else if (move.right.isDown) {
        player.flipX = false;
        player.setVelocityX(260);
        player.anims.play("walkR", true);
      } else {
        player.setVelocityX(0);
        player.anims.play("idle", true);
      }
      if (move.up.isDown && player.body.touching.down) {
        // gjør at player ikke kan hoppe utenfor skjerm, merk worldbounds teller ikke som colission.  
        player.setVelocityY(-530);
        player.anims.play("jumpR", true);
      }
  }

  killPlayer() {
    player.rotation += 0.08;
    player.x += 5;
    player.y -= 8;
    player.body.enable = false;
    player.setScale(player.scaleX + 0.01, player.scaleY + 0.01);
  }
}
