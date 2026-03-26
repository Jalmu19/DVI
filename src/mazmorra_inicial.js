import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Cajas from './game-objects/items/cajas.js'
import Banderas from './game-objects/items/banderas.js'
import Puertas from './game-objects/items/puertas.js'
import GameScene from "./game-scene.js";


import mazmorra from '../assets/mapas/mazmorra.json'
import suelo from '../assets/sprites/dungeon.png'
import puertas from '../assets/sprites/puerta.png'
import puertas_laterales from '../assets/sprites/puerta_lateral.png'
import puertas_salida from '../assets/sprites/puerta_salida.png'
import puerta_entrada from '../assets/sprites/dungeon.png'
import cofre_verde from '../assets/sprites/cofre_verde.png'
import cofre_azul from '../assets/sprites/cofre_azul.png'
import cofre_amarillo from '../assets/sprites/cofre_amarillo.png'
import cofre_morado from '../assets/sprites/cofre_morado.png'
import bandera_verde from '../assets/sprites/bandera_verde.png'
import bandera_morada from '../assets/sprites/bandera_morada.png'
import bandera_azul from '../assets/sprites/bandera_azul.png'
import bandera_amarilla from '../assets/sprites/bandera_amarilla.png'
import paredes from '../assets/sprites/dungeon.png'
import antorchas from '../assets/sprites/dungeon.png'



export default class MazmorraInicial extends GameScene{

    constructor(){
        super({key:'mazmorra_inicial'});
    }

    //preload de la escena siguiente    
    preload(){
        this.load.image('suelo', suelo);
        this.load.image('puerta', puertas);
        this.load.image('puerta_lateral', puertas_laterales);
        this.load.image('puerta_salida', puertas_salida);
        this.load.image('puerta_entrada', puerta_entrada);
        this.load.image('caja_verde', cofre_verde);
        this.load.image('caja_morada', cofre_morado);
        this.load.image('caja_azul', cofre_azul);
        this.load.image('caja_amarilla', cofre_amarillo);
        this.load.image('bandera_verde', bandera_verde);
        this.load.image('bandera_morada', bandera_morada);
        this.load.image('bandera_azul', bandera_azul);
        this.load.image('bandera_amarilla', bandera_amarilla);
        this.load.image('paredes', paredes);
        this.load.image('antorchas', antorchas);

        this.load.tilemapTiledJSON('mazmorra', mazmorra);
    }


    create(){
        var map = this.make.tilemap({key : 'mazmorra_inicial'});

        var img1 = map.addTilesetImage('paredes', 'paredes');
        var img2 = map.addTilesetImage('suelo', 'suelo');
        var img3 = map.addTilesetImage('puerta_entrada', 'puerta_entrada');


        map.createLayer('suelo', img2, 0,0);
        var paredes_y_entrada = map.createLayer('paredesYpuerta', [img1, img3], 0,0);

 
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = new Player(this,  133, 252);

        //colision paredes-player
        paredes_y_entrada.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, paredes_y_entrada);  



        //cajas
        this.cajas = this.physics.add.group();
        this.capaCajas = map.getObjectLayer('Caja');
        this.capaCajas.objects.forEach(objeto =>{
            var aux =  new Cajas(this, objeto.x, objeto.y, objeto);
            this.cajas.add(aux); 
        })
        this.physics.add.collider(this.player, this.cajas, (player, caja) => {
            
            // Solo permitimos que la caja se mueva si el jugador está caminando hacia ella
            // Reducimos la velocidad a 0.4 (40% de la velocidad del jugador) para que se sienta pesada
            const factorEmpuje = 0.4;

            if (player.body.touching.right && player.body.velocity.x > 0) {
                caja.body.velocity.x = player.body.velocity.x * factorEmpuje;
            } 
            else if (player.body.touching.left && player.body.velocity.x < 0) {
                caja.body.velocity.x = player.body.velocity.x * factorEmpuje;
            }
            else if (player.body.touching.down && player.body.velocity.y > 0) {
                caja.body.velocity.y = player.body.velocity.y * factorEmpuje;
            }
            else if (player.body.touching.up && player.body.velocity.y < 0) {
                caja.body.velocity.y = player.body.velocity.y * factorEmpuje;
            }

        }, null, this);

        // También colisión entre las cajas y el escenario (paredes)
        this.physics.add.collider(this.cajas, paredes_y_entrada);


        //banderas
        this.banderas = this.physics.add.group();
        this.capaBanderas = map.getObjectLayer('Bandera');

        this.capaBanderas.objects.forEach(objeto => {
            var aux =  new Banderas(this, objeto.x, objeto.y, objeto);
            this.banderas.add(aux);  
        });
        this.physics.add.overlap(this.cajas, this.banderas,(caja, bandera) => {
            this.cajaSobreBandera(caja, bandera);
        }, null, this);



        //puertas
        this.puertas = this.physics.add.group();
        this.capaPuertas = map.getObjectLayer('Puertas');
        
        this.capaPuertas.objects.forEach(objeto =>{            
            var a = new Puertas(this, objeto.x, objeto.y, objeto);
            this.puertas.add(a);
        });
        this.physics.add.collider(this.player, this.puertas); 
        this.physics.add.collider(this.puertas, paredes_y_entrada);
        this.physics.add.collider(this.cajas, this.puertas); //para que al empujar una caja no se desplace la puerta


                
        //Crear capa de salidas, pero no configuradas  
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');

        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);     

    }

    cambiarScene(){
        this.anims.createFromAseprite('player');
        this.scene.start('mazmorra');
           
    }

        cajaSobreBandera(caja, bandera) {
        var abreCaja = caja.properties.find(p => p.name === "abreGrupo");
        var abreBandera = bandera.properties.find(p => p.name === "abreGrupo");

        // Si la bandera y la caja abren la misma puerta
        if (abreCaja && abreBandera && abreCaja.value === abreBandera.value) {
            const distancia = Phaser.Math.Distance.Between(caja.x, caja.y, bandera.x, bandera.y);
            if(distancia < 10){
                caja.body.setVelocity(0);
                caja.x = bandera.x;
                caja.y = bandera.y;
                this.abrirPuerta(abreCaja.value);
            }
        }
    }



    abrirPuerta(valor) {
        this.puertas.children.iterate(puerta=> {
            if(puerta){
                const propGrupo = puerta.properties.find(p => p.name === "abreGrupo");
                // Si la puerta tiene esa propiedad y coincide con lo que manda la caja/bandera
                if (propGrupo && propGrupo.value === valor) {
                    puerta.disableBody(true, true); // Se desactivan todas las del grupo
                }
            }
        })
    }


    update() {
        // Recorremos todas las cajas y si no tienen a nadie empujando, velocidad 0
        this.cajas.children.iterate(caja => {
            // Si la caja se está moviendo, la frenamos
            caja.setVelocity(0); 
        });
    }

}