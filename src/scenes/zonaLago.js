import Oruga from "../game-objects/enemy/oruga.js";
import Player from '../game-objects/player/player.js'
import Chest from "../game-objects/items/chest.js";
import laberinto from '../../assets/mapas/laberinto.json'
import GameScene from "./game-scene.js";

import villa from '../../assets/sprites/villa1.png'
import arbol from '../../assets/sprites/arbol.png'
import flor from '../../assets/sprites/florAmarilla.png'
import Rata from "../game-objects/enemy/rata.js";
import Item from '../game-objects/item.js';

import hielo from '../../assets/sprites/hielo.png'
import {SPELLS } from '../constants';


import entrada_ciudad from '../../assets/mapas/entrada_ciudad.json'
import muralla from '../../assets/sprites/muralla.png'
import puerta from '../../assets/sprites/puerta_muralla.png'
import valla from '../../assets/sprites/valla.png';
import Slime from "../game-objects/enemy/slime.js";




export default class Zona_Lago extends GameScene {

    constructor() {
        super({ key: 'zonaLago' });
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];  
           
    }

    preload() {
       this.load.image('castle',muralla);
       this.load.image('valla',valla)
       this.load.image('puertaMuralla', puerta);
       this.load.tilemapTiledJSON('entrada_ciudad',entrada_ciudad);

    }



    create() {
        this.registry.set('escenaActual', {
            scene: 'zonaLago', 
            x: 37,               
            y: 233               
        });

        this.initSpellEventListener();
        var map = this.make.tilemap({ key: 'zonaLago' });
        console.log(map.tilesets.map(t => t.name));

        var img1 = map.addTilesetImage('Villa1', 'plantilla');
        var img2 = map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('flor1', 'flor');
        var img4 = map.addTilesetImage('agua', 'agua');
        var img5 = map.addTilesetImage('detalleAgua', 'detalleAgua');
        var img6 = map.addTilesetImage('elevacionAgua', 'islotesAgua')
        var img7 = map.addTilesetImage('hielo', 'hielo');
        var img8 = map.addTilesetImage('curvas', 'curvas');
        var img9 = map.addTilesetImage('Hierba', 'hierba');

    
        map.createLayer('fondo', [img1, img9,img6, img3], 0, 0);
        map.createLayer('hielo', img7, 0,0);
        map.createLayer('Camino',[img1], 0 ,0)
        map.createLayer('bordesCamino', [img8],  0,0);
        this.lago = map.createLayer('Agua',[img4, img1] ,0,0)
        map.createLayer('DetallesAgua', img5, 0, 0)
        this.islotes = map.createLayer('islotes', [img1,img6], 0,0);
        this.islotes.forEachTile(tileIslote => {
            if (tileIslote.index !== -1) {
                this.lago.removeTileAt(tileIslote.x, tileIslote.y);
            }
        });
        
        
        
        this.arboles = map.createLayer('Arboles', [img2,img8], 0, 0);
 
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //Cofre islote
        
        this.cofre = this.physics.add.group({classType: Chest,
                                                        immovable: true,
                                                        allowGravity: false })
        this.capaCofre = map.getObjectLayer('Cofre');
        this.llenarCofre(this.capaCofre, this.cofre);

      
        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);
        
        //Colision cofre-player
        this.physics.add.collider(this.player, this.cofre);
        
        //Añadiendo colision a las fisicas
        this.arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.arboles);
       
        this.lago.setCollisionByExclusion([-1],true);
        this.physics.add.collider(this.player, this.lago);
 
        //limites de camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);


        //Salidas
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);
        
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);
        
        //Colision jugador y cofre
        
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
                a = new Slime(this, obj.x, obj.y,'slime');
            }
            
            this.enemigos.add(a);

        })


        //bayas
        this.bayas = this.physics.add.staticGroup();
        this.capaBayas = map.getObjectLayer('bayas')
        this.capaBayas.objects.forEach(obj =>{
            var a = new Item(this, obj.x, obj.y, 'berry', 0,{ id: 'berry', name: obj.name, quantity: 1})
            this.bayas.add(a)
        })
        
        //Colision baya-player
        this.manageItems(this.player, this.bayas);


        //Colisiones de enemigos
       /* this.physics.add.collider(this.enemigos, this.lago);
        this.physics.add.collider(this.enemigos, this.arboles);
        this.physics.add.collider(this.enemigos, this.enemigos); */
        
        Object.values(this.player.mapOfSpells).forEach(group => {
            if (group instanceof Phaser.Physics.Arcade.Group) {
                this.physics.add.overlap(group, this.lago, (shoot, tile) => {
                        console.log("a");
                        console.log(shoot.spellKey);
                        this.freezeWater(shoot, tile);
                    }, 
                    (shoot, tile) => {
                        return shoot.active && shoot.visible && tile.index !== -1;
                    }, 
                    this
                );
            }
        });
        
        let existeMusica = this.sound.get('lakeMusic');
        if (!existeMusica) {
            existeMusica = this.sound.add('lakeMusic', { loop: true });
            existeMusica.play();
        } else if (!existeMusica.isPlaying) {
            existeMusica.play();
        }

    }
   
    freezeWater(shoot, tile) {
        if (shoot.spellKey === SPELLS.FREEZE_SHOOT.KEY && tile.properties.esAgua) {
            console.log("congelado");
            const map = this.lago.tilemap;
            const tilesetHielo = this.lago.layer.tilemapLayer.tilemap.getTileset('hielo');
            const idHielo = tilesetHielo.firstgid;
            
            this.lago.putTileAt(idHielo, tile.x, tile.y);

            const radio = 1; 

            for (let x = -radio; x <= radio; x++) {
                for (let y = -radio; y <= radio; y++) {
                    const targetTile = map.getTileAt(tile.x + x, tile.y + y, true, 'Agua');

                    if (targetTile && targetTile.properties.esAgua && !targetTile.properties.esHielo) {
                        const newTile = this.lago.putTileAt(idHielo, targetTile.x, targetTile.y);                        
                        newTile.properties.esAgua = false;                        
                        this.lago.setCollision(newTile.index, false);
                    }
                }
            }

            shoot.setActive(false);
            shoot.setVisible(false);
            if (shoot.body) shoot.body.stop();
        }
    }

    cambiarScene(jugador, salidas) {       
       
       if(salidas.tag === 'salidaCiudad' ){
            this.scene.start('entrada_ciudad', {
                x : 63,
                y : 470,
                stats : this.player.getStats()
            });
       }
        else{
            this.scene.start('zonaBosque', {
                x : 453,
                y : 160,
                stats : this.player.getStats()
            });
            this.sound.stopAll();

        }
    }

}