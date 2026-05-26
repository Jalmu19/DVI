import Phaser from "phaser";
import Salidas from "../game-objects/enemy/salidas";
import Cajas from '../game-objects/items/cajas.js'
import Inventory from '../inventory.js'
import Chest from "../game-objects/items/chest.js";


/**
 * Escena de principal del juego. De esta heredan todas las demás
 */
export default class GameScene extends Phaser.Scene {
    dies() {
        this.sound.stopAll();
        this.scene.stop('ui');
        this.scene.start('game-over', { stats: this.player.getStats() });
    }

    slowTime() {
        this.time.timeScale = 0.1;
        this.physics.world.timeScale = 15;
        // Aplicarle slow-mo tambien a las animaciones
        this.physics.world.bodies.each(body => {
            let child = body.gameObject;
            if (child instanceof Phaser.GameObjects.Sprite) child.anims.timeScale = 0.25;
        })
    }

    resetTime() {
        this.time.timeScale = 1;
        this.physics.world.timeScale = 1;
        this.physics.world.bodies.each(body => {
            let child = body.gameObject;
            if (child instanceof Phaser.GameObjects.Sprite) child.anims.timeScale = 1;
        })
    }

    setupSpellCollisions(spell) {
        if(this.arboles) this.physics.add.collider(spell, this.arboles, (s) => s.impact());
        if(this.paredes_y_entrada) this.physics.add.collider(spell, this.paredes_y_entrada, (s) => s.impact());
        if(this.paredes) this.physics.add.collider(spell, this.paredes, (s) => s.impact());
        if(this.cofre) this.physics.add.collider(spell, this.cofre, (s) => s.impact());
        if(this.puertas) this.physics.add.collider(spell, this.puertas, (s) => s.impact());
    }

    initSpellEventListener() {
        this.events.on('to-set-up-colliders', (nuevoHechizo) => {
            this.setupSpellCollisions(nuevoHechizo);
        });
    }

    cargarSalidas(capa, grupo) {

        capa.objects.forEach(objeto => {
            var a = new Salidas(this, objeto.x, objeto.y, objeto.width, objeto.height, objeto.name);
            grupo.add(a)
        })

    }

    crearObjeto(grupoObjeto, capaObjeto, tipoObjeto) {
        capaObjeto.objects.forEach(objeto => {
            var aux = new tipoObjeto(this, objeto.x, objeto.y, objeto);
            grupoObjeto.add(aux);
        });
    }

    crearZoneGameObject(grupoObjeto, capaObjeto){
        if(capaObjeto){
            capaObjeto.objects.forEach( object => {
                let zona = this.add.zone(object.x, object.y, object.width, object.height).setOrigin(0, 0);           
                // Le damos cuerpo físico
                this.physics.add.existing(zona, true); 
                grupoObjeto.add(zona);
            })
        }
    }

    llenarCofre(capaCofre, cofre) {
        capaCofre.objects.forEach(obj => {
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
            cofre.add(a)
        });
    }


    logicaCajas(player, cajas) {
        this.physics.add.collider(player, cajas, (player, caja) => {

            // Solo permitimos que la caja se mueva si el jugador está caminando hacia ella
            // Reducimos la velocidad a 0.4 (40% de la velocidad del jugador) para que se sienta pesada
            const factorEmpuje = 0.4;
            
            // Empujar a la DERECHA (Jugador a la izquierda de la caja)
            if (player.body.touching.right) {
                player.pushing = true;
                // Solo movemos si la caja NO está bloqueada por la derecha (pared)
                if (!caja.body.blocked.right && !caja.body.touching.right) {
                    caja.setVelocityX(player.body.velocity.x * factorEmpuje);
                }
            }
            // Empujar a la IZQUIERDA
            else if (player.body.touching.left) {
                player.pushing = true;
                if (!caja.body.blocked.left && !caja.body.touching.left) {
                    caja.setVelocityX(player.body.velocity.x * factorEmpuje);
                }
            }
            // Empujar ABAJO
            else if (player.body.touching.down) {
                player.pushing = true;
                if (!caja.body.blocked.down && !caja.body.touching.down) {
                    caja.setVelocityY(player.body.velocity.y * factorEmpuje);
                }
            }
            // Empujar ARRIBA
            else if (player.body.touching.up) {
                player.pushing = true;
                if (!caja.body.blocked.up && !caja.body.touching.up) {
                    caja.setVelocityY(player.body.velocity.y * factorEmpuje);
                }
            }

        }, null, this);

    }

    cajaSobreBandera(caja, bandera, puertas) {

        var abreCaja = caja.properties.find(p => p.name === "abreGrupo");
        var abreBandera = bandera.properties.find(p => p.name === "abreGrupo");

        // Si la bandera y la caja abren la misma puerta
        if (abreCaja && abreBandera && abreCaja.value === abreBandera.value && !caja.abierto) {
            const distancia = Phaser.Math.Distance.Between(caja.x, caja.y, bandera.x, bandera.y);
            if (distancia < 10) {
                caja.abierto = true
                this.sonidoAbrirPuerta.play();
                caja.body.setVelocity(0);
                caja.x = bandera.x;
                caja.y = bandera.y;
                caja.setImmovable(true);
                this.abrirPuerta(abreCaja.value, puertas);
            }
        }
    }

    abrirPuerta(valor, puertas) {
        puertas.children.iterate(puerta => {
            if (puerta) {
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
            if (child && child.interactuable !== undefined && child.interactuable) {
                let d = Phaser.Math.Distance.Between(player.x, player.y, child.x, child.y);
                if (d < distMin) {
                    distMin = d;
                    obj = child;
                }
            }
        })
        return obj;
    }

    manageItems(player, items) {

        this.physics.add.overlap(player, items, (player, item) => {
            console.log("COGIDO")
            const added = Inventory.addItem(
                item.itemData.id,
                item.itemData.name,
                item.itemData.frame,
                item.itemData.quantity,
                item.itemData.texture
            );

            if (added) item.destroy()
            this.events.emit('ObjetoRecogido');

            this.sound.add('pickupSound').play();
        });
    }

    dialogo(dialog_text) {

        this.dialogBox = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY + 60, 300, 50, 0x000000, 0.7
        ).setStrokeStyle(2, 0xffffff).setScrollFactor(0);

        this.dialogText = this.add.text(this.cameras.main.centerX - 145, this.cameras.main.centerY + 40, '', {
            fontSize: '10px',
            fontFamily: 'monospace',
            wordWrap: { width: 300 }
        }
        ).setScrollFactor(0);

        this.dialogText.setText(dialog_text);
        this.visibilityDialog(true);
        this.isDialogOpen = true;
        this.player.inDialog = true;


        this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.teclaE.on('down', () => {
            this.visibilityDialog(false);
            this.isDialogOpen = false;
            this.player.inDialog = false;
            if(this.player.displayedItem) {
                this.player.displayedItem.destroy();
                this.player.displayedItem = null;
                this.player.openingChest = false;
            }
        });

    }

    visibilityDialog(visible) {
        this.dialogBox.setVisible(visible);
        this.dialogText.setVisible(visible);
    }


}