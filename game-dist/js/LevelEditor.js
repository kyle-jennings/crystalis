/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
// Crystalis Clone - First Area Implementation

import CrystalisGame from '@/game/js/CrystalisGame.js';

export default class LevelEditor extends CrystalisGame {

  constructor(userConfigs = {}) {
    super(userConfigs);
    
    // Set up click event listeners for edit mode
    if (this.isEditMode) {
      this.setupEditModeListeners();
    }
  }

  setupEditModeListeners() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left + this.camera.x;
      const clickY = e.clientY - rect.top + this.camera.y;
      
      console.log(`Clicked at world coordinates: (${clickX}, ${clickY})`);
      
      // Check what was clicked on
      this.identifyClickedEntity(clickX, clickY);
    });

    // Add drag and drop support
    this.canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    this.canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      this.handleCanvasDrop(e);
    });
  }

  handleCanvasDrop(e) {
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const dragData = JSON.parse(data);
      const rect = this.canvas.getBoundingClientRect();
      
      // Calculate world coordinates where the object was dropped
      const dropX = e.clientX - rect.left + this.camera.x;
      const dropY = e.clientY - rect.top + this.camera.y;

      console.log(`Dropped ${dragData.objectType} at (${dropX}, ${dropY})`);
      
      // Create and place the new object
      this.createObjectAtPosition(dragData.objectType, dropX, dropY);
      
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }

  createObjectAtPosition(objectType, x, y) {
    // Import the object mappings to get the class
    import('@game/js/lib/objectMappings').then((module) => {
      const GameEnvironmentObjects = module.default;
      const ObjectClass = GameEnvironmentObjects[objectType];
      
      if (!ObjectClass) {
        console.error(`Unknown object type: ${objectType}`);
        return;
      }

      // Create temporary instance to get dimensions
      const tempObject = new ObjectClass(0, 0);
      const objectWidth = tempObject.width || 32;
      const objectHeight = tempObject.height || 32;
      
      // Center the object at the mouse position
      const centeredX = x - (objectWidth / 2);
      const centeredY = y - (objectHeight / 2);

      // Create new instance with centered position
      const newObject = new ObjectClass(centeredX, centeredY);

      // Add to the appropriate array based on object type
      const typeMap = {
        'House': this.houses,
        'Wall': this.walls,
        'Tree': this.trees,
        'Mountain': this.mountains,
        'Stalactite': this.stalactites,
        'Cave': this.caves,
        'Entry': this.entries,
      };

      const targetArray = typeMap[objectType];
      console.log(objectType, targetArray);
      if (targetArray) {
        targetArray.push(newObject);
        console.log(`Added new ${objectType} at (${x}, ${y})`);
        
        // Trigger a re-render
        console.log(this);
        this.render();
      } else {
        console.error(`No array found for object type: ${objectType}`);
      }
    }).catch(error => {
      console.error('Error importing object mappings:', error);
    });
  }

  identifyClickedEntity(x, y) {
    // Check houses
    const objects = [
      this.houses,
      this.walls,
      this.trees,
      this.mountains,
      this.stalactites,
      this.caves,
      this.entries,
    ];
    
    // objects.forEach((objArr) => {
    for (const objArr of objects) {
      for (const obj of objArr) {
        if (this.isPointInEntity(x, y, obj)) {
          this.logEntityDetails(obj);
          
          // Update the Vue component via the store
          if (this.setSelectedEntity) {
            this.setSelectedEntity(obj);
          }
          
          return;
        }
      }
    }

    // If nothing was clicked, log the empty space
    console.log('=== EMPTY SPACE CLICKED ===');
    console.log(`Empty space at coordinates: (${x}, ${y})`);
    
    // Clear selection for empty space
    if (this.setSelectedEntity) {
      this.setSelectedEntity(null);
    }
  }

  isPointInEntity(x, y, entity) {
    // Most entities have x, y, width, height properties
    const entityX = entity.x || 0;
    const entityY = entity.y || 0;
    const entityWidth = entity.width || 32; // Default width
    const entityHeight = entity.height || 32; // Default height

    return x >= entityX && x <= entityX + entityWidth &&
           y >= entityY && y <= entityY + entityHeight;
  }

  logEntityDetails(entity) {
    const obj = {};
    console.log(`--- ${entity.type || 'Entity'} ---`);

    // Try to access constructorParams if available
    if (entity.constructor && entity.constructor.constructorParams) {
      // console.log('--- Constructor Parameters ---');
      for (const [param, config] of Object.entries(entity.constructor.constructorParams)) {
        const currentValue = entity[param];
        obj[param] = `${currentValue} (${config.type}) - ${config.description}`;
        // console.log(`${param}: ${currentValue} (${config.type}) - ${config.description}`);
      }
      console.log(obj);
    }
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

    // Draw caves (cave areas)
    for (const cave of this.caves) {
      cave.draw(this.ctx);
    }

    // Draw entries (level transitions) - only visible in edit mode
    for (const entry of this.entries) {
      entry.draw(this.ctx, this.isEditMode);
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

    this.drawGrid()
  }

  updateUI() {
    if (this.isEditMode) return;
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
    this.canvas.width = this.Level.worldWidth;
    this.canvas.height = this.Level.worldHeight;
    this.width = this.Level.worldWidth;
    this.height = this.Level.worldHeight;
    this.worldWidth = this.Level.worldWidth;
    this.worldHeight = this.Level.worldHeight;

    // Initialize the level using the Level class
    this.Level.initialize(this);
    
    console.log(`Loaded Level ${this.currentLevel}`);
  }

  drawGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 0.5;

    const gridSize = 32;

    // Vertical lines
    for (let x = 0; x <= this.worldWidth; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.worldHeight);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.worldHeight; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.worldWidth, y);
      this.ctx.stroke();
    }
  }

}
