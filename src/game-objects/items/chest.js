import Phaser from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
    /**
     * Constructor del cofre
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */

    constructor(scene, x, y, id, itemData) {
        super(scene, x, y, 'chest');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.id = id;
        this.itemIn = itemData;
        this.body.setSize(16, 17).setOffset(8, 8);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true); 
        this.body.setCollideWorldBounds(true);
        this.interactuable = true;
        if (scene.registry.get('openedChests').includes(this.scene.scene.key + "_" + this.id)) {
            this.isOpened = true;
            this.play('open');
        }
        else {
            this.isOpened = false;
            this.play('closed');
        }
    }

    /**
     * Metodo que abre el cofre (cambiando dicho sprite) y dando al jugador el objeto en su interior
     */
    interact(player) {
        if(!this.isOpened) {
            this.play('open');
            this.isOpened  = true;
            let openedChests = this.scene.registry.get('openedChests');
            openedChests.push(this.scene.scene.key + "_" + this.id);
            this.scene.registry.set('openedChests',openedChests);
            player.acquireFromChest(this.itemIn);

            // Obtenemos el nombre del item o un genérico si no tiene
            let itemName = this.itemIn ? this.itemIn.name : "Objeto desconocido";
            this.scene.dialogo("Has recibido: " + itemName);
            
            if(itemName === "hechizo de hielo"){
                this.scene.time.delayedCall(4000, () => {
                    this.mostrarTutorialCambiarHechizos();
                });
            }
            this.scene.sound.add('chestSound').play();
        }
    }

    mostrarTutorialCambiarHechizos(){
        const contenedor = this.scene.add.container(320 / 2 + 70, 180 / 2 + 60).setScrollFactor(0);
        contenedor.setAlpha(0);

        this.scene.tweens.add({
            targets: contenedor,
            alpha: 1,         
            duration: 500,    
            ease: 'Power2'  
        });

        const fondo = this.scene.add.rectangle(0, 0, 170, 30, 0x000080, 0.8);
        fondo.setStrokeStyle(2, 0xffffff);

        const mensaje = this.scene.add.text(0, 1, 'Cambiar hechizos : Tabulador', {
            fontSize: '10px',
            fill: '#fff',
        }).setOrigin(0.5);

        const btnCerrar = this.scene.add.text(81, -15, 'X', {
            fontSize: '10px',
            fill: '#000000',
            backgroundColor: '#ff96ea'
        })
        .setOrigin(0.5)
        .setPadding(2)

       const zonaClick = this.scene.add.zone(311, 135, 10, 10); 
        zonaClick.setInteractive({ useHandCursor: true });
        zonaClick.setScrollFactor(0);
        zonaClick.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: contenedor,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    contenedor.destroy();
                    zonaClick.destroy();
                }
            });
        });

        contenedor.add([fondo, mensaje, btnCerrar]);
        contenedor.setDepth(100);
    }

}