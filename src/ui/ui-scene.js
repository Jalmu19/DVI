export default class UIScene extends Phaser.Scene {
    constructor(){
        super({key:'ui'});
    }

    create() {
        this.hearts = this.add.group();
        this.drawHearts(3); // Al principio los corazones maximos son 3 TODO crear clase de constantes
        this.game.events.on('health-changed', (data) => {this.updateHearts(data.heartNum, data.actualHealth)});

        this.spells = ['shoot']; // Teniendo solo un hechizo no se podra abrir el menú
        this.menuX = 320 / 2;
        this.menuY = 180 / 2;
        this.spellsMenu = this.add.container(this.menuX,this.menuY);
        this.drawSpellsMenu();
        this.game.events.on('spell-gained', (data) => { this.spells.push(data); this.drawGrimores(); }) // Data será el tag del hechizo 
        this.game.events.on('open-menu', () => this.updateSpellsMenu());
        this.game.events.on('close-menu', () => this.spellsMenu.setVisible(false));
    }

    /**
     * Método que dibuja los corazones en la pantalla 
     * @param {number} heartNum Número de corazones máximo 
     */
    drawHearts(heartNum) {
        for(let i = 0;  i < heartNum; ++i)
            this.hearts.add(this.add.sprite(20 + i*20,15,'health'));
    }

    /**
     * Actualiza la vida que se muestra con los corazones
     * @param {number} heartNum Número de corazones máximo
     * @param {number} actualHealth La vida real sobre heartNum*2 
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
        let bg = this.add.circle(0, 0, 70, 0x000000, 0.7);
        this.spellsMenu.add(bg);
        this.drawGrimores();
    }
    
    /**
     * Método que dibuja los grimorios del menú de hechizos
     */
    drawGrimores() {
        const radius = 40;
        
        for(let i = 0; i < this.spells.length; ++i) {
            const rad = Phaser.Math.DegToRad((i * (360 / this.spells.length)) - 90);
            let x = Math.cos(rad) * radius;
            let y = Math.sin(rad) * radius;
            
            let icon = this.add.image(x, y, 'grimorio-basico');
            icon.setData('id', this.spells[i]);
            this.spellsMenu.add(icon);
        }
        
        this.spellsMenu.setVisible(false);
    }

    updateSpellsMenu() {
        this.spellsMenu.setVisible(true)
        const pointer = this.input.activePointer;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const angle = Phaser.Math.Angle.Between(centerX, centerY, pointer.x, pointer.y);
        let grados = Phaser.Math.RadToDeg(angle);
        if (grados < 0) grados += 360;
    }
}