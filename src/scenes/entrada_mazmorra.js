import Phaser from "phaser";
import Salidas from '../game-objects/enemy/salidas.js'
import Player from '../game-objects/player/player.js'

import mazmorra_inicial from '../../assets/mapas/mazmorra_inicial.json'
import suelo from '../../assets/sprites/dungeon.png'
import puerta from '../../assets/sprites/puerta.png'
import puerta_entrada from '../../assets/sprites/dungeon.png'
import paredes from '../../assets/sprites/dungeon.png'
import cofre_rojo from '../../assets/sprites/cofre_rojo.png'
import bandera_roja from '../../assets/sprites/bandera_roja.png'
import GameScene from "./game-scene.js";

import sonidoPuerta from '../../assets/sounds/sonidoPuerta.mp3'
import Chest from "../game-objects/items/chest.js";


export default class Entrada_mazmorra extends GameScene{

    constructor(){
        super({key:'entrada_mazmorra'}); 
        this.atravesarPlataforma = false; 
    }

    init(datos){
         this.datos = [datos.x, datos.y, datos.stats];
    }


    //preload de la escena siguiente    
    preload(){
        this.load.image('suelo', suelo);
        this.load.image('puerta_entrada', puerta_entrada);
        this.load.image('puerta', puerta);
        this.load.image('paredes', paredes);
        this.load.image('caja_roja', cofre_rojo);
        this.load.image('bandera_roja', bandera_roja);

        this.load.tilemapTiledJSON('mazmorra_inicial', mazmorra_inicial);

        this.load.audio('sonidoPuerta', sonidoPuerta);
    }


    create(){
        var map = this.make.tilemap({key : 'entrada-mazmorra-bosque'});

        var img1 = map.addTilesetImage('cesped', 'cesped');
        var img2 = map.addTilesetImage('plataforma_cesped', 'plataforma_cesped');
        var img3 = map.addTilesetImage('arbol', 'arbol');
        var img4 = map.addTilesetImage('Bridges', 'Bridges');
        var img5 = map.addTilesetImage('seta', 'seta');
        var img6 = map.addTilesetImage('florAmarilla', 'flor');
        var img7 = map.addTilesetImage('tierra', 'tierra');
        var img8 = map.addTilesetImage('piedras_tierra', 'piedras_tierra');
        var img9 = map.addTilesetImage('escaleras', 'escaleras');
        var img10 = map.addTilesetImage('pared_mazmorra', 'pared_mazmorra');
        var img11 = map.addTilesetImage('puerta_mazmorra', 'puerta_mazmorra');

        map.createLayer('Suelo', [img1, img7, img8], 0,0);
        var dungeon = map.createLayer('mazmorra', [img10, img11], 0,0);
        var plataformas = map.createLayer('Plataformas', img2, 0,0);
        map.createLayer('setitas y flores', [img5,img6 ], 0,0);
        var arboles = map.createLayer('arboles', img3, 0,0);
        map.createLayer('capa_puente', img4, 0,0);
        map.createLayer('escaleras', img9, 0,0);

        //Cofre
        this.capaCofre = map.getObjectLayer('Cofre');
        this.cofre = this.physics.add.group({classType: Chest,
            immovable: true,
            allowGravity: false });
        this.capaCofre.objects.forEach(obj => {

            // Saca las propiedades si es que tiene
            const props = obj.properties ? obj.properties.reduce((acc, p) => {
                acc[p.name] = p.value;
                return acc;
            }, {}) : {};

            const itemData = props.id ? {
                id: props.id,
                name: props.name,
                quantity: props.quantity || 1,
                texture: props.texture,
                frame: props.frame || 0
            } : null;

            var a = new Chest(this, obj.x, obj.y, obj.id, itemData)
            this.cofre.add(a)
        })


        //this.player = new Player(this, 50, 20);
        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        //COLISION CON COFRES
        this.physics.add.collider(this.player, this.cofre);

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


        dungeon.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, dungeon);


        this.colisionPlataforma = this.physics.add.collider(this.player, plataformas);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player); 


        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        
        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        this.music = this.sound.add('forestMusic');
        this.music.play();
        this.music.setLoop(true);

    }

    cambiarScene(jugador, salidas){
        this.anims.createFromAseprite('player');
        
        if(salidas.tag === 'salidaMazmorra' ){
            this.scene.start('mazmorra_inicial', {
                x : 133,
                y : 252,
                stats : this.player.getStats()
                
            });

            this.music.stop();
        }
        else{
            this.scene.start('zonaBosque', {
                x : 393,
                y : 210,
                stats : this.player.getStats()
            });
            this.music.stop();
        }
    } 

    update(){
        if(this.atravesarPlataforma)
            this.colisionPlataforma.active = false;       
        else 
            this.colisionPlataforma.active = true;

        this.atravesarPlataforma = false; //reseteo para el próximo
    }

}