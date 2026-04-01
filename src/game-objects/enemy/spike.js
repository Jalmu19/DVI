import BaseEnemy from "./baseEnemy";

export default class Spike extends BaseEnemy {

    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.body.setSize(10,9).setOffset(11, 12);
    }
    
    movement(){}
}