import BaseEnemy from "./baseEnemy";

export default class Rata extends BaseEnemy {

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.body.setSize(12,12).setOffset(10, 10);
    }

    movement() {}
}