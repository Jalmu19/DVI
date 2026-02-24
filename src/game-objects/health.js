export default class Health {

    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {Phaser.Physics.Arcade.Sprite} player Jugador para saber si esta en iframe
    */
    constructor(scene, player){
        this.player = player;
        this.maxHearts = 3;
        this.actualHealth = this.maxHearts*2;
        this.containers = 0;
        this.label = scene.add.text(900, 10, "", {fontsize: 40});
        this.updateHealth();
    }

    takeDamage(dmg) {
        if(!this.player.invincible) {
            this.actualHealth -= dmg;
            this.updateHealth();
            this.player.knockBack();
        }
    }

    updateHealth() {
        this.label.text = "Health: "+ this.actualHealth;
    }

    dead() {
        return this.actualHealth === 0;
    }

    addContainer() {
        if(++this.containers === 2){
            this.maxHearts++;
            this.actualHealth = this.maxHearts*2;   
        }
    }
}