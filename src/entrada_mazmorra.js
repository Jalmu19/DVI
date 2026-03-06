import Phaser from "phaser";
import Salidas from './game-objects/enemy/salidas.js'
import Player from './game-objects/player/player.js'

import mazmorra from '../assets/mapas/mazmorra.json'
import suelo from '../assets/sprites/dungeon.png'
import puertas from '../assets/sprites/puerta.png'
import puerta_entrada from '../assets/sprites/dungeon.png'
import cofre_verde from '../assets/sprites/cofre_verde.png'
import cofre_rojo from '../assets/sprites/cofre_rojo.png'
import cofre_azul from '../assets/sprites/cofre_azul.png'
import cofre_amarillo from '../assets/sprites/cofre_amarillo.png'
import cofre_morado from '../assets/sprites/cofre_morado.png'
import bandera_verde from '../assets/sprites/bandera_verde.png'
import bandera_roja from '../assets/sprites/bandera_roja.png'
import bandera_morada from '../assets/sprites/bandera_morada.png'
import bandera_azul from '../assets/sprites/bandera_azul.png'
import bandera_amarilla from '../assets/sprites/bandera_amarilla.png'
import paredes from '../assets/sprites/dungeon.png'
import antorchas from '../assets/sprites/dungeon.png'


export default class Entrada_mazmorra extends Phaser.Scene{

    constructor(){
        super({key:'entrada_mazmorra'}); 
        this.atravesarPlataforma = false; 
    }  


    //preload de la escena siguiente    
    preload(){
        this.load.image('suelo', suelo);
        this.load.image('puertas', puertas);
        this.load.image('puerta_entrada', puerta_entrada);
        this.load.image('cofre_verde', cofre_verde);
        this.load.image('cofre_rojo', cofre_rojo);
        this.load.image('cofre_morado', cofre_morado);
        this.load.image('cofre_azul', cofre_azul);
        this.load.image('cofre_amarillo', cofre_amarillo);
        this.load.image('bandera_verde', bandera_verde);
        this.load.image('bandera_roja', bandera_roja);
        this.load.image('bandera_morada', bandera_morada);
        this.load.image('bandera_azul', bandera_azul);
        this.load.image('bandera_amarilla', bandera_amarilla);
        this.load.image('paredes', paredes);
        this.load.image('antorchas', antorchas);

        this.load.tilemapTiledJSON('mazmorra', mazmorra);
    }


    create(){
        var map = this.make.tilemap({key : 'entrada-mazmorra-bosque'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('plataforma_cesped', 'plataforma_cesped');
        var img3 = map.addTilesetImage('arbol', 'arbol');
        var img4 = map.addTilesetImage('bridge', 'puente');
        var img5 = map.addTilesetImage('seta', 'seta');
        var img6 = map.addTilesetImage('florAmarilla', 'flor');
        var img7 = map.addTilesetImage('tierra', 'tierra');
        var img8 = map.addTilesetImage('piedras_tierra', 'piedras_tierra');
        var img9 = map.addTilesetImage('escaleras', 'escaleras');
        var img10 = map.addTilesetImage('pared_mazmorra', 'pared_mazmorra');
        var img11 = map.addTilesetImage('puerta_mazmorra', 'puerta_mazmorra');

        var suelo = map.createLayer('Suelo', [img1, img7, img8], 0,0);
        map.createLayer('mazmorra', [img10, img11], 0,0);
        var plataformas = map.createLayer('Plataformas', img2, 0,0);
        map.createLayer('setitas y flores', [img5,img6 ], 0,0);
        var arboles = map.createLayer('arboles', img3, 0,0);
        map.createLayer('capa_puente', img4, 0,0);
        map.createLayer('escaleras', img9, 0,0);


        this.player = new Player(this, 0, 30);


        //COLISIONES CON PLATAFORMAS Y ESCALERAS
        plataformas.setCollisionByExclusion([-1], true);

        this.escalerasFisicas = this.physics.add.staticGroup();
        this.objetosEscaleras = map.getObjectLayer('Objetos_Escaleras'); 

        if(this.objetosEscaleras){
            this.objetosEscaleras.objects.forEach( object => {
                let zona = this.add.zone(object.x, object.y, object.width, object.height).setOrigin(0, 0);           
                // Le damos cuerpo físico
                this.physics.add.existing(zona, true); 
                this.escalerasFisicas.add(zona);
            })
        }

        //COLISION CON EL PUENTE
        this.puenteFisico = this.physics.add.staticGroup();
        this.objetoPuente = map.getObjectLayer('Objeto_puente'); 

        if(this.objetoPuente){
            this.objetoPuente.objects.forEach( object => {
                let zona = this.add.zone(object.x, object.y, object.width, object.height).setOrigin(0, 0);           
                // Le damos cuerpo físico
                this.physics.add.existing(zona, true); 
                this.puenteFisico.add(zona);
            })
        }

        //para que no se caiga del puente ni atraviese las plataformas al bajar la escalera
        this.barandillas= this.physics.add.staticGroup();
        this.objetoBarandillas = map.getObjectLayer('Barandillas'); 

        if(this.objetoBarandillas){
            this.objetoBarandillas.objects.forEach( object => {
                let zona = this.add.zone(object.x, object.y, object.width, object.height).setOrigin(0, 0);           
                // Le damos cuerpo físico
                this.physics.add.existing(zona, true); 
                this.barandillas.add(zona);
            })
        }
        this.physics.add.collider(this.player, this.barandillas);


        
        this.physics.add.overlap(this.player, [this.escalerasFisicas, this.puenteFisico], () => {
            this.atravesarPlataforma = true;
        } , null, this);



        //OTRAS COLISIONES
        arboles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, arboles);

        /**suelo.setCollisionByExclusion([-1], true);       
        this.physics.add.collider(this.player, suelo); */
        this.colisionPlataforma = this.physics.add.collider(this.player, plataformas);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player); 


        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.capaSalidas.objects.forEach(objeto =>{
            
            var a = new Salidas(this, objeto.x, objeto.y);
            this.salidas.add(a)
        })

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

    }

    cambiarScene(){
        this.anims.createFromAseprite('player');
        this.scene.start('mazmorra');
    } 

    dies() {
        this.scene.start('game-over');
    }

    update(){
        if(this.atravesarPlataforma)
            this.colisionPlataforma.active = false;       
        else 
            this.colisionPlataforma.active = true;

        this.atravesarPlataforma = false; //reseteo para el próximo
    }

}