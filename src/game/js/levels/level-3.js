// Cave Area
import { Slime, Ant } from '../classes/Enemy.js';
import ExperienceOrb from '@game/js/classes/ExperienceOrb.js';
import Mountain from '../classes/Mountain.js';
import Stalactite from '../classes/Stalactite.js';

// canvas configuration (default size)
export const canvasConfigs = {
  canvasWidth: 540,
  canvasHeight: 566,
  width: 540,
  height: 566,
  worldWidth: 1024,
  worldHeight: 768,
  playerX: 256,
  playerY: 400,
};

// background configuration
export const backgroundConfigs = {
  backgroundColor: '#1a1a1a', // Dark cave
  accentColor: '#2a2a2a', // Slightly lighter
  theme: 'cave',
};

// Cave enemy configurations
const enemyConfigs = [
  // Cave entrance area enemies
  {
    type: 'Slime', x: 200, y: 300, area: 'Cave entrance',
  },
  {
    type: 'Slime', x: 350, y: 250, area: 'Cave entrance',
  },
  {
    type: 'Ant', x: 400, y: 400, area: 'Cave entrance',
  },
  {
    type: 'Ant', x: 150, y: 350, area: 'Cave entrance',
  },

  // Deeper cave enemies
  {
    type: 'Slime', x: 600, y: 200, area: 'Deeper cave',
  },
  {
    type: 'Slime', x: 750, y: 350, area: 'Deeper cave',
  },
  {
    type: 'Ant', x: 500, y: 500, area: 'Deeper cave',
  },
  {
    type: 'Ant', x: 800, y: 450, area: 'Deeper cave',
  },
  {
    type: 'Slime', x: 900, y: 250, area: 'Deeper cave',
  },

  // Cave tunnels enemies
  {
    type: 'Ant', x: 300, y: 600, area: 'Cave tunnels',
  },
  {
    type: 'Slime', x: 450, y: 650, area: 'Cave tunnels',
  },
  {
    type: 'Ant', x: 700, y: 600, area: 'Cave tunnels',
  },
];

// Cave item configurations
const itemConfigs = [
  {
    x: 180, y: 180, value: 8, description: 'Higher value in caves',
  },
  {
    x: 450, y: 300, value: 8, description: 'Cave treasure',
  },
  {
    x: 700, y: 200, value: 10, description: 'Rare find',
  },
  {
    x: 850, y: 400, value: 8, description: 'Cave treasure',
  },
  {
    x: 300, y: 550, value: 8, description: 'Cave treasure',
  },
  {
    x: 600, y: 650, value: 10, description: 'Deep cave treasure',
  },
  {
    x: 100, y: 400, value: 8, description: 'Cave treasure',
  },
];

// Cave mountain configurations (rock formations/cave walls)
const mountainConfigs = [
  {
    x: 150, y: 50, hasPortal: false, portalDestination: null, description: 'North chamber wall',
  },
  {
    x: 700, y: 80, hasPortal: false, portalDestination: null, description: 'Northeast wall',
  },
  {
    x: 50, y: 450, hasPortal: false, portalDestination: null, description: 'West wall',
  },
  {
    x: 850, y: 350, hasPortal: false, portalDestination: null, description: 'East wall',
  },
  {
    x: 400, y: 500, hasPortal: true, portalDestination: 1, description: 'Central cave formation - PORTAL BACK TO LEVEL 1',
  },
  {
    x: 800, y: 600, hasPortal: true, portalDestination: 3, description: 'Deep cave exit - PORTAL TO VILLAGE (LEVEL 3)',
  },
];

// Cave stalactite configurations
const stalactiteConfigs = [
  // Entry chamber stalactites
  {
    x: 120, y: 100, isHanging: true, description: 'Stalactite (hanging)',
  },
  {
    x: 180, y: 150, isHanging: false, description: 'Stalagmite (floor)',
  },
  {
    x: 280, y: 80, isHanging: true, description: 'Stalactite',
  },
  {
    x: 320, y: 200, isHanging: false, description: 'Stalagmite',
  },

  // Main chamber stalactites
  {
    x: 450, y: 120, isHanging: true, description: 'Stalactite',
  },
  {
    x: 480, y: 350, isHanging: false, description: 'Stalagmite',
  },
  {
    x: 550, y: 180, isHanging: true, description: 'Stalactite',
  },
  {
    x: 620, y: 300, isHanging: false, description: 'Stalagmite',
  },

  // Deep cave stalactites
  {
    x: 750, y: 200, isHanging: true, description: 'Stalactite',
  },
  {
    x: 780, y: 280, isHanging: false, description: 'Stalagmite',
  },
  {
    x: 850, y: 150, isHanging: true, description: 'Stalactite',
  },
  {
    x: 920, y: 250, isHanging: false, description: 'Stalagmite',
  },

  // Lower tunnel stalactites
  {
    x: 200, y: 580, isHanging: true, description: 'Stalactite',
  },
  {
    x: 250, y: 620, isHanging: false, description: 'Stalagmite',
  },
  {
    x: 380, y: 570, isHanging: true, description: 'Stalactite',
  },
  {
    x: 650, y: 590, isHanging: true, description: 'Stalactite',
  },
  {
    x: 720, y: 630, isHanging: false, description: 'Stalagmite',
  },
];

export function initialize(game) {
  // Clear existing entities
  game.enemies = [];
  game.items = [];
  game.trees = [];
  game.mountains = [];
  game.stalactites = [];
  game.houses = [];
  game.walls = [];

  // Create enemies from configuration
  enemyConfigs.forEach((config) => {
    if (config.type === 'Slime') {
      game.enemies.push(new Slime(config.x, config.y));
    } else if (config.type === 'Ant') {
      game.enemies.push(new Ant(config.x, config.y));
    }
  });

  // Create items from configuration
  itemConfigs.forEach((config) => {
    game.items.push(new ExperienceOrb(config.x, config.y, config.value));
  });

  // Create mountains from configuration
  mountainConfigs.forEach((config) => {
    game.mountains.push(new Mountain(config.x, config.y, config.hasPortal, config.portalDestination));
  });

  // Create stalactites from configuration
  stalactiteConfigs.forEach((config) => {
    game.stalactites.push(new Stalactite(config.x, config.y, config.isHanging));
  });
}
