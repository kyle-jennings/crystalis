// inputMappings.js - Input key mappings and configurations for the game

// Movement key mappings
export const MOVEMENT_KEYS = {
    up: ['KeyW', 'ArrowUp'],
    down: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight']
};

// Action key mappings
export const ACTION_KEYS = {
    attack: 'KeyZ',
    dash: 'ShiftLeft',
    magic: 'KeyX',
    changeMagic: 'KeyC',
    toggleEnemies: 'KeyT',
    toggleInstructions: 'KeyH',
    nextLevel: 'BracketRight',     // ] key
    prevLevel: 'BracketLeft'       // [ key
};

// Input configuration
export const INPUT_CONFIG = {
    dashCooldown: 1.0,
    attackCooldown: 0.3,
    magicCooldown: 0.5,
    chargeRequiredTime: 1.5,
    chargeIndicatorDelay: 0.5
};


// Game control keys that should have default browser behavior prevented
export const GAME_KEYS = [
    ...Object.values(MOVEMENT_KEYS).flat(),
    ...Object.values(ACTION_KEYS)
];
