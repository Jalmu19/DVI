import Phaser from "phaser";

export default class Puertas extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, objeto) {
        super(scene, x, y, objeto.name);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.properties = objeto.properties;
        this.setImmovable(true);
    }
}
