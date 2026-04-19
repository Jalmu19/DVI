import Phaser from 'phaser';
export default class MainMenu extends Phaser.Scene
{
    constructor() {
        super({ key: 'mainmenu' });
    }

    create(){
        this.music = this.sound.add('menuSound');
        this.music.loop = true;
        this.music.play();

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
            playSound.play();
           
            this.cameras.main.fadeOut(1000, 0, 0, 0);
                
        }); 

        this.cameras.main.once('camerafadeoutcomplete', (camera, effect) => {
            this.scene.start('IntroStoryScene'); 
        });
    }

}