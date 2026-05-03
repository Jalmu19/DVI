import BaseEnemy from "./baseEnemy";
import { ENEMY } from "../../constants";

export default class Slime extends BaseEnemy {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.body.setSize(22, 16).setOffset(5, 7);
        this.speed = ENEMY.SLIME.SPEED.NORMAL;
        this.dashRange = 60;
        this.isDashing = false;
        this.preparingDash = false;
        this.canDash = true;
        this.visionRange = 150;
        this.canBeFreezed = true;
    }

    chasing(distance) {
        this.isChasing = true;
        if(distance > this.dashRange && this.canDash) this.doDash();
        else if(!this.isDashing) this.scene.physics.moveToObject(this, this.target, this.speed);

        // Pausamos el movimiento aleatorio
        if(this.movEvent) this.movEvent.paused = true;
    }

    notChasing() {
        this.isChasing = false;
        if (this.movEvent) this.movEvent.paused = false;
    }

    doDash() {
        this.isDashing = true;
        this.canDash = false;
        this.setVelocity(0, 0);

        const prepareTime = 200;
        this.preparingDash = true;

        this.scene.time.delayedCall(prepareTime, () => {
            this.preparingDash = false;
            this.speed = ENEMY.SLIME.SPEED.DASH;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
            this.scene.physics.velocityFromRotation(angle, ENEMY.SLIME.SPEED.DASH, this.body.velocity);

            const dashDur = 400;

            this.scene.time.delayedCall(dashDur, () => {
                this.isDashing = false;
                this.speed = ENEMY.SLIME.SPEED.NORMAL;
                this.setVelocity(0,0);
                this.scene.time.delayedCall(ENEMY.SLIME.DASH_COOLDOWN, () => this.canDash = true );
            });
        });

    }

    updateAnimation() {
        const vX = this.body.velocity.x;
        const vY = this.body.velocity.y;

        if(!this.knocked) {
            if(Math.abs(vX) > Math.abs(vY)) {
                this.lastDir = 'side';
                this.flipX = vX < 0;
            }
            else if(vY > 0) this.lastDir = 'front';
            else if(vY < 0) this.lastDir = 'back';
        }

        let anim;
        if(this.preparingDash) anim = 'slime-prdash-' + this.lastDir ;
        else if(this.freezed) anim = 'slime-idle-' + this.lastDir;
        else anim = 'slime-walk-' + this.lastDir;

        this.play(anim,true);
    }
}