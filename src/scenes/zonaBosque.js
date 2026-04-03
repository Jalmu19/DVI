import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Salidas from '../game-objects/enemy/salidas.js'
import Spike from '../game-objects/enemy/spike.js'

import entrada_mazmorra from '../../assets/mapas/entrada-mazmorra-bosque.json'
import cesped from '../../assets/sprites/cesped.png'
import plataforma_cesped from '../../assets/sprites/plataforma_cesped.png'
import puente from '../../assets/sprites/Bridges.png'
import seta from '../../assets/sprites/seta.png'
import tierra from '../../assets/sprites/tierra.png'
import piedras_tierra from '../../assets/sprites/piedras_tierra.png'
import escaleras from '../../assets/sprites/escaleras.png'
import pared_mazmorra from '../../assets/sprites/pared_mazmorra.png'
import puerta_mazmorra from '../../assets/sprites/dungeon.png'
import GameScene from "./game-scene.js";
import Item from "../game-objects/item.js";
import Inventory from '../inventory.js';

export default class Zona_bosque extends GameScene {

    constructor() {
        super({ key: 'zonaBosque' });
    }
    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }

    preload() {
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



    create() {
        var map = this.make.tilemap({ key: 'zBosque' });

        var img1 = map.addTilesetImage('Villa1', 'plantilla');
        var img2 = map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('flor1', 'flor');
        var img4 = map.addTilesetImage('Hierba', 'hierba');


        map.createLayer('fondo', img4, 0, 0);
        map.createLayer('Detalles', [img3, img1], 0, 0);
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

        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');

        this.cargarSalidas(this.capaSalidas, this.salidas);
        
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');
        this.capaEnemigos.objects.forEach(obj => {
            var a = new Spike(this, obj.x, obj.y, 'spike');
            this.enemigos.add(a);
        })
        //this.physics.add.collider(this.enemigos, arboles);
    
        this.items = this.physics.add.staticGroup()
        this.capaBayas = map.getObjectLayer('Bayas')
        this.capaBayas.objects.forEach(obj =>{
            var a = new Item(this, obj.x, obj.y, 'berry', 0,{ id: 'berry', name: obj.name, quantity: 1})
            this.items.add(a)

        })
        /*const berry1 = new Item(this, 100, 100, 'berry', 0, { id: 'berry', name: 'berry1', quantity: 1});
        const berry2 = new Item(this, 150, 100, 'berry', 0, { id: 'berry2', name: 'berry2',  quantity: 3});
        const berry3 = new Item(this, 200, 100, 'berry', 0, { id: 'berry', name: 'berry3', quantity: 1});
        this.items.add(berry1)
        this.items.add(berry2)
        this.items.add(berry3) */
        this.manageItems(this.player, this.items)

        
    }

    cambiarScene(jugador, salidas) {
        if(salidas.tag === 'salidaMazmorra' ){
            this.scene.start('entrada_mazmorra', {
                x : 50,
                y : 20,
                stats : this.player.getStats()
            });
        }
        else if(salidas.tag === 'salidaLago'){
            //this.scene.start("zonaLago")
        }
        else{
            this.scene.switch('bosque', {
                x : 156,
                y : 26,
                stats : this.player.getStats()
            });
        }
    }

}