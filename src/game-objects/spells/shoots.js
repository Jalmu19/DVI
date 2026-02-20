class Shoots extends Phaser.Physics.Arcade.Group{
    constructor(scene, config){
        super(scene,
            {classType: Bullet, createCallback: Bullets.prototype.onCreate}
        );
    }

    fire(x, y, vx, vy){
        const bullet = this.getFirst.Dead(false);

        if(bullet) bullet.fire(x, y, vx, vy);
    }

    onCreate(bullet){
        bullet.onCreate();
    }
}