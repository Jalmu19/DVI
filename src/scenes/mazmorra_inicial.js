import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Cajas from '../game-objects/items/cajas.js'
import Banderas from '../game-objects/items/banderas.js'
import Puertas from '../game-objects/items/puertas.js'
import GameScene from "./game-scene.js";

import Spike from '../game-objects/enemy/spike.js'
import Rata from '../game-objects/enemy/rata.js'

import mazmorra from '../../assets/mapas/mazmorra.json'
import suelo from '../../assets/sprites/dungeon.png'
import puertas from '../../assets/sprites/puerta.png'
import paredesMazmorra from '../../assets/sprites/paredesMazmorra.png'
import puertasLaterales from '../../assets/sprites/puertasLaterales.png'
import cofre_verde from '../../assets/sprites/cofre_verde.png'
import cofre_azul from '../../assets/sprites/cofre_azul.png'
import cofre_amarillo from '../../assets/sprites/cofre_amarillo.png'
import cofre_morado from '../../assets/sprites/cofre_morado.png'
import bandera_verde from '../../assets/sprites/bandera_verde.png'
import bandera_morada from '../../assets/sprites/bandera_morada.png'
import bandera_azul from '../../assets/sprites/bandera_azul.png'
import bandera_amarilla from '../../assets/sprites/bandera_amarilla.png'
import antorchas from '../../assets/sprites/dungeon.png'



export default class MazmorraInicial extends GameScene{

    constructor(){
        super({key:'mazmorra_inicial'});
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }

    //preload de la escena siguiente    
    preload(){
        this.load.image('suelo', suelo);
        this.load.image('paredesMazmorra', paredesMazmorra);
        this.load.image('puerta', puertas);
        this.load.image('puertasLaterales', puertasLaterales);
        this.load.image('caja_verde', cofre_verde);
        this.load.image('caja_morada', cofre_morado);
        this.load.image('caja_azul', cofre_azul);
        this.load.image('caja_amarilla', cofre_amarillo);
        this.load.image('bandera_verde', bandera_verde);
        this.load.image('bandera_morada', bandera_morada);
        this.load.image('bandera_azul', bandera_azul);
        this.load.image('bandera_amarilla', bandera_amarilla);
        this.load.image('antorchas', antorchas);

        this.load.tilemapTiledJSON('mazmorra', mazmorra);
    }


    create(){
        var map = this.make.tilemap({key : 'mazmorra_inicial'});

        this.sonidoAbrirPuerta = this.sound.add('sonidoPuerta');

        var img1 = map.addTilesetImage('paredes', 'paredes');
        var img2 = map.addTilesetImage('suelo', 'suelo');
        var img3 = map.addTilesetImage('puerta_entrada', 'puerta_entrada');

        map.createLayer('suelo', img2, 0,0);
        var paredes_y_entrada = map.createLayer('paredesYpuerta', [img1, img3], 0,0);
        paredes_y_entrada.setCollisionByExclusion([-1], true);

 
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);



        //Recuperar datos
        const datosGuardados = this.registry.get('estado_mazmorra_inicial');

        //Cajas
        this.cajas = this.physics.add.group();
        this.capaCajas = map.getObjectLayer('Caja');

        if (datosGuardados && datosGuardados.cajas.length > 0) {
            // Si hay datos, creamos las cajas en la posición donde se quedaron
            datosGuardados.cajas.forEach(c => {
                let nuevaCaja = new Cajas(this, c.x, c.y, c);
                nuevaCaja.setTexture(c.textureKey);
                this.cajas.add(nuevaCaja);
            });
        } else {
            // Si es la primera vez, usamos el mapa de Tiled
            this.crearObjeto(this.cajas, this.capaCajas, Cajas);
        }


        //puertas
        this.puertas = this.physics.add.group();
        this.capaPuertas = map.getObjectLayer('Puertas');
        this.crearObjeto(this.puertas, this.capaPuertas, Puertas);
 

        //banderas
        this.banderas = this.physics.add.group();
        this.capaBanderas = map.getObjectLayer('Bandera');
        this.crearObjeto(this.banderas, this.capaBanderas, Banderas);
        this.physics.add.overlap(this.cajas, this.banderas,(caja, bandera) => {
            this.cajaSobreBandera(caja, bandera, this.puertas);
        }, null, this);
                
        //SALIDAS
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        this.cargarSalidas(this.capaSalidas, this.salidas);


        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);


        // Enemigos
       /* this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');

        if (datosGuardados) {
            datosGuardados.enemigos.forEach(e => {
                let spike = new Rata(this, e.x, e.y, 'rata');
                this.enemigos.add(spike);
            });
        } else {
            this.capaEnemigos.objects.forEach(obj => {
                var a = new Rata(this, obj.x, obj.y, 'rata');
                this.enemigos.add(a);
            });
        }*/
        
        this.logicaCajas(this.player, this.cajas);
        this.physics.add.collider(this.player, paredes_y_entrada);  
       // this.physics.add.collider(this.player, this.puertas); 
        this.physics.add.collider(this.puertas, paredes_y_entrada);
        this.physics.add.collider(this.cajas, this.puertas); //para que al empujar una caja no se desplace la puerta
        this.physics.add.collider(this.cajas, paredes_y_entrada); // También colisión entre las cajas y el escenario (paredes)
        this.physics.add.collider(this.enemigos, paredes_y_entrada);
        this.physics.add.collider(this.enemigos, this.enemigos);
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);     

    }

          
       cambiarScene(jugador, salidas) {
        this.guardarEstado();


        this.anims.createFromAseprite('player');
        if(salidas.tag === 'salidaSigHab' ){
           this.scene.start('mazmorra', {
            x : 48,
            y : 292,
            stats : this.player.getStats()
            });
        }
        else{
            this.scene.start('entrada_mazmorra', {
                x : 398,
                y : 20,
                stats : this.player.getStats()
            });
        }
    }
        
    guardarEstado(){
        //Guardar pos de las cajas
        let estadoCajas = [];
        this.cajas.children.iterate(caja => {
            estadoCajas.push({ x: caja.x, 
                                y: caja.y, 
                                textureKey: caja.texture.key, 
                                properties: caja.properties, 
                                name:caja.name }); 
        });

        //Guardar enemigos vivos
       /* let enemigosVivos = [];
        this.enemigos.children.iterate(enemigo => {
            if (enemigo.active) {
                enemigosVivos.push({ x: enemigo.x, y: enemigo.y, id: enemigo.name });
            }
        });*/

        //Guardamos todo en el registry bajo un ID único para esta habitación
        this.registry.set('estado_mazmorra_inicial', {
            cajas: estadoCajas,
            //enemigos: enemigosVivos,
        });
    }



    update() {
        // Recorremos todas las cajas y si no tienen a nadie empujando, velocidad 0
        this.cajas.children.iterate(caja => {
            // Si la caja se está moviendo, la frenamos
            caja.setVelocity(0); 
        });
    }

}