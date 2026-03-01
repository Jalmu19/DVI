import Boot from './boot.js';
import End from './end.js';
import Level from './level.js';
import Phaser from 'phaser';
import Entrada_mazmorra from './entrada_mazmorra.js';
import Bosque from './bosque.js'
import Phaser from 'phaser';
import zBosque from './zonaBosque.js'
import GameOver from './game-over.js';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 180,
    parent: 'juego',
    scale: {
        mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [Boot, Entrada_mazmorra, Level, End],
    //scene: [Boot,Bosque,zBosque, Level, End, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 400 },
            debug: false
        }
    }
};

new Phaser.Game(config);
