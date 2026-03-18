import Phaser from "phaser";

export default class Puertas extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, objeto) {
        super(scene, x, y, "puerta");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.moves = false;
        this.setOrigin(0, 1);

        this.properties = objeto.properties;
        this.id = objeto.id;
    }
}
