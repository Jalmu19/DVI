import Phaser from "phaser";
import Inventory from '.././inventory.js';

/** Clase para la interfaz grafica del inventario */
export default class InventoryScene extends Phaser.Scene {
    /**
    @param {Phaser.Scene} backgroundScene       //Escena actual
    */

    constructor() {
        super({ key: 'InventoryScene' });       //Nombre de la escena para llamarla
        this.positions = [];                    // Array para guardar las coordenadas X e Y de cada hueco 
    }

    /** Guarda la escena que estaba activa antes de abrir el inventario, para poder volver a ella. */
    init(data){
        this.backgroundScene = data.backgroundScene
    }

    create() {
        this.paintInventory();
        this.input.keyboard.on('keydown-F', () => {     //Registra la accion pulsar F para cerrar el inventario
            this.game.events.emit('inventoryMenu', this.backgroundScene);
        });
    }

    paintInventory(){
        this.children.removeAll();                                                                      //Borra todo lo anterior
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY,'inventoryBackground');     //Pinta el fondo
        this.paintItems();
    }

    paintItems() {
        const columns = 3;
        const size = 30;

        Inventory.getItems().forEach((item, index) => {
            const x = 100 + (index % columns) * (size + 10);
            const y = 90 + Math.floor(index / columns) * (size + 10);
            const box = this.add.rectangle(x, y, size, size, 0x000000, 0.5);
            box.setStrokeStyle(2, 0xffffff);
            const img = this.add.image(x, y, item.texture).setFrame(item.frame)     //Añade la imagen del item
            img.setInteractive();                                                   //Permite que se pueda hacer click en la imagen
            
            let countText = null;
            if (item.quantity > 1) {                                                //Pintar la cantidad del mismo item si hay mas de 1
                countText = this.add.text(x + 15, y + 15, `x${item.quantity}`, {
                    fontSize: '12px',
                    fontFamily: 'Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3
            });
            countText.setOrigin(0.5);
            }
            
            this.positions.push({ x, y });

            img.on('pointerdown', () => {       //Registra hacer click en el item para usarlo
                this.useItem(item, img, countText);
            });

            //Efecto de seleccionar el item cuando el raton esta encima
            img.on('pointerover', () => img.setTint(0xcccccc));
            img.on('pointerout', () => img.clearTint());
        });
    }

    useItem(itemData, sprite, texto) {
        if (itemData.id === 'berry') {
            this.game.events.emit('healPlayer', 1); 
            console.log("CURA");
        }
        else if(itemData.id.includes('staff')) {
            this.game.events.emit('change-staff', itemData);
        }
        
        Inventory.eliminateItem(itemData.id);

        // Animación visual
        this.tweens.add({
            targets: texto ? [sprite, texto] : [sprite],
            alpha: 0,
            scale: 0.5,
            duration: 200,
            onComplete: () => {     //Tras la animacion de desaparecer el item actualiza la imagen del inventario
                this.paintInventory();
            }
        });
    } 
}