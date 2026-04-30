export default class Slime extends BaseEnemy {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.body.setSize(2, 16).setOffset(5, 7);
        this.speed = ENEMY.SLIME.SPEED.NORMAL;
        this.dashRange = 60;
        this.isDashing = false;
        this.canDash = true;
        this.visionRange = 150;
    }

    chasing(distance) {
        this.isDashing = true;
        if(distance > this.dashRange && this.canDash) this.doDash();
        else this.scene.physics.moveToObject(this, this.target, this.speed);

        // Pausamos el movimiento aleatorio
        if(this.movEvent) this.movEvent.paused = true;
    }

    notChasing() {
        super.notChasing();
        if (this.movEvent) this.movEvent.paused = false;
    }

    doDash() {
        this.isDashing = true;
        this.setVelocity(0, 0);

        const prepareTime = 200;

        this.scene.time.delayedCall(prepareTime, () => {
            //TODO ANIMACION DE DASH 
            this.speed = ENEMY.SLIME.SPEED.DASH;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
            this.scene.physics.velocityFromRotation(angle, this.dashSpeed, this.body.velocity);

            const dashDur = 400;

            this.scene.time.delayedCall(dashDur, () => {
                this.isDashing = false;
                this.scene.time.delayedCall(ENEMY.SLIME.DASH_COOLDOWN, () => this.canDash = true );
            });
        });

    }
}