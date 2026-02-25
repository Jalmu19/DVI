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
        //this.setOrigin(0,1)
        //this.setAngle(-60);
        this.player = player;
        this.scene.input.mouse.disableContextMenu();
        this.scene.input.on('pointerdown', pointer => {
            if(pointer.isDown){
                if(pointer.rightButtonDown()) {
                    this.setActive(true).setVisible(true);
                    if(pointer.leftButtonDown()) console.log("DISPARA");
                }
            }  
        })
        this.scene.input.on('pointerup', pointer => {
            if(pointer.rightButtonReleased()) {
                this.setActive(false).setVisible(false);
                console.log("SUELTA");
            }
        })
    }

    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        this.x = this.player.x - 7;
        this.y = this.player.y + 7.5;
        const pointer = this.scene.input.activePointer;
        this.rotation = Phaser.Math.Angle.Between(this.x,this.y - 1, pointer.x, pointer.y);
    }
}