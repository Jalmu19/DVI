import Phaser from "phaser";

/**
 * Escena de principal del juego. De esta heredan todas las demás
 */
export default class GameScene extends Phaser.Scene {
    dies() {
        this.scene.stop('ui');
        this.scene.start('game-over');
    }

    slowTime() {
        this.physics.world.timeScale = 15;
    }
    
    resetTime() {
        this.physics.world.timeScale = 1;
    }
}