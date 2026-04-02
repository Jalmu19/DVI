import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Cajas from '../game-objects/items/cajas.js'
import Banderas from '../game-objects/items/banderas.js'
import Puertas from '../game-objects/items/puertas.js'
import GameScene from "./game-scene.js";

import habitacion_boss from '../../assets/mapas/habitacion_boss.json'
import suelo from '../../assets/sprites/dungeon.png'
import paredes from '../../assets/sprites/dungeon.png'


export default class Mazmorra extends GameScene{

    constructor(){
        super({key:'mazmorra'});
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }

    //preload de la escena siguiente    
    preload(){
        this.load.image('suelo', suelo);
        this.load.image('paredes', paredes);
        this.load.tilemapTiledJSON('habitacion_boss', habitacion_boss);
    }


    create(){
        var map = this.make.tilemap({key : 'mazmorra'});
        this.sonidoAbrirPuerta = this.sound.add('sonidoPuerta'); 

        var img12 = map.addTilesetImage('paredes', 'paredes');
        var img13 = map.addTilesetImage('antorchas', 'antorchas');
        var img14 = map.addTilesetImage('puerta_entrada', 'puerta_entrada');
        var img15 = map.addTilesetImage('suelo', 'suelo');


        map.createLayer('Suelo', img15, 0,0);
        var paredes_y_entrada = map.createLayer('ParedesYEntrada', [img12, img14], 0,0);
        map.createLayer('Antorchas', img13, 0,0); //antorchas


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        paredes_y_entrada.setCollisionByExclusion([-1], true);
        
        //salidas  
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        this.cargarSalidas(this.capaSalidas, this.salidas);

        //puertas
        this.puertas = this.physics.add.group();
        this.capaPuertas = map.getObjectLayer('Puertas');
        this.crearObjeto(this.puertas, this.capaPuertas, Puertas);

        //cajas
        this.cajas = this.physics.add.group();
        this.capaCajas = map.getObjectLayer('Cajas');
        this.crearObjeto(this.cajas, this.capaCajas, Cajas);
       


        // También colisión entre las cajas y el escenario (paredes)
        this.physics.add.collider(this.cajas, paredes_y_entrada);


        //banderas
        this.banderas = this.physics.add.group();
        this.capaBanderas = map.getObjectLayer('Banderas');
        this.crearObjeto(this.banderas, this.capaBanderas, Banderas);
        this.physics.add.overlap(this.cajas, this.banderas,(caja, bandera) => {
            this.cajaSobreBandera(caja, bandera, this.puertas);
        }, null, this);


        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        this.logicaCajas(this.player, this.cajas);
        this.physics.add.collider(this.player, paredes_y_entrada);  
        this.physics.add.collider(this.player, this.puertas); 
        this.physics.add.collider(this.puertas, paredes_y_entrada);
        this.physics.add.collider(this.cajas, this.puertas); //para que al empujar una caja no se desplace la puerta
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);     

    }

    cambiarScene(jugador, salidas){
        this.anims.createFromAseprite('player');
        if(salidas.tag === 'salidaBossFinal' ){
           this.scene.start('habitacion_boss', {
                x : 350,
                y : 112,
                stats : this.player.getStats()
            });  
        }
        else{
            this.scene.start('mazmorra_inicial', {
                x : 110,
                y : 18,
                stats : this.player.getStats()
            });
        }
                
    }

    update() {
        // Recorremos todas las cajas y si no tienen a nadie empujando, velocidad 0
        this.cajas.children.iterate(caja => {
            // Si la caja se está moviendo, la frenamos
            caja.setVelocity(0); 
        });
    }

}