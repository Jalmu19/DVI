import Phaser from "phaser";
import {FRAME_BARRIL, DAÑO_BARRIL} from "../../constants";

export default class Barril extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'cueva', FRAME_BARRIL);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setImmovable(false);
        this.body.setCollideWorldBounds(true);

        this.dmgGiven=DAÑO_BARRIL;
           
        this.movement();      
    }

    movement(){
        this.scene.time.delayedCall(0, () => {
            if (this.body) {
                if(this.name==="barril7" || this.name==="barril8" || this.name === "barril5"|| this.name==="barril1"){
                    this.body.setVelocityY(150);
                    this.body.setBounce(0, 1); //rebote vertical
                }
                else{
                    this.body.setVelocityX(150);
                    this.body.setBounce(1, 0); //rebote horizontal
                }        
            }
        });
    }

    preUpdate(t, dt){
        if (this.scene.physics.overlap(this.scene.player.hurtbox, this))
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);
    }

}
