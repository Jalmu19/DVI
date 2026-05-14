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
        this.input.keyboard.once('keydown-F', () => {     //Registra la accion pulsar F para cerrar el inventario
            this.game.events.emit('inventoryMenu', this.backgroundScene);
        });
    }

    paintInventory(){
        this.children.removeAll();                                                                      //Borra todo lo anterior
        this.positions = [];
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY,'inventoryBackground');     //Pinta el fondo
        this.paintItems();
        this.paintToolTip();
    }

    paintToolTip() {
        this.tooltipText = this.add.text(4, 4, '', {
            fontStyle: '"Courier New", Courier, monospace',
            fontSize: '2px',
            color: '#ffffff',
            wordWrap: { width: 120 },
            resolution: 2
        });

        this.tooltipBg = this.add.graphics();

        this.tooltip = this.add.container(0, 0, [this.tooltipBg, this.tooltipText]);
        this.tooltip.setDepth(10);
        this.tooltip.setVisible(false);
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
            img.on('pointerover', () => {
                img.setTint(0xcccccc);

                // Mostrar info del objeto
                let objetoTexto = `** ${item.name || 'Objeto'} **\n`;

                if (item.id === 'berry') {
                    objetoTexto += `Una baya que restaura un poco de salud.\nCura: Medio corazón`;
                } 
                else if (item.id.includes('staff')) {
                    if(item.id === 'staff-lago') objetoTexto += `Un báculo. \nBonus Daño : 0.5`;
                    else objetoTexto += `Un báculo viejo. \nBonus Daño : 0`;
                }

                this.tooltipText.setText(objetoTexto);

                let textBounds = this.tooltipText.getBounds();
                this.tooltipBg.clear();
                this.tooltipBg.fillStyle(0x000080, 0.85); // Negro con 85% de opacidad
                this.tooltipBg.lineStyle(1, 0xffffff, 1);

                this.tooltipBg.fillRoundedRect(0, 0, textBounds.width + 8, textBounds.height + 8, 2);
                this.tooltipBg.strokeRoundedRect(0, 0, textBounds.width + 8, textBounds.height + 8, 2);

                let posX = img.x + 20; 
                let posY = img.y - 10; 

                // Evitar que se salga de la pantalla por la derecha
                if (posX + textBounds.width + 8 > this.scale.width) {
                    posX = img.x - textBounds.width - 20; // Si no cabe, lo ponemos a la izquierda del objeto
                }
                // Evitar que se salga por abajo
                if (posY + textBounds.height + 8 > this.scale.height) {
                    posY = this.scale.height - textBounds.height - 12;
                }

                this.tooltip.setPosition(posX, posY);

                this.tooltip.setVisible(true);

            });
            img.on('pointerout', () => {
                img.clearTint();
                this.tooltip.setVisible(false);
            });
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