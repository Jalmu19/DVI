import Phaser from 'phaser';
import BaseNpc from './baseNpc';


/**
 * Clase que representa el ladron del inicio del juego. El ladron unicamente le roba al jugador y salta un diálogo entre ellos
 */
export default class Ladron extends BaseNpc {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'kirbo');

        this.body.setSize(14, 15);
        this.name = "Ladron"
        this.setScale(1.5,1.5);
        this.setPosition(390, 178);
        this.texto = [{text : "Hola"},{text : "Pepsi cola"},{text : "caracola"}];

    }
}