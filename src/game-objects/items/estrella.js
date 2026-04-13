import Phaser from "phaser";

export default class Estrella extends Phaser.Physics.Arcade.Sprite{
    /**
     * Constructor de las estrellas del laberinto
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
    }


}