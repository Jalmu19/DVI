
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
    
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        const extra = 32;
        const bounds = this.scene.physics.world.bounds;
        if(this.y <= -32 || this.y >= bounds.height + 32 || this.x >= bounds.width + 32 || this.x <= -32){
            this.setActive(false);
            this.setVisible(false);
        }
    }
}