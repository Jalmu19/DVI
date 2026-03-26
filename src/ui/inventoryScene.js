import Phaser from "phaser";
import Inventory from '.././inventory.js';

export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InventoryScene' });
        this.positions = [];
        this.cursor = 0;
    }

    create() {
        this.inventoryLogic = Inventory;
        this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7).setOrigin(0);
        this.paintInventory();
    }

    paintInventory() {
        const columns = 5;
        const size = 60;

        this.inventoryLogic.getItems().forEach((item, index) => {
            const x = 100 + (index % columns) * (size + 10);
            const y = 100 + Math.floor(index / columns) * (size + 10);

            this.add.image(x, y, 'slot_bg');
            
            if (item) this.add.image(x, y, item.texture)

            this.slots.push({ x, y });
        });
    }

    updateCursorPosition() {
        const target = this.slots[this.cursor];

        this.tweens.add({
            targets: this.cursor,
            x: target.x,
            y: target.y,
            duration: 100,
            ease: 'Power2'
        });
    }
}