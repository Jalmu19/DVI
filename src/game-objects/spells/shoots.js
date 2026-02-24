import Shoot from "./shoot";

export default class Shoots extends Phaser.Physics.Arcade.Group{
    constructor(world, scene, config){
        super(world, scene,
            {...config, classType: Shoot, createCallback: Shoot.prototype.onCreate}
        );
    }

    fire(x, y, vx, vy){
        const shoot = this.getFirstDead(false);

        if(shoot) shoot.fire(x, y, vx, vy);
    }

    onCreate(shoot){
        shoot.onCreate();
    }
}