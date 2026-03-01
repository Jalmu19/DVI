import Phaser from "phaser";
import Player from './game-objects/player/player.js'


export default class Entrada_mazmorra extends Phaser.Scene{

    constructor(){
        super({key:'entrada_mazmorra'});
    }

  

    create(){
        var map = this.make.tilemap({key : 'entrada-mazmorra-bosque'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('plataforma_cesped', 'plataforma_cesped');
        var img3 = map.addTilesetImage('arbol', 'arbol');
        var img4 = map.addTilesetImage('puente', 'puente');
        var img5 = map.addTilesetImage('seta', 'seta');
        var img6 = map.addTilesetImage('florAmarilla', 'florAmarilla');
        var img7 = map.addTilesetImage('tierra', 'tierra');
        var img8 = map.addTilesetImage('piedras_tierra', 'piedras_tierra');
        var img9 = map.addTilesetImage('escaleras', 'escaleras');
        var img10 = map.addTilesetImage('pared_mazmorra', 'pared_mazmorra');
        var img11 = map.addTilesetImage('puerta_mazmorra', 'puerta_mazmorra');
        var img12= map.addTilesetImage('seto', 'seto');

        map.createLayer('Suelo', [img1, img7, img8], 0,0);
        var mazmorra = map.createLayer('mazmorra', [img10, img11], 0,0);
        var plataformas = map.createLayer('Plataformas', [img2], 0,0);
        var naturaleza = map.createLayer('setitas y flores', [img5,img6 ], 0,0);
        var arboles = map.createLayer('arboles', [img3, img12], 0,0);
        var capa_puente = map.createLayer('capa_puente', [img4], 0,0);
        var escaleras = map.createLayer('escaleras', [img9], 0,0);
       
             
        arboles.setCollisionByExclusion([-1], true);
        mazmorra.setCollisionByExclusion([-1], true);

        plataformas.setCollisionByExclusion([-1], true);
        plataformas.forEachTile( tile => {
                tile.collideLeft = false; 
                tile.collideRight = false; 
                tile.collideDown = false;
            }
        )
        escaleras.setCollisionByExclusion([-1], false);


       /* // Colisión especial para plataformas tipo altillo 
        this.physics.add.collider(this.player, plataformas, (player, tile) => 
            { return player.body.velocity.y > 0; // solo si cae 
        });*/

        // Detectar si está en escaleras 
       /* this.physics.add.overlap(this.player, escaleras, () => 
            { this.player.enEscalera = true; });
        
        this.physics.add.overlap(this.player, escaleras, () => 
            { this.player.enEscalera = false; });
*/


        this.player = new Player(this, 150,100);
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        //colision suelo-player
        this.physics.add.collider(this.player, mazmorra); 
        this.physics.add.collider(this.player, arboles); 

    }

    cambiarScene(){
       // if(this.player.x > 500)
        //    this.scene.start('end');

        //this.player = new Player(this,150,100);
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        //colision suelo-player
        //this.physics.add.collider(this.player,arboles);
        //this.physics.add.collider(this.player, casas);

    }

}