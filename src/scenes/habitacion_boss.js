import Phaser from "phaser";
import Salidas from '../game-objects/enemy/salidas.js'
import Player from '../game-objects/player/player.js'
import GameScene from "./game-scene.js";



export default class HabitacionBoss extends GameScene{

    constructor(){
        super({key:'habitacion_boss'}); 
    }

    init(datos){
         this.datos = [datos.x, datos.y, datos.stats];
    }

    create(){
        var map = this.make.tilemap({key : 'habitacion_boss'});

        var img1 = map.addTilesetImage('suelo', 'suelo');
        var img2 = map.addTilesetImage('paredes', 'paredes');

        map.createLayer('suelo', [img1], 0,0);
        var paredes = map.createLayer('paredes', [img2], 0,0);

        //this.player = new Player(this, 350, 112);
        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        //COLISIONES
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
        this.anims.createFromAseprite('player');
        this.scene.start('mazmorra');     
    } 

}