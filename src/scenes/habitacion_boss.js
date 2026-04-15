import Phaser from "phaser";
import Salidas from '../game-objects/enemy/salidas.js'
import Player from '../game-objects/player/player.js'
import GameScene from "./game-scene.js";
import Chest from '../game-objects/items/chest.js'


import boss from '../../assets/sprites/dungeon1-boss.png'
import FirstDungeonBoss from "../game-objects/enemy/firstDungeonBoss.js";

export default class HabitacionBoss extends GameScene{

    constructor(){
        super({key:'habitacion_boss'}); 
    }

    init(datos){
         this.datos = [datos.x, datos.y, datos.stats];
    }

    preload() {
        this.load.image('boss', boss);
    }

    create(){
        var map = this.make.tilemap({key : 'habitacion_boss'});

        var img1 = map.addTilesetImage('suelo', 'suelo');
        var img2 = map.addTilesetImage('paredes', 'paredes');

        map.createLayer('suelo', [img1], 0,0);
        var paredes = map.createLayer('paredes', [img2], 0,0);

        
        //BOSS
        this.boss = this.physics.add.group();
        this.capaBoss = map.getObjectLayer('Boss');
        this.capaBoss.objects.forEach(objeto => {
            var aux =  new FirstDungeonBoss(this, objeto.x, objeto.y, 'boss');
            this.boss.add(aux);  
        });

        
        //Cofre solo cuando se mata al boss
        this.events.once('boss_dead', ()=>{
            this.capaCofre = map.getObjectLayer('Cofre');
            this.cofre = this.physics.add.group({classType: Chest,
                                                    immovable: true,
                                                    allowGravity: false });
            this.llenarCofre(this.capaCofre, this.cofre);
            this.physics.add.collider(this.player, this.cofre); //COLISION CON COFRE
        });


        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        //COLISIONES
        paredes.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, paredes);

        this.physics.add.collider(this.boss, paredes);

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
         this.scene.start('mazmorra', {
            x : 25,
            y : 40,
            stats : this.player.getStats()
        }); 
    } 

}