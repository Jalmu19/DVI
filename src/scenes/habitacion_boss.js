import Phaser from "phaser";

import Puertas from '../game-objects/items/puertas.js'
import Player from '../game-objects/player/player.js'
import GameScene from "./game-scene.js";
import Chest from '../game-objects/items/chest.js'


import FirstDungeonBoss from "../game-objects/enemy/firstDungeonBoss.js";

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

        //puertas
        this.puertas = this.physics.add.group();
        this.capaPuertas = map.getObjectLayer('Puertas');
        this.crearObjeto(this.puertas, this.capaPuertas, Puertas);


        //COFRE
        this.capaCofre = map.getObjectLayer('Cofre');
        this.cofre = this.physics.add.group({classType: Chest,
                                                    immovable: true,
                                                    allowGravity: false });
        this.llenarCofre(this.capaCofre, this.cofre);
        this.hacerVisible(this.cofre, false);

        
         //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');    
        this.cargarSalidas(this.capaSalidas, this.salidas);
        this.hacerVisible(this.salidas, false);

        

        //Cofre y salida aparecen solo cuando se mata al boss
        this.events.once('boss_dead', ()=>{
            this.hacerVisible(this.cofre, true);
            this.hacerVisible(this.salidas, true);
            this.hacerVisible(this.puertas, false); //desactivamos la puerta
        });

        //BOSS
        if(this.registry.get('passedDungeons') <= 0){ //si es la primera vez
            this.boss = this.physics.add.group();
            this.capaBoss = map.getObjectLayer('Boss');
            this.capaBoss.objects.forEach(objeto => {
                var aux =  new FirstDungeonBoss(this, objeto.x, objeto.y, 'boss');
                this.boss.add(aux);  
            });
            this.physics.add.collider(this.boss, paredes);
        }
        else if(this.registry.get('passedDungeons') == 1){ //si ya he derrotado al boss
            this.hacerVisible(this.cofre, true);
            this.hacerVisible(this.salidas, true);
        }


        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        //COLISIONES
        paredes.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, paredes);
        this.physics.add.collider(this.player, this.cofre); //COLISION CON COFRE

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player); 

    }

    cambiarScene(jugador, salidas){
        this.anims.createFromAseprite('player');
         if(salidas.tag === 'atras' ){
            this.scene.start('mazmorra', {
                x : 25,
                y : 40,
                stats : this.player.getStats()
            });
        }
        else if(salidas.tag === "salida_bosque"){
            this.scene.start('entrada_mazmorra', {
                x : 394,
                y : 46,
                stats : this.player.getStats()
            });
        }
    } 

    hacerVisible(grupo, valor){
        grupo.getChildren().forEach(g => {
            g.setVisible(valor);
            g.body.enable = valor;
        });
    }

}