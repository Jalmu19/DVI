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

        this.freezed = false;
        this.canBeFreezed = false;

        //PERSIGUE AL JUGADOR
        this.isChasing = true;
        this.target = new Phaser.Math.Vector2();
        this.visionRange = 70;
        this.isRebounding = false;
        //Ejecuta una funcion cuando pase cierto tiempo
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(500, 1500),  //tiempo que espera (variado, entre 500-1500ms)
            callback: this.movement,                //funcion que llama cuando se acaba el tiempo
            callbackScope: this,                    //asegura que siga siendo la clase baseenemy
            loop: false,                            //se mueven todo el rato
        })

        this.setupCollisions();
    }

    movement(){
        this.setVelocity(0,0);
        if(!this.freezed){
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
    }

    takeDamage(spell){
        this.health = this.health - 1;
        console.log("ENEMIGO HERIDO, HP: ", this.health);

        if(this.health <= 0){
            this.destroy();
        }
        else{
            if(spell.isFreezer()){
                console.log("ENEMIGO CONGELADO");
                this.setTint(0x00ffff);
                this.freezed = true;
                const oldSpeed = this.speed;
                if(!this.canBeFreezed) this.speed *= 0.5;
                this.scene.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.clearTint();
                    this.freezed = false;
                    this.speed = oldSpeed;
                }
            })
            }
            else{
                this.setTint(0xff0000);
                this.scene.time.addEvent({
                delay: 500,
                callback: () => {
                    this.clearTint();
                }
            })
            }
        }
    }

    setupCollisions() {
        this.scene.physics.add.overlap(this, this.scene.player.getHechizo(), (spell) => {
            this.handleSpellCollision(spell);
        });
    }

    handleSpellCollision(spell) {
        if (this.scene.player.isProtected()) {
            this.scene.player.getPlayer(this.target);
            const angle = Phaser.Math.Angle.Between(this.target.x, this.target.y, this.x, this.y);
            this.body.velocity.setToPolar(angle, 50);
            this.isRebounding = true;
            this.scene.time.delayedCall(500, () => {
                this.isRebounding = false;
            });
        } 
        else {
            this.takeDamage(spell);
            spell.setActive(false).setVisible(false);
            spell.body.setEnable(false);
        }
    }

    preUpdate(t,dt) {
        super.preUpdate(t,dt);
        //DAÑO AL JUGADOR
        if (this.scene.physics.overlap(this.scene.player, this)) 
            this.scene.player.takeDamage(this.dmgGiven, this.x, this.y);

        if(!this.isRebounding){
            if(!this.canBeFreezed || !this.freezed){
                this.scene.player.getPlayer(this.target);
                const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
                if (distance < this.visionRange){
                    this.isChasing = true;
                    this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + 1.5707963267948966;
                }
                else {
                    this.isChasing = false;
                    this.setVelocity(0, 0);
                }
            }
            else if(this.canBeFreezed) this.setVelocity(0, 0);
        }
        
    }

    
}