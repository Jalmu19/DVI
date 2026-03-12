export default class UIScene extends Phaser.Scene {
    constructor(){
        super({key:'ui'});
    }

    create() {
        this.hearts = this.add.group();
        this.drawHearts(3); // Al principio los corazones maximos son 3 TODO crear clase de constantes
        this.game.events.on('health-changed', (data) => {this.updateHearts(data.heartNum, data.actualHealth)});

        this.spells = ['basic']; // Al principio solo se tiene el basico. Teniendo solo un hechizo no se podra abrir el menú
        this.menuX = 320 / 2;
        this.menuY = 180 / 2;
        this.spellsMenu = this.add.container(this.menuX,this.menuY);
        this.drawSpellsMenu();
        this.game.events.on('spell-gained', (data) => {this.spells.push(data)}) // Data será el tag del hechizo 
        this.game.events.on('open-menu', () => this.spellsMenu.setVisible(true));
        this.game.events.on('close-menu', () => this.spellsMenu.setVisible(false));
    }

    /**
     * Método que dibuja los corazones en la pantalla 
     */
    drawHearts(heartNum) {
        for(let i = 0;  i < heartNum; ++i)
            this.hearts.add(this.add.sprite(20 + i*20,15,'health'));
    }

    /**
     * Actualiza la vida que se muestra con los corazones
     */
    updateHearts(heartNum, actualHealth) {
        if(heartNum > this.hearts.length) this.drawHearts(heartNum);
        
        let children = this.hearts.getChildren();
        for(let i = 0; i < children.length; ++i) {
            const heart = Math.max(0, Math.min(2, actualHealth - i  * 2));
            if(heart >= 2) children[i].setFrame(0);
            else if(heart >= 1.5) children[i].setFrame(1);
            else if(heart >= 1) children[i].setFrame(2);
            else if(heart >= 0.5) children[i].setFrame(3);
            else children[i].setFrame(4);
        }
    }
    
    /**
     * Método que dibuja el menú para elegir los hechizos
     */
    drawSpellsMenu() {
        let fondo = this.add.circle(0, 0, 70, 0x000000, 0.7);
        this.spellsMenu.add(fondo);
        this.spellsMenu.setVisible(false);
    }
}