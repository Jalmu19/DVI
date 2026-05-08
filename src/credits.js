import { SCENE } from "./constants";

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'credits' });
    }

    create() {
        this.add.text(20, 20, 'Pulsa ESC para volver', { 
            fontSize: '18px', 
            fill: '#aaaaaa' 
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('mainmenu'); 
        });

        const creditos = `
            [ERTUTAS]
            Programación, UI, Sprites

            [Sesils]
            Mapas interiores, música, progamación

            [Jalmu19]
            Lo que sea

            [yo262]
            Lo que sea

            ==== ASSETS EXTERNOS ===
            TILESETS
                Lo que sea
            
            SPRITES
                Lo que sea

            ==== HERRAMIENTAS ====
            Desarrollado con Phaser 3
            Sprites diseñados con Aseprite
            Mapas creados con Tiled
            Música creada con ---Lo que sea---

            ¡GRACIAS POR JUGAR!







        `;

        let textoAnimado = this.add.text(SCENE.WIDTH / 2, SCENE.HEIGHT + 100, creditos, { 
            fontSize: '24px', 
            fill: '#cccccc',
            align: 'center'
        }).setOrigin(0.5, 0.5).setAlign('center');

        this.tweens.add({
            targets: textoAnimado.height,
            y: -textoAnimado - 50,
            duration: 15000,
            repeat: -1
        });


    }
}