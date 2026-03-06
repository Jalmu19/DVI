import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Salidas from './game-objects/enemy/salidas.js'



export default class Mazmorra extends Phaser.Scene{

    constructor(){
        super({key:'mazmorra'});
    }



    create(){
        var map = this.make.tilemap({key : 'mazmorra'});

  
        var img2 = map.addTilesetImage('cofre_verde', 'cofre_verde');
        var img3 = map.addTilesetImage('cofre_rojo', 'cofre_rojo');
        var img4 = map.addTilesetImage('cofre_morado', 'cofre_morado');
        var img5 = map.addTilesetImage('cofre_azul', 'cofre_azul');
        var img6 = map.addTilesetImage('cofre_amarillo', 'cofre_amarillo');
        var img7 = map.addTilesetImage('bandera_verde', 'bandera_verde');
        var img8 = map.addTilesetImage('bandera_roja', 'bandera_roja');
        var img9 = map.addTilesetImage('bandera_morada', 'bandera_morada');
        var img10 = map.addTilesetImage('bandera_azul', 'bandera_azul');
        var img11 = map.addTilesetImage('bandera_amarilla', 'bandera_amarilla');
        var img12 = map.addTilesetImage('paredes', 'paredes');
        var img1 = map.addTilesetImage('puertas', 'puertas'); //puertas de dentro de la mazmorra y la de salida
        var img13 = map.addTilesetImage('antorchas', 'antorchas');
        var img14 = map.addTilesetImage('puerta_entrada', 'puerta_entrada');
        var img15 = map.addTilesetImage('suelo', 'suelo');


        map.createLayer('Suelo', img15, 0,0);
        var paredes_y_entrada = map.createLayer('ParedesYEntrada', [img12, img14], 0,0);
        map.createLayer('Antorchas', img13, 0,0); //antorchas
        map.createLayer('Cajas', [img2, img3, img4, img5, img6], 0, 0);
        map.createLayer('Banderas', [img7, img8, img9, img10, img11], 0, 0);
        map.createLayer('Puertas', [img1], 0, 0);


        this.player = new Player(this,  48, 292);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        
        //Crear capa de salidas, pero no configuradas  
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.capaSalidas.objects.forEach(objeto =>{
            
            var a = new Salidas(this, objeto.x, objeto.y);
            this.salidas.add(a)
        })
         this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        //colision paredes-player
        paredes_y_entrada.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, paredes_y_entrada);       

    }

    cambiarScene(){
        this.anims.createFromAseprite('player');
        this.scene.start('game-over');
           
    }

    dies() {
        this.scene.start('game-over');
    }

}