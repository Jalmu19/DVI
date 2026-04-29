import Phaser from "phaser";
import Salidas from '../game-objects/enemy/salidas.js'
import Player from '../game-objects/player/player.js'

import laberinto from '../../assets/mapas/laberinto.json'
import mapaCueva from '../../assets/mapas/mapaCueva.json'
import suelo from '../../assets/sprites/dungeon.png'
import puerta from '../../assets/sprites/puerta.png'
import puerta_entrada from '../../assets/sprites/dungeon.png'
import paredes from '../../assets/sprites/dungeon.png'
import cofre_rojo from '../../assets/sprites/cofre_rojo.png'
import bandera_roja from '../../assets/sprites/bandera_roja.png'
import tileCueva from '../../assets/sprites/cueva.png'
import GameScene from "./game-scene.js";

import star from '../../assets/sprites/star.png'
import Rata from "../game-objects/enemy/rata.js";




export default class Entrada_ciudad extends GameScene{

    constructor(){
        super({key:'entrada_ciudad'}); 
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
        this.dialog_text = ["Has recibido: "];
    }


    //preload de la escena siguiente    
    preload(){        
        //Cueva
        this.load.spritesheet('star', star, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('cueva', tileCueva, {  frameWidth: 16,   frameHeight: 16, margin: 0, spacing: 0 });
        this.load.tilemapTiledJSON('mapaCueva', mapaCueva);

        //Laberinto
        this.load.tilemapTiledJSON('laberinto', laberinto);
    }


    create(){
        var map = this.make.tilemap({key : 'entrada_ciudad'});

        var img1 = map.addTilesetImage('Hierba', 'hierba');
        var img2 =  map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('tierra', 'tierra');
        var img4 = map.addTilesetImage('castle','castle');
        var img5 = map.addTilesetImage('puerta', 'puerta');        
        var img6 = map.addTilesetImage('agua', 'agua');
        var img7 = map.addTilesetImage('Villa1', 'plantilla');



        map.createLayer('suelo', img1, 0,0);
        this.arboles = map.createLayer('Arboles', img2, 0,0);
        map.createLayer('Camino', [img3, img4], 0,0);
        map.createLayer('Ciudad', img4, 0,0);
        map.createLayer('detalles', img4, 0,0);
        map.createLayer('foso', [img6, img4, img7,img3], 0,0);
        map.createLayer('puerta', img5, 0,0);



        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        
        //COLISIONES
        this.arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.arboles);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player); 


        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);
        

    }

    cambiarScene(jugador, salidas){
        
        if(salidas.tag === 'salidaPlaya' ){
                  
        }
        else if(salidas.tag === 'salidaLaberinto' ){
            this.scene.start('laberinto', {
                x : 143,
                y : 30,
                stats : this.player.getStats()
            });

            
        }
        else  if(salidas.tag === 'salidaCueva' ){
            this.scene.start('escenaCueva', {
                x : 985,
                y : 928,
                stats : this.player.getStats()
            });
           
        }
        else{
            this.scene.start('zonaLago', {
                x : 843,
                y : 210,
                stats : this.player.getStats()
            });
        }
    } 

}