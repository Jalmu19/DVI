import Phaser from 'phaser';
export default class MainMenu extends Phaser.Scene
{
    constructor() {
        super({ key: 'mainmenu' });
    }

    init(datos) {
        this.globals = datos.globals
        console.log("init");
        console.log(datos.globals);
    }

    create()
    {
        
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

        var start  = this.add.text(80, 150, "Press any key to start");
        start.setFontSize(20);
        start.setFill('#ffffff');
        start.setScrollFactor(0);
        start.setFontFamily('"Press Start 2P"');

        /*
        let buttonPlay = this.add.image(300, 180, 'button');
        buttonPlay.setInteractive({ useHandCursor: true });
        var buttonText  = this.add.text(275, 170, "Play");
        buttonText.setFontSize(20);
        buttonPlay.on('pointerover', () => { buttonPlay.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000); } );
        buttonPlay.on('pointerdown',this.changeScene, this);
        buttonPlay.on('pointerout',() => {buttonPlay.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);});
        */

        this.input.keyboard.on('keydown', function (_event) { 
            this.changeScene();
        },  this);
    }

    changeScene()
    {
        this.scene.start("bosque",{ globals : this.globals});
        this.sonidoFondo.play();
    }
}