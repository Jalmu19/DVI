import Oruga from "../game-objects/enemy/oruga.js";
import Player from '../game-objects/player/player.js'
import laberinto from '../../assets/mapas/laberinto.json'
import GameScene from "./game-scene.js";

import villa from '../../assets/sprites/villa1.png'
import arbol from '../../assets/sprites/arbol.png'
import flor from '../../assets/sprites/florAmarilla.png'

import star from '../../assets/sprites/star.png'
import Rata from "../game-objects/enemy/rata.js";



export default class Zona_Lago extends GameScene {

    constructor() {
        super({ key: 'zonaLago' });
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];  
           
    }

    preload() {
       this.load.tilemapTiledJSON('laberinto', laberinto);
       
       this.load.image('star', star);

    }



    create() {
        var map = this.make.tilemap({ key: 'zonaLago' });

        var img1 = map.addTilesetImage('Villa1', 'plantilla');
        var img2 = map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('flor1', 'flor');
        var img4 = map.addTilesetImage('agua', 'agua');
        var img5 = map.addTilesetImage('detalleAgua', 'detalleAgua');
        var img6 = map.addTilesetImage('elevacionAgua', 'islotesAgua')


        map.createLayer('fondo', [img1, img3], 0, 0);
        var lago = map.createLayer('Agua',[img4, img1] ,0,0)
        map.createLayer('DetallesAgua', img5, 0, 0)
        map.createLayer('islotes', [img1,img6], 0,0);
        map.createLayer('Camino',img1, 0 ,0)
        
        var arboles = map.createLayer('Arboles', img2, 0, 0);

        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      
        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);
        
        //Añadiendo colision a las fisicas
        arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, arboles);
       
        //lago.setCollisionByExclusion([-1],true);
        //this.physics.add.collider(this.player, lago);

        //limites de camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);


        //Salidas
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        //Cofre islote

        this.cofre = this.physics.add.group()
        this.capaCofre = map.getObjectLayer('Cofre');

        this.llenarCofre(this.capaCofre, this.cofre);  
        
        this.physics.add.collider(this.player, this.capaCofre);

        //Enemigos
        this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');
        this.capaEnemigos.objects.forEach(obj =>{
            var a;
            if(obj.name === "Oruga"){
                a = new Oruga(this, obj.x, obj.y,'oruga');
            }
            else{
                a = new Rata(this, obj.x, obj.y,'rata');
            }
            
            this.enemigos.add(a);

        })
        
        
    }
   

    cambiarScene(jugador, salidas) {
        if(salidas.tag === 'salidaLaberinto' ){
            this.scene.start('laberinto', {
                x : 143,
                y : 30,
                stats : this.player.getStats()
            });
        }
        else{
            this.scene.switch('zonaBosque', {
                x : 453,
                y : 160,
                stats : this.player.getStats()
            });
        }
    }

}