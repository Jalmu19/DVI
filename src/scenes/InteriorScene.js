import Phaser from "phaser";
import GameScene from "./game-scene.js";
import Player from '../game-objects/player/player.js'

import npc4 from '../../assets/sprites/npc-4.png'
import { NPCS } from "../constants.js";

export default class InteriorScene extends GameScene {
    constructor() {
        super({ key: 'InteriorScene' });
    }

    init(data) {
        this.mapName = data.mapaKey;
        this.spawnX = data.x;
        this.spawnY = data.y;
        this.playerStats = data.stats;
    }

    preload(){
        this.load.spritesheet('npc4', npc4, { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        const map = this.make.tilemap({ key: this.mapName });

        const tilesets = [
            map.addTilesetImage('TopDownHouse_DoorsAndWindows', 'doorsWindows'),
            map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'floorsWalls'),
            map.addTilesetImage('TopDownHouse_FurnitureState1', 'greenFurniture'),
            map.addTilesetImage('TopDownHouse_FurnitureState2', 'brownFurniture'),
            map.addTilesetImage('TopDownHouse_SmallItems', 'smallItems'),
            map.addTilesetImage('colisiones', 'colisiones'),
            map.addTilesetImage('demo church', 'demo_church')
        ];
      
        this.player = new Player(this, this.spawnX, this.spawnY,this.playerStats);
        this.player.setDepth(1);
        
        
        map.layers.forEach(layerData => {
            const layer = map.createLayer(layerData.name, tilesets, 0, 0); 

            if (layerData.name === 'bordes') {
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player, layer);
            }

            if (layerData.name === 'objetos2' || layerData.name === 'superposicion') {
                layer.setDepth(2);
            }
        });

        this.colisionesFisicas = this.physics.add.staticGroup();
        this.colisionesObjetos = map.getObjectLayer('colisiones'); 

        if(this.colisionesObjetos){
            this.colisionesObjetos.objects.forEach( object => {
                let zona = this.add.zone(object.x, object.y, object.width, object.height).setOrigin(0, 0);           
                // Le damos cuerpo físico
                this.physics.add.existing(zona, true); 
                this.colisionesFisicas.add(zona);
            })
        }

        this.physics.add.collider(this.player, this.colisionesFisicas);

        this.cargarNPCs();
        this.crearGrafico();
        
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('salidas');
        this.cargarSalidas(this.capaSalidas, this.salidas);
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        if (map.widthInPixels > this.cameras.main.width || map.heightInPixels > this.cameras.main.height) {
            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.player.setCollideWorldBounds(true);
            this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        } else {
            this.cameras.main.stopFollow();
            
        const xCentral = (map.widthInPixels / 2);
        const yCentral = (map.heightInPixels / 2);
        this.cameras.main.centerOn(xCentral, yCentral);
        }
    }

    cambiarScene(jugador, salidas){
        if(salidas.tag === 'salida' ){
            this.scene.start('bosque', {
                x : 251,
                y : 381,
                stats : this.player.getStats()
            })  
        }
        else if(salidas.tag === 'salidaHabitacion' ){
            this.scene.start('InteriorScene', {
                mapaKey: 'roomjson',
                x : 60,
                y : 140,
                stats : this.player.getStats()
            })  
        }
        else if(salidas.tag === 'salidaAbajo' ){
            this.scene.start('InteriorScene', {
                mapaKey: 'homejson',
                x : 30,
                y : 50,
                stats : this.player.getStats()
            })  
        }
        else if(salidas.tag === 'salidaIglesia' ){
            this.scene.start('bosque', {
                x : 62,
                y : 207,
                stats : this.player.getStats()
            })  
        }
    }

    buscarNPCCercano() {
        const distanciaMaxima = 20; 
        const npc = this.npcs.getChildren().find(n => {
            const d = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, 
                n.x, n.y
            );
            return d < distanciaMaxima;
        });

        return npc;
    }

    lanzarDialogo(npc) {
        if (this.hablando) return;

        this.hablando = true;
        this.npcActual = npc;
        this.player.inDialog = true;
        
        const frase = npc.obtenerSiguienteDialogo();
        this.dialogText.setText(frase);

        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true);
    }

    obtenerSiguienteDialogo() {
        const frase = this.dialogos[this.indiceDialogo];

        this.indiceDialogo = (this.indiceDialogo + 1) % this.dialogos.length;

        return fraseActual;
    }

    crearGrafico(){
        this.dialogBox = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY + 60, 300, 50, 0x000000, 0.7
        ).setStrokeStyle(2, 0xffffff).setScrollFactor(0).setVisible(false);

        this.dialogText = this.add.text(this.cameras.main.centerX - 145, this.cameras.main.centerY + 40, '', { 
            fontSize: '10px', 
            fontFamily: 'monospace', 
            wordWrap: { width: 300 } 
        }
        ).setScrollFactor(0).setVisible(false);

        this.player.on('Interaccion', () => {
            if (this.hablando && this.npcActual) {
                const frase = this.npcActual.obtenerSiguienteDialogo();

                if (this.npcActual.indiceDialogo === 0) {
                    this.cerrarDialogo();
                } else {
                    this.dialogText.setText(frase);
                }
            } 
            else {
                const npc = this.buscarNPCCercano(); 
                if (npc) {
                    this.lanzarDialogo(npc);
                }
            }
        });
        this.dialogBox.setDepth(100);
        this.dialogText.setDepth(100);
    }

    cerrarDialogo(npc) {
        this.hablando = false;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        this.player.inDialog = false;
        if (this.npcActual) {
            this.npcActual.indiceDialogo = 0;
            this.npcActual = null;
        }
    }
    
    cargarNPCs(){
        const configuracionNPCs = [
            { x: 280, y: 80, texture: 'abuela_perfil', frame: null, mapa: 'homejson', data: { nombre: 'abuela', dialogos: ['Vuelve a casa cuando quieras querida.'] } },
            { x: 151, y: 50, texture: 'abuelo_perfil', frame: null, mapa: 'homejson', data: { nombre: 'abuelo', dialogos: ['Estoy seguro que vivirás grandes experiencias ahí fuera.'] } },
            { x: 160, y: 155, texture: 'cura', frame: null, mapa: 'churchjson', data: { nombre: 'cura', dialogos: ['Ten fé y tendrás suerte en tu camino.'] } },
            { x: 60, y: 350, texture: 'npc4', frame: NPCS.VIEW.FRONT, mapa: 'churchjson', data: { nombre: 'NPC1', dialogos: ['El otro día oí una voz que me susurraba: abre el inventario con la F. No sé que significa pero es una señal seguro.'] } },
        ];
        this.npcs = this.physics.add.group();
        configuracionNPCs.forEach(conf => {
            const npc = this.npcs.create(conf.x, conf.y, conf.texture, conf.frame);
            npc.nombre = conf.data.nombre;
            npc.dialogos = conf.data.dialogos;
            npc.indiceDialogo = 0;
            npc.setBodySize(20, 20);
            npc.obtenerSiguienteDialogo = function() {
                const frase = this.dialogos[this.indiceDialogo];
                this.indiceDialogo = (this.indiceDialogo + 1) % this.dialogos.length;
                return frase;
            };

            if (conf.mapa === this.mapName) {
                npc.setVisible(true);
                npc.setActive(true);
                npc.body.enable = true;
            } else {
                npc.setVisible(false);
                npc.setActive(false);
                npc.body.enable = false;
            }

            npc.setImmovable(true);
        });
        
        this.physics.add.collider(this.player, this.npcs);
    }
}