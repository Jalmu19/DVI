import Phaser from "phaser";

const STORY = [
    { 
        text: 'Hasta aquí el encuentro de hoy. Podéis marchar.'
    },
    { 
        text: 'Nos vemos la siguiente semana.' 
    },
    { 
        text: 'Bien. Volvamos a casa.', delay: 1500 
    },
    {
        text: '¿Eh? ¿Qué pasa Lilith?', delay: 1000
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
        text: 'Si ganas de explorar tienes, podemos ir contigo a la capital algún día.'
    },
    {
        text: '¡Eh! ¿A dónde vas?', action: 'lilith_goes'
    },
    {
        text: 'Esta chica...', delay: 2000
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
        text: 'Yo... Puede que tengas razón.', delay: 1000
    },
    {
        text: '¡Lilith, baja un momento!', action: 'changeRoomScene'
    },
    {
        text: 'Lo hemos hablado y queríamos decirte que hemos decidido respetar tus deseos. Eres libre de vivir tu propia vida y puedes irte si es lo que quieres.', delay: 1000, action: 'changeHomeScene'
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
        
        this.layersChurch = {};
        this.layersChurch = this.loadChurchMap();
        this.layersRoom = {};
        this.layersRoom = this.loadRoomMap();
        this.layersHome= {};
        this.layersHome = this.loadHomeMap();
        
        Object.values(this.layersHome).forEach(layer => {
            layer.setVisible(false);
        });
        
        Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(false);
        });
        
        this.cura = this.physics.add.sprite(159, 155, 'cura');
        this.lilith = this.physics.add.sprite(100, 210, 'lilith');
        this.abuela = this.physics.add.sprite(70, 210, 'abuela');
        this.abuelo = this.physics.add.sprite(50, 210, 'abuelo');
        
        this.dialog();

        this.input.on('pointerdown', () => {
            this.next();
        });

        this.nextScene();

        this.skipKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.skipKey.on('down', () => {
            this.skipIntro();
        });
    }

    loadHomeMap(){
        const map = this.make.tilemap({ key: 'homejson' });
        const doorWindowsTileset = map.addTilesetImage('TopDownHouse_DoorsAndWindows', 'doorsWindows');
        const floorWallsTileset = map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'floorsWalls');
            const furniture1Tileset = map.addTilesetImage('TopDownHouse_FurnitureState1', 'greenFurniture');
        const furniture2Tileset = map.addTilesetImage('TopDownHouse_FurnitureState2', 'brownFurniture');
        const smallItemsTileset = map.addTilesetImage('TopDownHouse_SmallItems', 'smallItems');
        const tileset = [doorWindowsTileset, floorWallsTileset, furniture2Tileset, furniture1Tileset, smallItemsTileset];

        const suelo = map.createLayer('suelo', tileset, 0, 0);
        const alfombra = map.createLayer('alfombra', tileset, 0, 0);
        const pared = map.createLayer('pared', tileset, 0, 0);
        const bordespared = map.createLayer('bordespared', tileset, 0, 0);
        const bordes = map.createLayer('bordes', tileset, 0, 0);
        const silla = map.createLayer('silla', tileset, 0, 0);
        const muebles = map.createLayer('muebles', tileset, 0, 0);
        const escalera = map.createLayer('escalera', tileset, 0, 0);
        const objetos = map.createLayer('objetos', tileset, 0, 0);
        const layers = {suelo, alfombra, pared, bordes, silla, muebles, objetos, escalera, bordespared};
        
        return layers;
    }

    loadRoomMap(){
        const map = this.make.tilemap({ key: 'roomjson' });
        const doorWindowsTileset = map.addTilesetImage('TopDownHouse_DoorsAndWindows', 'doorsWindows');
        const floorWallsTileset = map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'floorsWalls');
        const furnitureTileset = map.addTilesetImage('TopDownHouse_FurnitureState1', 'greenFurniture');
        const smallItemsTileset = map.addTilesetImage('TopDownHouse_SmallItems', 'smallItems');
        const tileset = [doorWindowsTileset, floorWallsTileset, furnitureTileset, smallItemsTileset];

        const suelo = map.createLayer('suelo', tileset, 0, 0);
        const alfombra = map.createLayer('alfombra', tileset, 0, 0);
        const pared = map.createLayer('pared', tileset, 0, 0);
        const ventanas = map.createLayer('ventanas', tileset, 0, 0);
        const escalera = map.createLayer('escalera', tileset, 0, 0);
        const bordes = map.createLayer('bordes', tileset, 0, 0);
        const muebles = map.createLayer('muebles', tileset, 0, 0);
        const objetos = map.createLayer('objetos', tileset, 0, 0);
        const layers = {suelo, alfombra, ventanas, pared, escalera, bordes, muebles, objetos};
        
        return layers;

    }

    loadChurchMap(){
        const map = this.make.tilemap({ key: 'churchjson' });
        const tileset = map.addTilesetImage('demo church', 'demo_church');
        
        const suelo = map.createLayer('suelo', tileset, 0, 0);
        const ladrillo = map.createLayer('ladrillo', tileset, 0, 0);
        const ventanas = map.createLayer('ventanas', tileset, 0, 0);
        const pared = map.createLayer('pared', tileset, 0, 0);
        const decoraciones = map.createLayer('decoraciones', tileset, 0, 0);
        const bordes = map.createLayer('bordes', tileset, 0, 0);
        const layers = {suelo, ladrillo, ventanas, pared, decoraciones, bordes};

        this.centerX = map.widthInPixels / 2;
        this.centerY = map.heightInPixels / 2 - 120;
        this.cameras.main.centerOn(this.centerX, this.centerY);
        
        return layers;
    }

    dialog() {
        this.dialogBox = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY + 60, 300, 50, 0x000000, 0.7
        ).setStrokeStyle(2, 0xffffff).setScrollFactor(0);
        
        this.dialogText = this.add.text(this.cameras.main.centerX - 145, this.cameras.main.centerY + 40, '', { 
            fontSize: '10px', 
            fontFamily: 'monospace', 
            wordWrap: { width: 300 } 
        }
        ).setScrollFactor(0);

        this.visibilityDialog(false);
    }

    skipIntro() {
    if (this.timerText) this.timerText.remove();
    
    this.cameras.main.stopFollow();
    this.cameras.main.resetFX(); 
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('bosque', { x: 251, y: 381 });
        this.scene.launch('ui');
        const music = this.sound.add('musicaFondo');
        music.play();
        music.setLoop(true); 
    });
    }

    visibilityDialog(visible) {
        this.dialogBox.setVisible(visible);
        this.dialogText.setVisible(visible);
    }

    nextScene() {
        const actualText = STORY[this.n];
        this.writingAnimation(actualText.text);
    }

    writingAnimation(text) {
        this.isWriting = true;
        this.visibilityDialog(true);
        this.dialogText.setText('');
        const actualEntry = STORY[this.n];

        if (actualEntry.action) this.handleAction(actualEntry.action);
    
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
        if (!this.isWriting) {
            this.n++;

            if (this.n < STORY.length) {
                const actualText = STORY[this.n];

                if (this.n === 2) {
                    this.isWriting = true;
                    this.dialogText.setText('');
                    this.visibilityDialog(false);

                    this.cameras.main.pan(this.centerX, this.centerY + 100, 3000, 'Power2', false, (camera, progress) => {
                        if (progress === 1) this.waitWrite(actualText);
                    });
                } 
                else this.waitWrite(actualText);

            } else {
                this.scene.start('bosque', {x: 251, y: 381, stats : null});
                this.scene.launch('ui');
                const music = this.sound.add('musicaFondo');
                music.play();
                music.setLoop(true); 
                
            }
        }
    }

    waitWrite(actualText) {
        if (actualText.delay) {
            this.isWriting = true;
            this.dialogText.setText('');

            this.time.delayedCall(actualText.delay, () => {
                this.nextScene();
            });
        } else this.nextScene();
    }

    handleAction(actionName) {
        if (actionName){
            switch (actionName) {
                case 'lilith_goes':
                    this.lilithGoes();
                break;
                case 'changeRoomScene':
                    this.isWriting = true;
                    this.visibilityDialog(false);
                    this.cameras.main.fadeOut(5000, 0, 0, 0);

                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.prepareRoomScene();

                        this.time.delayedCall(5000, () => {
                            this.cameras.main.fadeIn(5000, 0, 0, 0);

                            this.cameras.main.once('camerafadeincomplete', () => {
                                this.visibilityDialog(true);
                                this.isWriting = false;
                                this.lilithMove();
                            });
                        });
                    });
                break;
                case 'changeHomeScene':
                    this.isWriting = true;
                    this.visibilityDialog(false);
                    this.cameras.main.fadeOut(5000, 0, 0, 0);

                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.prepareHomeScene();
                        this.cameras.main.setScroll(0, 0);

                        this.time.delayedCall(5000, () => {
                            this.cameras.main.fadeIn(5000, 0, 0, 0);

                            this.cameras.main.once('camerafadeincomplete', () => {
                                this.visibilityDialog(true);
                                this.isWriting = false;
                                this.lilithMoveHome();
                            });
                        });
                    });
                break;
            }
        }
    }

    lilithGoes(){
                this.add.timeline([
            {
                at: 0, 
                tween: {
                    targets: this.lilith,
                    x: '+=60', 
                    duration: 1500
                }
            },
            {
                at: 3000, 
                tween: {
                    targets: this.lilith,
                    y: '+=200', 
                    duration: 2500
                }
            },
            {
                at: 8000, 
                run: () => {
                    this.lilith.anims.stop();
                    this.lilith.setFrame(0); // Se queda quieta
                    this.lilith.setVisible(false);
                }
            }
        ]).play();

    }

    prepareRoomScene(){
        Object.values(this.layersChurch).forEach(layer => {
            layer.setVisible(false);
        });

        this.abuela.setVisible(false);
        this.abuelo.setVisible(false);
        this.cura.setVisible(false);

        Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(true);
        });

        this.lilith = this.physics.add.sprite(120, 80, 'lilith');
        this.cameras.main.setScroll(0, 0);
    }

    lilithMove(){
        this.add.timeline([
            {
                at: 3000, 
                tween: {
                    targets: this.lilith,
                    x: '+=33',
                    duration: 1500
                }
            },
            {
                at: 10000, 
                tween: {
                    targets: this.lilith,
                    y: '+=50', 
                    duration: 1500
                }
            },
            {
                at: 13000, 
                tween: {
                    targets: this.lilith,
                    x: '-=45', 
                    duration: 1500
                }
            },
            {
                at: 20000, 
                tween: {
                    targets: this.lilith,
                    y: '-=35', 
                    duration: 1500
                }
            },
            {
                at: 23000,
                tween: {
                    targets: this.lilith,
                    x: '-=45', 
                    duration: 1500
                }
            },
            {
                at: 26000, 
                tween: {
                    targets: this.lilith,
                    y: '+=60', 
                    duration: 1500
                }
            }
        ]).play();
    }

    prepareHomeScene(){
        Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(false);
        });

        this.lilith.setVisible(false)
        
        Object.values(this.layersHome).forEach(layer => {
            layer.setVisible(true);
        });

        this.lilith = this.physics.add.sprite(30, 50, 'lilith');
        this.abuelo = this.physics.add.sprite(250, 100, 'abuelo');
        this.abuela = this.physics.add.sprite(250, 120, 'abuela');       
    }

    lilithMoveHome(){
        this.add.timeline([
            {
                at: 0, 
                tween: {
                    targets: this.lilith,
                    y: '+=60', 
                    duration: 1500
                }
            },
            {
                at: 3000, 
                tween: {
                    targets: this.lilith,
                    x: '+=200', 
                    duration: 4500
                }
            }
        ]).play();
    }
}