import Player from '../game-objects/player/player.js'

import mapaCueva from '../../assets/mapas/mapaCueva.json'
import tileCueva from '../../assets/sprites/cueva.png'
import GameScene from "./game-scene.js";



export default class Entrada_cueva extends GameScene{

    constructor(){
        super({key:'entrada_cueva'}); 
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }


    //preload de la escena siguiente    
    preload(){
        this.load.tilemapTiledJSON('mapaCueva', mapaCueva);
    }


    create(){
        this.initSpellEventListener();
        var map = this.make.tilemap({key : 'entrada_cueva'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('cueva', 'cueva');   
        var img3 = map.addTilesetImage('arbol', 'arbol');


        map.createLayer('Suelo', [img1], 0,0);
        map.createLayer('Entrada', img2, 0,0);
        map.createLayer('Cueva', img2, 0,0);
        this.decoraciones = map.createLayer('Decoracion', img2, 0,0);
        this.arboles = map.createLayer('Arboles', img3, 0,0);

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);


        //OTRAS COLISIONES
        this.arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.arboles);


        this.decoraciones.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.decoraciones);


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
        
       if(salidas.tag === 'entradaCueva' ){
            this.scene.start('escenaCueva', {
                x : 961,
                y : 986,
                stats : this.player.getStats()
                
            });

            this.sound.stopAll();
        }
        else{
            this.scene.start('entrada_ciudad', {
                x : 34,
                y : 27,
                stats : this.player.getStats()
            });
        }
    } 

}