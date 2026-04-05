import Boot from './scenes/boot.js';
import Phaser from 'phaser';
import Entrada_mazmorra from './scenes/entrada_mazmorra.js';
import Bosque from './scenes/bosque.js';
import MazmorraInicial from './scenes/mazmorra_inicial.js'
import Mazmorra from './scenes/mazmorra.js'
import HabitacionCofre from './scenes/habitacion_cofre.js'
import HabitacionBoss from './scenes/habitacion_boss.js';
import zBosque from './scenes/zonaBosque.js';
import GameOver from './scenes/game-over.js';
import MainMenu from './mainMenu.js';
import UIScene from './ui/ui-scene.js'
import dialogoLadron from './ui/dialogoLadron.js';
import InventoryScene from './ui/inventoryScene.js'
import IntroStoryScene from './introStoryScene.js'
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
    scene: [Boot, IntroStoryScene, /*MainMenu*/,dialogoLadron, Bosque,zBosque, Entrada_mazmorra, MazmorraInicial, Mazmorra, HabitacionCofre, HabitacionBoss, GameOver, UIScene, InventoryScene ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    render: {
        roundPixels: true // Evita que los elementos se dibujen en "medios píxeles"
    }
};

new Phaser.Game(config);
