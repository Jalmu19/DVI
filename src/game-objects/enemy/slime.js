export default class Slime extends BaseEnemy {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.body.setSize(2, 16).setOffset(5, 7);
        this.speed = ENEMY.SLIME.SPEED;
        //this.visionRange = 100;
    }

    
}