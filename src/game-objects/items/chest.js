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
        }
    }
}