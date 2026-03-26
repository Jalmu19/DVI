import Phaser from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
    /**
     * Constructor del cofre
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */

    constructor(scene, x, y) {
        super(scene, x, y, 'chest');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setCollideWorldBounds(true);
        this.interactuable = true;
        this.isOpened = false;
        this.play('closed');
    }

    /**
     * Metodo que abre el cofre (cambiando dicho sprite) y dando al jugador el objeto en su interior
     */
    openChest() {
        if(!this.isOpened)
            this.play('open');
    }
}