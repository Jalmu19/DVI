import Shoot from "./shoot";

export default class Shoots extends Phaser.Physics.Arcade.Group{
    constructor(world, scene, config){
        scene.currentShootKey = config.key;
        scene.currentShootSpeed = config.speed;

        super(world, scene,
            {...config, classType: Shoot, createCallback: Shoot.prototype.onCreate}
        );
    }

    fire(x, y, rotation){
        const shoot = this.getFirstDead(false);

        if(shoot) shoot.fire(x, y, rotation);
    }

    onCreate(shoot){
        shoot.onCreate();
    }
}