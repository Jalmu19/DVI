import Phaser from "phaser";

/**
 * Escena de Game Over. Cuando el player pierde toda su vida, se presenta un
 * texto que indica que ha perdido.
 * Si se pulsa cualquier tecla, se vuelve a iniciar el juego.
 */
export default class GameOver extends Phaser.Scene {
    /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'game-over' });
  }

  /**
   * Creación de la escena. Tan solo contiene el texto que indica que el juego se ha acabado
   */
  create() {
    this.add.text(160, 90, 'GAME OVER!\nPerdiste todos tus corazones\nPulsa cualquier tecla para volver a jugar', {fontSize : 10})
        .setOrigin(0.5, 0.5)  // Colocamos el pivote en el centro de cuadro de texto 
        .setAlign('center');  // Centramos el texto dentro del cuadro de texto

    // Añadimos el listener para cuando se haya pulsado una tecla. Es probable que no
    // lleguemos a ver el mensaje porque veníamos con una tecla pulsada del juego (al 
    // ir moviendo al jugador). Se puede mejorar añadiendo un temporizador que 
    // añada este listener pasado un segundo
    this.input.keyboard.on('keydown', function (_event) { 
      this.scene.start('boot');
    }, this);
  }

}