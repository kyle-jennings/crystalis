/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
// Crystalis Clone - First Area Implementation

import CombatSystem from './classes/CombatSystem.js';
import MagicSystem from './classes/MagicSystem.js';
import Player from './classes/Player.js';
import ExperienceOrb from '@game/js/classes/ExperienceOrb.js';
import {
  GAME_KEYS, MOVEMENT_KEYS, ACTION_KEYS, INPUT_CONFIG,
} from './lib/inputMappings.js';

// Import all level modules as objects
import LevelBuilder from '@/game/js/classes/LevelBuilder.js';
import Level1 from './levels/level-1.js';
import Level2 from './levels/level-2.js';
import Level3 from './levels/level-3.js';

const CONFIG_DEFAULTS = Object.freeze({
  isEditMode: false,
  $elm: '#gameCanvas',
});
export default class CrystalisGame {
  constructor(userConfigs = CONFIG_DEFAULTS) {
    const configs = {
      isEditMode: false,
      $elm: '#gameCanvas',
      ...userConfigs,
    };
    this.isEditMode = configs.isEditMode;
    this.canvas = document.querySelector(configs.$elm);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;


    // Level registry for easy access
    this.LEVELS = {
      1: Level1,
      2: Level2,
      3: Level3,
    };


    // Game state
    this.currentLevel = 1;
    this.maxLevel = 3;
    this.Level = new LevelBuilder(); // Will hold the active level module
    this.gameTime = 0;
    this.camera = { x: 0, y: 0 };
    this.worldWidth = 1024;
    this.worldHeight = 768;

    // Player stats and state
    this.player = new Player(256, 400); // Start in center of first area
    this.magicSystem = new MagicSystem(this.player, this);
    this.combatSystem = new CombatSystem(this.player, this);
    
    // Game entities
    this.enemies = [];
    this.items = [];
    this.projectiles = [];
    this.effects = [];
    this.trees = []; // Add trees array
    this.mountains = []; // Add mountains array
    this.caves = []; // Add caves array
    this.stalactites = []; // Add stalactites array
    this.houses = []; // Add houses array
    this.walls = []; // Add walls array
    this.entries = []; // Add entries array for level transitions

    // Input handling
    this.keys = {};
    this.lastAttackTime = 0;
    this.lastMagicTime = 0;
    this.enemiesCanMove = true; // Toggle for enemy movement

    // Charge attack system
    this.isCharging = false;
    this.chargeStartTime = 0;
    this.chargeRequiredTime = INPUT_CONFIG.chargeRequiredTime;
    this.chargeIndicatorDelay = INPUT_CONFIG.chargeIndicatorDelay;

    // Initialize world
    this.loadLevel(this.currentLevel);
    this.setupEventListeners();
    this.updateUI();

    // Make game instance globally accessible for button
    window.game = this;

    // Start game loop
    this.gameLoop();

  }

  loadLevel(levelNumber) {
    // Set current level object
    this.Level.updateConfigs(this.LEVELS[levelNumber]);

    if (!this.Level) {
      console.warn(`Level ${levelNumber} not found, loading level 1`);
      // eslint-disable-next-line prefer-destructuring
      this.Level.updateConfigs(this.LEVELS[1]);
      this.currentLevel = 1;
    }

    // Using new Level class
    console.log('Loading level using Level class');
    
    // Reset player position to spawn point
    this.player.x = this.Level.playerX;
    this.player.y = this.Level.playerY;

    // Adjust canvas size based on level instance
    // Canvas dimensions: The actual HTML canvas element size (what the user sees)
    this.canvas.width = this.Level.canvasWidth;
    this.canvas.height = this.Level.canvasHeight;
    
    // Logical/viewport dimensions: Used for camera calculations and rendering bounds
    // (Usually same as canvas dimensions, but can be different for scaling scenarios)
    this.width = this.Level.width;
    this.height = this.Level.height;
    
    // World dimensions: The total game world size that entities can exist in
    // (Can be larger than canvas/viewport for scrolling levels)
    this.worldWidth = this.Level.worldWidth;
    this.worldHeight = this.Level.worldHeight;

    // Initialize the level using the Level class
    this.Level.initialize(this);
    
    console.log(`Loaded Level ${this.currentLevel}`);
  }

  switchLevel(direction) {
    const newLevel = this.currentLevel + direction;
    if (newLevel >= 1 && newLevel <= this.maxLevel) {
      this.currentLevel = newLevel;
      this.loadLevel(this.currentLevel);
      this.updateUI();
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      // Start charging when space is first pressed
      if (e.code === ACTION_KEYS.attack && !this.keys[ACTION_KEYS.attack]) {
        this.isCharging = true;
        this.chargeStartTime = this.gameTime;
      }

      this.keys[e.code] = true;

      // Prevent default browser behavior for game keys
      if (GAME_KEYS.includes(e.code)) {
        e.preventDefault();
      }
    });

    document.addEventListener('keyup', (e) => {
      // Handle space key release for attacks
      if (e.code === ACTION_KEYS.attack && this.isCharging) {
        const chargeTime = this.gameTime - this.chargeStartTime;

        console.log('Space released, charge time:', chargeTime, 'required:', this.chargeRequiredTime);

        // Check if charged long enough for projectile attack
        if (chargeTime >= this.chargeRequiredTime) {
          console.log('Firing projectile...');
          const projectileData = this.player.attack();
          console.log('Projectile data:', projectileData);
          this.combatSystem.createSwordAttack(projectileData);
          this.lastAttackTime = this.gameTime;
        } else {
          // Short press - perform melee attack
          console.log('Performing melee attack');
          this.combatSystem.performMeleeAttack();
          this.lastAttackTime = this.gameTime;
        }

        // Reset charging state
        this.isCharging = false;
        this.chargeStartTime = 0;
      }

      this.keys[e.code] = false;
    });

    // Add keyboard shortcut for toggling enemy movement
    document.addEventListener('keydown', (e) => {
      if (e.code === ACTION_KEYS.toggleEnemies) {
        this.toggleEnemyMovement();
        e.preventDefault();
      }

      if (e.code === ACTION_KEYS.toggleInstructions) {
        window.toggleInstructions();
        e.preventDefault();
      }

      if (e.code === ACTION_KEYS.nextLevel) {
        this.switchLevel(1);
        e.preventDefault();
      }

      if (e.code === ACTION_KEYS.prevLevel) {
        this.switchLevel(-1);
        e.preventDefault();
      }
    });
  }

  update() {
    this.gameTime += 1 / 60;

    // Skip player and enemy updates in edit mode
    if (this.isEditMode) {
      return;
    }

    // Handle input
    this.handleInput();

    // Update player
    this.player.update();

    // Check for cave opening portal activation
    const portalMountain = this.player.checkCaveOpeningPortal(this.mountains);
    if (portalMountain && portalMountain.caveOpeningDestination) {
      console.log(`Entering portal to level ${portalMountain.caveOpeningDestination}`);
      this.currentLevel = portalMountain.caveOpeningDestination;
      this.loadLevel(this.currentLevel);
      this.updateUI();
      return; // Skip rest of update to avoid issues during level transition
    }

    // Check for entry collisions (level transitions)
    for (const entry of this.entries) {
      if (entry.checkCollision(this.player)) {
        if (entry.activate(this)) {
          return; // Skip rest of update due to level transition
        }
      }
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Only update enemy movement if enabled
      if (this.enemiesCanMove) {
        // Pass game entities to enemy for collision detection
        const gameEntities = {
          trees: this.trees,
          mountains: this.mountains,
          stalactites: this.stalactites,
          houses: this.houses,
          walls: this.walls
        };
        
        enemy.update(this.player, gameEntities);
      } else {
        // Still update animation even when frozen
        enemy.updateAnimation();
      }

      // Remove dead enemies
      if (enemy.hp <= 0) {
        // Drop experience
        this.items.push(new ExperienceOrb(enemy.x, enemy.y, enemy.expValue));
        this.enemies.splice(i, 1);
      }
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();

      if (projectile.shouldRemove) {
        this.projectiles.splice(i, 1);
      }
    }

    // Update items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.update();

      // Check pickup
      if (this.getDistance(this.player, item) < 20) {
        item.pickup(this.player);
        this.items.splice(i, 1);
        this.updateUI();
      }
    }

    // Update effects
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.update();

      if (effect.shouldRemove) {
        this.effects.splice(i, 1);
      }
    }

    // Check collisions
    this.checkCollisions();

    // Update camera to follow player
    this.updateCamera();

    // Update magic system
    this.magicSystem.update(1/60); // Pass delta time
  }

  handleInput() {
    // Skip input handling in edit mode
    if (this.isEditMode) {
      return;
    }

    let { speed } = this.player;
    let dx = 0; let
      dy = 0;

    // Check if player is in a mountain or cave for speed reduction
    const inMountain = this.player.checkMountainSlowdown(this.mountains);
    const inCave = this.player.checkCaveSlowdown(this.caves);
    if (inMountain || inCave) {
      speed *= 0.4; // Reduce speed to 40% when in mountain or cave
    }

    // Movement (8-directional) using key mappings
    if (MOVEMENT_KEYS.up.some((key) => this.keys[key])) dy -= speed;
    if (MOVEMENT_KEYS.down.some((key) => this.keys[key])) dy += speed;
    if (MOVEMENT_KEYS.left.some((key) => this.keys[key])) dx -= speed;
    if (MOVEMENT_KEYS.right.some((key) => this.keys[key])) dx += speed;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707; // 1/sqrt(2)
      dy *= 0.707;
    }

    // Store player's current position
    const originalX = this.player.x;
    const originalY = this.player.y;

    // Try to move player with current world boundaries
    this.player.move(dx, dy, this.worldWidth, this.worldHeight);

    // Check for tree collisions and revert if necessary
    const collidingTree = this.player.checkTreeCollisions(this.trees);
    const collidingStalactite = this.player.checkStalactiteCollisions(this.stalactites);
    const collidingHouse = this.player.checkHouseCollisions(this.houses);
    const collidingWall = this.player.checkWallCollisions(this.walls);

    if (collidingTree || collidingStalactite || collidingHouse || collidingWall) {
      // Revert to original position
      this.player.x = originalX;
      this.player.y = originalY;

      // Try moving only horizontally
      this.player.move(dx, 0, this.worldWidth, this.worldHeight);
      if (this.player.checkTreeCollisions(this.trees) || this.player.checkStalactiteCollisions(this.stalactites) || this.player.checkHouseCollisions(this.houses) || this.player.checkWallCollisions(this.walls)) {
        // Horizontal movement also collides, revert and try vertical only
        this.player.x = originalX;
        this.player.y = originalY;
        this.player.move(0, dy, this.worldWidth, this.worldHeight);

        // If vertical also collides, stay in place
        if (this.player.checkTreeCollisions(this.trees) || this.player.checkStalactiteCollisions(this.stalactites) || this.player.checkHouseCollisions(this.houses) || this.player.checkWallCollisions(this.walls)) {
          this.player.x = originalX;
          this.player.y = originalY;
        }
      }
    }

    // Dash
    if (this.keys[ACTION_KEYS.dash]) {
      this.player.dash();
      // Clear the key to prevent repeated dashing
      this.keys[ACTION_KEYS.dash] = false;
    }

    // Change magic (placeholder)
    if (this.keys[ACTION_KEYS.changeMagic]) {
      // Cycle through magic spells
    }

    // Magic/Item use
    if (this.keys[ACTION_KEYS.magic] && this.gameTime - this.lastMagicTime > INPUT_CONFIG.magicCooldown) {
      this.magicSystem.castSpell();
      this.lastMagicTime = this.gameTime;
      this.updateUI();
    }

    // Change magic
    if (this.keys[ACTION_KEYS.changeMagic]) {
      this.magicSystem.cycleSpell();
      this.updateUI();
      this.keys[ACTION_KEYS.changeMagic] = false; // Prevent repeated cycling
    }
  }

  checkCollisions() {
    // Player vs Enemies - check both types of invulnerability
    for (const enemy of this.enemies) {
      if (this.getDistance(this.player, enemy) < 24
                && !this.player.invulnerable && !this.player.dashInvulnerable) {
        this.player.takeDamage(enemy.damage);
        this.updateUI();
      }
    }

    // Use combat system for projectile collisions
    this.combatSystem.checkProjectileCollisions();
  }

  updateCamera() {
    // this.Level is already the LevelBuilder instance
    const levelInstance = this.Level;
    
    if (levelInstance) {
      // Using Level class
      // If level canvas size matches world size, use fixed camera (like village)
      if (levelInstance.canvasWidth === levelInstance.worldWidth
              && levelInstance.canvasHeight === levelInstance.worldHeight) {
        // Fixed camera - show entire level
        this.camera.x = 0;
        this.camera.y = 0;
      } else {
        // Dynamic camera - center on player
        this.camera.x = this.player.x - this.width / 2;
        this.camera.y = this.player.y - this.height / 2;

        // Clamp camera to world bounds
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.height));
      }
    } else {
      // Fallback - center on player
      this.camera.x = this.player.x - this.width / 2;
      this.camera.y = this.player.y - this.height / 2;

      // Clamp camera to world bounds
      this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.width));
      this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.height));
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Save context for camera transformation
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Draw world background
    this.drawBackground();

    // Draw mountains (behind everything for proper layering)
    for (const mountain of this.mountains) {
      mountain.draw(this.ctx);
    }

    // Draw houses (village buildings)
    for (const house of this.houses) {
      house.draw(this.ctx);
    }

    // Draw walls (village borders)
    for (const wall of this.walls) {
      wall.draw(this.ctx);
    }

    // Draw trees (before other entities for proper layering)
    for (const tree of this.trees) {
      tree.draw(this.ctx);
    }

    // Draw stalactites (cave decorations)
    for (const stalactite of this.stalactites) {
      stalactite.draw(this.ctx);
    }

    // Skip drawing dynamic entities in edit mode
    if (!this.isEditMode) {
      // Draw items
      for (const item of this.items) {
        item.draw(this.ctx);
      }

      // Draw enemies
      for (const enemy of this.enemies) {
        enemy.draw(this.ctx);
      }

      // Draw player
      this.player.draw(this.ctx);

      // Draw projectiles
      for (const projectile of this.projectiles) {
        projectile.draw(this.ctx);
      }

      // Draw effects
      for (const effect of this.effects) {
        effect.draw(this.ctx);
      }
    }

    // Restore context
    this.ctx.restore();

    // Skip charge indicator in edit mode
    if (!this.isEditMode) {
      // Draw charge indicator (after camera transformation)
      this.combatSystem.drawChargeIndicator();
    }
  }

  drawBackground() {
    // this.Level is already the LevelBuilder instance
    const levelInstance = this.Level;
    
    let backgroundColor, accentColor;
    
    if (levelInstance) {
      // Using Level class
      backgroundColor = levelInstance.backgroundColor;
      accentColor = levelInstance.accentColor;
    } else {
      // Fallback defaults
      backgroundColor = '#2d5016'; // Default to forest green
      accentColor = '#1a3009'; // Default to darker green
    }

    // Draw background
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    // Add some simple terrain details
    this.ctx.fillStyle = accentColor;
    for (let x = 0; x < this.worldWidth; x += 64) {
      for (let y = 0; y < this.worldHeight; y += 64) {
        if ((x + y) % 128 === 0) {
          this.ctx.fillRect(x, y, 32, 32);
        }
      }
    }
  }

  updateUI() {
    if (this.isEditMode) return;
    document.getElementById('level').textContent = this.player.level;
    document.getElementById('currentArea').textContent = this.currentLevel;
    document.getElementById('hp').textContent = this.player.hp;
    document.getElementById('maxHp').textContent = this.player.maxHp;
    document.getElementById('mp').textContent = this.player.mp;
    document.getElementById('maxMp').textContent = this.player.maxMp;
    document.getElementById('exp').textContent = this.player.exp;
    document.getElementById('currentSword').textContent = this.player.currentSword;

    // Update HP bar
    const hpPercent = (this.player.hp / this.player.maxHp) * 100;
    document.getElementById('hpFill').style.width = `${hpPercent}%`;

    // Update MP bar
    const mpPercent = (this.player.mp / this.player.maxMp) * 100;
    document.getElementById('mpFill').style.width = `${mpPercent}%`;

    // Add current spell to UI
    const currentSpellElement = document.getElementById('currentSpell');
    if (currentSpellElement) {
      currentSpellElement.textContent = this.magicSystem.getCurrentSpellName();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  toggleEnemyMovement() {
    this.enemiesCanMove = !this.enemiesCanMove;

    // Update button appearance
    const button = document.getElementById('toggleEnemiesBtn');
    if (this.enemiesCanMove) {
      button.textContent = 'Freeze Enemies';
      button.classList.remove('enemies-frozen');
    } else {
      button.textContent = 'Unfreeze Enemies';
      button.classList.add('enemies-frozen');
    }

    console.log(`Enemy movement ${this.enemiesCanMove ? 'enabled' : 'disabled'}`);
  }

  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

}
