/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
// Crystalis Clone - First Area Implementation

import CrystalisGame from '@/game/js/CrystalisGame.js';

export default class LevelEditor extends CrystalisGame {

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
}
