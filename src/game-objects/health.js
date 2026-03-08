export default class Health {

    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {Phaser.Physics.Arcade.Sprite} player Jugador para saber si esta en iframe
    */

    constructor(scene){
        this.maxHearts = 3;
        this.actualHealth = this.maxHearts*2;
        this.containers = 0;
        this.label = scene.add.text(scene.cameras.main.width - 10, 10, "", {fontSize: 15});
        this.label.setDepth(1).setScrollFactor(0).setOrigin(1,0);
        this.hearts = scene.add.group();
        for(let i = 0;  i < this.maxHearts; ++i) //Inicializacion
            this.hearts.add(scene.add.sprite(20 + i*20,15,'health').setDepth(1).setScrollFactor(0));
        this.updateHealth();
    }

     /**
     * Funcion que se encarga de reducir la vida en dmg-cantidad
     */
    reduceHealth(dmg) {
        this.actualHealth - dmg >= 0 ? this.actualHealth -= dmg : this.actualHealth = 0;
        this.updateHealth();
        this.updateHealth2();
    }

    updateHealth2() {
        let children = this.hearts.getChildren();
        for(let i = 0; i < children.length; ++i) {
            const heart = Math.max(0, Math.min(2, this.actualHealth - i  * 2));
            if(heart >= 2) children[i].setFrame(0);
            else if(heart >= 1.5) children[i].setFrame(1);
            else if(heart >= 1) children[i].setFrame(2);
            else if(heart >= 0.5) children[i].setFrame(3);
            else children[i].setFrame(4);
        }
    }

    /**
     * Actualiza la UI con la vida actual
     */
    updateHealth() {
        this.label.text = "Health: "+ this.actualHealth;
    }

    /**
     * Comprueba si esta muerto
     */
    isDead() {
        return this.actualHealth === 0;
    }

    /**
     * Incrementa el numero de partes de contenedor y comprueba si es posible aumentar la vida maxima y la recupera
     */
    addContainer() {
        if(++this.containers === 2){
            this.maxHearts++;
            this.actualHealth = this.maxHearts*2;   
        }
    }
}