import Phaser from "phaser";
import Salidas from '../game-objects/enemy/salidas.js'
import Player from '../game-objects/player/player.js'

import laberinto from '../../assets/mapas/laberinto.json'
import entrada_cueva from '../../assets/mapas/entrada_cueva.json'
import tileCueva from '../../assets/sprites/cueva.png'
import GameScene from "./game-scene.js";

import ciudad from '../../assets/mapas/ciudad.json'
import suelos_ciudad from '../../assets/sprites/suelos_ciudad.png'
import tejados_ciudad from '../../assets/sprites/tejados_ciudad.png'
import tejados_lado_ciudad from '../../assets/sprites/tejados_lado_ciudad.png'
import paredes_casaciudad from '../../assets/sprites/paredes_casaciudad.png'

import star from '../../assets/sprites/star.png'



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
        //Laberinto
        this.load.spritesheet('star', star, { frameWidth: 32, frameHeight: 32 });
        this.load.tilemapTiledJSON('laberinto', laberinto);

        this.load.tilemapTiledJSON('entrada_cueva', entrada_cueva);
        this.load.spritesheet('cueva', tileCueva, {  frameWidth: 16,   frameHeight: 16, margin: 0, spacing: 0 });

        this.load.tilemapTiledJSON('ciudad', ciudad);
        this.load.image('suelos_ciudad', suelos_ciudad);
        this.load.image('tejados_ciudad', tejados_ciudad);
        this.load.image('tejados_lado_ciudad', tejados_lado_ciudad);
        this.load.image('paredes_casaciudad', paredes_casaciudad);

    }


    create(){
        var map = this.make.tilemap({key : 'entrada_ciudad'});

        var img1 = map.addTilesetImage('Hierba', 'hierba');
        var img2 =  map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('tierra', 'tierra');
        var img4 = map.addTilesetImage('castle','castle');
        var img5 = map.addTilesetImage('puerta', 'puertaMuralla');        
        var img6 = map.addTilesetImage('agua', 'agua');
        var img7 = map.addTilesetImage('Villa1', 'plantilla');
        var img8 =map.addTilesetImage('valla', 'valla');        
        var img9 = map.addTilesetImage('curvas', 'curvas');
        var img11= map.addTilesetImage('curvas2','curvas2');
        var img10 = map.addTilesetImage('elevacionAgua', 'islotesAgua')
        var img12 = map.addTilesetImage('flor1', 'flor');



        map.createLayer('suelo', [img3 , img1], 0,0);      
        map.createLayer('suelo_camino', [img4,img7], 0,0);
        map.createLayer('bordes_camino',[img9,img11],0,0);

        map.createLayer('detalles', [img4, img7, img12], 0,0);

        map.createLayer('Ciudad', img4, 0,0);
        map.createLayer('puerta', img5, 0,0); 
        this.agua = map.createLayer('foso', [img6, img4, img7, img10], 0,0);
        this.arboles = map.createLayer('Arboles', [img2, img8], 0,0);
             
       


        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        
        //COLISIONES
        this.arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.arboles);

        this.agua.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.agua);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player); 


        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);
        
        let existeMusica = this.sound.get('lakeMusic');
        if (!existeMusica) {
            existeMusica = this.sound.add('lakeMusic', { loop: true });
            existeMusica.play();
        } else if (!existeMusica.isPlaying) {
            existeMusica.play();
        }

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
             this.sound.stopAll();
        }
        else  if(salidas.tag === 'salidaCueva' ){
            this.scene.start('entrada_cueva', {
                x : 245,
                y : 210,
                stats : this.player.getStats()
            });
            this.sound.stopAll();
        }
        else if(salidas.tag === 'entradaCiudad'){
            this.scene.start('ciudad', {
                x : 400,
                y : 1000,
                stats : this.player.getStats()
            });
             this.sound.stopAll();
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