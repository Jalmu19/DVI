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
        this.ejeBloqueado = null;

        this.setDrag(2000);
        // false para poder hacer el overlap con la bandera
        this.setImmovable(false); 
         
        // Evitamos que cualquier fuerza externa la mueva
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.properties = objeto.properties;
    }

    interact(player) {
         if (!this.ejeBloqueado) {
            const diffX = Math.abs(player.x - this.x);
            const diffY = Math.abs(player.y - this.y);

            // Si la distancia en X es mayor que en Y, es que estamos a los lados (movimiento horizontal)
            // Si la distancia en Y es mayor, es que estamos arriba/abajo (movimiento vertical)
            if (diffX > diffY) this.ejeBloqueado = 'x';
            else this.ejeBloqueado = 'y';
        }

        if (player.cursors.interact.isDown && this.ejeBloqueado) {
            
            if (this.ejeBloqueado === 'x') {
                // Bloqueamos el movimiento vertical tanto del player como de la caja
                player.body.velocity.y = 0; 
                this.setVelocity(player.body.velocity.x * this.pesoFactor, 0);
                
                player.body.velocity.x *= this.pesoFactor;
            } 
            else if (this.ejeBloqueado === 'y') {
                // Bloqueamos el movimiento horizontal tanto del player como de la caja
                player.body.velocity.x = 0;
                this.setVelocity(0, player.body.velocity.y * this.pesoFactor);
                
                player.body.velocity.y *= this.pesoFactor;
            }
        }

        if (player.cursors.interact.isUp) {
            this.ejeBloqueado = null;
        }
    }

}