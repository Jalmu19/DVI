import Phaser from "phaser";
import Inventory from '.././inventory.js';

export default class InventoryScene extends Phaser.Scene {
    /**
    @param {Phaser.Scene} backgroundScene
    */

    constructor() {
        super({ key: 'InventoryScene' });
        this.positions = [];
        this.cursor = 0;
    }

    init(data){
        this.backgroundScene = data.backgroundScene
    }

    create() {
        this.inventoryLogic = Inventory;
        this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7).setOrigin(0);
        this.paintInventory();

        this.input.keyboard.on('keydown-F', () => {
            this.game.events.emit('inventoryMenu', this.backgroundScene);
        });
    }

    paintInventory() {
        const columns = 5;
        const size = 60;

        this.inventoryLogic.getItems().forEach((item, index) => {
            const x = 100 + (index % columns) * (size + 10);
            const y = 100 + Math.floor(index / columns) * (size + 10);

            
            const img = this.add.image(x, y, item.texture).setFrame(item.frame)
                img.setInteractive();
            
                let countText = null;
                if (item.quantity > 1) {
                
                const countText = this.add.text(x + 15, y + 15, `x${item.quantity}`, {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3
                });
                countText.setOrigin(0.5); // Centrar el texto en su propia posición
            }
            

            this.positions.push({ x, y });
            img.on('pointerdown', () => {
                this.usarYDesaparecer(item, img, countText);
            });

            img.on('pointerover', () => img.setTint(0xcccccc));
            img.on('pointerout', () => img.clearTint());
        });
    }
    usarYDesaparecer(itemData, sprite, texto) {
        // Lógica de datos
        this.inventoryLogic.eliminateItem(itemData.id);

        // Animación visual
        this.tweens.add({
            targets: texto ? [sprite, texto] : [sprite],
            alpha: 0,
            scale: 0.5,
            duration: 200,
            onComplete: () => {
                // Redibujar para que los espacios se reorganicen
                this.children.removeAll(); // Borra todo lo anterior
        this.add.rectangle(0, 0, 800, 600, 0x000000, 0.7).setOrigin(0);
        this.paintInventory();
            }
        });
    } 
    updateCursorPosition() {
        const target = this.positions[this.cursor];

        this.tweens.add({
            targets: this.cursor,
            x: target.x,
            y: target.y,
            duration: 100,
            ease: 'Power2'
        });
    }
}