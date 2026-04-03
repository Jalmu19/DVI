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
        //this.lilith = this.physics.add.sprite(120, 80, 'lilith');
        
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
        
       /*
       this.lilith = this.physics.add.sprite(30, 50, 'lilith');
       this.abuelo = this.physics.add.sprite(250, 100, 'abuelo');
       this.abuela = this.physics.add.sprite(250, 120, 'abuela');
        */

        this.dialog();
        this.input.on('pointerdown', () => {
            this.next();
        });

        this.nextScene();

        this.skipKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Escuchamos cuando se pulsa una vez
        this.skipKey.on('down', () => {
            this.skipIntro();
        });
    }
    skipIntro() {
    // 1. Detenemos cualquier evento de tiempo activo (como la escritura del texto)
    if (this.timerText) this.timerText.remove();
    
    // 2. Limpiamos la cámara (por si estaba en medio de un Fade o Pan)
    this.cameras.main.stopFollow();
    this.cameras.main.resetFX(); 

    // 3. Efecto de salida rápido (opcional pero queda mejor)
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
        // 4. Vamos a la escena del bosque
        this.scene.start('bosque', { x: 251, y: 381 });
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
        const escalera = map.createLayer('escalera', tileset, 0, 0);
        const bordes = map.createLayer('bordes', tileset, 0, 0);
        const bordespared = map.createLayer('bordespared', tileset, 0, 0);
                const silla = map.createLayer('silla', tileset, 0, 0);

        const muebles = map.createLayer('muebles', tileset, 0, 0);
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
        this.cameras.main.setZoom(1);
        
        return layers;
    }

dialog() {
    this.dialogBox = this.add.rectangle(
        this.cameras.main.centerX, 
        this.cameras.main.centerY + 60, 
        300, 50, 0x000000, 0.7
    ).setStrokeStyle(2, 0xffffff).setScrollFactor(0);
    
    this.dialogText = this.add.text(
        this.cameras.main.centerX - 145, 
        this.cameras.main.centerY + 40, 
        '', 
        { fontSize: '10px', fontFamily: 'monospace', wordWrap: { width: 300 } }
    ).setScrollFactor(0);

    // Los ocultamos al inicio si fuera necesario
    this.toggleDialog(false);
}

toggleDialog(visible) {
    this.dialogBox.setVisible(visible);
    this.dialogText.setVisible(visible);
}
    nextScene() {
        const actualText = STORY[this.n];
        this.writingAnimation(actualText.text);
    }

    writingAnimation(text) {
        this.isWriting = true;
        this.toggleDialog(true);
        this.dialogText.setText('');
        const actualEntry = STORY[this.n];
    if (actualEntry.action) {
        this.handleAction(actualEntry.action);
    }
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

            // 1. GESTIÓN DE CÁMARA (Ocurre primero)
            if (this.n === 2) {
                this.isWriting = true; // Bloqueamos para que no pasen texto mientras la cámara se mueve
                this.dialogText.setText(''); // Limpiamos el texto para que no estorbe el movimiento
                this.toggleDialog(false); // <--- OCULTAMOS TODO
                this.cameras.main.pan(this.centerX, this.centerY + 100, 3000, 'Power2', false, (camera, progress) => {
                    // Solo cuando el movimiento de cámara termina (progress === 1)
                    if (progress === 1) {
                        this.ejecutarTextoConDelay(actualText);
                    }
                });
            } 
            else {
                // Si no hay movimiento de cámara, vamos directo al texto
                this.ejecutarTextoConDelay(actualText);
            }

        } else {
            this.scene.start('bosque', {x: 251, y: 381});
              this.scene.launch('ui');
                this.musicaFondo = this.sound.add('musicaFondo');
                this.musicaFondo.play();
                this.musicaFondo.setLoop(true); 
                this.scene.start('bosque', {x: 251, y: 381, stats : null});
        }
    }
}

// Creamos esta función auxiliar para no repetir código
ejecutarTextoConDelay(actualText) {
    if (actualText.delay) {
        this.isWriting = true;
        this.dialogText.setText('');
        this.time.delayedCall(actualText.delay, () => {
            this.nextScene();
        });
    } else {
        this.nextScene();
    }
}

// Añade este método a tu clase IntroStoryScene
handleAction(actionName) {
    if (!actionName) return;

    switch (actionName) {
        case 'lilith_goes':
            // Creamos la línea de tiempo
            this.add.timeline([
                {
                    at: 0, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        x: '+=60', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                },
                {
                    at: 3000, // Empieza justo cuando termina el anterior (a los 1000ms)
                    tween: {
                        targets: this.lilith,
                        y: '+=200', // Se mueve a la derecha 100 píxeles
                        duration: 2500
                    }
                },
                {
                    at: 8000, // Empieza al terminar el anterior (1000 + 1500)
                    run: () => {
                        this.lilith.anims.stop();
                        this.lilith.setFrame(0); // Se queda quieta
                        this.lilith.setVisible(false);
                    }
                }
            ]).play();
        break;
        case 'lilith_move':
            // Creamos la línea de tiempo
            
            this.time.delayedCall(25000, () => {
                /*
                this.cameras.main.fadeOut(5000, 0, 0, 0);
            });
            */
            //this.cameras.main.once('camerafadeoutcomplete', () => {
            
                Object.values(this.layersRoom).forEach(layer => {
                    layer.setVisible(false);
                });
                this.abuela.setVisible(true);
            this.abuelo.setVisible(true);
            Object.values(this.layersHome).forEach(layer => {
                layer.setVisible(true);
                });
            this.lilith = this.physics.add.sprite(150, 80, 'lilith');
                });

                 
        


            this.add.timeline([
                {
                    at: 3000, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        x: '+=33', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                },
                {
                    at: 10000, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        y: '+=50', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                },
                {
                    at: 13000, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        x: '-=45', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                },
                {
                    at: 20000, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        y: '-=35', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                },
                {
                    at: 23000, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        x: '-=45', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                },
                {
                    
                    at: 26000, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        y: '+=60', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                }
                
            ]).play();
            
        break;
        case 'home_move':
            // Creamos la línea de tiempo
            this.add.timeline([
                {
                    at: 0, // Empieza de inmediato
                    tween: {
                        targets: this.lilith,
                        y: '+=60', // Baja 50 píxeles desde donde esté
                        duration: 1500
                    }
                },
                {
                    at: 3000, // Empieza justo cuando termina el anterior (a los 1000ms)
                    tween: {
                        targets: this.lilith,
                        x: '+=200', // Se mueve a la derecha 100 píxeles
                        duration: 4500
                    }
                }
                
            ]).play();
        break;
        case 'changeRoomScene':
            console.log(this.n);
            this.isWriting = true;
            this.toggleDialog(false);
        // Difuminado a negro para que el cambio no sea brusco
        this.cameras.main.fadeOut(5000, 0, 0, 0);
        
        
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            
             Object.values(this.layersChurch).forEach(layer => {
            layer.setVisible(false);
        });
            this.abuela.setVisible(false);
        this.abuelo.setVisible(false);
        Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(true);
        });
        this.lilith = this.physics.add.sprite(150, 80, 'lilith');
       this.cameras.main.setScroll(0, 0);
            this.time.delayedCall(5000, () => {
            // Vuelves a mostrar la cámara
            this.cameras.main.fadeIn(5000, 0, 0, 0);
            this.cameras.main.once('camerafadeincomplete', () => {
                 // <--- ¡AQUÍ LIBERAMOS EL JUEGO!
                // Ahora, cuando el jugador haga clic, el contador 'n' subirá
                // y aparecerá el diálogo 18 automáticamente.
                this.toggleDialog(true);
                this.isWriting = false;
               
            });
            });
        });
        break;
        case 'changeHomeScene':
            console.log(this.n);
            this.isWriting = true;
            this.toggleDialog(false);
        // Difuminado a negro para que el cambio no sea brusco
        this.cameras.main.fadeOut(5000, 0, 0, 0);
        
        
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            
             Object.values(this.layersRoom).forEach(layer => {
            layer.setVisible(false);
        });
            this.lilith.setVisible(false)
            
        Object.values(this.layersHome).forEach(layer => {
            layer.setVisible(true);
        });
        this.lilith = this.physics.add.sprite(100, 210, 'lilith');
        this.abuela = this.physics.add.sprite(100, 210, 'abuela');
        this.abuelo = this.physics.add.sprite(100, 210, 'abuelo');
       this.cameras.main.setScroll(0, 0);
            this.time.delayedCall(5000, () => {
            // Vuelves a mostrar la cámara
            this.cameras.main.fadeIn(5000, 0, 0, 0);
            this.cameras.main.once('camerafadeincomplete', () => {
                 // <--- ¡AQUÍ LIBERAMOS EL JUEGO!
                // Ahora, cuando el jugador haga clic, el contador 'n' subirá
                // y aparecerá el diálogo 18 automáticamente.
                this.toggleDialog(true);
                this.isWriting = false;
               
            });
            });
        });
        break;
    }
}
}