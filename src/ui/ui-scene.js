import { SCENE, UI , PLAYER } from "../constants";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ui' });
    }

    create() {
        this.hearts = this.add.group();
        this.drawHearts(PLAYER.MAX_HEALTH_CONTAINER); // Al principio los corazones maximos son 3 TODO crear clase de constantes
        this.game.events.on('health-changed', (data) => { this.updateHearts(data.heartNum, data.actualHealth) });

        this.spells = []; // Teniendo solo un hechizo no se podra abrir el menú
        this.chosenSpell;
        this.menuX = SCENE.WIDTH / 2;
        this.menuY = SCENE.HEIGHT / 2;
        this.spellsMenu = this.add.container(this.menuX, this.menuY);
        this.drawSpellsMenu();
        this.game.events.on('spell-gained', (data) => { this.spells.push(data); this.drawGrimores(); }) // Data será el tag del hechizo 
        this.game.events.on('open-menu', () => this.updateSpellsMenu());
        this.game.events.on('close-menu', () => this.updateSpell());
        this.game.events.on('inventoryMenu', (actualScene) => this.inventoryMenu(actualScene));

        this.ammo = this.add.group();
        this.drawProyectiles(10);
        this.game.events.on('ammo-changed', (data) => this.updateProyectiles(data.maxAmmo ,data.actualAmmo));

        this.fsButton = this.add.image(SCENE.WIDTH - 20, SCENE.HEIGHT - 20, 'fullscreen');
        this.fsButton.setInteractive().on('pointerdown', () =>{
            if (this.scale.isFullscreen) this.scale.stopFullscreen();
            else this.scale.startFullscreen();
        });

        this.events.once('shutdown', () => {
            this.game.events.off('health-changed');
            this.game.events.off('spell-gained');
            this.game.events.off('open-menu');
            this.game.events.off('close-menu');
            this.game.events.off('inventoryMenu');
            this.game.events.off('ammo-changed');
        });
    }

    /**
     * Método que dibuja los corazones en la pantalla 
     * @param {number} heartNum Número de corazones máximo 
     */
    drawHearts(heartNum) {
        for (let i = 0; i < heartNum; ++i)
            this.hearts.add(this.add.sprite(20 + i * 20, 15, 'health'));
    }

    /**
     * Actualiza la vida que se muestra con los corazones
     * @param {number} heartNum Número de corazones máximo
     * @param {number} actualHealth La vida real sobre heartNum*2 
     */
    updateHearts(heartNum, actualHealth) {
        if (heartNum > this.hearts.length) this.drawHearts(heartNum);

        let children = this.hearts.getChildren();
        for (let i = 0; i < children.length; ++i) {
            const heart = Math.max(0, Math.min(2, actualHealth - i * 2));
            if (heart >= 2) children[i].setFrame(UI.HEALTH.FULL_HEART);
            else if (heart >= 1.5) children[i].setFrame(UI.HEALTH.THREE_QUARTER_HEART);
            else if (heart >= 1) children[i].setFrame(UI.HEALTH.MID_HEART);
            else if (heart >= 0.5) children[i].setFrame(UI.HEALTH.QUARTER_HEART);
            else children[i].setFrame(UI.HEALTH.ZERO_HEART);
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
        let i = this.spellsMenu.list.length;
        while(i >= 0) {
            const objeto = this.spellsMenu.list[i];
            if (objeto instanceof Phaser.GameObjects.Image)
                this.spellsMenu.remove(objeto, true); // true = lo destruye de la memoria
            --i;
        }

        const radius = 40;

        for (let i = 0; i < this.spells.length; ++i) {
            const rad = Phaser.Math.DegToRad((i * (360 / this.spells.length)) - 90);
            let x = Math.cos(rad) * radius;
            let y = Math.sin(rad) * radius;

            let icon = this.add.image(x, y, 'grimorio-' + this.spells[i]);
            icon.setData('id', this.spells[i]);
            this.spellsMenu.add(icon);
        }

        this.spellsMenu.setVisible(false);
    }

    /**
     * Metodo que se encarga de seguir al puntero del raton para elegir el hechizo del menu
     */
    updateSpellsMenu() {
        this.spellsMenu.setVisible(true)
        const pointer = this.input.activePointer;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const angle = Phaser.Math.Angle.Between(centerX, centerY, pointer.x, pointer.y);
        let degs = Phaser.Math.RadToDeg(angle);
        if (degs < 0) degs += 360;

        // MAGIA: Calculamos el índice basado en el ángulo
        // Sumamos 90 para compensar el desfase del dibujo inicial
        let fit = (degs + 90 + (180 / this.spells.length)) % 360;
        let index = Math.floor(fit / (360 / this.spells.length));

        // Limitar el índice por si acaso
        index = Phaser.Math.Clamp(index, 0, this.spells.length - 1);

        this.chosenSpell = this.spells[index];

    }

    /**
     * Método que emite el evento para cambiar al hechizo seleccionado en la ui 
     */
    updateSpell() {
        this.spellsMenu.setVisible(false)
        this.game.events.emit('spell-changed', this.chosenSpell);
    }

    /**
     * Método que dibuja el número de proyectiles del hechizo 
     * @param {number} maxAmmo Número de máximo de proyectiles 
     */
    drawProyectiles(maxAmmo) {
        for (let i = 0; i < maxAmmo; ++i)
            this.ammo.add(this.add.sprite(SCENE.WIDTH - 60 + i * 5, 15, 'proyectiles'));
    }

    /**
     * Actualiza la vida que se muestra con los corazones
     * @param {number} maxAmmo Número de corazones máximo
     * @param {number} actualHealth La vida real sobre heartNum*2 
     */
    updateProyectiles(maxAmmo, actualAmmo) {
        if (maxAmmo > this.ammo.length) this.drawProyectiles(maxAmmo);

        let children = this.ammo.getChildren();
        for (let i = 0; i < children.length; ++i) {
            if(i < actualAmmo) children[i].setFrame(0);
            else children[i].setFrame(1);
        }
    }

    inventoryMenu(actualScene){
        if (this.scene.isActive('InventoryScene')) {
            this.scene.stop('InventoryScene');
            this.scene.resume(actualScene);
            console.log("CIERRA INVENTARIO")
        } else {
            this.scene.pause(actualScene);
            this.scene.launch('InventoryScene', { backgroundScene: actualScene });
            console.log("ABRE INVENTARIO")
        }
    }
}