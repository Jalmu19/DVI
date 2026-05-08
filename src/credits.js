import { SCENE } from "./constants";

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'credits' });
    }

    create() {
        this.add.text(10, 10, 'Pulsa ESC para volver', { 
            fontSize: 10, 
            fill: '#aaaaaa' 
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('mainmenu'); 
        });

        const creditos = [
            "=== EQUIPO ===",
            "[ERTUTAS]",
            "Programación, UI, Sprites",
            "",
            "[Sesils]",
            "Mapas interiores, música, progamación",
            "",
            "[Jalmu19]",
            "Lo que sea",
            "",
            "[yo262]",
            " Lo que sea",
            "",
            "==== ASSETS EXTERNOS ===",
            "TILESETS",
            "Lo que sea",
            "",
            "SPRITES",
            "Lo que sea",
            "",
            "==== HERRAMIENTAS ====",
            "Desarrollado con Phaser 3",
            "Sprites diseñados con Aseprite",
            "Mapas creados con Tiled",
            "Música creada con ---Lo que sea---",
            "",
            "¡GRACIAS POR JUGAR!"
        ];

        let textoAnimado = this.add.text(SCENE.WIDTH / 2, SCENE.HEIGHT + 100, creditos, { 
            fontSize: 12.5, 
            fill: '#cccccc'
        }).setOrigin(0.5).setAlign('center');

        this.tweens.add({
            targets: textoAnimado,
            y: -textoAnimado.height,
            duration: 15000,
            repeat: -1
        });


    }
}