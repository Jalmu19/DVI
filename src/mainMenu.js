import Phaser from 'phaser';
export default class MainMenu extends Phaser.Scene
{
    constructor() {
        super({ key: 'mainmenu' });
    }

    create(){

        this.music = this.sound.get('menuSound');
        if (!this.music) {
            this.music = this.sound.add('menuSound');
            this.music.loop = true;
            this.music.play();
        } else if (!this.music.isPlaying) {
            this.music.play();
        }

        
        

        let bg = this.add.image(0, 0, 'background');
        bg.displayHeight = this.sys.game.config.height;
        bg.scaleX = bg.scaleY;
        bg.x = this.sys.game.config.width/2;
        bg.y = this.sys.game.config.height/2;

        var title  = this.add.text(40, 50, "ENCHANTMENTS");
        title.setFontSize(30);
        title.setFill('#fefb36');
        title.setScrollFactor(0);
        title.setFontFamily('"Press Start 2P"');


        const botonJugar = this.add.text(160, 120, 'JUGAR', {
            fontSize: '15px',
            fill: '#c92efd',
            backgroundColor: '#fff64f',
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5);

        botonJugar.setInteractive({ useHandCursor: true });

        botonJugar.on('pointerover', () => botonJugar.setStyle({ fill: 'rgb(255, 255, 255)' })); 
        botonJugar.on('pointerout', () => botonJugar.setStyle({ fill: '#c92efd' }));  
        const playSound = this.sound.add('playSound');
        botonJugar.on('pointerdown', () => {
            this.tweens.add({
            targets: botonJugar,
            scale: 0.9,
            duration: 100,
            yoyo: true
            });
            this.tweens.add({
            targets: this.music,
            volume: 0,
            duration: 1000
            });
            playSound.play();
            botonJugar.disableInteractive();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
                
        });

        const botonCreditos = this.add.text(160, 150, 'CREDITOS', {
            fontSize: '15px',
            fill: '#c92efd',
            backgroundColor: '#fff64f',
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5);

        botonCreditos.setInteractive({ useHandCursor: true });

        botonCreditos.on('pointerover', () => botonCreditos.setStyle({ fill: 'rgb(255, 255, 255)' })); 
        botonCreditos.on('pointerout', () => botonCreditos.setStyle({ fill: '#c92efd' }));  
        botonCreditos.on('pointerdown', () => {
            this.tweens.add({
            targets: botonCreditos,
            scale: 0.9,
            duration: 100,
            yoyo: true
            });
            this.tweens.add({
            targets: this.music,
            volume: 0,
            duration: 1000
            });
            playSound.play();
            botonCreditos.disableInteractive();
            this.scene.start('credits');
                
        });         

        this.cameras.main.once('camerafadeoutcomplete', (camera, effect) => {
            this.scene.start('IntroStoryScene'); 
        });
    }

}