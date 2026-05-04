export default class Staff extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de la varita o baculo
     * @param {Phaser.Scene} scene
     * @param {Phaser.Physics.Arcade.Sprite} player Jugador para poder acceder en todo momento a su posicion y actualizar la posicion del baculo
     */

    constructor(scene, player) {
        super(scene, 0, 0, 'palo');
        this.scene.add.existing(this);
        this.setVisible(false);
        this.setOrigin(0.21875,0.75)
        this.player = player;
        this.id = 'staff-base';
        this.bonusDmg = 0;
        this.scene.input.mouse.disableContextMenu();
        this.onPointerDown = pointer => {
            if(pointer.isDown){
                if(pointer.rightButtonDown()) {
                    this.setActive(true).setVisible(true);
                    if(pointer.leftButtonDown()) this.player.lanzarHechizo(this.x,this.y, this.rotation - Phaser.Math.DegToRad(45), this.bonusDmg);
                }
            }  
        }
        this.onPointerUp = pointer => {
            if(pointer.rightButtonReleased()) {
                this.setActive(false).setVisible(false);
                console.log("SUELTA");
            }
        }
        this.scene.input.on('pointerup', this.onPointerUp)
        this.scene.input.on('pointerdown', this.onPointerDown);

        this.once('destroy', () => {
            this.scene.input.off('pointerdown', this.onPointerDown);
            this.scene.input.off('pointerup', this.onPointerUp);
        });
    }

    /**
     * Actualiza el bonus de daño que tiene esa varita
     * @param {Number} bonus 
     */
    setStats(stats) {
        this.bonusDmg = stats.bonus;
        this.id = stats.id;
        if (stats.texture) this.setTexture(stats.texture);
    }

    getStats() {
        return {
            id : this.id,
            bonus : this.bonusDmg,
            texture : this.texture
        }
    }

    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        this.x = this.player.x;
        this.y = this.player.y + 5;
        const pointer = this.scene.input.activePointer;
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y) + Phaser.Math.DegToRad(45);
    }
}