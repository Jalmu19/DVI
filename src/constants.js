export const SCENE = {
    WIDTH: 320,
    HEIGHT: 180
}

export const PLAYER = {
    SPEED: 100,
    MAX_HEALTH_CONTAINER: 3,
    HEALTH_PIECE: 1
}

export const SPELLS = {
    SHOOT: {
        SPEED: 200,
        KEY: 'shoot'
    },
    FREEZE_SHOOT: {
        SPEED: 150,
        KEY: 'freezing_shoot'
    },
    SHIELD: {
        KEY: 'shield'
    }
}

export const ENEMY = {
    BASE_SPEED: 10,
    BASE_HEALTH: 5,
    RAT: {
        SPEED: 40
    },
    BOSS: {
        HEALTH: 70,
        SPEED: 70,
        FIRST: {
            HITBOX: {
                'side': {
                    normal: { width: 55, height: 49, offsetX: 6, offsetY: 11 },
                    weak: { width: 12, height: 10, offsetX: 20, offsetY: -10}
                },
                'front': {
                    normal: { width: 38, height: 50, offsetX: 14, offsetY: 8 },
                    weak: { width: 10, height: 10, offsetX: 2, offsetY: 0}
                },
                'back': {
                    normal: { width: 38, height: 52, offsetX: 14, offsetY: 7 },
                    weak: { width: 10, height: 7, offsetX: -1, offsetY: -12}
                } 
            }

        }
    }
}

export const UI = {
    HEALTH: {
        FULL_HEART: 0,
        THREE_QUARTER_HEART: 1,
        MID_HEART: 2,
        QUARTER_HEART: 3,
        ZERO_HEART: 4
    }
}

export const NUM_ESTRELLAS_LABERINTO = 3;