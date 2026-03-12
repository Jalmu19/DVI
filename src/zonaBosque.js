import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Salidas from './game-objects/enemy/salidas.js'
import Spike from './game-objects/enemy/spike.js'

import entrada_mazmorra from '../assets/mapas/entrada-mazmorra-bosque.json'
import cesped from '../assets/sprites/cesped.png'
import plataforma_cesped from '../assets/sprites/plataforma_cesped.png'
import puente from '../assets/sprites/Bridges.png'
import seta from '../assets/sprites/seta.png'
import tierra from '../assets/sprites/tierra.png'
import piedras_tierra from '../assets/sprites/piedras_tierra.png'
import escaleras from '../assets/sprites/escaleras.png'
import pared_mazmorra from '../assets/sprites/pared_mazmorra.png'
import puerta_mazmorra from '../assets/sprites/dungeon.png'

export default class Zona_bosque extends Phaser.Scene{

    constructor(){
        super({key:'zonaBosque'});
    }

  preload(){
        this.load.tilemapTiledJSON('entrada-mazmorra-bosque', entrada_mazmorra)
        this.load.image('cesped', cesped);
        this.load.image('plataforma_cesped', plataforma_cesped);
        this.load.image('Bridges', puente);
        this.load.image('seta', seta);
        this.load.image('tierra', tierra);
        this.load.image('piedras_tierra', piedras_tierra);
        this.load.image('escaleras', escaleras);
        this.load.image('pared_mazmorra', pared_mazmorra);
        this.load.image('puerta_mazmorra', puerta_mazmorra);  

    }
 
  

    create(){
        var map = this.make.tilemap({key : 'zBosque'});

        var img1 = map.addTilesetImage('Villa1', 'plantilla');
        var img2 = map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('flor1', 'flor');
        var img4 = map.addTilesetImage('Hierba', 'hierba');


        map.createLayer('fondo', img4, 0,0);
        map.createLayer('Detalles', [img3, img1], 0,0);
        var arboles = map.createLayer('Arboles', img2, 0,0);

        //Crear capa de salidas, pero no configuradas
              
        arboles.setCollisionByExclusion([-1], true);
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        let datos = this.registry.get('datos');
        this.player = new Player(this, datos.x,datos.y);

        //Añadiendo colision a las fisicas
        this.physics.add.collider(this.player, arboles);
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.capaSalidas.objects.forEach(objeto =>{
            
            var a = new Salidas(this, objeto.x, objeto.y);
            this.salidas.add(a)
        })
       this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

       this.enemigos = this.physics.add.group();
       this.capaEnemigos = map.getObjectLayer('Enemigos');
       this.capaEnemigos.objects.forEach(obj=>{
            var a = new Spike(this, obj.x, obj.y, 'spike');
            this.enemigos.add(a);
       })
       //this.physics.add.collider(this.enemigos, arboles);
        
    }
    cambiarScene(){
        this.registry.set('datos', {x : 0 , y : 30})
        this.scene.start('entrada_mazmorra');
    } 
    dies() {
        this.scene.stop('ui');
        this.scene.start('game-over');
    }

}