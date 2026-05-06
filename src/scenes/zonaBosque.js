import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Salidas from '../game-objects/enemy/salidas.js'
import Ladron from '../game-objects/npcs/ladron.js'
import GameScene from "./game-scene.js";
import Item from "../game-objects/item.js";

import entrada_mazmorra from '../../assets/mapas/entrada-mazmorra-bosque.json'
import zonaLago from '../../assets/mapas/zona_lago.json'

import cesped from '../../assets/sprites/cesped.png'
import plataforma_cesped from '../../assets/sprites/plataforma_cesped.png'
import puente from '../../assets/sprites/Bridges.png'
import tierra from '../../assets/sprites/tierra.png'
import piedras_tierra from '../../assets/sprites/piedras_tierra.png'
import escaleras from '../../assets/sprites/escaleras.png'
import escaleras_laterales from '../../assets/sprites/escaleras_laterales.png'
import pared_mazmorra from '../../assets/sprites/pared_mazmorra.png'
import puerta_mazmorra from '../../assets/sprites/dungeon.png'
import islotes from '../../assets/sprites/islotesLago.png'
import agua from '../../assets/sprites/agua.png'
import detalleAgua from '../../assets/sprites/detalleAgua.png'
import hielo from '../../assets/sprites/hielo.png'

import Inventory from '../inventory.js';
import Oruga from "../game-objects/enemy/oruga.js";

export default class Zona_bosque extends GameScene {

    constructor() {
        super({ key: 'zonaBosque' });
        this.numLines = 0;
        
    }
    init(datos){
        this.datos = [datos.x, datos.y, datos.stats]; 
        this.STORY = ["Jijijijijijijijiji",
            "...",
            "Has perdido: colgante de metal",
            "¿No eres una hechicera de verdad? Demuestramelo completando la mazmorra que hay siguiendo el camino a mi espalda"];
         
           
    }

    preload() {
        //Carga de elementos de entrada_mazmorra
        this.cargaEntrada_mazmorra()

        //Carga de elementos de zonaLago, si hemos pasado la dungeon
       // if(this.registry.get('passedDungeons') > 0)
            this.cargaZonaLago()

    }
    

    cargaZonaLago(){
         this.load.tilemapTiledJSON('zonaLago', zonaLago)
         this.load.image('hielo', hielo);
         this.load.image('agua', agua)
         this.load.image('islotesAgua', islotes);
         this.load.image('detalleAgua', detalleAgua);
        // this.load.image()

    }

    cargaEntrada_mazmorra(){
        this.load.tilemapTiledJSON('entrada-mazmorra-bosque', entrada_mazmorra)
        this.load.image('cesped', cesped);
        this.load.image('plataforma_cesped', plataforma_cesped);
        this.load.image('Bridges', puente);
        this.load.image('tierra', tierra);
        this.load.image('piedras_tierra', piedras_tierra);
        this.load.image('escaleras', escaleras);
        this.load.image('escaleras_laterales', escaleras_laterales);
        this.load.image('pared_mazmorra', pared_mazmorra);
        this.load.image('puerta_mazmorra', puerta_mazmorra);

    }


    create() {
        this.registry.set('escenaActual', {
            scene: 'zonaBosque', 
            x: 80,               
            y: 210               
        });
        this.initSpellEventListener();
        var map = this.make.tilemap({ key: 'zBosque' });

        var img1 = map.addTilesetImage('Villa1', 'plantilla');
        var img2 = map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('flor1', 'flor');
        var img4 = map.addTilesetImage('Hierba', 'hierba');

        map.createLayer('fondo', [img4, img1], 0, 0);
        map.createLayer('Detalles', [img3, img1], 0, 0);
        this.arboles = map.createLayer('Arboles', img2, 0, 0);

        //Crear capa de salidas, pero no configuradas

        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        
        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);
        
        //Añadiendo colision a las fisicas
        this.arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.arboles);
        //limites de camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');

        //Salidas
        this.cargarSalidas(this.capaSalidas, this.salidas);
        
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');
        this.capaEnemigos.objects.forEach(obj => {
            var a = new Oruga(this, obj.x, obj.y,'oruga');
            this.enemigos.add(a);
        })

        //Ladron        
        if (!this.registry.get('dialogLadron')){// si no hemos interactuado con el ladron antes
            this.ladron = this.physics.add.group({immovable: true, allowGravity: false });
            this.capaLadron = map.getObjectLayer('Ladron');
            this.capaLadron.objects.forEach(obj => {
                if(obj.name === "Kirbo"){
                    this.spriteLadron = new Ladron(this, obj.x, obj.y);
                    this.spriteLadron.setAlpha(0);
                    this.ladron.add(this.spriteLadron);
                }               
                else{
                    var a = new Salidas(this, obj.x, obj.y, obj.width, obj.height, obj.name);
                    this.ladron.add(a);
                }               
                
                
            })

            this.colision = this.physics.add.collider(this.player, this.ladron, this.cambiarVisibilidad, null, this);
        }

        //Capa de bloqueo   
       /* if(this.registry.get('passedDungeons') <= 0){
            this.capaMuralla = map.getObjectLayer('Bloqueo')
            this.capaMuralla.objects.forEach(obj =>{
                var a = new Salidas(this, obj.x, obj.y, obj.width, obj.height, obj.name);
                this.muro = a
                this.muro.setImmovable(true)
            })

            this.physics.add.collider(this.player, this.muro);
        }  */
        
    
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

        this.crearGrafico();
        this.numLines = 1;
        
        if (!this.registry.get('tutorialHechizo')) {
            this.mostrarTutorialHechizo();
        }
     
        this.events.once('ObjetoRecogido', () => {
        if (!this.registry.get('tutorialInventario')) {
            this.mostrarTutorialInventario();
        }
        });

        let existeMusica = this.sound.get('forestMusic');
        if (!existeMusica) {
            existeMusica = this.sound.add('forestMusic', { loop: true });
            existeMusica.play();
        } else if (!existeMusica.isPlaying) {
            existeMusica.play();
        }
    }
   

    next(){
 
        if(this.numLines === this.STORY.length){  
            this.limpiarEscena();
            this.cambiarVisibilidad(false)
        }
        else{
            this.time.delayedCall(100, () => {//delay de cuanto tarda en salir el texto
                this.dialogText.setText(this.STORY[this.numLines])
                this.numLines += 1;
                
            });
        
        }
        
    }

    limpiarEscena(){
        this.cambiarVisibilidad(false);
        this.registry.set('dialogLadron', true);
            this.tweens.add({
            targets: this.spriteLadron,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                if(this.ladron)
                this.ladron.clear(true , true)
            }
        });
        

        if(this.colision)
            this.colision.destroy()

    }

    cambiarVisibilidad(boleano){
        if(boleano){
            this.tweens.add({
                targets: this.spriteLadron,
                alpha: 1,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                }
            });

            this.sound.add('kirboSound').play();
        }
       this.dialogBox.setVisible(boleano);
       this.dialogText.setVisible(boleano)
       this.player.inDialog = boleano;
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



        this.dialogText.setText(this.STORY[0])

        this.input.on('pointerdown', ()=>{
            if (this.dialogBox.visible) {
                this.dialogText.setText("");
                this.next()
            }
           
        })

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
            
            this.scene.start('zonaLago', { 
                x : 37,
                y : 233,
                stats : this.player.getStats()})
            this.sound.stopAll();
        }
        else{
            this.scene.start('bosque', {
                x : 156,
                y : 26,
                stats : this.player.getStats()
            });
            this.sound.stopAll();
        }
    }

    mostrarTutorialHechizo() {
        const { width, height } = this.scale;
        const contenedor = this.add.container(width / 2 + 70, height / 2 + 60).setScrollFactor(0);
        contenedor.setAlpha(0);

        this.tweens.add({
            targets: contenedor,
            alpha: 1,         
            duration: 500,    
            ease: 'Power2'  
        });

        const fondo = this.add.rectangle(0, 0, 170, 30, 0x000080, 0.8);
        fondo.setStrokeStyle(2, 0xffffff);

        const mensaje = this.add.text(0, 1, 'Apuntar: click derecho\nDisparar: click izquierdo.', {
            fontSize: '10px',
            fill: '#fff',
        }).setOrigin(0.5);

        const btnCerrar = this.add.text(81, -15, 'X', {
            fontSize: '10px',
            fill: '#000000',
            backgroundColor: '#ff96ea'
        })
        .setOrigin(0.5)
        .setPadding(2)

       const zonaClick = this.add.zone(311, 135, 10, 10); 
        zonaClick.setInteractive({ useHandCursor: true });
        zonaClick.setScrollFactor(0);
        zonaClick.on('pointerdown', () => {
            this.tweens.add({
                targets: contenedor,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.registry.set('tutorialHechizo', true);
                    contenedor.destroy();
                    zonaClick.destroy();
                }
            });
        });

        contenedor.add([fondo, mensaje, btnCerrar]);
        contenedor.setDepth(100);
    }

    mostrarTutorialInventario(){
      const { width, height } = this.scale;
        const contenedor = this.add.container(width / 2 + 70, height / 2 + 60).setScrollFactor(0);
        contenedor.setAlpha(0);

        this.tweens.add({
            targets: contenedor,
            alpha: 1,         
            duration: 500,    
            ease: 'Power2'  
        });

        const fondo = this.add.rectangle(0, 0, 170, 30, 0x000080, 0.8);
        fondo.setStrokeStyle(2, 0xffffff);

        const mensaje = this.add.text(0, 1, 'Abrir inventario : F.', {
            fontSize: '12px',
            fill: '#fff',
        }).setOrigin(0.5);

        const btnCerrar = this.add.text(81, -15, 'X', {
            fontSize: '10px',
            fill: '#000000',
            backgroundColor: '#ff96ea'
        })
        .setOrigin(0.5)
        .setPadding(2)

       const zonaClick = this.add.zone(311, 135, 10, 10); 
        zonaClick.setInteractive({ useHandCursor: true });
        zonaClick.setScrollFactor(0);
        zonaClick.on('pointerdown', () => {
            this.tweens.add({
                targets: contenedor,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.registry.set('tutorialInventario', true);
                    contenedor.destroy();
                    zonaClick.destroy();
                }
            });
        });

        contenedor.add([fondo, mensaje, btnCerrar]);
        contenedor.setDepth(100);
    }
    
}