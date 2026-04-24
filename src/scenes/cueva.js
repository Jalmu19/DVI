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


    preload(){
        // Generar un círculo de luz
        this.crearCirculoLuz();
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
        this.crearOscuridad(map);


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

    crearCirculoLuz(){
        let canvas = document.createElement('canvas');
        canvas.width = 300; // Tamaño del radio de luz
        canvas.height = 300;
        let ctx = canvas.getContext('2d');
        let gradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 300);
        this.textures.addCanvas('luz-suave', canvas);
    }


   crearOscuridad(map){
        //capa negra que cubre todo el mapa
        const oscuro = this.add.graphics();
        oscuro.fillStyle(0x000000, 0.9); // Color negro, 90% de opacidad
        oscuro.fillRect(0, 0, map.widthInPixels, map.heightInPixels);
        oscuro.setDepth(10); // ponerlo por encima de todo

        //crear el foco de luz
        this.lightCircle = this.make.sprite({
            x: this.player.x,
            y: this.player.y,
            key: 'luz-suave', 
            add: false
        });

        //aplicar la máscara inversa
        const mask = new Phaser.Display.Masks.BitmapMask(this, this.lightCircle);
        mask.invertAlpha = true; // oculta lo negro donde está el círculo
        oscuro.setMask(mask);
   }


   update() {
    if (this.lightCircle) {
        this.lightCircle.x = this.player.x;
        this.lightCircle.y = this.player.y;
        }
    }
}