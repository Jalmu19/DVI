import BaseEnemy from "./baseEnemy";
import { ENEMY } from "../../constants";

export default class FirstDungeonBoss extends BaseEnemy {
        
        /**
         * @param {Phaser.Scene} scene
         * @param {number} x Coordenada X
         * @param {number} y Coordenada Y
        */
        constructor(scene, x, y, key){
            super(scene, x, y, key);
            this.speed = ENEMY.BOSS.SPEED;
            this.dmgGiven = 1; 
            this.health = ENEMY.BOSS.HEALTH;

            this.body.setSize(45,45).setOffset(11, 12);

            //NO PERSIGUE AL JUGADOR
            this.isChasing = false;
            this.movEvent.loop = true;
        }
}