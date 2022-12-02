export { Player };

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, move) {
    super(scene, x, y, texture);
    scene.physics.add.existing(this);
    //console.log(super.body)
    this.setSize(145, 280);
    this.flipX = true;
    this.setScale(0.25);
    this.play("idle");
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.move = move;
  }
  movePlayer(){
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

// https://labs.phaser.io/edit.html?src=src/game%20objects/sprites/custom%20sprite%20class%20ES6.js&v=3.55.2
