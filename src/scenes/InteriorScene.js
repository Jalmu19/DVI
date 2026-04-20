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
            map.addTilesetImage('demo church', 'demo_church')
        ];

        map.layers.forEach(layerData => {
            const layer = map.createLayer(layerData.name, tilesets, 0, 0);
            
            // Si la capa tiene una propiedad en Tiled llamada "colision", activarla
            // O puedes hacerlo por nombre: if (layerData.name === 'Paredes')
            /*
            if (layerData.properties.some(p => p.name === 'collides' && p.value === true)) {
                layer.setCollisionByExclusion([-1]);
                this.physics.add.collider(this.player, layer);
            }
                */
        });

        this.player = new Player(this, this.spawnX, this.spawnY, /*this.playerStats*/);

        // 4. Configurar las salidas (siempre se debe llamar "Salidas" en Tiled)
        /*
        const capaSalidas = map.getObjectLayer('Salidas');
        if (capaSalidas) {
            this.salidas = this.physics.add.group();
            this.cargarSalidas(capaSalidas, this.salidas);
            this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);
        }
            */
    }
}