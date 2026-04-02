import Phaser from "phaser";

const STORY = [
    { 
        text: 'Hasta aquí el encuentro de hoy. Podéis marchar.' 
    },
    { 
        text: 'Nos vemos la siguiente semana.' 
    },
    { 
        text: 'Bien. Volvamos a casa.' 
    },
    {
        text: '¿Eh? ¿Qué pasa Lilith?'
    },
    {
        text: '¿Algo que contarnos? Estás muy seria. No te preocupes, tus abuelos te escucharán. Dinos, ¿qué es ese asunto que nos quieres decir?'
    },
    {
        text: '...'
    },
    {
        text: '...'
    },
    {
        text: '¿QUE QUIERES IRTE A EXPLORAR EL MUNDO?'
    },
    {
        text: 'Escúchame bien, ahí fuera hay muchos peligros. Animales, criaturas mágicas... Por no hablar que en la escuela solo aprendísteis lo básico de la magia. '
    },
    {
        text: '¿Cómo vas a sobrevivir ahí afuera? Ni pensarlo jovencita. Es mucho más seguro que te quedes aquí, conmigo y con tu abuelo.'
    },
    {
        text: 'Si ganas de explorar tienes, podemos ir contigo a la ciudad principal algún día.'
    },
    {
        text: '¡Eh! ¿A dónde vas?'
    },
    {
        text: 'Esta chica...'
    },
    {
        text: 'Querida... Quizá deberíamos reconsiderar su petición... Ya es mayor, no podemos estar protegiéndola por siempre.'
    },
    {
        text: 'Solo quiero que esté bien. Es lo que sus padres hubieran querido.'
    },
    {
        text: '¿Y qué hay de su felicidad?'
    },
    {
        text: 'Yo... Puede que tengas razón.'
    },
    {
        text: '¡Lilith, baja un momento!'
    },
    {
        text: 'Lo hemos hablado y queríamos decirte que hemos decidido respetar tus deseos. Eres libre de vivir tu propia vida y puedes irte si es lo que quieres.'
    },
    {
        text: 'Antes de marchar... Tengo algo que darte.'
    },
    {
        text: 'Has recibido: Colgante de metal.'
    },
    {
        text: 'Era de tu madre, un recuerdo de una de sus muchas aventuras. Quizá de ahí te viene la curiosidad.'
    },
    {
        text: 'Ten cuidado ahí fuera, tesoro. Y ya sabes aquí siempre tendrás un lugar donde volver.'
    }
];

export default class IntroStoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroStoryScene' });
        this.n = 0;
        this.isWriting = false;
    }

    create() {
       const map = this.make.tilemap({ key: 'churchjson' });
        const tileset = map.addTilesetImage('demo church', 'demo_church');
        
        const suelo = map.createLayer('suelo', tileset, 0, 0);
        const ladrillo = map.createLayer('ladrillo', tileset, 0, 0);
        const ventanas = map.createLayer('ventanas', tileset, 0, 0);
        const pared = map.createLayer('pared', tileset, 0, 0);
        const decoraciones = map.createLayer('decoraciones', tileset, 0, 0);
        const bordes = map.createLayer('bordes', tileset, 0, 0);
        

        // Calcula el centro del mapa en píxeles
         this.centerX = map.widthInPixels / 2;
         this.centerY = map.heightInPixels / 2 - 120;

        // Mueve la cámara a ese punto
        this.cameras.main.centerOn(this.centerX, this.centerY);
        this.cameras.main.setZoom(1);

        this.cura = this.physics.add.sprite(159, 155, 'cura');
        this.lilith = this.physics.add.sprite(100, 210, 'lilith');
        this.abuela = this.physics.add.sprite(70, 210, 'abuela');
        this.abuelo = this.physics.add.sprite(50, 210, 'abuelo');

        this.dialog();

        this.input.on('pointerdown', () => {
            this.next();
        });

        this.nextScene();
    }

    dialog() {
        this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY + 60, 300, 50, 0x000000, 0.7).setStrokeStyle(2, 0xffffff).setScrollFactor(0);
        
        this.dialogText = this.add.text(this.cameras.main.centerX - 145, this.cameras.main.centerY + 40, '', {fontSize: '10px', 
            fontFamily: 'monospace', wordWrap: { width: 300 }}).setScrollFactor(0);
    }

    nextScene() {
        const actualText = STORY[this.n];
        this.writingAnimation(actualText.text);
    }

    writingAnimation(text) {
        this.isWriting = true;
        this.dialogText.setText('');
        let charIndex = 0;
        
        if (this.timerText) this.timerText.remove();

        this.timerText = this.time.addEvent({
            delay: 50,
            callback: () => {
                this.dialogText.text += text[charIndex];
                charIndex++;
                if (charIndex === text.length) this.isWriting = false;
            },
            repeat: text.length - 1
        });
    }

    next() {
        if (!this.isWriting){
            this.n++;

            if (this.n === 3) { 
                this.cameras.main.pan(this.centerX, this.centerY + 100, 1000, 'Power2');
            }

            if (this.n < STORY.length) 
                this.nextScene();
            else {
                this.scene.launch('ui');
                this.musicaFondo = this.sound.add('musicaFondo');
                this.musicaFondo.play();
                this.musicaFondo.setLoop(true); 
                this.scene.start('bosque', {x: 251, y: 381, stats : null});
            }
                
        }
    }
}