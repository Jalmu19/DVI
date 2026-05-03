import Phaser from 'phaser';
import Staff from '../items/staffs-wands/staff';
import Health from '../health';
import Shoots from '../spells/shoots';
import FreezingShoot from '../spells/freezingShoot';
import Shield from '../spells/shield';
import Shoot from '../spells/shoot';
import Inventory from '../../inventory';
import { PLAYER, SPELLS } from '../../constants';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y, stats = null) {
        super(scene, x, y, 'player');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Cambiar hitbox para chocar con el entorno
        this.body.setSize(14, 15).setOffset(8, 13);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        // Añadimos una "hitbox" para el daño que recibe
        this.hurtbox = this.scene.add.zone(this.x,this.y, 14, 20);
        this.scene.physics.add.existing(this.hurtbox);
        // Hacemos que el cuerpo del hurtbox sea un sensor (no choca, solo detecta)
        this.hurtbox.body.setAllowGravity(false);

        this.speed = PLAYER.SPEED;
        this.health = new Health(scene);
        this.weapon = new Staff(scene, this);
        this.invincible = false;
        this.knocked = false;
        // Variable para saber que direccion de sprite parado poner cuando no se toque tecla
        this.lastDir = 'front';
        // Para comprobar si anteriormente se ha habierto el menu de hechizos. Así en cada preUpdate no mandara el evento de cerrar el menu
        this.menuOpened = false;
        this.inventoryOpened = false;
        this.actualObj = null;
        this.inDialog = false; // Para impedir su movimiento si esta en dialogo
        this.openingChest = false;
        this.displayedItem = null // El item que muestra cuando coge de un cofre
        this.pushing = false;

        this.mapOfSpells = [];
        this.protected = false;
        if(stats) {
            this.lastDir = stats.lastDir;
            this.protected = stats.protected;
            this.health.setStats(stats.health);
            console.log(stats.actualSpell);
            stats.mapOfSpells.forEach(key => {
                this.añadirHechizo(key, false);
            })
            this.actualSpell = this.mapOfSpells[stats.actualSpell];
        }
        else {
            this.añadirHechizo(SPELLS.SHOOT.KEY);
            this.añadirHechizo(SPELLS.FREEZE_SHOOT.KEY);
            this.actualSpell = this.mapOfSpells[SPELLS.SHOOT.KEY];
        }

        this.onSpellChange = (data) => { this.changeSpell(data) };
        this.scene.game.events.on('spell-changed', this.onSpellChange);

        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            interact: Phaser.Input.Keyboard.KeyCodes.E,
            spellMenu: Phaser.Input.Keyboard.KeyCodes.TAB,
            inventoryMenu: Phaser.Input.Keyboard.KeyCodes.F
        });

        this.on('destroy', () => {
            this.scene.game.events.off('spell-changed', this.onSpellChange);
        });

        scene.game.events.on('healPlayer', (puntos) => {        //Evento para recuperar vida si toma item curativo
            this.health.increaseHealth(puntos);
            console.log("El jugador se curó");
        });
    }

    /**
     * Metodo que añade un hechizo al personaje
     * @param {String} spell El key del hechizo que se añade
     */
    añadirHechizo(spell, emit = true) {
        let aux;
        if (spell !== 'shield') {
            if(spell === 'shoot')
                aux = new Shoots(this.scene.physics.world, this.scene, { classType: Shoot, key: spell });
            else 
                aux = new Shoots(this.scene.physics.world, this.scene, { classType: FreezingShoot, key: spell });
        }
        else aux = new Shield(this.scene, 0, 0, this);
        this.scene.events.emit('to-set-up-colliders', aux);
        aux.emitUi();
        this.mapOfSpells[spell] = aux;
        if (emit) this.scene.game.events.emit('spell-gained', spell);
    }

    /**
     * Cambia el hechizo actual
     * @param {String} spell El key del hechizo que al que se cambia
     */
    changeSpell(spell) {
        if (spell !== this.actualSpell.key) {
            let aux = this.mapOfSpells[spell];
            this.actualSpell = aux;
            this.actualSpell.emitUi();
        }
    }

    /**
     * Devuelve el hechizo actual
     */
    getHechizo() { return this.actualSpell; }

    /**
     * Método que que dispara siempre y cuando se tenga un hechizo
     */
    lanzarHechizo(x, y, rotation) {
        if (this.actualSpell) {
            this.actualSpell.fire(x, y, rotation);
        }
    }

    acquireFromChest(item) {
        if(item.id !== 'health-container' && item.id !== SPELLS.SHOOT.KEY && item.id !== SPELLS.FREEZE_SHOOT.KEY && item.id !== SPELLS.SHIELD)Inventory.addItem(item.id, item.name, item.frame, item.quantity, item.texture);
        else {
            if(item.id === 'health-container') this.health.addContainer();
            else this.añadirHechizo(item.id);
        }
        this.play('chest-find');
        this.displayedItem = this.scene.add.image(this.x, this.y - 20, item.texture, item.frame);
        this.openingChest = true;
    }

    /**
     * Un enemigo ha dado al jugador, entonces en la clase de Health
     * se baja la vida acorde al dmg y se le dan unos i-frames
     * @param {number} dmg Daño que recibe el jugador
     * @param {number} enemyX Coordenada X del enemigo que daña al jugador
     * @param {number} enemyY Coordenada Y del enemigo que daña al jugador
     */
    takeDamage(dmg, enemyX, enemyY) {
        if (!this.invincible) {
            this.health.reduceHealth(dmg);
            if (!this.health.isDead()) {
                this.invincible = true;
                this.setTint(0x1abc9c);
                this.knockBack(enemyX, enemyY);
                this.scene.time.addEvent({
                    delay: 300,
                    callback: () => {
                        this.invincible = false;
                        this.clearTint();
                    }
                })
            }
            else {
                this.scene.dies();
            }
        }
    }

    /**
     * Método que mueve al personaje cuando le dan
     */
    knockBack(enemyX, enemyY) {
        // Calcula el angulo entre el jugador y el enemigo
        const angle = Phaser.Math.Angle.Between(enemyX, enemyY, this.x, this.y);
        // Convierte de angulo a coordenadas cartesianas
        this.body.velocity.setToPolar(angle, 200);

        this.knocked = true;
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.knocked = false;
            }
        })
    }

    updateHurtBox() {
        this.hurtbox.body.setVelocity(this.body.velocity.x, this.body.velocity.y);
        this.hurtbox.x = this.x - 1;
        this.hurtbox.y = this.y + 2;
    }

    /**
     * Métodos preUpdate de Phaser.
     * Se encarga del movimiento del jugador, de animar el sprite, y de abrir el menú de hechizos
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        this.updateHurtBox();
        if (!this.knocked) {
            this.body.setVelocity(0);

            // Comprueba si se abre el menu de hechizos
            if (this.cursors.spellMenu.isDown) {
                this.scene.game.events.emit('open-menu');
                this.scene.slowTime();
                this.menuOpened = true;
            }

            // Cierrra el menu de hechizos solo si anteriormente se ha abierto
            if (!this.cursors.spellMenu.isDown && this.menuOpened) {
                this.scene.game.events.emit('close-menu');
                this.scene.resetTime();
                this.menuOpened = false;
            }

            let anim;
            let vY = 0;
            let vX = 0;
            
            if(!this.inDialog) {
                if (this.cursors.up.isDown) {
                    vY = -this.speed;
                    if(!this.pushing) anim = 'walk-back';
                    else anim = 'idle-push-back';
                    this.lastDir = 'back';
                }
                if (this.cursors.down.isDown) {
                    vY = this.speed;
                    if(!this.pushing) anim = 'walk-front';
                    else anim = 'idle-push-front';
                    this.lastDir = 'front';
                }
                if (this.cursors.left.isDown) {
                    vX = -this.speed;
                    if(!this.pushing) anim = 'walk-lside';
                    else anim = 'idle-push-lside';
                    this.lastDir = 'lside';
                }
                if (this.cursors.right.isDown) {
                    vX = this.speed;
                    if(!this.pushing) anim = 'walk-rside';
                    else anim = 'idle-push-rside';
                    this.lastDir = 'rside';
                }

                // Normaliza para que no se mueva más rapido cuando va en diagonal
                if (vX !== 0 && vY !== 0) {
                    // Math.SQRT1_2 es aproximadamente 0.707
                    vX *= Math.SQRT1_2;
                    vY *= Math.SQRT1_2;
                }
    
                this.body.setVelocity(vX, vY);
            }

            if(!this.openingChest) {
                if (vX === 0 && vY === 0) {
                    let idle = 'idle-' + this.lastDir;
                    this.play(idle, true);
                }
                else this.play(anim, true);
            }
        

            if (Phaser.Input.Keyboard.JustDown(this.cursors.inventoryMenu)) {
                this.scene.game.events.emit('inventoryMenu', this.scene);
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.interact)) {
                this.actualObj = this.scene.interactWithInteractuable(this, 20);
                this.emit('Interaccion');
                console.log('e');
            }

            if(this.actualObj) {
                this.actualObj.interact(this);
                if (!this.cursors.interact.isDown) {
                    this.actualObj = null;
                }
            }

            this.pushing = false;
        }
    }

    getPlayer(target) {
        return target.set(this.x, this.y);
    }

    getStats() {
        return {
            mapOfSpells : Object.keys(this.mapOfSpells),
            actualSpell : this.actualSpell.key,
            lastDir : this.lastDir,
            protected : this.protected,
            health : this.health.getStats()
        }
    }

    setProtection() { this.protected = true; }
    removeProtection() { this.protected = false; }
    isProtected() { return this.protected; }

    ralentiza(){
        if (this.speed == PLAYER.SPEED) { 
            this.speed -= 60;
            this.setTint(0x82ccdd);
        }

    this.scene.time.delayedCall(2000, () => {
        if (this.active) {
            this.speed = PLAYER.SPEED;
            this.clearTint();
        }
    });
    }
}