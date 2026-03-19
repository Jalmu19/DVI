import Shoot from "./shoot";

export default class Shoots extends Phaser.Physics.Arcade.Group{
    constructor(world, scene, config){
        scene.currentShootKey = config.key;
        scene.currentShootSpeed = config.speed;

        super(world, scene,
            {...config, classType: config.classType, createCallback: config.classType.prototype.onCreate}
        );

        this.createMultiple({key: 'shoot', frameQuantity: 1, active: false, visible: false});
    }

    fire(x, y, rotation){
        const shoot = this.getFirstDead(false);

        if(shoot) shoot.fire(x, y, rotation);
    }

    onCreate(shoot){
        shoot.onCreate();
    }

    getKey() {
        return this.key;
    }
}