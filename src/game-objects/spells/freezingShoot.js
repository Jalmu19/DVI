import Shoot from "./shoot";

export default class FreezingShoot extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, key) {
       super(scene, x, y, key);
       scene.add.existing(this);

        // 2. ¡ESTA ES LA MÁS IMPORTANTE! Crea el cuerpo físico (this.body)
        scene.physics.add.existing(this);
        this.key = key;
        this.speed = 0; 
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

        this.scene.time.delayedCall(2000, () => {
            this.setActive(false);
            this.setVisible(false);
        });
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
    }
}