export default class Spike extends Phaser.GameObjects.Sprite {
    /**
     * Constructor del pincho para probar la funcionalidad de la vida
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */

    constructor(scene, x, y){
        super(scene, x, y, 'spike');
        this.setScale(0.25);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);
        //cambiar hitbox
        this.body.setSize(50,60).setOffset(77.5,97.5);
        this.dmgGiven = 0.5;

        
    }

    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        if (this.scene.physics.overlap(this.scene.player, this)) {
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);
        }
    }
}