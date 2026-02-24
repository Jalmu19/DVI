
export default class Shoot extends Phaser.Physics.Arcade.Sprite{
    
    fire(x, y, vx, vy){
        this.setDisplaySize(16, 16);
        this.enableBody(true, x, y, true, true);
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