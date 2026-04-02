import Phaser from "phaser";

export default class Cajas extends Phaser.Physics.Arcade.Sprite  {

    constructor(scene, x, y, objeto) {
        super(scene, x, y, objeto.name);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(12,12)
        this.setOffset(2, 2);

        this.interactuable = true;
        this.pesoFactor = 0.4;

        this.setDrag(2000);
        // false para poder hacer el overlap con la bandera
        this.setImmovable(false); 
         
        // Evitamos que cualquier fuerza externa la mueva
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.properties = objeto.properties;
    }

    interact(player) {
        if(player.cursors.interact.isDown) {
            player.body.velocity.x *= this.pesoFactor;
            player.body.velocity.y *= this.pesoFactor;
            this.setVelocity(player.body.velocity.x, player.body.velocity.y);
            //TODO que solo se pueda mover en el eje en el que ha empezado
        }
    }

}