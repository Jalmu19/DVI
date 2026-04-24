import Phaser from "phaser";
import {FRAME_ROCA} from "../../constants";

export default class Roca extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'cueva', FRAME_ROCA);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setImmovable(false);
        this.body.setCollideWorldBounds(true);
           

        // Usamos un pequeño delay de 0ms para que la velocidad 
        // se aplique después de que el grupo la cree
        scene.time.delayedCall(0, () => {
            if (this.body) {
                if(this.name==="roca7" || this.name==="roca8" || this.name === "roca5"|| this.name==="roca1"){
                    this.body.setVelocityY(150);
                    this.body.setBounce(0, 1); //rebote vertical
                }
                else{
                    this.body.setVelocityX(150);
                    this.body.setBounce(1, 0); //rebote horizontal
                }

                
            }
        });

    }

}
