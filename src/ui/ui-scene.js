import { SCENE, UI, PLAYER, SPELLS } from "../constants";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ui' });
    }

    init(data) {
        this.maxHearts = data && data.stats ? data.stats : PLAYER.MAX_HEALTH_CONTAINER;
    }

    create() {
        this.hearts = this.add.group();
        this.drawHearts(this.maxHearts); // Al principio los corazones maximos son 3
        this.game.events.on('health-changed', (data) => { this.updateHearts(data.heartNum, data.actualHealth) });

        this.spellsMenu = this.add.container();
        this.drawSpellsMenu();
        this.game.events.on('change-spell', (data) => this.drawGrimores(data));

        this.game.events.on('inventoryMenu', (actualScene) => this.inventoryMenu(actualScene));

        this.ammo = this.add.group();
        this.drawProyectiles(10);
        this.game.events.on('ammo-changed', (data) => this.updateProyectiles(data.maxAmmo, data.actualAmmo));

        this.fsButton = this.add.image(SCENE.WIDTH - 300, SCENE.HEIGHT - 20, 'fullscreen');
        this.fsButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            if (this.scale.isFullscreen) this.scale.stopFullscreen();
            else this.scale.startFullscreen();
        });

        this.events.once('shutdown', () => {
            this.game.events.off('health-changed');
            this.game.events.off('change-spell');
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
        this.hearts.clear(true, true);
        for (let i = 0; i < heartNum; ++i)
            this.hearts.add(this.add.sprite(20 + i * 20, 15, 'health'));
    }

    /**
     * Actualiza la vida que se muestra con los corazones
     * @param {number} heartNum Número de corazones máximo
     * @param {number} actualHealth La vida real sobre heartNum*2 
     */
    updateHearts(heartNum, actualHealth) {
        if (heartNum > this.hearts.getLength()) this.drawHearts(heartNum);

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
        let bg = this.add.rectangle(27.5, 40, 26, 26, 0x000000, 0.7).setStrokeStyle(1, 0xffffff);
        bg.setData('background');
        this.spellsMenu.add(bg);
        this.grimore = this.add.image(27.5, 40, 'grimorio-' + SPELLS.SHOOT.KEY).setScale(0.7);
        this.spellsMenu.add(this.grimore);
    }

    /**
     * Método que dibuja los grimorios del menú de hechizos
     */
    drawGrimores(spell) {
        this.grimore.setTexture('grimorio-' + spell);
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
            if (i < actualAmmo) children[i].setFrame(0);
            else children[i].setFrame(1);
        }
    }

    inventoryMenu(actualScene) {
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