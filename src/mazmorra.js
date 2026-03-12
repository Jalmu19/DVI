import Phaser from "phaser";
import Player from './game-objects/player/player.js'
import Salidas from './game-objects/enemy/salidas.js'
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
        //var img1 = map.addTilesetImage('puertas', 'puerta'); //puertas de dentro de la mazmorra y la de salida
        var img13 = map.addTilesetImage('antorchas', 'antorchas');
        var img14 = map.addTilesetImage('puerta_entrada', 'puerta_entrada');
        var img15 = map.addTilesetImage('suelo', 'suelo');


        map.createLayer('Suelo', img15, 0,0);
        var paredes_y_entrada = map.createLayer('ParedesYEntrada', [img12, img14], 0,0);
        map.createLayer('Antorchas', img13, 0,0); //antorchas
        //map.createLayer('Puertas', [img1], 0, 0);


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
        this.physics.add.overlap(this.cajas, this.banderas,map, (caja, bandera, map) => {
            this.cajaSobreBandera(caja, bandera, map);
        }, null, this);


        //puertas
        this.puertas = this.physics.add.group();
        this.capaPuertas = map.getObjectLayer('Puertas');
        
        this.capaPuertas.objects.forEach(objeto =>{            
            var a = new Puertas(this, objeto.x, objeto.y, objeto);
            this.puertas.add(a)
        })





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


    cajaSobreBandera(caja, bandera, map) {
        // Buscar propiedad de relación
        var relacionCaja = caja.properties.find(p => p.name.startsWith("relacion"));
        var abreCaja = caja.properties.find(p => p.name.startsWith("abrePuerta"));

        var abreBandera = bandera.properties.find(p => p.name.startsWith("abrePuerta"));

        // Si la bandera y la caja abren la misma puerta
        if (abreCaja && abreBandera && abreCaja.value === abreBandera.value) {
            console.log("¡Caja correcta colocada!");
            this.abrirPuerta(abreCaja.value, map);
        }
    }

    abrirPuerta(idPuerta, capaPuertas, map) {
        var capaPuertas = map.getObjectLayer('Puertas');

        capaPuertas.objects.forEach(obj => {
            if (obj.id === idPuerta) {

                var puerta = this.physics.add.sprite(obj.x, obj.y, 'puertas');
                puerta.disableBody(true, true); // Desaparece

                console.log("Puerta abierta:", obj.name);
            }
        });
    }

    update() {
        // Recorremos todas las cajas y si no tienen a nadie empujando, velocidad 0
        this.cajas.children.iterate(caja => {
            // Si la caja se está moviendo, la frenamos gradualmente
            // Esto hace que se detenga en seco
            caja.setVelocity(0); 
        });
    }

}