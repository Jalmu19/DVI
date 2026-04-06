import Phaser from 'phaser';


/**
 * Clase que representa el ladron del inicio del juego. El ladron unicamente le roba al jugador y salta un diálogo entre ellos
 */
export default class BaseNpc extends Phaser.Physics.Arcade.Sprite {

    constructor(x,y,scene,sprite){
        super(x, y, scene, sprite);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

}