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
        this.sceneChanging = false;
    }

    create() {
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        this.layersChurch = {};
        this.layersChurch = this.loadChurchMap();
        this.layersRoom = {};
        this.layersRoom = this.loadRoomMap();
        this.layersHome = {};
        this.layersHome = this.loadHomeMap();

        Object.values(this.layersHome).forEach(layer => {
            layer.setVisible(false);
        });

        Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(false);
        });

        this.cura = this.physics.add.sprite(159, 155, 'cura');
        this.lilith = this.physics.add.sprite(100, 210, 'lilith');
        this.lilith.play('idle-back');
        this.abuela = this.physics.add.sprite(70, 210, 'abuela');
        this.abuelo = this.physics.add.sprite(50, 210, 'abuelo');
        this.abuela_perfil = this.physics.add.sprite(250, 100, 'abuela_perfil');
        this.abuelo_perfil = this.physics.add.sprite(250, 120, 'abuelo_perfil');
        this.abuela_perfil.setVisible(false);
        this.abuelo_perfil.setVisible(false);
        this.createLilithAnimations();
        this.skipText();

        this.dialog();

        this.input.on('pointerdown', () => {
            if(!this.sceneChanging) this.next();
        });

        this.nextScene();

        this.skipKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

        this.skipKey.once('down', () => {
            this.skipIntro();
            this.music.stop();
        });

        this.music = this.sound.add('introMusic');
        this.music.play();
        this.music.setLoop(true);
    }

    loadHomeMap() {
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
        const layers = { suelo, alfombra, pared, bordes, silla, muebles, objetos, escalera, bordespared };

        return layers;
    }

    loadRoomMap() {
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
        const layers = { suelo, alfombra, ventanas, pared, escalera, bordes, muebles, objetos };

        return layers;

    }

    loadChurchMap() {
        const map = this.make.tilemap({ key: 'churchjson' });
        const tileset = map.addTilesetImage('demo church', 'demo_church');

        const suelo = map.createLayer('suelo', tileset, 0, 0);
        const ladrillo = map.createLayer('ladrillo', tileset, 0, 0);
        const ventanas = map.createLayer('ventanas', tileset, 0, 0);
        const pared = map.createLayer('pared', tileset, 0, 0);
        const decoraciones = map.createLayer('decoraciones', tileset, 0, 0);
        const bordes = map.createLayer('bordes', tileset, 0, 0);
        const layers = { suelo, ladrillo, ventanas, pared, decoraciones, bordes };

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
        this.cameras.main.fadeOut(2000, 0, 0, 0);
         this.tweens.add({
            targets: this.music,
            volume: 0,
            duration: 2000
        });
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('bosque', { x: 251, y: 381 });
            this.scene.launch('ui');
           this.music.stop();
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
        this.dialogText.setText(text);
        
        const actualEntry = STORY[this.n];

        if (actualEntry.action) this.handleAction(actualEntry.action);
        if (this.timerText) this.timerText.remove();

        this.isWriting = false;
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

                    this.cameras.main.pan(this.centerX, this.centerY + 100, 2000, 'Power2', false, (camera, progress) => {
                        if (progress === 1) this.waitWrite(actualText);
                    });
                }
                else this.waitWrite(actualText);

            } else {
                this.tweens.add({
                targets: this.music,
                volume: 0,
                duration: 2000
                });
                this.sceneChanging = true;
                this.cameras.main.fadeOut(2000, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('bosque', { x: 251, y: 381, stats: null });
                    this.scene.launch('ui');
                    this.music.stop();
                });
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
        if (actionName) {
            switch (actionName) {
                case 'lilith_goes':
                    this.lilithGoes();
                    break;
                case 'changeRoomScene':
                    this.input.enabled = false;
                    this.isWriting = true;
                    this.visibilityDialog(false);
                    this.cameras.main.fadeOut(3000, 0, 0, 0);

                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.prepareRoomScene();

                        this.time.delayedCall(3000, () => {
                            this.cameras.main.fadeIn(3000, 0, 0, 0);

                            this.cameras.main.once('camerafadeincomplete', () => {
                                this.lilithMove();

                                this.time.delayedCall(5000, () => {
                                    this.visibilityDialog(true);

                                    this.time.delayedCall(1000, () => {
                                        this.isWriting = false;
                                        this.input.enabled = true;
                                        this.next();
                                    });
                                });
                            });
                        });
                    });
                    break;
                case 'changeHomeScene':
                    this.input.enabled = false;
                    this.isWriting = true;
                    this.visibilityDialog(false);
                    this.cameras.main.fadeOut(1000, 0, 0, 0);

                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.tweens.killTweensOf(this.lilith);
                        this.prepareHomeScene();

                        this.time.delayedCall(1000, () => {
                            this.cameras.main.fadeIn(2000, 0, 0, 0);

                            this.time.delayedCall(100, () => {
                                this.lilithMoveHome();
                            });
                            this.cameras.main.once('camerafadeincomplete', () => {


                                this.time.delayedCall(4500, () => {
                                    this.input.enabled = true;
                                    this.visibilityDialog(true);
                                    this.isWriting = false;
                                });

                            });
                        });
                    });
                    break;
            }
        }
    }

    lilithGoes() {
        this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.lilith,
                    x: '+=60',
                    duration: 1000,
                    onStart: () => { this.lilith.play('lilith_walk-rside'); },
                }
            },
            {
                at: 1100,
                tween: {
                    targets: this.lilith,
                    y: '+=200',
                    duration: 1500,
                    onStart: () => { this.lilith.play('lilith_walk-front'); },
                    onComplete: () => { this.lilith.anims.stop(); this.lilith.setFrame(23); }
                }
            },
            {
                at: 5000,
                run: () => {
                    this.lilith.anims.stop();
                    this.lilith.setVisible(false);
                }
            }
        ]).play();

    }

    prepareRoomScene() {
        Object.values(this.layersChurch).forEach(layer => {
            layer.setVisible(false);
        });

        this.abuela.setVisible(false);
        this.abuelo.setVisible(false);
        this.cura.setVisible(false);

        Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(true);
        });

        this.lilith.setPosition(120, 80);
        this.lilith.setVisible(true);
        this.cameras.main.setScroll(0, 0);
        this.isWriting = true;
    }

    lilithMove() {
        this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.lilith,
                    x: '+=33',
                    duration: 1000,
                    onStart: () => { this.lilith.play('lilith_walk-rside'); },
                    onComplete: () => { this.lilith.anims.stop(); this.lilith.setFrame(23) }

                }
            },
            {
                at: 1500,
                tween: {
                    targets: this.lilith,
                    y: '+=50',
                    duration: 1000,
                    onStart: () => { this.lilith.play('lilith_walk-front'); }
                }
            },
            {
                at: 3000,
                tween: {
                    targets: this.lilith,
                    x: '-=45',
                    duration: 1000,
                    onStart: () => { this.lilith.play('lilith_walk-lside'); },
                    onComplete: () => { this.lilith.anims.stop(); this.lilith.setFrame(22) }
                }
            },
            {
                at: 5500,
                tween: {
                    targets: this.lilith,
                    y: '-=35',
                    duration: 1000,
                    onStart: () => { this.lilith.play('lilith_walk-back'); }

                }
            },
            {
                at: 6500,
                tween: {
                    targets: this.lilith,
                    x: '-=45',
                    duration: 1000,
                    onStart: () => { this.lilith.play('lilith_walk-lside'); }
                }
            },
            {
                at: 7500,
                tween: {
                    targets: this.lilith,
                    y: '+=60',
                    duration: 1000,
                    onStart: () => { this.lilith.play('lilith_walk-front'); }
                }
            }
        ]).play();
    }

    prepareHomeScene() {
        Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(false);
        });

        this.lilith.setVisible(false)

        Object.values(this.layersHome).forEach(layer => {
            layer.setVisible(true);
        });

        this.lilith.setPosition(30, 50);
        this.lilith.setVisible(true);
       
        this.abuela_perfil.setVisible(true);
        this.abuelo_perfil.setVisible(true);
        this.isWriting = true;
    }

    lilithMoveHome() {
        this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.lilith,
                    y: '+=60',
                    duration: 1500,
                    onStart: () => { this.lilith.play('lilith_walk-front'); }
                }
            },
            {
                at: 1500,
                tween: {
                    targets: this.lilith,
                    x: '+=200',
                    duration: 4500,
                    onStart: () => { this.lilith.play('lilith_walk-rside'); },
                    onComplete: () => { this.lilith.anims.stop(); this.lilith.setFrame(7) }
                }
            }
        ]).play();
    }

    createLilithAnimations() {
        this.anims.create({
            key: 'lilith_walk-rside',
            frames: this.anims.generateFrameNames('player', {
                start: 7,
                end: 12,
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'lilith_walk-front',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 6,
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'lilith_walk-lside',
            frames: this.anims.generateFrameNames('player', {
                start: 15,
                end: 21,
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'lilith_walk-back',
            frames: this.anims.generateFrameNames('player', {
                start: 23,
                end: 29,
            }),
            frameRate: 5,
            repeat: -1
        });
    }

    skipText(){
        const x = 270;
        const y = 20;
        const width = 90;
        const height = 20;

        const fondo = this.add.rectangle(0, 0, width, height, 0x000080, 0.8);
        

        const estiloTexto = { 
            fontSize: '10px', 
            fontFamily: 'Arial', 
            color: '#ffffff' 
        };
        const texto = this.add.text(0, 0, 'Saltar Escena : K', estiloTexto);

        texto.setOrigin(0.5);


        const miCaja = this.add.container(x, y, [fondo, texto]);
        miCaja.setScrollFactor(0);
      
       
    }
}