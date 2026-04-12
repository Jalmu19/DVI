import Shoot from "./shoot";

export default class Shoots extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        scene.currentShootKey = config.key;
        scene.currentShootSpeed = config.speed;

        super(world, scene,
            { ...config, classType: config.classType, createCallback: config.classType.prototype.onCreate }
        );
        this.key = config.key;

        this.maxAmmo = 10;
        this.ammo = this.maxAmmo;
        this.isReloading = false;
        this.cooldownTime = 2000;

        this.createMultiple({ key: this.key, frameQuantity: this.maxAmmo, active: false, visible: false });
    }

    fire(x, y, rotation) {
        if (!this.isReloading && this.ammo > 0) {
            const shoot = this.getFirstDead(false);

            if (shoot) {
                shoot.fire(x, y, rotation);
                this.ammo--;
                this.emitUi();

                if (this.ammo <= 0) {
                    this.startReload();
                }
            }
        }
    }

    onCreate(shoot) {
        shoot.onCreate();
    }

    startReload() {
        this.isReloading = true;
        this.scene.time.delayedCall(this.cooldownTime, () => {
            this.ammo = this.maxAmmo;
            this.isReloading = false;
            this.emitUi();
        });
    }

    emitUi(){
        this.scene.game.events.emit('ammo-changed', { maxAmmo: this.maxAmmo, actualAmmo: this.ammo });
    }
}