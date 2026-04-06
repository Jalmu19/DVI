 import Phaser from "phaser";



 export default class Ladron extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,sprite) {

            super(scene, x, y, sprite);
            this.scene.add.existing(this);
            this.scene.physics.add.existing(this);
    }
}