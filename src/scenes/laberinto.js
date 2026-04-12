import Phaser from "phaser";
import Salidas from '../game-objects/enemy/salidas.js'
import Player from '../game-objects/player/player.js'
import GameScene from "./game-scene.js";

import cesped from "../../assets/sprites/cesped.png"
import tierra from "../../assets/sprites/tierra.png"
import arbol from "../../assets/sprites/arbol.png"
import laberinto_final from "../../assets/mapas/laberinto_final.json"


export default class Laberinto extends GameScene{

    constructor(){
        super({key:'laberinto'}); 
    }

    init(datos){
         this.datos = [datos.x, datos.y, datos.stats];
    }

    preload() {
        this.load.image('cesped', cesped);
        this.load.image('tierra', tierra);
        this.load.image('arbol', arbol);

        this.load.tilemapTiledJSON('laberinto_final', laberinto_final);
    }

    create(){
        var map = this.make.tilemap({key : 'laberinto'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('tierra', 'tierra');
        var img3 = map.addTilesetImage('arbol', 'arbol');

        map.createLayer('suelo', [img1, img2], 0,0);
        var arboles = map.createLayer('arboles', [img3], 0,0);

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]); 
        console.log(this.player.x, this.player.y);

        //COLISIONES
        arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, arboles);


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
        this.anims.createFromAseprite('player');
        if(salidas.tag === "entrada"){
            this.scene.start('entrada_ciudad', {
                x : 25,
                y : 40,
                stats : this.player.getStats()
            }); 
        }
        else if(salidas.tag === "salida1"){
            this.scene.start('laberinto', {
                x : 143,
                y : 45,
                stats : this.player.getStats()
            }); 
        }
        else if(salidas.tag === "salida2"){
            this.scene.start('laberinto', {
                x : 593,
                y : 365,
                stats : this.player.getStats()
            }); 
        }
        else if(salidas.tag === "salida3"){
            this.scene.start('laberinto', {
                x : 590,
                y : 260,
                stats : this.player.getStats()
            }); 
        }
        else if(salidas.tag === "salida4"){
            this.scene.start('laberinto', {
                x : 159,
                y : 526,
                stats : this.player.getStats()
            }); 
        }
        else if(salidas.tag === "salida5"){
            this.scene.start('laberinto', {
                x : 34,
                y : 440,
                stats : this.player.getStats()
            }); 
        }
        else if(salidas.tag === "salida"){
            this.scene.start('laberinto_final', {
                x : 71,
                y : 30,
                stats : this.player.getStats()
            }); 
        }
    } 

}