import Phaser from 'phaser'


import villa from './assets/villa1.png'
import casa from './assets/casaAzul.png'
import cNaranj from './assets/casaNaranja.png'
import cGrande from './assets/casaGrande.png'
import pozo from './assets/pozo.png'
import arbol from './assets/arbol.png'
import flor from './assets/florAmarilla.png'
import player from './assets/kirbo.png'

import mapa from './assets/mapaVilla.json'

/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
    //this.load.setPath('assets/sprites/');
    this.load.image('casa', casa);
    this.load.image('plantilla', villa);
    this.load.image('naranja', cNaranj);
    this.load.image('grande', cGrande);
    this.load.image('arbol', arbol);
    this.load.image('pozo', pozo);
    this.load.image('flor', flor);

    this.load.tilemapTiledJSON('puebloIni', mapa);
    this.load.image('player', player);

   
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
    create() {    
      this.scene.start('bosque');
    }
}