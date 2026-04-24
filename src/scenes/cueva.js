import Phaser from "phaser";
import Player from '../game-objects/player/player.js'

import GameScene from "./game-scene.js";

import Chest from "../game-objects/items/chest.js";
import Rata from '../game-objects/enemy/rata.js'


export default class Cueva extends GameScene{

    constructor(){
        super({key:'escenaCueva'}); 
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }


    create(){
        var map = this.make.tilemap({key : 'mapaCueva'});

        var img1 = map.addTilesetImage('cueva', 'cueva');   

        map.createLayer('Suelo', img1, 0,0);
        var paredes = map.createLayer('Paredes', img1, 0,0);
        map.createLayer('CierreParedes', img1, 0,0);
        var detalles = map.createLayer('Detalles', img1, 0,0);


        //Cofre
        this.capaCofre = map.getObjectLayer('Cofre');
        this.cofre = this.physics.add.group({classType: Chest,
            immovable: true,
            allowGravity: false });
        this.llenarCofre(this.capaCofre, this.cofre);

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);


        // Enemigos
        this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');

        /*if (datosGuardados) {
            datosGuardados.enemigos.forEach(obj => {
                var a = new Rata(this, obj.x, obj.y, 'rata');
                this.enemigos.add(a);
            });
        } else {*/
            this.capaEnemigos.objects.forEach(obj => {
                var a = new Rata(this, obj.x, obj.y, 'rata');
                this.enemigos.add(a);
            });
       // }


       /* this.puntosLuz = this.physics.add.group();
        this.capaPuntosLuz = map.getObjectLayer('PuntosLuz');
        this.crearObjeto(this.puntosLuz, this.capaPuntosLuz, PuntosLuz);

        this.rocas = this.physics.add.group();
        this.capaRocas = map.getObjectLayer('Rocas');
        this.crearObjeto(this.rocas, this.capaRocas, Roca);*/



        //COLISION CON COFRES
        this.physics.add.collider(this.player, this.cofre);

        //COLISIONES
        detalles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, detalles);
        paredes.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, paredes);


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player); 


        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');        
        this.cargarSalidas(this.capaSalidas, this.salidas);
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

    }

    cambiarScene(jugador, salidas){    
        this.scene.start('ciudad', {
            x : 122,
            y : 138,
            stats : this.player.getStats()
            
        });     
    } 


    update() {
    // Esto mostrará la posición X e Y cada frame
    console.log(`X: ${this.player.x}, Y: ${this.player.y}`);
}

}