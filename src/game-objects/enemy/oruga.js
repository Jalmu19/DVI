import BaseEnemy from "./baseEnemy";

export default class Oruga extends BaseEnemy {

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.body.setSize(28,10).setOffset(2, 10);

        this.play({key : 'move', repeat: -1, delay: Phaser.Math.Between(0, 1000)}, true);
    }
    
    movement(){}

    preUpdate(t, dt) {
        Phaser.Physics.Arcade.Sprite.prototype.preUpdate.call(this, t, dt);
        if (this.scene.physics.overlap(this.scene.player.hurtbox, this)) {
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);
        }
    }
}