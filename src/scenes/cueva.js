import Phaser from "phaser";
import Player from '../game-objects/player/player.js'

import GameScene from "./game-scene.js";

import Chest from "../game-objects/items/chest.js";
import Rata from '../game-objects/enemy/rata.js'
import Luminarias from '../game-objects/items/luminarias.js'
import Barril from '../game-objects/items/barriles.js'


export default class Cueva extends GameScene{

    constructor(){
        super({key:'escenaCueva'}); 
        this.atravesarPlataforma = false; 
    }

    init(datos){
        this.datos = [datos.x, datos.y, datos.stats];
    }


    preload(){
        // Generar un círculo de luz
        this.crearCirculoLuz();

    }


    create(){
        var map = this.make.tilemap({key : 'mapaCueva'});

        var img1 = map.addTilesetImage('cueva', 'cueva');   

        map.createLayer('Suelo', img1, 0,0);
        var paredes = map.createLayer('Paredes', img1, 0,0);
        map.createLayer('CierreParedes', img1, 0,0);
        var detalles = map.createLayer('Detalles', img1, 0,0);


        //Cofre
        this.capaCofre = map.getObjectLayer('Cofre');
        this.cofre = this.physics.add.group({classType: Chest,
            immovable: true,
            allowGravity: false });
        this.llenarCofre(this.capaCofre, this.cofre);

        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);
        this.crearOscuridad(map);


        // Enemigos
        this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');
        this.capaEnemigos.objects.forEach(obj => {
            var a = new Rata(this, obj.x, obj.y, 'rata');
            this.enemigos.add(a);
        });
        

       //Puntos de luz
        this.luminarias = this.physics.add.group();
        this.capaLuminarias = map.getObjectLayer('Luminarias');
        this.capaLuminarias.objects.forEach(objeto => {
            var aux = new Luminarias(this, objeto.x, objeto.y);
            aux.encendida = false;
            this.luminarias.add(aux);
        });
        this.physics.add.overlap(this.player, this.luminarias, this.activarLuz, null, this);


        //Barriles
        this.barriles = this.physics.add.group();
        this.capaBarriles = map.getObjectLayer('Barriles');
        this.capaBarriles.objects.forEach(objeto => {
            var aux = new Barril(this, objeto.x, objeto.y);
            aux.setName(objeto.name);
            this.barriles.add(aux);
        });


        //Pared que que permite bajar, no subir
        this.paredBajada = this.physics.add.staticGroup();
        this.objetoBajada = map.getObjectLayer('ParedBajada'); 
        this.crearZoneGameObject(this.paredBajada, this.objetoBajada);

        //colisones paredes y pared de bajada
        paredes.setCollisionByExclusion([-1], true);
        this.colisionParedes = this.physics.add.collider(this.player, paredes);
        this.physics.add.overlap(this.player, this.paredBajada, () => {
            // Si el jugador presiona ABAJO mientras está sobre el objeto 'paredBajada'
            if (this.player.cursors.down.isDown) {
                this.atravesarPlataforma = true;
            }
        }, null, this);


        //COLISION CON COFRES
        this.physics.add.collider(this.player, this.cofre);

        detalles.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, detalles);

        
        //colisión barriles con paredes. Al chocar con la pared, el bounce(1) hará que cambie de dirección solo
        this.physics.add.collider(this.barriles, paredes);
                


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player); 


        //SALIDA Y CAMBIO DE MAPA
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');        
        this.cargarSalidas(this.capaSalidas, this.salidas);
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

    }



    cambiarScene(jugador, salidas){    
        this.scene.start('entrada_ciudad', {
            x : 17,
            y : 48,
            stats : this.player.getStats()
            
        });     
    } 


    activarLuz(player, luminaria) {
        if (!luminaria.encendida) {
            luminaria.encender();

            this.tweens.add({
                targets: this.capaNegra, // El objeto Graphics que cubre todo
                alpha: 0.3,              
                duration: 2000,          // En 2 segundos se ilumina
                ease: 'Power2'
            });

            // para que el círculo del jugador crezca
            this.tweens.add({
                targets: this.lightCircle,
                scale: 2.5,              //el foco se hace más grande
                duration: 1000
            });

            // pasados 10 segundos (10000 ms), se apaga
            this.time.delayedCall(10000, () => {
                this.apagarLuz(luminaria);
            }, [], this);
        }
    }


    apagarLuz(luminaria){
        if (luminaria.encendida) {
            luminaria.apagar();

            this.tweens.add({
                targets: this.capaNegra, // El objeto Graphics que cubre todo
                alpha: 0.3,              
                duration: 5000,          
                ease: 'Power2'
            });

            // para que el círculo del jugador vuelva a hacerse pequeño
            this.tweens.add({
                targets: this.lightCircle,
                scale: 0.75,              //el foco se hace más pequeño
                duration: 1000
            });
        }
    }




    crearCirculoLuz(){
        let canvas = document.createElement('canvas');
        canvas.width = 300; // Tamaño del radio de luz
        canvas.height = 300;
        let ctx = canvas.getContext('2d');
        let gradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 300);
        this.textures.addCanvas('luz-suave', canvas);
    }


   crearOscuridad(map){
        //capa negra que cubre todo el mapa
        const oscuro = this.add.graphics();
        oscuro.fillStyle(0x000000, 0.9); // Color negro, 90% de opacidad
        oscuro.fillRect(0, 0, map.widthInPixels, map.heightInPixels);
        oscuro.setDepth(10); // ponerlo por encima de todo

        //crear el foco de luz
        this.lightCircle = this.make.sprite({
            x: this.player.x,
            y: this.player.y,
            key: 'luz-suave', 
            add: false
        });

        //aplicar la máscara inversa
        const mask = new Phaser.Display.Masks.BitmapMask(this, this.lightCircle);
        mask.invertAlpha = true; // oculta lo negro donde está el círculo
        oscuro.setMask(mask);
   }




   update() {
        if (this.lightCircle) {
            this.lightCircle.x = this.player.x;
            this.lightCircle.y = this.player.y;
        }

        if(this.atravesarPlataforma)
            this.colisionParedes.active = false;       
        else 
            this.colisionParedes.active = true;

        this.atravesarPlataforma = false; //reseteo para el próximo
    }

        
}