import BaseEnemy from "./baseEnemy";

export default class Rata extends BaseEnemy {

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.body.setSize(12,12).setOffset(10, 10);
        this.offset = -1.5707963267948966;
    }

    movement() {}
}