import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Cajas from '../game-objects/items/cajas.js'
import Banderas from '../game-objects/items/banderas.js'
import Puertas from '../game-objects/items/puertas.js'
import GameScene from "./game-scene.js";
import Rata from '../game-objects/enemy/rata.js'


import habitacion_boss from '../../assets/mapas/habitacion_boss.json'
import habitacion_cofre from '../../assets/mapas/habitacion_cofre.json'
import suelo from '../../assets/sprites/dungeon.png'
import paredes from '../../assets/sprites/dungeon.png'


export default class Mazmorra extends GameScene{

    constructor(){
        super({key:'mazmorra'});
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }

    //preload de la escena siguiente    
    preload(){
        this.load.image('suelo', suelo);
        this.load.image('paredes', paredes);
        this.load.tilemapTiledJSON('habitacion_boss', habitacion_boss);
        this.load.tilemapTiledJSON('habitacion_cofre', habitacion_cofre);

    }


    create(){
        this.registry.set('escenaActual', {
            scene: 'mazmorra', 
            x: 48,               
            y: 292,
             stats: this.datos.stats              
        });

        this.initSpellEventListener();
        var map = this.make.tilemap({key : 'mazmorra'});
        this.sonidoAbrirPuerta = this.sound.add('sonidoPuerta'); 

        var img12 = map.addTilesetImage('paredesMazmorra', 'paredesMazmorra');
        var img13 = map.addTilesetImage('antorchas', 'antorchas');
        var img15 = map.addTilesetImage('suelo', 'suelo');


        map.createLayer('Suelo', img15, 0,0);
        this.paredes_y_entrada = map.createLayer('ParedesYEntrada', [img12], 0,0);
        map.createLayer('Antorchas', img13, 0,0); //antorchas


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.paredes_y_entrada.setCollisionByExclusion([-1], true);
    
        //salidas  
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');
        this.cargarSalidas(this.capaSalidas, this.salidas);


         //Recuperar datos
        const datosGuardados = this.registry.get('estado_mazmorra');

        //puertas
        this.puertas = this.physics.add.group();
        this.capaPuertas = map.getObjectLayer('Puertas');
        this.crearObjeto(this.puertas, this.capaPuertas, Puertas);


        //cajas
        this.cajas = this.physics.add.group();
        this.capaCajas = map.getObjectLayer('Cajas');
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


        //banderas
        this.banderas = this.physics.add.group();
        this.capaBanderas = map.getObjectLayer('Banderas');
        this.crearObjeto(this.banderas, this.capaBanderas, Banderas);
        this.physics.add.overlap(this.cajas, this.banderas,(caja, bandera) => {
            this.cajaSobreBandera(caja, bandera, this.puertas);
        }, null, this);


         // Enemigos
        this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');

        if (datosGuardados) {
            datosGuardados.enemigos.forEach(obj => {
                var a = new Rata(this, obj.x, obj.y, 'rata');
                this.enemigos.add(a);
            });
        } else {
            this.capaEnemigos.objects.forEach(obj => {
                var a = new Rata(this, obj.x, obj.y, 'rata');
                this.enemigos.add(a);
            });
        }

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);

        //colisiones
        this.logicaCajas(this.player, this.cajas);
        this.physics.add.collider(this.player, this.paredes_y_entrada);  
        this.physics.add.collider(this.player, this.puertas);
        this.physics.add.collider(this.puertas, this.paredes_y_entrada);
        this.physics.add.collider(this.cajas, this.paredes_y_entrada);
        this.physics.add.collider(this.cajas, this.puertas); //para que al empujar una caja no se desplace la puerta
        this.physics.add.collider(this.enemigos, this.paredes_y_entrada);
        this.physics.add.collider(this.enemigos, this.enemigos);
        this.physics.add.collider(this.enemigos, this.puertas);
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);    
        
        if (!this.registry.get('tutorialCofres')) {
            this.mostrarTutorialCofres();
        }

    }

    cambiarScene(jugador, salidas){
        this.guardarEstado();

        if(salidas.tag === 'salidaBossFinal' ){
           this.scene.start('habitacion_boss', {
                x : 350,
                y : 112,
                stats : this.player.getStats()
            });  
            this.sound.stopAll();
        }
        else if(salidas.tag === 'salidaHabAnterior'){
            this.scene.start('mazmorra_inicial', {
                x : 81,
                y : 29,
                stats : this.player.getStats()
            });
        }
        else if(salidas.tag === 'salidaHabCofre'){
           this.scene.start('habitacion_cofre', {
                x : 23,
                y : 96,
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
        let enemigosVivos = [];
        this.enemigos.children.iterate(enemigo => {
            if (enemigo.active) {
                enemigosVivos.push({ x: enemigo.x, y: enemigo.y, id: enemigo.name });
            }
        });

        //Guardamos todo en el registry bajo un ID único para esta habitación
        this.registry.set('estado_mazmorra', {
            cajas: estadoCajas,
            enemigos: enemigosVivos,
        });
    }

    update() {
        // Recorremos todas las cajas y si no tienen a nadie empujando, velocidad 0
        this.cajas.children.iterate(caja => {
            // Si la caja se está moviendo, la frenamos
            if (caja.body.touching.none) caja.setVelocity(0); 
        });
    }

        mostrarTutorialCofres() {
        const { width, height } = this.scale;
        const contenedor = this.add.container(width / 2 + 70, height / 2 + 60).setScrollFactor(0);
        contenedor.setAlpha(0);

        this.tweens.add({
            targets: contenedor,
            alpha: 1,         
            duration: 500,    
            ease: 'Power2'  
        });

        const fondo = this.add.rectangle(0, 0, 170, 30, 0x000080, 0.8);
        fondo.setStrokeStyle(2, 0xffffff);

        const mensaje = this.add.text(0, 1, 'Empujar \no arrastrar con E + WASD', {
            fontSize: '10px',
            fill: '#fff',
        }).setOrigin(0.5);

        const btnCerrar = this.add.text(81, -15, 'X', {
            fontSize: '10px',
            fill: '#000000',
            backgroundColor: '#ff96ea'
        })
        .setOrigin(0.5)
        .setPadding(2)

       const zonaClick = this.add.zone(311, 135, 10, 10); 
        zonaClick.setInteractive({ useHandCursor: true });
        zonaClick.setScrollFactor(0);
        zonaClick.on('pointerdown', () => {
            this.tweens.add({
                targets: contenedor,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.registry.set('tutorialCofres', true);
                    contenedor.destroy();
                    zonaClick.destroy();
                }
            });
        });

        contenedor.add([fondo, mensaje, btnCerrar]);
        contenedor.setDepth(100);
    }

}