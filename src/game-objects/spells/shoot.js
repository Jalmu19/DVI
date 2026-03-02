
export default class Shoot extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        const key = scene.currentShootKey;
        const speed = scene.currentShootSpeed;

        super(scene, x, y, key);
        this.speed = speed; 
        this.setDisplaySize(16, 16);
    }

    fire(x, y, rotation){
        const posX = x + Math.cos(rotation);
        const posY = y + Math.sin(rotation);

        const vx = Math.cos(rotation) * this.speed;
        const vy = Math.sin(rotation) * this.speed;

        this.angle = Phaser.Math.RadToDeg(rotation) - 90;
       
        this.enableBody(true, posX, posY, true, true);
        this.setVelocity(vx, vy);
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
    
}