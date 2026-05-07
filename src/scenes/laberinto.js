import Phaser from "phaser";
import Chest from '../game-objects/items/chest.js'
import Player from '../game-objects/player/player.js'
import GameScene from "./game-scene.js";
import Estrella from '../game-objects/items/estrella.js'

import { NUM_ESTRELLAS_LABERINTO } from "../constants.js";

import cesped from "../../assets/sprites/cesped.png"
import tierra from "../../assets/sprites/tierra.png"
import arbol from "../../assets/sprites/arbol.png"
import laberinto_final from "../../assets/mapas/laberinto_final.json"
import Avispa from "../game-objects/enemy/avispa.js";
import avispaSprite from "../../assets/sprites/avispa.png"


export default class Laberinto extends GameScene{

    constructor(){
        super({key:'laberinto'}); 
    }

    init(datos){
         this.datos = [datos.x, datos.y, datos.stats];

        if (!this.registry.has('estrellasRecogidas')) {
            this.registry.set('estrellasRecogidas', []);
        }
        if (!this.registry.has('numEstrellasRecogidas')) {
            this.registry.set('numEstrellasRecogidas', 0);
        }

        this.isDialogOpen = false;
    }

    preload() {
        this.load.image('cesped', cesped);
        this.load.image('tierra', tierra);
        this.load.image('arbol', arbol);
        this.load.image('avispaSprite', avispaSprite);
        this.load.tilemapTiledJSON('laberinto_final', laberinto_final);
    }

    create(){
        this.registry.set('escenaActual', {
            scene: 'laberinto', 
            x: 143,               
            y: 30               
        });

        this.initSpellEventListener();
        var map = this.make.tilemap({key : 'laberinto'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('tierra', 'tierra');
        var img3 = map.addTilesetImage('arbol', 'arbol');

        map.createLayer('suelo', [img1, img2], 0,0);
        this.arboles = map.createLayer('arboles', [img3], 0,0);

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]); 
        console.log(this.player.x, this.player.y);

        //COLISIONES
        this.arboles.setCollisionByExclusion([-1], true);
        //this.physics.add.collider(this.player, this.arboles);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //this.scale.resize(map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);        
        this.cameras.main.startFollow(this.player); 

        //ESTRELLAS
        // Obtenemos la lista del registry
        var recogidas = this.registry.get('estrellasRecogidas') || [];

        this.estrellas = this.physics.add.group();
        this.capaEstrellas = map.getObjectLayer('Estrellas');
        this.capaEstrellas.objects.forEach(objeto => {
            const id = `estrella_${objeto.x}_${objeto.y}`;
            if (!recogidas.includes(id)) {
                let star = new Estrella(this, objeto.x, objeto.y, 'star', [0,1, 8, 9]);
                this.estrellas.add(star);
            }
        });
        this.physics.add.overlap(this.player, this.estrellas, this.collectStar, null, this);
      
        this.avispas = this.physics.add.group({ classType: Avispa, runChildUpdate: true });
        this.physics.add.collider(this.avispas, this.avispas);
        this.generarAvispas();

        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

    }

    cambiarScene(jugador, salidas){
        var estrellas = this.registry.get('numEstrellasRecogidas');

        if(salidas.tag === "entrada"){
            this.scene.start('entrada_ciudad', {
                x : 25,
                y : 40,
                stats : this.player.getStats()
            }); 
        }
        else if(salidas.tag === "entrada1") this.changePosition(this.player, 618, 538);
        else if(salidas.tag === "entrada2") this.changePosition(this.player, 22, 489);
        else if(salidas.tag === "entrada3") this.changePosition(this.player, 366, 147);
        else if(salidas.tag === "entrada4") this.changePosition(this.player, 560, 385);
        //si hemos recogido todas las estrellas, dejamos que pase
        else if(salidas.tag === "entrada5"){
            if(estrellas===NUM_ESTRELLAS_LABERINTO)
                this.changePosition(this.player, 52, 574);
            else if(!this.isDialogOpen)
                this.dialogo("Salida bloqueada\nRecoge primero todas las estrellas.\nTe quedan: " + (NUM_ESTRELLAS_LABERINTO-estrellas) + " estrellas.")
        }
        else if(salidas.tag === "entrada6") this.changePosition(this.player, 390, 686);
        else if(salidas.tag === "salida1") this.changePosition(this.player, 23, 96);
        else if(salidas.tag === "salida2") this.changePosition(this.player, 617, 296);
        else if(salidas.tag === "salida3") this.changePosition(this.player, 210, 147);
        else if(salidas.tag === "salida4") this.changePosition(this.player, 241, 526);
        else if(salidas.tag === "salida5") this.changePosition(this.player, 123, 244);
        else if(salidas.tag === "salida6") this.changePosition(this.player, 198, 722);

        else if(salidas.tag === "salida"){
            this.scene.start('laberinto_final', {
                x : 71,
                y : 30,
                stats : this.player.getStats()
            }); 
        }
    } 

    changePosition(player, x, y){
        player.setPosition(x, y);
    }

    collectStar(player, star) {
        if (star) {
            const id = `estrella_${star.x}_${star.y}`;
            let recogidas = this.registry.get('estrellasRecogidas') || [];

            if (!recogidas.includes(id)) {
                star.disableBody(true, true);
                
                // Guardar ID
                recogidas.push(id);
                this.registry.set('estrellasRecogidas', recogidas);

                // Sumar al contador global
                let total = this.registry.get('numEstrellasRecogidas') || 0;
                this.registry.set('numEstrellasRecogidas', total + 1);
                
                console.log(total);

                if(total === NUM_ESTRELLAS_LABERINTO-1){
                    this.dialogo("¡Enhorabuena! Salida desbloqueada.");
                }
            }
        }
    }

    generarAvispas() {
        const MAX_AVISPAS = 5;

        if (Phaser.Math.Between(1, 100) > 40 && this.avispas.getLength() < MAX_AVISPAS) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 200; 
            const spawnX = this.player.x + Math.cos(angle) * distance;
            const spawnY = this.player.y + Math.sin(angle) * distance;

            const avispa = new Avispa(this, spawnX, spawnY, 'avispaSprite');
            this.avispas.add(avispa);
            console.log("avispa creada");
        }

        this.time.addEvent({
            delay: Phaser.Math.Between(3000, 7000),
            callback: this.generarAvispas,
            callbackScope: this
        });

    }
}