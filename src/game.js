import Boot from './scenes/boot.js';
import Phaser from 'phaser';
import Entrada_mazmorra from './scenes/entrada_mazmorra.js';
import Bosque from './scenes/bosque.js';
import MazmorraInicial from './scenes/mazmorra_inicial.js'
import Mazmorra from './scenes/mazmorra.js'
import HabitacionCofre from './scenes/habitacion_cofre.js'
import HabitacionBoss from './scenes/habitacion_boss.js';
import zBosque from './scenes/zonaBosque.js';
import zonaLago from './scenes/zonaLago.js'
import Laberinto from './scenes/laberinto.js';
import LaberintoFinal from './scenes/laberinto_final.js';
import EntradaCueva from './scenes/entrada_cueva.js';
import Cueva from './scenes/cueva.js';
import GameOver from './scenes/game-over.js';
import MainMenu from './mainMenu.js';
import UIScene from './ui/ui-scene.js';
import InventoryScene from './ui/inventoryScene.js'
import IntroStoryScene from './introStoryScene.js'
import InteriorScene from './scenes/InteriorScene.js';
import Entrada_ciudad from './scenes/entrada_ciudad.js';
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
        mode: Phaser.Scale.FIT
    },
    pixelArt: true,
    scene: [Boot, MainMenu, IntroStoryScene, Bosque,zBosque,zonaLago, Entrada_mazmorra, MazmorraInicial, Mazmorra, HabitacionCofre, HabitacionBoss,
        Entrada_ciudad,Laberinto, LaberintoFinal, EntradaCueva, Cueva, GameOver, InteriorScene, UIScene, InventoryScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

new Phaser.Game(config);
