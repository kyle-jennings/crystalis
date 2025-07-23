// inputMappings.js - Input key mappings and configurations for the game

// Game control keys that should have default browser behavior prevented
export const GAME_KEYS = [
    'Space',
    'KeyW',
    'KeyA', 
    'KeyS',
    'KeyD',
    'KeyQ',
    'KeyE',
    'KeyZ',
    'KeyT',
    'KeyH',
    'ArrowUp',
    'ArrowDown', 
    'ArrowLeft',
    'ArrowRight'
];

// Movement key mappings
export const MOVEMENT_KEYS = {
    up: ['KeyW', 'ArrowUp'],
    down: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight']
};

// Action key mappings
export const ACTION_KEYS = {
    attack: 'Space',
    dash: 'KeyZ',
    magic: 'KeyQ',
    changeMagic: 'KeyE',
    toggleEnemies: 'KeyT',
    toggleInstructions: 'KeyH'
};

// Input configuration
export const INPUT_CONFIG = {
    dashCooldown: 1.0,
    attackCooldown: 0.3,
    magicCooldown: 0.5,
    chargeRequiredTime: 1.5,
    chargeIndicatorDelay: 0.5
};
