import BaseEnemy from "./baseEnemy";
import { ENEMY } from "../../constants";

export default class FirstDungeonBoss extends BaseEnemy {

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.speed = ENEMY.BOSS.SPEED;
        this.dmgGiven = 1;
        this.health = ENEMY.BOSS.HEALTH;

        this.body.setSize(45, 45).setOffset(11, 12);

        this.weakSpot = scene.add.zone(x, y, 13, 15);
        scene.physics.add.existing(this.weakSpot);

        //NO PERSIGUE AL JUGADOR
        this.isChasing = false;
        this.visionRange = 0;

        this.setupBossCollisions();
    }

    setupBossCollisions() {
        this.scene.physics.add.overlap(
            this.scene.player.getHechizo(),
            this.weakSpot,
            (spell, zone) => {
                this.handleWeakSpotCollision(spell);
            },
            null,
            this
        );
    }

    handleWeakSpotCollision(spell) {
        if (spell.active) {
            this.takeDamage(spell); // Llama al takeDamage de BaseEnemy
            spell.setActive(false).setVisible(false);
            spell.body.setEnable(false);
        }
    }

    preUpdate(t,dt) {
        Phaser.Physics.Arcade.Sprite.prototype.preUpdate.call(this, t, dt);
        if (this.scene.physics.overlap(this.scene.player.hurtbox, this)) {
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);
        }

        this.weakSpot.x = this.x + 5;
        this.weakSpot.y = this.y - 12;
    }
}