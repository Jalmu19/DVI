
export default class Shoot extends Phaser.Physics.Arcade.Image{

    fire(x, v, vx, vy){
        this.enableBody(true, x, y, true, true);
        this.setVelocity(vx, vy);
    }

    onCreate(){
        this.disableBody(true, true);
    }
    
}