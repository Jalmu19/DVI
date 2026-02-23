export default class Health {

    constructor(){
        this.maxHearts = 3;
        this.actualHealth = this.maxHearts*2;
        this.containers = 0;
    }

    die() {
        return this.actualHealth === 0;
    }

    addContainer() {
        if(++this.containers === 2){
            this.maxHearts++;
            this.actualHealth = this.maxHearts*2;   
        }
    }

    recieveDamage() {
        this.actualHealth -= 0.5;
    }
}