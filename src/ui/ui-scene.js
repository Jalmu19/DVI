export default class UIScene extends Phaser.Scene {
    constructor(){
        super({key:'ui'});
    }

    create() {
        this.hearts = this.add.group();
        this.drawHearts(3); // Al principio los corazones maximos son 3 TODO crear clase de constantes

        this.game.events.on('health-changed', (data) => {this.updateHearts(data.heartNum, data.actualHealth)});
    }

    drawHearts(heartNum) {
        for(let i = 0;  i < heartNum; ++i)
            this.hearts.add(this.add.sprite(20 + i*20,15,'health').setDepth(1).setScrollFactor(0));
    }

    updateHearts(heartNum, actualHealth) {
        if(heartNum > this.hearts.length) this.drawHearts(heartNum);
        
        let children = this.hearts.getChildren();
        for(let i = 0; i < children.length; ++i) {
            const heart = Math.max(0, Math.min(2, actualHealth - i  * 2));
            if(heart >= 2) children[i].setFrame(0);
            else if(heart >= 1.5) children[i].setFrame(1);
            else if(heart >= 1) children[i].setFrame(2);
            else if(heart >= 0.5) children[i].setFrame(3);
            else children[i].setFrame(4);
        }
    }
}