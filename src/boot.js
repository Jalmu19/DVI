import Phaser from 'phaser'


//import villa from '../assets/sprites/villa1.png'
//import mapa from '../assets/sprites/mapaVilla.json'
import entrada_mazmorra from '../assets/sprites/entrada-mazmorra-bosque.json'

import casa from '../assets/sprites/casaAzul.png'
import arbol from '../assets/sprites/arbol.png'
import flor from '../assets/sprites/florAmarilla.png'
import cNaranja from '../assets/sprites/casaNaranja.png'
import cGrande from '../assets/sprites/casaGrande.png'
import pozo from '../assets/sprites/pozo.png'

import player from '../assets/sprites/player.png'
import palo from '../assets/sprites/palo.png'
import shoot from '../assets/sprites/shoot.png'
import spike from '../assets/sprites/spikes-placeholder.png'

import cesped from '../assets/sprites/cesped.png'
import plataforma_cesped from '../assets/sprites/plataforma_cesped.png'
import puente from '../assets/sprites/puente.png'
import seta from '../assets/sprites/seta.png'
import florAmarilla from '../assets/sprites/florAmarilla.png'
import tierra from '../assets/sprites/tierra.png'
import piedras_tierra from '../assets/sprites/piedras_tierra.png'
import escaleras from '../assets/sprites/escaleras.png'
import pared_mazmorra from '../assets/sprites/pared_mazmorra.png'
import puerta_mazmorra from '../assets/sprites/dungeon.png'
import arbusto from '../assets/sprites/arbusto.png'



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
    /*this.load.image('platform', platform);
    this.load.image('base', base);
    this.load.image('star', star);*/


      this.load.image('player', player);
      /*this.load.image('palo', palo);
      this.load.image('shoot', shoot);
      this.load.image('spike',spike);*/

   /* this.load.image('plantilla', villa);
    this.load.tilemapTiledJSON('mapa', mapa);
    this.load.image('casa', casa);
    this.load.image('arbol', arbol);
    this.load.image('flor', flor);
    this.load.image('naranja', cNaranja);
    this.load.image('grande', cGrande);
    this.load.image('pozo', pozo);*/

    this.load.tilemapTiledJSON('entrada-mazmorra-bosque', entrada_mazmorra)
    this.load.image('cesped', cesped);
    this.load.image('plataforma_cesped', plataforma_cesped);
    this.load.image('arbol', arbol);
    this.load.image('puente', puente);
    this.load.image('seta', seta);
    this.load.image('florAmarilla', florAmarilla);
    this.load.image('tierra', tierra);
    this.load.image('piedras_tierra', piedras_tierra);
    this.load.image('escaleras', escaleras);
    this.load.image('pared_mazmorra', pared_mazmorra);
    this.load.image('puerta_mazmorra', puerta_mazmorra);    
    this.load.image('arbusto', arbusto);
  
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('entrada_mazmorra');
  }
}