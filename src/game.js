import Boot from './boot.js';
import End from './end.js';
import Level from './level.js';
import Bosque from './bosque.js'
import Phaser from 'phaser';
import zBosque from './zonaBosque.js'

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    parent: 'juego',
    scale: {
        //mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [Boot,Bosque,zBosque, Level, End],
    physics: {
        default: 'arcade',
        arcade: {
<<<<<<< HEAD
            //gravity: { y: 400 },
=======
>>>>>>> 39eb570badf4ab83a7cf397197de0c50dbe85aa4
            debug: false
        }
    }
};

new Phaser.Game(config);
