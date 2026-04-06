import Phaser from 'phaser';


/**
 * Clase que representa el ladron del inicio del juego. El ladron unicamente le roba al jugador y salta un diálogo entre ellos
 */
export default class Ladron extends Phaser.Physics.Arcade.Sprite {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'kirbo');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Cambiar hitbox para chocar con el entorno
        this.body.setSize(14, 15);
        this.setScale(1.5,1.5);
        this.setPosition(390, 178);

        /*this.on('destroy', () => {
            this.scene.game.events.off('spell-changed', this.onSpellChange);
        });

        scene.game.events.on('healPlayer', (puntos) => {        //Evento para recuperar vida si toma item curativo
            this.health.increaseHealth(puntos);
            console.log("El jugador se curó");
        });
        */
    }
}