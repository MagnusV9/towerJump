export { Player };

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, move) {
    super(scene, x, y, texture);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.anims.create({
      key: "idle",
      frames: "playerIdle",
      framerate: 30,
      repeat: -1,
    });
    scene.anims.create({
      key: "walkR",
      frames: "playerWalk",
      framerate: 30,
      repeat: -1,
    });
    scene.anims.create({
      key: "jumpR",
      frames: "playerJump",
      framerate: 30,
      repeat: -1,
    });

    this.setSize(145, 280);
    this.flipX = true;
    this.setScale(0.25);
    this.play("idle");
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.move = move;
  }

  movePlayer() {
    if (this.move.left.isDown) {
      this.flipX = true;
      this.setVelocityX(-260);
      this.anims.play("walkR", true);
    } else if (this.move.right.isDown) {
      this.flipX = false;
      this.setVelocityX(260);
      this.anims.play("walkR", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("idle", true);
    }
    if (this.move.up.isDown && this.body.touching.down) {
      // gjør at player ikke kan hoppe utenfor skjerm, merk worldbounds teller ikke som colission.
      this.setVelocityY(-530);
      this.anims.play("jumpR", true);
    }
  }
}


