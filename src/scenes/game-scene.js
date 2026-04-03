import Phaser from "phaser";
import Salidas from "../game-objects/enemy/salidas";
import Cajas from '../game-objects/items/cajas.js'


/**
 * Escena de principal del juego. De esta heredan todas las demás
 */
export default class GameScene extends Phaser.Scene {
    dies() {
        this.sound.stopAll(); //paramos todos los sonidos
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

    crearObjeto(grupoObjeto, capaObjeto, tipoObjeto){
        capaObjeto.objects.forEach(objeto => {
            var aux =  new tipoObjeto(this, objeto.x, objeto.y, objeto);
            grupoObjeto.add(aux);  
        });
    }



    logicaCajas(player, cajas){
         this.physics.add.collider(player, cajas, (player, caja) => {
            
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

    }

    cajaSobreBandera(caja, bandera, puertas) {

        var abreCaja = caja.properties.find(p => p.name === "abreGrupo");
        var abreBandera = bandera.properties.find(p => p.name === "abreGrupo");

        // Si la bandera y la caja abren la misma puerta
        if (abreCaja && abreBandera && abreCaja.value === abreBandera.value && !caja.abierto) {
            const distancia = Phaser.Math.Distance.Between(caja.x, caja.y, bandera.x, bandera.y);
            if(distancia < 10){   
                caja.abierto = true           
                this.sonidoAbrirPuerta.play();
                caja.body.setVelocity(0);
                caja.x = bandera.x;
                caja.y = bandera.y;      
                this.abrirPuerta(abreCaja.value, puertas);
            }
        }
    }

    abrirPuerta(valor, puertas) {
         puertas.children.iterate(puerta=> {
            if(puerta){
                const propGrupo = puerta.properties.find(p => p.name === "abreGrupo");
                // Si la puerta tiene esa propiedad y coincide con lo que manda la caja/bandera
                if (propGrupo && propGrupo.value === valor) {     
                    puerta.disableBody(true, true); // Se desactivan todas las del grupo
                }
            }
        })
    }


    interactWithInteractuable(player, rango) {
        let obj = null;
        let distMin = rango;
        this.physics.world.bodies.each(body => {
            let child = body.gameObject;
            if(child && child.interactuable !== undefined && child.interactuable) {
                let d = Phaser.Math.Distance.Between(player.x, player.y, child.x, child.y);
                if(d < distMin) {
                    distMin = d;
                    obj= child;
                }
            }
        })
        return obj;
    }

        manageItems(player, items){
        
        this.physics.add.overlap(player, this.items, (player, item) => {
            console.log("COGIDO")
            const added = Inventory.addItem(
                item.itemData.id, 
                item.itemData.name, 
                item.itemData.frame,
                item.itemData.quantity,
                item.itemData.texture
            );

            if (added) item.destroy()
        });
    }

}