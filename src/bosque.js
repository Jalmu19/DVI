import Phaser from "phaser";
import Player from './game-objects/player/player.js'


export default class Bosque extends Phaser.Scene{

    constructor(){
        super({key:'bosque'});
    }

  

    create(){
        var map = this.make.tilemap({key : 'mapa'});

        var img1 = map.addTilesetImage('Casa', 'casa');
        var img2 = map.addTilesetImage('Villa1', 'plantilla');
        var img3 = map.addTilesetImage('Arbol', 'arbol');
        var img4 = map.addTilesetImage('flor1', 'flor');
        var img5 = map.addTilesetImage('Iglesia', 'naranja');
        var img6 = map.addTilesetImage('IglesiaBien', 'grande');
        var img7 = map.addTilesetImage('Pozo', 'pozo');


        map.createLayer('Suelo', img2, 0,0);
        var casas = map.createLayer('Casas', [img1,img2, img5, img6, img7], 0,0);
        var arboles = map.createLayer('Arboleda', [img3, img4], 0,0);
        
        arboles.setCollisionByExclusion([-1], true);
        casas.setCollisionByExclusion([-1], true);

        this.player = new Player(this, 150,100);
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        //colision suelo-player
        this.physics.add.collider(this.player,arboles);
        this.physics.add.collider(this.player, casas);
    }

    cambiarScene(){
        if(this.player.x > 500)
            this.scene.start('end');

        this.player = new Player(this,150,100);
        //limites de camara
        //this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        /*this.cameras.main.startFollow(this.player);
        //colision suelo-player
        this.physics.add.collider(this.player,arboles);
        this.physics.add.collider(this.player, casas);*/

    }

}