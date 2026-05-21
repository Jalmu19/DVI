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
        this.body.setSize(45, 52).setOffset(11, 12);

        this.weakSpot = scene.add.zone(x, y, 12, 10);
        scene.physics.add.existing(this.weakSpot);

        this.knockVel = ENEMY.BOSS.KNOCKBACKVEL;

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

        this.play('front-idle');
        
        this.dieSound = 'muereBossSound';
    }

    getCollisionTarget() {
        return this.weakSpot ? this.weakSpot : null;
    }

    knockBack(proyX, proyY) {
        if(this.state !== "CHARGE") super.knockBack(proyX,proyY);
    }

    movement() {
        if (!this.active || !this.scene) return;

        if(this.knocked) this.scene.time.delayedCall(100, this.movement);

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
        if (!this.active || !this.scene) return;
        let nextDecisionDelay = Phaser.Math.Between(1000, 2000);

        if (this.state === 'WANDER') {
            this.speed = ENEMY.BOSS.SPEED;
            this.setRandomVelocity(); // Tu lógica actual
        }
        else if (this.state === 'CHARGE') {
            // Aviso de carga
            this.setVelocity(0, 0);
            this.setTint(0xffaa00);

            const prepareTime = 600;
            const chargeDuration = 1000;

            this.scene.time.delayedCall(prepareTime, () => {
                this.clearTint();
                this.speed = ENEMY.BOSS.SPEED * 2; // Velocidad de ataque
                this.scene.physics.moveToObject(this, this.scene.player, this.speed);
                this.scene.sound.add('embestidaSound').play();
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

    updateAnimation() {
        const vX = this.body.velocity.x;
        const vY = this.body.velocity.y;
        let currentConfig = ENEMY.BOSS.FIRST.HITBOX.front;

        if(this.knocked) {
            this.play(this.lastDir + '-idle');
        }
        // Prioridad: Animación lateral
        else if (Math.abs(vX) > Math.abs(vY)) {
            this.play('boss1-side-walk', true);
            this.lastDir = 'side';
            this.flipX = vX < 0;
            if(this.flipX) this.weakSpot.x = this.x - ENEMY.BOSS.FIRST.HITBOX.side.weak.offsetX;
            else this.weakSpot.x = this.x + ENEMY.BOSS.FIRST.HITBOX.side.weak.offsetX;
            this.weakSpot.y = this.y + ENEMY.BOSS.FIRST.HITBOX.side.weak.offsetY;
            currentConfig = ENEMY.BOSS.FIRST.HITBOX.side;
        }
        // Animación vertical
        else if (vY > 0) {
            this.play('boss1-front-walk', true);
            this.lastDir = 'front';
            this.weakSpot.x = this.x + ENEMY.BOSS.FIRST.HITBOX.front.weak.offsetX;
            this.weakSpot.y = this.y + ENEMY.BOSS.FIRST.HITBOX.front.weak.offsetY;
            currentConfig = ENEMY.BOSS.FIRST.HITBOX.front;
        } else if (vY < 0) {
            this.play('boss1-back-walk', true);
            this.lastDir = 'back';
            this.weakSpot.x = this.x + ENEMY.BOSS.FIRST.HITBOX.back.weak.offsetX;
            this.weakSpot.y = this.y + ENEMY.BOSS.FIRST.HITBOX.back.weak.offsetY;
            currentConfig = ENEMY.BOSS.FIRST.HITBOX.back;
        }
        // Si está quieto
        else {
            // Intentar determinar qué idle poner según el último movimiento
            if (this.anims.currentAnim) {
                const lastKey = this.anims.currentAnim.key;
                if (lastKey.includes('side')) this.play('side-idle', true);
                else if (lastKey.includes('back')) this.play('back-idle', true);
                else this.play('front-idle', true);
            }
        }

        /*
        // Lógica de ROTACIÓN (Inclinación dinámica)
        if (this.body.velocity.length() > 0) {
            // Calculamos cuánto inclinarlo. Por ejemplo, un máximo de 15 grados (0.26 radianes)
            // Si vX es positivo, inclina a la derecha, si es negativo, a la izquierda.
            const targetAngle = vX * 0.002; // Ajusta el 0.002 para más o menos inclinación

            // Suavizamos la rotación para que no sea brusca
            this.rotation = Phaser.Math.Interpolation.Linear([this.rotation, targetAngle], 0.1);
        } else {
            // Volver a posición vertical si se detiene
            this.rotation = Phaser.Math.Interpolation.Linear([this.rotation, 0], 0.1);
        }
        */

        this.applyDynamicHitbox(currentConfig);
    }

    applyDynamicHitbox(config) {
        const { width, height, offsetX, offsetY } = config.normal;
        
        // Ajuste para el flipX:
        // Si el sprite está volteado, el offset horizontal debe invertirse
        let finalOffsetX = offsetX;
        if (this.flipX) {
            // Fórmula: AnchoTotalSprite - AnchoHitbox - OffsetOriginal
            finalOffsetX = this.width - width - offsetX;
        }
    
        // Solo aplicar si el tamaño ha cambiado para ahorrar rendimiento
        if (this.body.width !== width || this.body.height !== height || this.body.offset.x !== finalOffsetX) {
            this.body.setSize(width, height);
            this.body.setOffset(finalOffsetX, offsetY);
        }
    }

    preUpdate(t, dt) {
        Phaser.Physics.Arcade.Sprite.prototype.preUpdate.call(this, t, dt);
        if (this.scene.physics.overlap(this.scene.player.hurtbox, this)) {
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);
        }

        this.updateAnimation();
    }
}