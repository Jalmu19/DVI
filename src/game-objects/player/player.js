import Phaser from 'phaser';
import Staff from '../items/staffs-wands/staff';
import Health from '../health';
import Shoots from '../spells/shoots';

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
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.score = 0;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        //cambiar hitbox
        this.body.setSize(14, 20).setOffset(9, 8);
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        this.speed = 100;
        this.health = new Health(scene);
        this.weapon = new Staff(scene, this);
        this.invincible = false;
        this.knocked = false;
        // Variable para saber que direccion de sprite parado poner cuando no se toque tecla
        this.lastDir = 'front';

        this.shoots = new Shoots(this.scene.physics.world, this.scene, { key: 'shoot', speed: 200 });
        this.shoots.createMultiple({key: 'shoot', quantity: 10, active: false, visible: false});
        this.actual_enchantment = this.shoots;

        //this.actual_enchantment = null;
        /*this.scene.input.on('pointerdown', (pointer) => { 
            if(pointer.rightButtonDown() && pointer.leftButtonDown()) 
                this.lanzarHechizo(this.x, this.y, this.weapon.rotation);
        });*/

        // Esta label es la UI en la que pondremos la puntuación del jugador
        this.label = this.scene.add.text(10, 10, "", { fontSize: 20 });

        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            interact: Phaser.Input.Keyboard.KeyCodes.E
        });
        this.updateScore();
    }

    lanzarHechizo(x, y, rotation) {
        if (this.actual_enchantment) {
            this.actual_enchantment.fire(x, y, rotation);
        }
    }

    /**
     * El jugador ha recogido una estrella por lo que este método añade un punto y
     * actualiza la UI con la puntuación actual.
     */
    point() {
        this.score++;
        this.updateScore();
    }

    /**
     * Un enemigo ha dado al jugador, entonces en la clase de Health
     * se baja la vida acorde al dmg y se le dan unos i-frames
     */
    takeDamage(dmg, enemyX, enemyY) {
        if (!this.invincible) {
            this.health.reduceHealth(dmg);
            if (!this.health.isDead()) {
                this.invincible = true;
                this.setTint(0x1abc9c);
                this.knockBack(enemyX, enemyY);
                this.scene.time.addEvent({
                    delay: 500,
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
     * Funcion que mueve al personaje cuando le dan
     */
    knockBack(enemyX, enemyY) {
        this.setVelocityX((this.x > enemyX ? 1 : -1) * 200);
        this.setVelocityY((this.Y > enemyY ? 1 : -1) * 200);

        this.knocked = true;
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.knocked = false;
            }
        })
    }

    /**
     * Actualiza la UI con la puntuación actual
     */
    updateScore() {
        this.label.text = 'Score: ' + this.score;
    }

    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (!this.knocked) {
            this.body.setVelocity(0);

            let anim;
            let vY = 0;
            let vX = 0;

            if (this.cursors.up.isDown){
                vY = -this.speed;
                anim = 'walk-back';
                this.lastDir = 'back';
            }
            if (this.cursors.down.isDown) {
                vY = this.speed;
                anim = 'walk-front';
                this.lastDir = 'front';
            }
            if (this.cursors.left.isDown){
                vX = -this.speed;
                anim = 'walk-lside';
                this.lastDir = 'lside';
            }
            if (this.cursors.right.isDown) {
                vX = this.speed;
                anim = 'walk-rside';
                this.lastDir = 'rside';
            }

            this.body.setVelocity(vX,vY);
            
            if(vX === 0 && vY === 0) {
                let idle = 'idle-' + this.lastDir;
                this.play(idle,true);
            }
            else this.play(anim,true);
        }
    }

}
