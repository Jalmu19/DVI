import Phaser from "phaser";
import GameScene from "./game-scene.js";
import Player from '../game-objects/player/player.js'

export default class InteriorScene extends GameScene {
    constructor() {
        super({ key: 'InteriorScene' });
    }

    init(data) {
        this.mapName = data.mapaKey;
        this.spawnX = data.x;
        this.spawnY = data.y;
        //this.playerStats = data.stats;
    }

    create() {
        const map = this.make.tilemap({ key: this.mapName });

        const tilesets = [
            map.addTilesetImage('TopDownHouse_DoorsAndWindows', 'doorsWindows'),
            map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'floorsWalls'),
            map.addTilesetImage('TopDownHouse_FurnitureState1', 'greenFurniture'),
            map.addTilesetImage('TopDownHouse_FurnitureState2', 'brownFurniture'),
            map.addTilesetImage('TopDownHouse_SmallItems', 'smallItems'),
            map.addTilesetImage('colisiones', 'colisiones'),
            map.addTilesetImage('demo church', 'demo_church')
        ];
      
        this.player = new Player(this, this.spawnX, this.spawnY, /*this.playerStats*/);
        this.player.setDepth(1);
        
        
        map.layers.forEach(layerData => {
            const layer = map.createLayer(layerData.name, tilesets, 0, 0); 

            if (layerData.name === 'bordes') {
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player, layer);
            }

            if (layerData.name === 'objetos2' || layerData.name === 'superposicion') {
                layer.setDepth(2);
            }
        });

        this.colisionesFisicas = this.physics.add.staticGroup();
        this.colisionesObjetos = map.getObjectLayer('colisiones'); 

        if(this.colisionesObjetos){
            this.colisionesObjetos.objects.forEach( object => {
                let zona = this.add.zone(object.x, object.y, object.width, object.height).setOrigin(0, 0);           
                // Le damos cuerpo físico
                this.physics.add.existing(zona, true); 
                this.colisionesFisicas.add(zona);
            })
        }

        this.physics.add.collider(this.player, this.colisionesFisicas);

        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('salidas');
        this.cargarSalidas(this.capaSalidas, this.salidas);
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);
    }

     cambiarScene(jugador, salidas){
        console.log("cambiando")
        if(salidas.tag === 'salida' ){
            this.scene.start('bosque', {
                x : 250,
                y : 370,
                stats : this.player.getStats()
            })  
        }
        else if(salidas.tag === 'salidaHabitacion' ){
            console.log("room")
            this.scene.start('InteriorScene', {
                mapaKey: 'roomjson',
                x : 100,
                y : 100,
                stats : this.player.getStats()
            })  
        }
        
        
    }
}