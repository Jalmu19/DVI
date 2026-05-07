import Phaser from "phaser";

export default class Puertas extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, objeto) {
        super(scene, x, y, objeto.name);
        
        this.setOrigin(0, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);  // No reacciona a choques
        this.body.moves = false;
        this.body.onOverlap = false;  // Evita bugs de solapamiento
        
        this.properties = objeto.properties;
        this.id = objeto.id;
    }
}
