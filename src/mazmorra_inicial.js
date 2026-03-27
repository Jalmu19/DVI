import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Cajas from './game-objects/items/cajas.js'
import Banderas from './game-objects/items/banderas.js'
import Puertas from './game-objects/items/puertas.js'
import GameScene from "./game-scene.js";


import mazmorra from '../assets/mapas/mazmorra.json'
import suelo from '../assets/sprites/dungeon.png'
import puertas from '../assets/sprites/puerta.png'
import puertas_laterales from '../assets/sprites/puerta_lateral.png'
import puertas_salida from '../assets/sprites/puerta_salida.png'
import puerta_entrada from '../assets/sprites/dungeon.png'
import cofre_verde from '../assets/sprites/cofre_verde.png'
import cofre_azul from '../assets/sprites/cofre_azul.png'
import cofre_amarillo from '../assets/sprites/cofre_amarillo.png'
import cofre_morado from '../assets/sprites/cofre_morado.png'
import bandera_verde from '../assets/sprites/bandera_verde.png'
import bandera_morada from '../assets/sprites/bandera_morada.png'
import bandera_azul from '../assets/sprites/bandera_azul.png'
import bandera_amarilla from '../assets/sprites/bandera_amarilla.png'
import paredes from '../assets/sprites/dungeon.png'
import antorchas from '../assets/sprites/dungeon.png'



export default class MazmorraInicial extends GameScene{

    constructor(){
        super({key:'mazmorra_inicial'});
    }
    init(datos){
        this.datos = [datos.x, datos.y, datos.mapOfSpells, datos.protec, datos.lastDir, datos.actualHealth];
    }

    //preload de la escena siguiente    
    preload(){
        this.load.image('suelo', suelo);
        this.load.image('puerta', puertas);
        this.load.image('puerta_lateral', puertas_laterales);
        this.load.image('puerta_salida', puertas_salida);
        this.load.image('puerta_entrada', puerta_entrada);
        this.load.image('caja_verde', cofre_verde);
        this.load.image('caja_morada', cofre_morado);
        this.load.image('caja_azul', cofre_azul);
        this.load.image('caja_amarilla', cofre_amarillo);
        this.load.image('bandera_verde', bandera_verde);
        this.load.image('bandera_morada', bandera_morada);
        this.load.image('bandera_azul', bandera_azul);
        this.load.image('bandera_amarilla', bandera_amarilla);
        this.load.image('paredes', paredes);
        this.load.image('antorchas', antorchas);

        this.load.tilemapTiledJSON('mazmorra', mazmorra);
    }


    create(){
        var map = this.make.tilemap({key : 'mazmorra_inicial'});

        var img1 = map.addTilesetImage('paredes', 'paredes');
        var img2 = map.addTilesetImage('suelo', 'suelo');
        var img3 = map.addTilesetImage('puerta_entrada', 'puerta_entrada');

        map.createLayer('suelo', img2, 0,0);
        var paredes_y_entrada = map.createLayer('paredesYpuerta', [img1, img3], 0,0);
        paredes_y_entrada.setCollisionByExclusion([-1], true);

 
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

       this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2], this.datos[3], this.datos[4], this.datos[5]);



        //puertas
        this.puertas = this.physics.add.group();
        this.capaPuertas = map.getObjectLayer('Puertas');
        this.crearObjeto(this.puertas, this.capaPuertas, Puertas);


        //cajas
        this.cajas = this.physics.add.group();
        this.capaCajas = map.getObjectLayer('Caja');      
        this.crearObjeto(this.cajas, this.capaCajas, Cajas);
        this.logicaCajas(this.player, this.cajas);


        //banderas
        this.banderas = this.physics.add.group();
        this.capaBanderas = map.getObjectLayer('Bandera');
        this.crearObjeto(this.banderas, this.capaBanderas, Banderas);
        this.physics.add.overlap(this.cajas, this.banderas,(caja, bandera) => {
            this.cajaSobreBandera(caja, bandera, this.puertas);
        }, null, this);


        this.physics.add.collider(this.player, paredes_y_entrada);  
        this.physics.add.collider(this.player, this.puertas); 
        this.physics.add.collider(this.puertas, paredes_y_entrada);
        this.physics.add.collider(this.cajas, this.puertas); //para que al empujar una caja no se desplace la puerta
        this.physics.add.collider(this.cajas, paredes_y_entrada); // También colisión entre las cajas y el escenario (paredes)

                
        //SALIDAS
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        this.cargarSalidas(this.capaSalidas, this.salidas);
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);     

    }

    cambiarScene(){
        this.anims.createFromAseprite('player');
        this.scene.start('mazmorra', {
            x : 48,
            y : 292,
            mapOfSpells : this.player.mapOfSpells,
            protec : this.player.protected,
            lastDir : this.player.lastDir,
            actualHealth : this.player.health.actualHealth
            
        });
           
    }



    update() {
        // Recorremos todas las cajas y si no tienen a nadie empujando, velocidad 0
        this.cajas.children.iterate(caja => {
            // Si la caja se está moviendo, la frenamos
            caja.setVelocity(0); 
        });
    }

}