import BaseEnemy from "./baseEnemy";
import { ENEMY } from "../../constants";

export default class Avispa extends BaseEnemy {
    constructor(scene, x, y,key) {
        super(scene, x, y, key);

        this.visionRange = 400;
        this.speed = ENEMY.AVISPA.SPEED;
        this.offset = -1.5707963267948966;
        this.knockVel = 300;
        this.setDepth(10);          
    }
}