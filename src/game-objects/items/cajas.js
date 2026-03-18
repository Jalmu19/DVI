import Phaser from "phaser";

export default class Cajas extends Phaser.Physics.Arcade.Sprite  {

    constructor(scene, x, y, objeto) {
        super(scene, x, y, objeto.name);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Hacemos que la caja sea una roca (no se mueve sola)
        this.setImmovable(true); 
       // this.setCollideWorldBounds(true);
        
        // Evitamos que cualquier fuerza externa la mueva
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.properties = objeto.properties;
    }

}