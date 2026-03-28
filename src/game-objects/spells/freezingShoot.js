import Shoot from "./shoot";
import { SPELLS } from "../../constants";

export default class FreezingShoot extends Shoot{

    constructor(scene, x, y){
        const key = scene.currentShootKey;
        super(scene, x, y, key);
        this.speed = SPELLS.FREEZE_SHOOT.SPEED; 
        this.setDisplaySize(16, 16);
        
        this.freeze = true;
    }

    fire(x, y, rotation){
        const posX = x + Math.cos(rotation);
        const posY = y + Math.sin(rotation);

        const vx = Math.cos(rotation) * this.speed;
        const vy = Math.sin(rotation) * this.speed;

        this.angle = Phaser.Math.RadToDeg(rotation) - 90;
       
        this.enableBody(true, posX, posY, true, true);
        this.setVelocity(vx, vy);
        this.setBodySize(10, 10);

        this.scene.time.delayedCall(500, () => {
            this.setActive(false);
            this.setVisible(false);
            this.disableBody(true, true);
        });
    }
    
}