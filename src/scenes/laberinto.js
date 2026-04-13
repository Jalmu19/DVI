import Phaser from "phaser";
import Chest from '../game-objects/items/chest.js'
import Player from '../game-objects/player/player.js'
import GameScene from "./game-scene.js";
import Estrella from '../game-objects/items/estrella.js'

import cesped from "../../assets/sprites/cesped.png"
import tierra from "../../assets/sprites/tierra.png"
import arbol from "../../assets/sprites/arbol.png"
import laberinto_final from "../../assets/mapas/laberinto_final.json"


export default class Laberinto extends GameScene{

    constructor(){
        super({key:'laberinto'}); 
        this.estrellasRecogidas=0;
    }

    init(datos){
         this.datos = [datos.x, datos.y, datos.stats];
    }

    preload() {
        this.load.image('cesped', cesped);
        this.load.image('tierra', tierra);
        this.load.image('arbol', arbol);

        this.load.tilemapTiledJSON('laberinto_final', laberinto_final);
    }

    create(){
        var map = this.make.tilemap({key : 'laberinto'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('tierra', 'tierra');
        var img3 = map.addTilesetImage('arbol', 'arbol');

        map.createLayer('suelo', [img1, img2], 0,0);
        var arboles = map.createLayer('arboles', [img3], 0,0);

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]); 
        console.log(this.player.x, this.player.y);

        //COLISIONES
        arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, arboles);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.scale.resize(map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        //this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);        
        //this.cameras.main.startFollow(this.player); 

        //ESTRELLAS
        this.estrellas = this.physics.add.group();
        this.capaEstrellas = map.getObjectLayer('Estrellas');
        this.capaEstrellas.objects.forEach(objeto => {
            var aux =  new Estrella(this, objeto.x, objeto.y, 'star');
            this.estrellas.add(aux);  
        });
        this.physics.add.overlap(this.player, this.estrellas, this.collectStar, null, this);
       
        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

    }

    cambiarScene(jugador, salidas){
        this.anims.createFromAseprite('player');
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
        else if(salidas.tag === "entrada5" && this.estrellasRecogidas === 3) this.changePosition(this.player, 52, 574);
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
        if(star){
            star.disableBody(true, true); //que ya no se vea
            console.log("¡Estrella recogida!");
            this.estrellasRecogidas++;
        }
    }

}