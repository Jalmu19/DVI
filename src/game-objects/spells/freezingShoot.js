import Shoot from "./shoot";

export default class FreezingShoot extends Shoot{

    constructor(scene, x, y){
        const key = scene.currentShootKey;
        const speed = 150;

        super(scene, x, y, key);
        this.speed = speed; 
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