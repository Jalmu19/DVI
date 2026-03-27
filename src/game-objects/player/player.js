import Phaser from 'phaser';
import Staff from '../items/staffs-wands/staff';
import Health from '../health';
import Shoots from '../spells/shoots';
import FreezingShoot from '../spells/freezingShoot';
import Shield from '../spells/shield';
import Shoot from '../spells/shoot';
import { PLAYER } from '../../constants';

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
    constructor(scene, x, y, mapOfSpells, protec, lastDir, actualHealth) {
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
        //this.shoots = new Shoots(this.scene.physics.world, this.scene, { classType: Shoot, key: 'shoot', speed: 200 });
        //this.shoots.createMultiple({key: 'shoot', quantity: 10, active: false, visible: false});
        //this.shoots = new Shoots(this.scene.physics.world, this.scene, { classType: FreezingShoot, key: 'shoot', speed: 150 });
        //this.shoots.createMultiple({key: 'shoot', quantity: 10, active: false, visible: false});
        //this.actualSpell = this.shoots;
        this.mapOfSpells = [];
        this.añadirHechizo('shoot');
        this.actualSpell = new Shield(this.scene, x, y, this);
        this.protected = false;

        this.mapOfSpells = mapOfSpells;
        this.protected = protec;
        this.lastDir = lastDir;
        this.health.actualHealth = actualHealth;

        this.scene.game.events.on('spell-changed', (data) => { this.changeSpell(data) });

        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            interact: Phaser.Input.Keyboard.KeyCodes.E,
            spellMenu: Phaser.Input.Keyboard.KeyCodes.TAB,
            inventoryMenu: Phaser.Input.Keyboard.KeyCodes.F
        });
    }

    /**
     * Metodo que añade un hechizo al personaje
     * @param {String} spell El key del hechizo que se añade
     */
    añadirHechizo(spell) {
        let aux;
        if (spell !== 'shield') aux = new Shoots(this.scene.physics.world, this.scene, { classType: Shoot, key: spell });
        else aux = new Shield(this.scene, x, y, this);
        this.mapOfSpells[spell] = aux;
        this.scene.game.events.emit('spell-gained', spell);
    }

    /**
     * Cambia el hechizo actual
     * @param {String} spell El key del hechizo que al que se cambia
     */
    changeSpell(spell) {
        if (spell !== this.actualSpell.key) {
            let aux = this.mapOfSpells[spell];
            if (spell !== 'shield') aux.createMultiple({ key: 'shoot', quantity: 10, active: false, visible: false });
            this.actualSpell = aux;
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

            if (this.cursors.up.isDown) {
                vY = -this.speed;
                anim = 'walk-back';
                this.lastDir = 'back';
            }
            if (this.cursors.down.isDown) {
                vY = this.speed;
                anim = 'walk-front';
                this.lastDir = 'front';
            }
            if (this.cursors.left.isDown) {
                vX = -this.speed;
                anim = 'walk-lside';
                this.lastDir = 'lside';
            }
            if (this.cursors.right.isDown) {
                vX = this.speed;
                anim = 'walk-rside';
                this.lastDir = 'rside';
            }

            this.body.setVelocity(vX, vY);

            if (vX === 0 && vY === 0) {
                let idle = 'idle-' + this.lastDir;
                this.play(idle, true);
            }
            else this.play(anim, true);

            if (Phaser.Input.Keyboard.JustDown(this.cursors.inventoryMenu)) {
                this.scene.game.events.emit('inventoryMenu', this.scene);
            }
        }
    }

    getPlayer(target) {
        return target.set(this.x, this.y);
    }

    setProtection() { this.protected = true; }
    removeProtection() { this.protected = false; }
    isProtected() { return this.protected; }
}