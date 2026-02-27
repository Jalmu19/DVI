import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Player1 from './game-objects/player/player1.js'



import villa from '../assets/sprites/villa1.png'
import arbol from '../assets/sprites/arbol.png'
import flor from '../assets/sprites/florAmarilla.png'
import cuervo from '../assets/sprites/kirbo.png'

import zonaBosque from '../assets/sprites/zona_bosque.json'

export default class Bosque extends Phaser.Scene{

    constructor(){
        super({key:'zonaBosque'});
    }
/**
 * 
    preload(){
        this.load.image('cuervoEnemigo', cuervo);
        this.load.image('plantilla', villa);
        this.load.image('arbol', arbol);
        this.load.image('flor', flor);

        this.load.tilemapTiledJSON('zBosque', zonaBosque);

    }
 */
  

    create(){
        var map = this.make.tilemap({key : 'zBosque'});

        var img1 = map.addTilesetImage('Villa1', 'plantilla');
        var img2 = map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('flor1', 'flor');


        map.createLayer('fondo', img1, 0,0);
        map.createLayer('Detalles', [img3, img1], 0,0);
        var arboles = map.createLayer('Arboles', img2, 0,0);

        //Crear capa de salidas, pero no configuradas
              
        arboles.setCollisionByExclusion([-1], true);
        
        this.player = new Player(this, 150,100);


       /** this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.capaSalidas.objects.forEach(objeto =>{
            
            var a = new Player1(this, objeto.x, objeto.y);
            this.salidas.add(a)
        })
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        //colision suelo-player
        this.physics.add.collider(this.player,arboles);
        this.physics.add.collider(this.player, casas);
        
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this); */
    }

}