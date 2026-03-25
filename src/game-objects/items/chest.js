import Phaser from "phaser";

export default class Chest extends Phaser.GameObjects.Sprite {
    /**
     * Constructor del cofre
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */

    constructor(scene, x, y) {
        super(scene, x, y, 'chest');
        this.interactuable = true;

    }
}