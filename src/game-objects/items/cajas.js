import Phaser from "phaser";

export default class Cajas extends Phaser.Physics.Arcade.Sprite  {

    constructor(scene, x, y, objeto) {
        super(scene, x, y, objeto.name);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // false para poder hacer el overlap con la bandera
        this.setImmovable(false); 
         
        // Evitamos que cualquier fuerza externa la mueva
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.properties = objeto.properties;
    }

}