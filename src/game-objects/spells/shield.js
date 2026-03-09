export default class Shield extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'shield');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDisplaySize(30, 30);
        this.setActive(false);
        this.setVisible(false);

        this.time_start = null;
    }

    fire(x, y, rotation){
        const distance = 30;
        const origin = new Phaser.Math.Vector2(x, y);
        const pointer = this.scene.input.activePointer;
        const destiny = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
        const direction = destiny.subtract(origin);
        direction.normalize();
        const posX = x + (direction.x * distance);
        const posY = y + (direction.y * distance);
        if(this.time_start)this.time_start.remove();
        this.enableBody(true, posX, posY, true, true);

        this.time_start = this.scene.time.delayedCall(2000, () => {
            this.time_start = null;
            this.disableBody(true, true);
        });
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);
    }
}