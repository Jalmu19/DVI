import { SPELLS } from "../../constants";

export default class Shoot extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        const key = scene.currentShootKey;
        super(scene, x, y, key);
        this.speed = SPELLS.SHOOT.SPEED; 
        this.setDisplaySize(16, 16);
        
        this.freeze = false;
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
    }

    onCreate(){
        if (this.body) {
        this.disableBody(true, true);
        
        } else {
            // Si no, usamos los flags manuales
            this.setActive(false);
            this.setVisible(false);
        }
   
    }
    
    isFreezer() { return this.freeze}

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        const extra = 32;
        const bounds = this.scene.physics.world.bounds;
        if(this.y <= -extra || this.y >= bounds.height + extra || this.x >= bounds.width + extra || this.x <= -extra){
            this.setActive(false);
            this.setVisible(false);
        }
    }
}