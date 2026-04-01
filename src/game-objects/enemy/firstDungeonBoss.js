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
            this.dmgGiven = 0.5; 
            this.health = ENEMY.BOSS.HEALTH;

            this.body.setSize(45,45).setOffset(11, 12);

            //PERSIGUE AL JUGADOR
            this.isChasing = true;
            this.target = new Phaser.Math.Vector2();
            this.visionRange = 70;
            this.isRebounding = false;
            //Ejecuta una funcion cuando pase cierto tiempo
            this.scene.time.addEvent({
                delay: Phaser.Math.Between(500, 1500),  //tiempo que espera (variado, entre 500-1500ms)
                callback: this.movement,                //funcion que llama cuando se acaba el tiempo
                callbackScope: this,                    //asegura que siga siendo la clase baseenemy
                loop: false,                            //se mueven todo el rato
            })
    
            this.setupCollisions();
        }

        preUpdate(t,dt) {
            super.preUpdate(t,dt);
            //DAÑO AL JUGADOR
            if (this.scene.physics.overlap(this.scene.player.hurtbox, this)) 
                this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);

            this.movement();
        }
}