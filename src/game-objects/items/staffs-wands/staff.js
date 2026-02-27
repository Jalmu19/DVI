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
<<<<<<< HEAD
        //this.setOrigin(0,1)
        //this.setAngle(-60);
=======
        this.setOrigin(0.375,0.625)
>>>>>>> 39eb570badf4ab83a7cf397197de0c50dbe85aa4
        this.player = player;
        this.scene.input.mouse.disableContextMenu();
        this.scene.input.on('pointerdown', pointer => {
            if(pointer.isDown){
                if(pointer.rightButtonDown()) {
                    this.setActive(true).setVisible(true);
<<<<<<< HEAD
                    if(pointer.leftButtonDown()) console.log("DISPARA");
=======
                    if(pointer.leftButtonDown()) this.player.lanzarHechizo(this.x,this.y, this.rotation);
>>>>>>> 39eb570badf4ab83a7cf397197de0c50dbe85aa4
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
<<<<<<< HEAD
        this.x = this.player.x - 7;
        this.y = this.player.y + 7.5;
        const pointer = this.scene.input.activePointer;
        this.rotation = Phaser.Math.Angle.Between(this.x,this.y - 1, pointer.x, pointer.y);
=======
        this.x = this.player.x - 5.5;
        this.y = this.player.y + 6;
        const pointer = this.scene.input.activePointer;
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY) + Phaser.Math.DegToRad(45);
>>>>>>> 39eb570badf4ab83a7cf397197de0c50dbe85aa4
    }
}