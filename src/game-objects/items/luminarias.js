import Phaser from "phaser";
import { FRAME_ENCENDIDO, FRAME_APAGADO } from "../../constants";

export default class Luminarias extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'cueva', FRAME_APAGADO);
        
        this.setOrigin(0, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }


    encender() {
        this.encendida = true;
        this.setFrame(FRAME_ENCENDIDO); 
    }

    apagar() {
        this.encendida = false;
        this.setFrame(FRAME_APAGADO); 
    }
}
