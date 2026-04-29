import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Salidas from '../game-objects/enemy/salidas.js'


import villa from '../../assets/sprites/villa1.png'
import arbol from '../../assets/sprites/arbol.png'
import flor from '../../assets/sprites/florAmarilla.png'
import cuervo from '../../assets/sprites/kirbo.png'

import zonaBosque from '../../assets/mapas/zona_bosque.json'
import hierba from "../../assets/sprites/hierba.png";
import GameScene from "./game-scene.js";

import npc1 from '../../assets/sprites/npc-1.png'
import npc2 from '../../assets/sprites/npc-2.png'
import npc3 from '../../assets/sprites/npc-3.png'
import npc4 from '../../assets/sprites/npc-4.png'

import { NPCS } from "../constants.js";

export default class Bosque extends GameScene{

    constructor(){
        super({key:'bosque'});
    }

    init(datos){        
        this.datos = [datos.x, datos.y, datos.stats];
    }

    preload(){
        this.load.image('cuervoEnemigo', cuervo);
        this.load.image('plantilla', villa);
        this.load.image('arbol', arbol);
        this.load.image('flor', flor);
        this.load.image('hierba', hierba);
        this.load.spritesheet('npc1', npc1, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('npc2', npc1, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('npc3', npc1, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('npc4', npc1, { frameWidth: 32, frameHeight: 32 });
        this.load.tilemapTiledJSON('zBosque', zonaBosque);

    }
  

    create(){
        this.initSpellEventListener();
        var map = this.make.tilemap({key : 'mapa'});

        var img1 = map.addTilesetImage('Casa', 'casa');
        var img2 = map.addTilesetImage('Villa1', 'plantilla');
        var img3 = map.addTilesetImage('Arbol', 'arbol');
        var img4 = map.addTilesetImage('flor1', 'flor');
        var img5 = map.addTilesetImage('Iglesia', 'naranja');
        var img6 = map.addTilesetImage('IglesiaBien', 'grande');
        var img7 = map.addTilesetImage('Pozo', 'pozo');

        map.createLayer('Suelo', img2, 0,0);
        this.arboles = map.createLayer('Arboleda', [img3, img4, img7], 0,0);
        var casas = map.createLayer('Casas', [img1,img2, img5, img6], 0,0);

        this.player = new Player(this, this.datos[0],this.datos[1], this.datos[2]);

        var tejado = map.createLayer('Tejados', [img1,img5,img6],0,0);

        const configuracionNPCs = [
            { x: 100, y: 200, texture: 'npc1', frame: NPCS.VIEW.R_SIDE,  data: { nombre: 'NPC1', dialogos: ['hola'] } },
            { x: 100, y: 150, texture: 'npc2', frame: NPCS.VIEW.FRONT, data: { nombre: 'NPC2', dialogos: ['lol'] } },
            { x: 50, y: 150, texture: 'npc3', frame: NPCS.VIEW.L_SIDE, data: { nombre: 'NPC3', dialogos: ['xd'] } },
            { x: 100, y: 50, texture: 'npc4', frame: NPCS.VIEW.R_SIDE, data: { nombre: 'NPC4', dialogos: ['crayola'] } },
        ];
        this.npcs = this.physics.add.group();
        configuracionNPCs.forEach(conf => {
            const npc = this.npcs.create(conf.x, conf.y, conf.texture, conf.frame);
            npc.nombre = conf.data.nombre;
            npc.dialogos = conf.data.dialogos;
            npc.indiceDialogo = 0;

            npc.obtenerSiguienteDialogo = function() {
                const frase = this.dialogos[this.indiceDialogo];
                this.indiceDialogo = (this.indiceDialogo + 1) % this.dialogos.length;
                return frase;
            };

            npc.setImmovable(true);
        });
       this.physics.add.collider(this.player, this.npcs);

        this.player.on('Interaccion', () => {
            const npc = this.buscarNPCCercano(); 
            if (npc) {
                this.lanzarDialogo(npc);
            }
        });

        //Crear capa de salidas, pero no configuradas
        this.crearGrafico();

        this.arboles.setCollisionByExclusion([-1], true);
        casas.setCollisionByExclusion([-1], true);
         
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');

        this.cargarSalidas(this.capaSalidas, this.salidas);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true);
        
        //colision suelo-this.player
        this.physics.add.collider(this.player,this.arboles);
        this.physics.add.overlap(this.player, tejado,null,null,this);    
        this.physics.add.collider(this.player,casas);            
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        this.music = this.sound.add('townMusic');
        this.music.play();
        this.music.setLoop(true);

    }

    cambiarScene(){
        this.scene.start('zonaBosque', {
            x : 80,
            y : 210,
            stats : this.player.getStats()
        });   
        
        this.music.stop();
    }

    buscarNPCCercano() {
        const distanciaMaxima = 60; 
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
        this.player.body.setVelocity(0);
        
        

        const frase = npc.obtenerSiguienteDialogo();
        this.dialogText.setText(npc.nombre, frase);

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

        this.input.on('pointerdown', ()=>{
            if (this.dialogBox.visible) {
                this.dialogText.setText("");
                this.next()
            }
           
        })

    }

    cerrarDialogo(npc) {
        this.hablando = false;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        
        if (this.npcActual) {
            this.npcActual.indiceDialogo = 0;
            this.npcActual = null;
        }
    }
}