import BaseEnemy from "./baseEnemy";
import { ENEMY } from "../../constants";

export default class FirstDungeonBoss extends BaseEnemy {

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.speed = ENEMY.BOSS.SPEED;
        this.dmgGiven = 1;
        this.health = ENEMY.BOSS.HEALTH;
        this.state = 'STILL';
        this.isBoss = true;
        this.body.setSize(45, 45).setOffset(11, 12);

        this.weakSpot = scene.add.zone(x, y, 13, 15);
        scene.physics.add.existing(this.weakSpot);

        this.dmgRecieved = 5;

        //NO PERSIGUE AL JUGADOR
        this.isChasing = false;
        this.visionRange = 0;

        this.setBounce(1);

        if (this.scene.player && this.scene.player.mapOfSpells) {
            Object.values(this.scene.player.mapOfSpells).forEach(group => {
                if (group instanceof Phaser.Physics.Arcade.Group) {
                    this.setupCollisions(group);
                }
            });
        }
    }

    getCollisionTarget() {
        return this.weakSpot ? this.weakSpot : null;
    }

    movement() {
        if (!this.active || !this.scene) return;

        const r = Phaser.Math.Between(0, 10);

        if (r < 6) {
            this.state = 'WANDER';
        } else if (r < 9) {
            this.state = 'CHARGE';
        } else {
            this.state = 'STILL';
        }

        this.applyStateBehavior();
    }

    applyStateBehavior() {
        let nextDecisionDelay = Phaser.Math.Between(1000, 2000);

        if (this.state === 'WANDER') {
            this.speed = ENEMY.BOSS.SPEED;
            this.setRandomVelocity(); // Tu lógica actual
        }
        else if (this.state === 'CHARGE') {
            // 1. Se detiene y parpadea (Aviso/Telegraph)
            this.setVelocity(0, 0);
            this.setTint(0xffaa00);

            const prepareTime = 600;
            const chargeDuration = 1000;

            this.scene.time.delayedCall(prepareTime, () => {
                this.clearTint();
                this.speed = ENEMY.BOSS.SPEED * 2; // Velocidad de ataque
                this.scene.physics.moveToObject(this, this.scene.player, this.speed);
            });

            nextDecisionDelay = prepareTime + chargeDuration;
        }
        else if (this.state === 'STILL') this.setVelocity(0, 0);

        this.movEvent = this.scene.time.addEvent({
            delay: nextDecisionDelay,
            callback: this.movement,
            callbackScope: this
        });
    }

    setRandomVelocity() {
        const bounds = this.scene.physics.world.bounds;
        const margin = 100; // Distancia al borde para considerar que "está cerca"

        let dirX = Phaser.Math.Between(-1, 1);
        let dirY = Phaser.Math.Between(-1, 1);

        // Si está cerca del borde IZQUIERDO, obligamos a ir a la DERECHA
        if (this.x < bounds.x + margin) dirX = 1;
        // Si está cerca del borde DERECHO, obligamos a ir a la IZQUIERDA
        else if (this.x > bounds.right - margin) dirX = -1;

        // Si está cerca del borde SUPERIOR, obligamos a ir ABAJO
        if (this.y < bounds.y + margin) dirY = 1;
        // Si está cerca del borde INFERIOR, obligamos a ir ARRIBA
        else if (this.y > bounds.bottom - margin) dirY = -1;

        this.setVelocity(dirX * this.speed, dirY * this.speed);
    }

    preUpdate(t, dt) {
        Phaser.Physics.Arcade.Sprite.prototype.preUpdate.call(this, t, dt);
        if (this.scene.physics.overlap(this.scene.player.hurtbox, this)) {
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);
        }

        this.weakSpot.x = this.x + 5;
        this.weakSpot.y = this.y - 12;
    }
}