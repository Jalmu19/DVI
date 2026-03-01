import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Salidas from './game-objects/enemy/salidas.js'

import mazmorra from '../assets/sprites/mazmorra.json'




export default class Mazmorra extends Phaser.Scene{

    constructor(){
        super({key:'mazmorra'});
    }

    preload(){
        this.load.image('puerta', puerta);
        this.load.image('cofre_verde', cofre_verde);
        this.load.image('cofre_rojo', cofre_rojo);
        this.load.image('cofre_morado', cofre_morado);
        this.load.image('cofre_azul', cofre_azul);
        this.load.image('cofre_amarillo', cofre_amarillo);
        this.load.image('bandera_verde', bandera_verde);
        this.load.image('bandera_roja', bandera_roja);
        this.load.image('bandera_morada', bandera_morada);
        this.load.image('bandera_azul', bandera_azul);
        this.load.image('bandera_amarilla', bandera_amarilla);
        this.load.image('paredes_mazmorra', paredes_mazmorra);

        this.load.tilemapTiledJSON('mazmorra', mazmorra);

    }
  

    create(){
        var map = this.make.tilemap({key : 'mazmorra'});

        var img1 = map.addTilesetImage('puerta', 'puerta');
        var img2 = map.addTilesetImage('cofre_verde', 'cofre_verde');
        var img3 = map.addTilesetImage('cofre_rojo', 'cofre_rojo');
        var img4 = map.addTilesetImage('cofre_morado', 'cofre_morado');
        var img5 = map.addTilesetImage('cofre_azul', 'cofre_azul');
        var img6 = map.addTilesetImage('cofre_amarillo', 'cofre_amarillo');
        var img7 = map.addTilesetImage('bandera_verde', 'bandera_verde');
        var img8 = map.addTilesetImage('bandera_roja', 'bandera_roja');
        var img9 = map.addTilesetImage('bandera_morada', 'bandera_morada');
        var img10 = map.addTilesetImage('bandera_azul', 'bandera_azul');
        var img11 = map.addTilesetImage('bandera_amarilla', 'bandera_amarilla');
        var img12 = map.addTilesetImage('paredes_mazmorra', 'paredes_mazmorra');


        map.createLayer('Suelo', img2, 0,0);
        var paredes = map.createLayer('Paredes', img12, 0,0);
        map.createLayer('Decoraciones', img12, 0,0); //antorchas

        //Crear capa de salidas, pero no configuradas              
        paredes.setCollisionByExclusion([-1], true);
        casas.setCollisionByExclusion([-1], true);
        
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = new Player(this, 150,100);


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
        this.physics.add.collider(this.player, casas);
        
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);
    }

    cambiarScene(){
        this.scene.start('');
           
    }

    dies() {
        this.scene.start('game-over');
    }

}