import { PLAYER } from "../constants";

export default class Health {

    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
     * @param {Phaser.Physics.Arcade.Sprite} player Jugador para saber si esta en iframe
    */

    constructor(scene){
        this.maxHearts = PLAYER.MAX_HEALTH_CONTAINER;
        this.actualHealth = this.maxHearts*2;
        this.containers = 0;
        this.scene = scene;
    }

     /**
     * Metodo que se encarga de reducir la vida en dmg-cantidad
     */
    reduceHealth(dmg) {
        this.actualHealth - dmg >= 0 ? this.actualHealth -= dmg : this.actualHealth = 0;
        this.scene.game.events.emit('health-changed', { heartNum: this.maxHearts, actualHealth: this.actualHealth });
    }

    /** Recupera puntos de vida */
    increaseHealth(points) {
        this.actualHealth + points < this.maxHearts*2 ? this.actualHealth += points : this.actualHealth = this.maxHearts*2;
        this.scene.game.events.emit('health-changed', { heartNum: this.maxHearts, actualHealth: this.actualHealth });
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
        if(++this.containers === PLAYER.HEALTH_PIECE){
            this.maxHearts++;
            this.actualHealth = this.maxHearts*2;   
        }
    }

    setStats(stats) {
        this.maxHearts = stats.maxHearts;
        this.actualHealth = stats.actualHealth;
        this.containers = stats.containers;

    } 

    getStats() {
        return {
            maxHearts : this.maxHearts,
            actualHealth : this.actualHealth,
            containers : this.containers
        }
    }
}