import Phaser from "phaser";
import Salidas from "./game-objects/enemy/salidas";

/**
 * Escena de principal del juego. De esta heredan todas las demás
 */
export default class GameScene extends Phaser.Scene {
    dies() {
        this.scene.stop('ui');
        this.scene.start('game-over');
    }

    slowTime() {
        this.physics.world.timeScale = 15;
    }
    
    resetTime() {
        this.physics.world.timeScale = 1;
    }
    
    cargarSalidas(capa, grupo){

         capa.objects.forEach(objeto =>{            
            var a = new Salidas(this, objeto.x, objeto.y, objeto.width, objeto.height, objeto.name);
            grupo.add(a)
        })

    }

    openInventory(){
        this.scene.launch('InventoryScene')
        this.scene.pause();
    }
}