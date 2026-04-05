import Phaser from 'phaser'

import background from '../../assets/sprites/background.jpg'
import villa from '../../assets/sprites/villa1.png'
import mapa from '../../assets/mapas/mapaVilla.json'

import casa from '../../assets/sprites/casaAzul.png'
import arbol from '../../assets/sprites/arbol.png'
import flor from '../../assets/sprites/florAmarilla.png'
import cNaranja from '../../assets/sprites/casaNaranja.png'
import cGrande from '../../assets/sprites/casaGrande.png'
import pozo from '../../assets/sprites/pozo.png'

import player from '../../assets/sprites/player.png'
import playerjson from '../../assets/sprites/player.json'
import health from '../../assets/sprites/health.png'
import palo from '../../assets/sprites/palo.png'
import shoot from '../../assets/sprites/basic-spell.png'
import grimorioBasico from '../../assets/sprites/grimorio-basico.png'
import grimorioShoot from '../../assets/sprites/grimorio-shoot.png'
import grimorioFrezShoot from '../../assets/sprites/grimorio-freezing_shoot.png'
import grimorioShield from '../../assets/sprites/grimorio-shield.png'
import spike from '../../assets/sprites/spikes-placeholder.png'
import fullscreen from '../../assets/sprites/fullscreen.png'

import shield from '../../assets/sprites/bandera_azul.png'

import chest from '../../assets/sprites/cofre_pequenyo.png'
import chestjson from '../../assets/sprites/cofre_pequenyo.json'
import berry from '../../assets/sprites/baya_curativa.png'
import musicaFondo from '../../assets/sounds/musicaFondo.mp3'
import musicaGameOver from '../../assets/sounds/game-over.mp3'
import musicaGetItem from '../../assets/sounds/item-obtained.mp3'
import musicaEnemiesPunch from '../../assets/sounds/enemies-punch.mp3'
import musicInitialTown from '../../assets/sounds/town.mp3'
import inventoryBackground from '../../assets/sprites/inventory.png'

import churchjson from '../../assets/mapas/church.json'
import roomjson from '../../assets/mapas/room.json'
import homejson from '../../assets/mapas/home.json'
import demo_church from '../../assets/sprites/demo church.png'
import doorsWindows from '../../assets/sprites/TopDownHouse_DoorsAndWindows.png'
import floorsWalls from '../../assets/sprites/TopDownHouse_FloorsAndWalls.png'
import greenFurniture from '../../assets/sprites/TopDownHouse_FurnitureState1.png'
import brownFurniture from '../../assets/sprites/TopDownHouse_FurnitureState2.png'
import smallItems from '../../assets/sprites/TopDownHouse_SmallItems.png'
import lilith from '../../assets/sprites/lilith.png'
import abuela from '../../assets/sprites/abuela.png'
import abuelo from '../../assets/sprites/abuelo.png'
import cura from '../../assets/sprites/cura.png'


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
    this.load.audio('musicaFondo', musicaFondo);
    this.load.audio('musicaGameOver', musicaGameOver);
    this.load.audio('musicaGetItem', musicaGetItem);
    this.load.audio('enemiesPunch', musicaEnemiesPunch);
    this.load.audio('musicInitialTown', musicInitialTown);
    this.load.image('background', background);

    this.load.aseprite('player', player, playerjson);
    this.load.spritesheet('health', health, { frameWidth: 32, frameHeight: 32 });
    this.load.aseprite('chest', chest, chestjson);
    this.load.image('palo', palo);
    this.load.image('shoot', shoot);
    this.load.image('grimorio-basico', grimorioBasico);
    this.load.image('grimorio-shoot', grimorioShoot);
    this.load.image('grimorio-freezing_shoot', grimorioFrezShoot);
    this.load.image('grimorio-shield', grimorioShield);
    this.load.image('spike',spike);
    this.load.image('shield', shield);
    this.load.image('plantilla', villa);
    this.load.tilemapTiledJSON('mapa', mapa);
    this.load.image('casa', casa);
    this.load.image('arbol', arbol);
    this.load.image('flor', flor);
    this.load.image('naranja', cNaranja);
    this.load.image('grande', cGrande);
    this.load.image('pozo', pozo);
    this.load.image('berry', berry)
    this.load.image('fullscreen', fullscreen);

    this.load.image('inventoryBackground', inventoryBackground);

    this.load.image('demo_church', demo_church);
    this.load.image('doorsWindows', doorsWindows);
    this.load.image('floorsWalls', floorsWalls);
    this.load.image('greenFurniture', greenFurniture);
    this.load.image('brownFurniture', brownFurniture);
    this.load.image('smallItems', smallItems);
    this.load.tilemapTiledJSON('churchjson', churchjson);
    this.load.tilemapTiledJSON('roomjson', roomjson);
    this.load.tilemapTiledJSON('homejson', homejson);
    this.load.image('lilith', lilith);
    this.load.image('abuela', abuela);
    this.load.image('abuelo', abuelo);
    this.load.image('cura', cura);
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {   
    this.registry.set('openedChests', []);
    this.anims.createFromAseprite('player');
    this.anims.createFromAseprite('chest');
    //this.scene.start('bosque', {x: 251, y: 381, stats: null});
    this.scene.start('IntroStoryScene');

    //musica

    //this.scene.start('mainmenu', { globals : this.globals});
  }
}