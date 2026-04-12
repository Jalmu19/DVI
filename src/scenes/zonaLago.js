import Oruga from "../game-objects/enemy/oruga.js";
import Player from '../game-objects/player/player.js'
import laberinto from '../../assets/mapas/laberinto.json'
import GameScene from "./game-scene.js";

import villa from '../../assets/sprites/villa1.png'
import arbol from '../../assets/sprites/arbol.png'
import flor from '../../assets/sprites/florAmarilla.png'



export default class Zona_Lago extends GameScene {

    constructor() {
        super({ key: 'zonaLago' });
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];  
           
    }

    preload() {
       this.load.tilemapTiledJSON('laberinto', laberinto);
      

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
        map.createLayer('Agua',[img6, img4, img1] ,0,0)
        map.createLayer('DetallesAgua', img5, 0, 0)
        map.createLayer('Camino',img1, 0 ,0)
        
        var arboles = map.createLayer('Arboles', img2, 0, 0);

        //Crear capa de salidas, pero no configuradas

        arboles.setCollisionByExclusion([-1], true);
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      
        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);
        
        //Añadiendo colision a las fisicas
        this.physics.add.collider(this.player, arboles);
        //limites de camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);


        //Salidas
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        
        
        
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
                //cambiar posicion de x e y
                x : 453,
                y : 160,
                stats : this.player.getStats()
            });
        }
    }

}