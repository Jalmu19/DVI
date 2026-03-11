import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Salidas from './game-objects/enemy/salidas.js'


import villa from '../assets/sprites/villa1.png'
import arbol from '../assets/sprites/arbol.png'
import flor from '../assets/sprites/florAmarilla.png'
import cuervo from '../assets/sprites/kirbo.png'

import zonaBosque from '../assets/mapas/zona_bosque.json'
import Spike from "./game-objects/enemy/spike.js";

export default class Bosque extends Phaser.Scene{

    constructor(){
        super({key:'bosque'});
    }

    preload(){
        this.load.image('cuervoEnemigo', cuervo);
        this.load.image('plantilla', villa);
        this.load.image('arbol', arbol);
        this.load.image('flor', flor);

        this.load.tilemapTiledJSON('zBosque', zonaBosque);

    }
  

    create(){
        var map = this.make.tilemap({key : 'mapa'});

        var img1 = map.addTilesetImage('Casa', 'casa');
        var img2 = map.addTilesetImage('Villa1', 'plantilla');
        var img3 = map.addTilesetImage('Arbol', 'arbol');
        var img4 = map.addTilesetImage('flor1', 'flor');
        var img5 = map.addTilesetImage('Iglesia', 'naranja');
        var img6 = map.addTilesetImage('IglesiaBien', 'grande');
        var img7 = map.addTilesetImage('Pozo', 'pozo');

        map.createLayer('Suelo', img2, 0,0);
        var arboles = map.createLayer('Arboleda', [img3, img4, img7], 0,0);
        var casas = map.createLayer('Casas', [img1,img2, img5, img6], 0,0);
        this.player = new Player(this, 150,100);
        var tejado = map.createLayer('Tejados', [img1,img5,img6],0,0);
       
        //Crear capa de salidas, pero no configuradas
              
        arboles.setCollisionByExclusion([-1], true);
        casas.setCollisionByExclusion([-1], true);
         
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.capaSalidas.objects.forEach(objeto =>{
            
            var a = new Salidas(this, objeto.x, objeto.y);
            this.salidas.add(a)
        })
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true);
        
        //colision suelo-player
        this.physics.add.collider(this.player,arboles);
        this.physics.add.overlap(this.player, tejado,null,null,this);    
        this.physics.add.collider(this.player,casas);            
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);
        this.scene.launch('ui');
        
    }

    cambiarScene(){
        this.anims.createFromAseprite('player');
        this.scene.start('zonaBosque');           
    }

    dies() {
        this.scene.start('game-over');
    }

}