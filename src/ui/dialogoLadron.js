import Phaser from "phaser";
import Player from '../game-objects/player/player.js'
import Salidas from '../game-objects/enemy/salidas.js'
import Ladron from '../game-objects/npcs/ladron.js'
import Spike from '../game-objects/enemy/spike.js'
import Item from "../game-objects/item.js";
import GameScene from "../scenes/game-scene.js";


export default class DialogoLadron extends GameScene {

    constructor() {
    super({ key: 'dialogoLadron' });
    this.STORY = ["Jijijijijijijijiji",
        "Has perdido: colgante de metal",
        "¿No eres una hechicera de verdad? Demuestramelo completando la mazmorra que hay siguiendo el camino de a mi espalda"]
    
    }
    init(data){
        this.background = data.backgroundScene;
        this.datos = [data.x, data.y, data.stats]
    }
   
    create(){
        //Parando escenas anteriores
        this.scene.pause(this.background)
        this.scene.stop('ui')

        //Nueva escena con diálogos
        console.log("Cargando escena")
        this.crearEscena();

        //Crear el rectangulo con texto
        console.log("Cargando rectángulo y texto")
        this.crearGrafico();
        
        this.numLines = 1;//lineas leidas hasta ahora
        this.input.on('pointerdown', ()=>{
            this.dialogText.setText("...");
            this.next()
        })

        this.dialogText.setText(this.STORY[0])
    }
    next(){
        if(this.numLines >= this.STORY.length){           
            this.scene.launch('ui')
            this.scene.start('zonaBosque', {
                x : this.player.x, 
                y : this.player.y,
                stats : this.player.getStats(),
                backgroundScene : this
            })
        }
        else{
            this.time.delayedCall(1000, () => {//delay de cuanto tarda en salir el texto
                this.dialogText.setText(this.STORY[this.numLines])
                this.numLines++;
            });
           
        }
    }
    crearGrafico(){
       this.dialogBox = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY + 60, 300, 50, 0x000000, 0.7
        ).setStrokeStyle(2, 0xffffff).setScrollFactor(0).setVisible(true);

        this.dialogText = this.add.text(this.cameras.main.centerX - 145, this.cameras.main.centerY + 40, '', { 
            fontSize: '10px', 
            fontFamily: 'monospace', 
            wordWrap: { width: 300 } 
        }
        ).setScrollFactor(0).setVisible(true);

    }
    mostrar(){
       this.dialogBox.setVisible(true);
    }
    crearEscena(){
        var map = this.make.tilemap({ key: 'zBosque' });
        
        var img1 = map.addTilesetImage('Villa1', 'plantilla');
        var img2 = map.addTilesetImage('Arbol', 'arbol');
        var img3 = map.addTilesetImage('flor1', 'flor');
        var img4 = map.addTilesetImage('Hierba', 'hierba');

        map.createLayer('fondo', img4, 0, 0);
        map.createLayer('Detalles', [img3, img1], 0, 0);
        var arboles = map.createLayer('Arboles', img2, 0, 0);

        //Crear capa de salidas, pero no configuradas

        arboles.setCollisionByExclusion([-1], true);
        //Tamaño del mundo fisico
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        
        this.player = new Player(this, this.datos[0], this.datos[1], this.datos[2]);
                
        //Añadiendo colision a las fisicas
        this.physics.add.collider(this.player, arboles);
        //limites de camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.salidas = this.physics.add.group();
        this.capaSalidas = map.getObjectLayer('Salidas');

        //Salidas
        this.cargarSalidas(this.capaSalidas, this.salidas);
        
        this.physics.add.overlap(this.player, this.salidas, this.cambiarScene, null, this);

        this.enemigos = this.physics.add.group();
        this.capaEnemigos = map.getObjectLayer('Enemigos');
        this.capaEnemigos.objects.forEach(obj => {
            var a = new Spike(this, obj.x, obj.y,'spike');
            this.enemigos.add(a);
        })

        //Ladron
        this.ladron = this.physics.add.group({immovable: true, allowGravity: false });
        this.capaLadron = map.getObjectLayer('Ladron');
        this.capaLadron.objects.forEach(obj => {
            var a ;
            if(obj.name === "Kirbo"){
                a = new Ladron(this, obj.x, obj.y);
            }               
            else{
                a = new Salidas(this, obj.x, obj.y, obj.width, obj.height, obj.name);
            }               
            this.ladron.add(a);
        })

        this.colision = this.physics.add.collider(this.player, this.ladron, this.mostrarDialogo, null, this);
    
        this.items = this.physics.add.staticGroup()
        this.capaBayas = map.getObjectLayer('Bayas')
        this.capaBayas.objects.forEach(obj =>{
            var a = new Item(this, obj.x, obj.y, 'berry', 0,{ id: 'berry', name: obj.name, quantity: 1})
            this.items.add(a)

        })

    }
    
}