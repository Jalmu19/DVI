import BaseEnemy from "./baseEnemy";
import { ENEMY } from "../../constants";

export default class Rata extends BaseEnemy {

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.body.setSize(12,12).setOffset(10, 10);
        this.offset = -1.5707963267948966;
        this.speed = ENEMY.RAT.SPEED;
        this.visionRange = 100;
        this.dieSound = 'ratSound';
        this.health = ENEMY.BASE_HEALTH + 2; 
    }

    movement() {}
}