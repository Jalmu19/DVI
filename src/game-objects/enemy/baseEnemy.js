export default class BaseEnemy extends Phaser.Physics.Arcade.Sprite{
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */
    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, false);
        this.body.setCollideWorldBounds(true);          //para que no se salga de los limites
        this.body.setSize(10,9).setOffset(11, 12);
        this.speed = 10;
        this.dmgGiven = 0.5; 
        this.health = 5;

        //Ejecuta una funcion cuando pase cierto tiempo
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(500, 1500),  //tiempo que espera (variado, entre 500-1500ms)
            callback: this.movement,                //funcion que llama cuando se acaba el tiempo
            callbackScope: this,                    //asegura que siga siendo la clase baseenemy
            loop: false,                            //se mueven todo el rato
        })
    }

    movement(){
        this.setVelocity(0,0);
        this.scene.time.delayedCall(200, () => {       //para que haga pausas mientras se mueve
            const randomDirection = Phaser.Math.Between(0, 3);
            if(randomDirection === 0) this.setVelocity(0, -this.speed);
            else if(randomDirection === 1) this.setVelocity(0, this.speed);
            else if(randomDirection === 2) this.setVelocity(-this.speed, 0);
            else this.setVelocity(this.speed, 0);

            this.scene.time.addEvent({
            delay: Phaser.Math.Between(500, 1500),  
            callback: this.movement,                
            callbackScope: this,                   
            loop: false,                            
        })
        })
    }

    takeDamage(){
        this.health = this.health - 1;
        console.log("ENEMIGO HERIDO, HP: ", this.health);

        if(this.health <= 0){
            this.destroy();
        }
    }

    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        if (this.scene.physics.overlap(this.scene.player, this)) 
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);
        if(this.scene.physics.add.overlap(this, this.scene.player.getHechizo(), (enemy, spell) => {
            enemy.takeDamage();
            spell.setActive(false).setVisible(false);
            spell.body.setEnable(false);
        }
        ));
        
    }

    
}