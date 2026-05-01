import { ENEMY } from "../../constants";

export default class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, false);
        this.body.setCollideWorldBounds(true);          //para que no se salga de los limites
        this.speed = ENEMY.BASE_SPEED;
        this.dmgGiven = 0.5;
        this.health = ENEMY.BASE_HEALTH;
        this.invicible = false;
        this.knocked = false;
        this.knockVel = 100;
        this.lastDir = 'front'; // En base enemy de momento no se usa
        this.isBoss = false;

        this.offset = 1.5707963267948966;
        this.freezed = false;
        this.canBeFreezed = false;

        this.onNewSpell = (newGroup) => {
            if (newGroup instanceof Phaser.Physics.Arcade.Group) {
                this.setupCollisions(newGroup);
            }
        };

        this.scene.events.on('to-set-up-colliders', this.onNewSpell);

        //PERSIGUE AL JUGADOR
        this.isChasing = true;
        this.target = new Phaser.Math.Vector2();
        this.visionRange = 70;
        this.isRebounding = false;
        //Ejecuta una funcion cuando pase cierto tiempo
        this.movEvent = this.scene.time.addEvent({
            delay: Phaser.Math.Between(500, 1500),  //tiempo que espera (variado, entre 500-1500ms)
            callback: this.movement,                //funcion que llama cuando se acaba el tiempo
            callbackScope: this,                    //asegura que siga siendo la clase baseenemy
            loop: false,                            //se mueven todo el rato
        })

        // REVISAR ESTO
        if (this.scene.player && this.scene.player.mapOfSpells) {
            Object.values(this.scene.player.mapOfSpells).forEach(group => {
                if (group instanceof Phaser.Physics.Arcade.Group) {
                    this.setupCollisions(group);
                }
            });
        }

        this.on('destroy', () => {
            this.scene.events.off('to-set-up-colliders', this.onNewSpell);


            if (this.isBoss) {
                this.scene.events.emit('boss_dead');
                this.scene.registry.set('passedDungeons', this.scene.registry.get('passedDungeons') + 1);
            }
            if (this.movEvent) this.movEvent.destroy();
            if (this.weakSpot) this.weakSpot.destroy();
        });
    }

    movement() {
        this.setVelocity(0, 0);
        if (!this.freezed) {
            this.scene.time.delayedCall(200, () => {       //para que haga pausas mientras se mueve
                this.setRandomVelocity()

                this.movEvent = this.scene.time.addEvent({
                    delay: Phaser.Math.Between(500, 1500),
                    callback: this.movement,
                    callbackScope: this,
                    loop: false,
                })
            })
        }
    }

    setRandomVelocity() {
        const randomDirection = Phaser.Math.Between(0, 3);
        if (randomDirection === 0) this.setVelocity(0, -this.speed);
        else if (randomDirection === 1) this.setVelocity(0, this.speed);
        else if (randomDirection === 2) this.setVelocity(-this.speed, 0);
        else this.setVelocity(this.speed, 0);
    }

    takeDamage(spell) {
        if (!this.invicible) {
            this.health = this.health - spell.dmg;
            console.log("ENEMIGO HERIDO, HP: ", this.health);

            if (this.health <= 0) {
                this.destroy();
            }
            else {
                if (spell.isFreezer()) {
                    console.log("ENEMIGO CONGELADO");
                    this.setTint(0x00ffff);
                    this.freezed = true;
                    const oldSpeed = this.speed;
                    if (!this.canBeFreezed) this.speed *= 0.5;
                    this.scene.time.addEvent({
                        delay: 2000,
                        callback: () => {
                            this.clearTint();
                            this.freezed = false;
                            this.speed = oldSpeed;
                        }
                    })
                }
                else {
                    this.invicible = true;
                    this.setTint(0xff0000);
                    this.knockBack(spell.x, spell.y);
                    this.scene.time.addEvent({
                        delay: 500,
                        callback: () => {
                            this.invicible = false;
                            this.clearTint();
                        }
                    })
                }
            }
        }
    }

    /**
    * Método que mueve al enemigo cuando le dan
    */
    knockBack(proyX, proyY) {
        // Calcula el angulo entre el jugador y el enemigo
        const angle = Phaser.Math.Angle.Between(proyX, proyY, this.x, this.y);
        // Convierte de angulo a coordenadas cartesianas
        this.body.velocity.setToPolar(angle, this.knockVel);

        this.knocked = true;
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.knocked = false;
            }
        })
    }

    setupCollisions(spellRecieved) {
        const target = this.getCollisionTarget();

        // Si el target no existe o no tiene cuerpo físico todavía, abortamos
        if (!target || !spellRecieved) return;

        this.spellCollider = this.scene.physics.add.overlap(this.getCollisionTarget(), spellRecieved, (self, spell) => {
            this.handleSpellCollision(spell);
        });
    }

    getCollisionTarget() {
        return this;
    }

    handleSpellCollision(spell) {
        if (this.scene.player.isProtected()) {
            this.scene.player.getPlayer(this.target);
            const angle = Phaser.Math.Angle.Between(this.target.x, this.target.y, this.x, this.y);
            this.body.velocity.setToPolar(angle, 50);
            this.isRebounding = true;
            this.scene.time.delayedCall(500, () => {
                this.isRebounding = false;
            });
        }
        else {
            this.takeDamage(spell);
            spell.impact();
        }
    }

    chasing(distance) {
        this.isChasing = true;
        this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + this.offset;
    }

    notChasing() {
        this.isChasing = false;
        this.setVelocity(0, 0);
    }

    updateAnimation() { }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        //DAÑO AL JUGADOR
        if (this.scene.physics.overlap(this.scene.player.hurtbox, this))
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);

        if (!this.knocked) {
            if (!this.isRebounding) {
                if (!this.canBeFreezed || !this.freezed) {
                    this.scene.player.getPlayer(this.target);
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
                    if (distance < this.visionRange) this.chasing(distance);
                    else this.notChasing();
                }
                else if (this.canBeFreezed) this.setVelocity(0, 0);
            }
        }
        this.updateAnimation();
    }


}