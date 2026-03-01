import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Salidas from './game-objects/enemy/salidas.js'

export default class Zona_bosque extends Phaser.Scene{

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
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.player = new Player(this, 150,100);
        //Añadiendo colision a las fisicas
        this.physics.add.collider(this.player, arboles);
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);


       /** this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.capaSalidas.objects.forEach(objeto =>{
            
            var a = new Salida(this, objeto.x, objeto.y);
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