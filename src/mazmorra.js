import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Cajas from './game-objects/items/cajas.js'
import Banderas from './game-objects/items/banderas.js'
import Puertas from './game-objects/items/puertas.js'
import GameScene from "./game-scene.js";



export default class Mazmorra extends GameScene{

    constructor(){
        super({key:'mazmorra'});
    }

    create(){
        var map = this.make.tilemap({key : 'mazmorra'});

        var img12 = map.addTilesetImage('paredes', 'paredes');
        var img13 = map.addTilesetImage('antorchas', 'antorchas');
        var img14 = map.addTilesetImage('puerta_entrada', 'puerta_entrada');
        var img15 = map.addTilesetImage('suelo', 'suelo');


        map.createLayer('Suelo', img15, 0,0);
        var paredes_y_entrada = map.createLayer('ParedesYEntrada', [img12, img14], 0,0);
        map.createLayer('Antorchas', img13, 0,0); //antorchas

        this.player = new Player(this,  48, 292);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //colision paredes-player
        paredes_y_entrada.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, paredes_y_entrada);  

        
        //Crear capa de salidas, pero no configuradas  
        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');

        this.cargarSalidas(this.capaSalidas, this.salidas);

        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);


        //cajas
        this.cajas = this.physics.add.group();
        this.capaCajas = map.getObjectLayer('Cajas');
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
        this.capaBanderas = map.getObjectLayer('Banderas');

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
            a.body.updateFromGameObject();
        });
        this.physics.add.collider(this.player, this.puertas); 
        this.physics.add.collider(this.puertas, paredes_y_entrada);
        this.physics.add.collider(this.cajas, this.puertas); //para que al empujar una caja no se desplace la puerta


        //limites de camara
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);     

    }

    cambiarScene(){
        this.anims.createFromAseprite('player');
        this.scene.start('game-over');
           
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