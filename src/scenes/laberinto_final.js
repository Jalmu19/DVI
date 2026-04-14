import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import GameScene from "./game-scene.js";
import Chest from "../game-objects/items/chest.js";



export default class Laberinto extends GameScene{

    constructor(){
        super({key:'laberinto_final'}); 
    }

    init(datos){
         this.datos = [datos.x, datos.y, datos.stats];
    }

    create(){
        var map = this.make.tilemap({key : 'laberinto_final'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('tierra', 'tierra');
        var img3 = map.addTilesetImage('arbol', 'arbol');

        map.createLayer('suelo', [img1, img2], 0,0);
        var arboles = map.createLayer('arboles', [img3], 0,0);

        
       //Cofre
        this.capaCofre = map.getObjectLayer('Cofre');
        this.cofre = this.physics.add.group({classType: Chest,
                                                immovable: true,
                                                allowGravity: false });

        this.llenarCofre(this.capaCofre, this.cofre);

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);     


        //COLISION CON COFRES
        this.physics.add.collider(this.player, this.cofre);


        //COLISIONES
        arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, arboles);

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
        this.scene.start('laberinto', {
            x : 390,
            y : 774,
            stats : this.player.getStats()
        }); 
        
    } 

}