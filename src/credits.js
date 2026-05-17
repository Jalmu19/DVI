import { SCENE } from "./constants";

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'credits' });
    }

    create() {
        this.add.text(10, 10, 'Pulsa ESC para volver', { 
            fontSize: 10, 
            fill: '#aaaaaa',
            fontFamily: 'monospace'
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('mainmenu'); 
        });

        const creditos = ["",
            "Enchantments",
            "",
            "=== EQUIPO ===",
            "[ERTUTAS]",
            "Programación, UI, Sprites",
            "",
            "[Sesils]",
            "Mapas interiores, música, progamación",
            "",
            "[Jalmu19]",
            "Programacion, mapas",
            "",
            "[yo262]",
            " Mapas, programación",
            "",
            "==== ASSETS EXTERNOS ===",
            "TILESETS",
            "Sunnyside World ASSET_PACK_V2.1\n by danieldiggle",
            "Free GoldRush AssetPack\n by Josh Stand",
            "2D Pixel Dungeon Asset Pack v2.0\n by pixel-poem",
            "(FREE) Village Top Down Asset Pack\n by judsonHolanda on Instagram",
            "The fantasy tileset castles and fortresses\n by ventilatore",
            "Medieval Village Exterior - RPG Tileset\n by Hypnobius",
            "",
            "SPRITES",
            "S001 nyknck by nyknck",
            "",
            "==== HERRAMIENTAS ====",
            "Desarrollado con Phaser 3",
            "Sprites diseñados con Aseprite",
            "Mapas creados con Tiled",
            "Música creada con Beepbox",
            "Tilsets externos con Itchio",
            "",
            "¡GRACIAS POR JUGAR!"
        ];

        let textoAnimado = this.add.text(SCENE.WIDTH / 2, SCENE.HEIGHT + 100, creditos, { 
            fontSize: 12.5,
            fontFamily: 'monospace',
            fill: '#cccccc'
        }).setOrigin(0.5).setAlign('center');

        this.tweens.add({
            targets: textoAnimado,
            y: -textoAnimado.height,
            duration: 30000,
            repeat: -1
        });


    }
}