import { Slime, Ant } from './Enemy.js';
import ExperienceOrb from '@game/js/classes/ExperienceOrb.js';
import Tree from './Tree.js';
import Mountain from './Mountain.js';
import Wall from './Wall.js';
import House from './House.js';
import Stalactite from './Stalactite.js';
import Entry from './Entry.js';
import Cave from './Cave.js';

// Level.js - Level configuration class for Crystalis game
export default class LevelBuilder {
  static constructorParams = {
    canvasWidth: {
      type: 'number',
      description: 'Width of the game canvas',
    },
    canvasHeight: {
      type: 'number',
      description: 'Height of the game canvas',
    },
    width: {
      type: 'number',
      description: 'Logical width of the level',
    },
    height: {
      type: 'number',
      description: 'Logical height of the level',
    },
    worldWidth: {
      type: 'number',
      description: 'Total world width for camera bounds',
    },
    worldHeight: {
      type: 'number',
      description: 'Total world height for camera bounds',
    },
    playerX: {
      type: 'number',
      description: 'Default player spawn X position',
    },
    playerY: {
      type: 'number',
      description: 'Default player spawn Y position',
    },
    backgroundColor: {
      type: 'string',
      description: 'Background color of the level',
    },
    accentColor: {
      type: 'string',
      description: 'Accent color for terrain details',
    },
  };

  constructor(config = {}) {
    this.updateConfigs(config);
  }

  updateConfigs(config = {}) {
  // Canvas dimensions
    this.canvasWidth = config.canvasWidth || 512;
    this.canvasHeight = config.canvasHeight || 480;
    
    // Logical dimensions
    this.width = config.width || this.canvasWidth;
    this.height = config.height || this.canvasHeight;
    
    // World dimensions (for camera bounds)
    this.worldWidth = config.worldWidth || 1024;
    this.worldHeight = config.worldHeight || 768;
    
    // Player spawn position
    this.playerX = config.playerX || 256;
    this.playerY = config.playerY || 400;
    
    // Visual settings
    this.backgroundColor = config.backgroundColor || '#2d5016'; // Forest green
    this.accentColor = config.accentColor || '#1a3009'; // Darker green
    
    // Game entities (initialize as empty arrays if not provided)
    this.enemies = config.enemies || [];
    this.items = config.items || [];
    this.trees = config.trees || [];
    this.mountains = config.mountains || [];
    this.caves = config.caves || [];
    this.stalactites = config.stalactites || [];
    this.houses = config.houses || [];
    this.walls = config.walls || [];
    this.entries = config.entries || [];
  }

  // Get canvas configuration object
  getCanvasConfigs() {
    return {
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      width: this.width,
      height: this.height,
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight,
      playerX: this.playerX,
      playerY: this.playerY,
    };
  }

  // Get background configuration object
  getBackgroundConfigs() {
    return {
      backgroundColor: this.backgroundColor,
      accentColor: this.accentColor,
    };
  }

  // Initialize level entities (to be overridden by specific levels)
  initialize(game) {
    // Clear existing entities
    game.caves = this.caves.map(config => new Cave(config.x, config.y));
    game.enemies = this.enemies.map((config) => {
      if (config.type === 'Slime') {
        return new Slime(config.x, config.y);
      } else if (config.type === 'Ant') {
        return new Ant(config.x, config.y);
      }
    });
    game.items = this.items.map(config => new ExperienceOrb(config.x, config.y, config.value));
    game.trees = this.trees.map(config => new Tree(config.x, config.y));
    game.mountains = this.mountains.map(config => new Mountain(config.x, config.y, config.hasPortal, config.portalDestination));
    game.stalactites = this.stalactites.map(config => new Stalactite(config.x, config.y, config.isHanging));
    game.houses = this.houses.map(config => new House(config.x, config.y, config.type));
    game.walls = this.walls
      .filter(config => !config.isOpening)
      .map(config => new Wall(
          config.x,
          config.y,
          config.width,
          config.height
        )
      );
    game.entries = this.entries.map(config => new Entry(
      config.x,
      config.y,
      config.width,
      config.height,
      config.destinationLevel,
      config.destinationX,
      config.destinationY,
    ))
  }

  // // Add entity methods for level building
  // addEnemy(enemy) {
  //   this.enemies.push(enemy);
  //   return this;
  // }

  // addTree(tree) {
  //   this.trees.push(tree);
  //   return this;
  // }

  // addMountain(mountain) {
  //   this.mountains.push(mountain);
  //   return this;
  // }

  // addCave(cave) {
  //   this.caves.push(cave);
  //   return this;
  // }

  // addStalactite(stalactite) {
  //   this.stalactites.push(stalactite);
  //   return this;
  // }

  // addHouse(house) {
  //   this.houses.push(house);
  //   return this;
  // }

  // addWall(wall) {
  //   this.walls.push(wall);
  //   return this;
  // }

  // addEntry(entry) {
  //   this.entries.push(entry);
  //   return this;
  // }

  // Utility method to create default level settings
  static createDefault() {
    return new Level({
      canvasWidth: 512,
      canvasHeight: 480,
      worldWidth: 1024,
      worldHeight: 768,
      playerX: 256,
      playerY: 400,
      backgroundColor: '#2d5016',
      accentColor: '#1a3009',
    });
  }

  static loadLevel(game) {

    // Get the Level instance if it exists, otherwise fall back to old format

    // Using new Level class
    console.log('Loading level using Level class');
    
    // Reset player position to spawn point
    game.player.x = this.playerX;
    game.player.y = this.playerY;

    // Adjust canvas size based on level instance
    game.canvas.width = this.canvasWidth;
    game.canvas.height = this.canvasHeight;
    game.width = this.width;
    game.height = this.height;
    game.worldWidth = this.worldWidth;
    game.worldHeight = this.worldHeight;

    // Initialize the level using the Level class
    this.initialize(game);
    
    console.log(`Loaded Level ${game.currentLevel}`);
  }

}
