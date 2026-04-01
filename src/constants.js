export const SCENE = {
    WIDTH : 320,
    HEIGHT : 180
}

export const PLAYER = {
    SPEED : 100,
    MAX_HEALTH_CONTAINER : 3,
    HEALTH_PIECE : 2 
}

export const SPELLS = {
    SHOOT: {
        SPEED : 200,
        KEY : 'shoot'
    },
    FREEZE_SHOOT: {
        SPEED : 150,
        KEY : 'freezing_shoot'
    },
    SHIELD: {
        KEY : 'shield'
    }
}

export const ENEMY = {
    BASE_SPEED : 10,
    BASE_HEALTH : 5,
    BOSS : {
        HEALTH : 70,
        SPEED : 30
    }
}

export const UI = {
    HEALTH : {
        FULL_HEART : 0,
        THREE_QUARTER_HEART : 1,
        MID_HEART : 2,
        QUARTER_HEART: 3,
        ZERO_HEART : 4
    }
}