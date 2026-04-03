import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Puertas from '../game-objects/items/puertas.js'
import GameScene from "./game-scene.js";
import Chest from "../game-objects/items/chest.js";




export default class HabitacionCofre extends GameScene{

    constructor(){
        super({key:'habitacion_cofre'});
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }

     create(){
        var map = this.make.tilemap({key : 'habitacion_cofre'});

        var img1 = map.addTilesetImage('paredes', 'paredes');
        var img2 = map.addTilesetImage('suelo', 'suelo');

        map.createLayer('Suelo', img2, 0,0);
        var paredes = map.createLayer('paredes', [img1], 0,0);
        paredes.setCollisionByExclusion([-1], true);

 
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

               
        //SALIDAS
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        this.cargarSalidas(this.capaSalidas, this.salidas);


        //Cofre
        this.capaCofre = map.getObjectLayer('Cofre');
        this.cofre = this.physics.add.group({classType: Chest,
                    immovable: true,
                    allowGravity: false });
        this.capaCofre.objects.forEach(obj => {
            var a = new Chest(this, obj.x, obj.y)
            this.cofre.add(a)
        })


        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        //COLISION CON COFRES
        this.physics.add.collider(this.player, this.cofre);

        this.physics.add.collider(this.player, paredes);  
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);     

    }

          
       cambiarScene(jugador, salidas) {
        this.anims.createFromAseprite('player');
        if(salidas.tag === 'salidaMazmorra' ){
           this.scene.start('mazmorra', {
            x : 436,
            y : 145,
            stats : this.player.getStats()
            });
        }
    }
        
}