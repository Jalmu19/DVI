import Phaser from 'phaser'

import villa from '../assets/sprites/villa1.png'
import mapa from '../assets/mapas/mapaVilla.json'

import casa from '../assets/sprites/casaAzul.png'
import arbol from '../assets/sprites/arbol.png'
import flor from '../assets/sprites/florAmarilla.png'
import cNaranja from '../assets/sprites/casaNaranja.png'
import cGrande from '../assets/sprites/casaGrande.png'
import pozo from '../assets/sprites/pozo.png'

import player from '../assets/sprites/player.png'
import playerjson from '../assets/sprites/player.json'
import palo from '../assets/sprites/palo.png'
import shoot from '../assets/sprites/basic-spell.png'
import spike from '../assets/sprites/spikes-placeholder.png'


export default class Inicio extends Phaser.Scene {

  constructor() {
    super({ key: 'inicio' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {  

    this.load.aseprite('player', player, playerjson);
    this.load.image('palo', palo);
    this.load.image('shoot', shoot);
    this.load.image('spike',spike);

    this.load.image('plantilla', villa);
    this.load.tilemapTiledJSON('mapa', mapa);
    this.load.image('casa', casa);
    this.load.image('arbol', arbol);
    this.load.image('flor', flor);
    this.load.image('naranja', cNaranja);
    this.load.image('grande', cGrande);
    this.load.image('pozo', pozo);


  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {

    const inicio = this.make.tilemap({ key: 'pantallaInicio' });
    const tileset = inicio.addTilesetImage('pantallaInicio');
    inicio.createLayer('pantallaInicio', tileset);

    const botonObj = mapa.getObjectLayer('botonPlay').objects[0];

    const botonPlay = this.add.rectangle(
        botonObj.x,
        botonObj.y,
        botonObj.width,
        botonObj.height,
        0x000000,
        0 // transparente
    ).setOrigin(0).setInteractive();

    botonPlay.on('pointerdown', () => {
        this.scene.start('bosque'); // Cambia a tu escena principal
    });

    botonPlay.on('pointerover', () => {
        botonPlay.setFillStyle(0xffffff, 0.2);
    });

    botonPlay.on('pointerout', () => {
        botonPlay.setFillStyle(0x000000, 0);
    });






    //this.anims.createFromAseprite('player');
  }

 /* cambiarScene(){
        this.scene.start('bosque');
    } */
}