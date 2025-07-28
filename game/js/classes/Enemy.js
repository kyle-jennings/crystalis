// Enemy.js - Enemy classes for Crystalis game

// Base Enemy class
export class Enemy {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the enemy',
    },
    y: {
      type: 'number',
      description: 'Y position of the enemy',
    },
    width: {
      type: 'number',
      description: 'Width of enemy sprite (fixed at 16)',
    },
    height: {
      type: 'number',
      description: 'Height of enemy sprite (fixed at 16)',
    },
    hp: {
      type: 'number',
      description: 'Current hit points',
    },
    maxHp: {
      type: 'number',
      description: 'Maximum hit points',
    },
    damage: {
      type: 'number',
      description: 'Damage dealt to player on contact',
    },
    expValue: {
      type: 'number',
      description: 'Experience points given when defeated',
    },
    speed: {
      type: 'number',
      description: 'Movement speed',
    },
    animFrame: {
      type: 'number',
      description: 'Current animation frame',
    },
    animTime: {
      type: 'number',
      description: 'Animation timing counter',
    },
  };

  constructor(x, y, hp, damage, expValue) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.hp = hp;
    this.maxHp = hp;
    this.damage = damage;
    this.expValue = expValue;
    this.speed = 1;
    this.animFrame = 0;
    this.animTime = 0;
  }

  update(player, gameEntities = {}) {
    // Simple AI - move toward player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0 && distance < 100) {
      // Store original position for collision checking
      const originalX = this.x;
      const originalY = this.y;

      // Calculate movement
      const moveX = (dx / distance) * this.speed;
      const moveY = (dy / distance) * this.speed;

      this.x += moveX;
      this.y += moveY;

      // Store movement data for alternative movement attempts
      this.originalX = originalX;
      this.originalY = originalY;
      this.attemptedMoveX = moveX;
      this.attemptedMoveY = moveY;

      // Check for collisions with all game entities
      const collidingTree = gameEntities.trees ? this.checkTreeCollisions(gameEntities.trees) : null;
      const collidingMountain = gameEntities.mountains ? this.checkMountainCollisions(gameEntities.mountains) : null;
      const collidingStalactite = gameEntities.stalactites ? this.checkStalactiteCollisions(gameEntities.stalactites) : null;
      const collidingHouse = gameEntities.houses ? this.checkHouseCollisions(gameEntities.houses) : null;
      const collidingWall = gameEntities.walls ? this.checkWallCollisions(gameEntities.walls) : null;

      // If any collision occurred, try alternative movement
      if (collidingTree || collidingMountain || collidingStalactite || collidingHouse || collidingWall) {
        this.tryAlternativeMovement(
          gameEntities.trees || [], 
          gameEntities.mountains || [], 
          gameEntities.stalactites || [], 
          gameEntities.houses || [], 
          gameEntities.walls || []
        );
      }
    }

    this.updateAnimation();
  }

  // Method to check collision with trees (called from game class)
  checkTreeCollisions(trees) {
    for (const tree of trees) {
      if (tree.checkCollision(this.x, this.y, this.width, this.height)) {
        return tree; // Return the colliding tree
      }
    }
    return null; // No collision
  }

  // Method to check collision with stalactites (called from game class)
  checkStalactiteCollisions(stalactites) {
    for (const stalactite of stalactites) {
      if (stalactite.checkCollision(this.x, this.y, this.width, this.height)) {
        return stalactite; // Return the colliding stalactite
      }
    }
    return null; // No collision
  }

  // Method to check collision with houses (called from game class)
  checkHouseCollisions(houses) {
    for (const house of houses) {
      if (house.checkCollision(this.x, this.y, this.width, this.height)) {
        return house; // Return the colliding house
      }
    }
    return null; // No collision
  }

  // Method to check collision with walls (called from game class)
  checkWallCollisions(walls) {
    for (const wall of walls) {
      if (wall.checkCollision(this.x, this.y, this.width, this.height)) {
        return wall; // Return the colliding wall
      }
    }
    return null; // No collision
  }

  // Method to check collision with mountains (called from game class)
  checkMountainCollisions(mountains) {
    for (const mountain of mountains) {
      if (mountain.checkEnemyCollision(this.x, this.y, this.width, this.height)) {
        return mountain; // Return the colliding mountain
      }
    }
    return null; // No collision
  }

  // Method to revert position if collision occurs
  revertMovement() {
    if (this.originalX !== undefined && this.originalY !== undefined) {
      this.x = this.originalX;
      this.y = this.originalY;
    }
  }

  // Method to try alternative movement (horizontal or vertical only)
  tryAlternativeMovement(trees, mountains = [], stalactites = [], houses = [], walls = []) {
    // Try horizontal movement only
    this.x = this.originalX + this.attemptedMoveX;
    this.y = this.originalY;

    if (this.checkTreeCollisions(trees) || this.checkMountainCollisions(mountains) || this.checkStalactiteCollisions(stalactites) || this.checkHouseCollisions(houses) || this.checkWallCollisions(walls)) {
      // Horizontal failed, try vertical only
      this.x = this.originalX;
      this.y = this.originalY + this.attemptedMoveY;

      if (this.checkTreeCollisions(trees) || this.checkMountainCollisions(mountains) || this.checkStalactiteCollisions(stalactites) || this.checkHouseCollisions(houses) || this.checkWallCollisions(walls)) {
        // Both failed, stay in original position
        this.x = this.originalX;
        this.y = this.originalY;
      }
    }
  }

  updateAnimation() {
    // Update animation
    this.animTime += 1 / 60;
    if (this.animTime > 0.3) {
      this.animFrame = (this.animFrame + 1) % 2;
      this.animTime = 0;
    }
  }

  takeDamage(damage, knockbackX = 0, knockbackY = 0) {
    this.hp -= damage;

    // Apply knockback if provided
    if (knockbackX !== 0 || knockbackY !== 0) {
      this.applyKnockback(knockbackX, knockbackY);
    }
  }

  applyKnockback(knockbackX, knockbackY) {
    // Store original position for collision checking
    const originalX = this.x;
    const originalY = this.y;

    // Apply knockback movement
    this.x += knockbackX;
    this.y += knockbackY;

    // Keep enemy within world bounds
    this.x = Math.max(0, Math.min(this.x, window.game.worldWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, window.game.worldHeight - this.height));

    // Check for collisions with obstacles and revert if necessary
    if (window.game) {
      const collidingTree = this.checkTreeCollisions(window.game.trees);
      const collidingMountain = this.checkMountainCollisions(window.game.mountains);
      const collidingStalactite = this.checkStalactiteCollisions(window.game.stalactites);

      if (collidingTree || collidingMountain || collidingStalactite) {
        // Revert to original position if knockback causes collision
        this.x = originalX;
        this.y = originalY;
      }
    }
  }

  draw(ctx) {
    // Flash red when hit
    if (this.hp < this.maxHp && this.animFrame === 0) {
      ctx.fillStyle = '#FF6666';
    } else {
      ctx.fillStyle = this.color;
    }

    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Add frozen indicator when enemies can't move
    if (window.game && !window.game.enemiesCanMove) {
      ctx.fillStyle = 'rgba(173, 216, 230, 0.7)'; // Light blue overlay
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Add ice crystal effect
      ctx.fillStyle = '#E6F3FF';
      ctx.fillRect(this.x + 2, this.y + 2, 4, 4);
      ctx.fillRect(this.x + 10, this.y + 10, 4, 4);
    }
  }
}

export class Slime extends Enemy {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the slime',
    },
    y: {
      type: 'number',
      description: 'Y position of the slime',
    },
    width: {
      type: 'number',
      description: 'Width of slime sprite (inherited)',
    },
    height: {
      type: 'number',
      description: 'Height of slime sprite (inherited)',
    },
    hp: {
      type: 'number',
      description: 'Hit points (8 for slimes)',
    },
    maxHp: {
      type: 'number',
      description: 'Maximum hit points (8 for slimes)',
    },
    damage: {
      type: 'number',
      description: 'Damage dealt (2 for slimes)',
    },
    expValue: {
      type: 'number',
      description: 'Experience points given (3 for slimes)',
    },
    speed: {
      type: 'number',
      description: 'Movement speed (0.5 for slimes)',
    },
    animFrame: {
      type: 'number',
      description: 'Current animation frame (inherited)',
    },
    animTime: {
      type: 'number',
      description: 'Animation timing counter (inherited)',
    },
    color: {
      type: 'string',
      description: 'Slime color (light green)',
    },
  };

  constructor(x, y) {
    super(x, y, 8, 2, 3);
    this.color = '#90EE90'; // Light green
    this.speed = 0.5;
  }
}

export class Ant extends Enemy {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the ant',
    },
    y: {
      type: 'number',
      description: 'Y position of the ant',
    },
    width: {
      type: 'number',
      description: 'Width of ant sprite (inherited)',
    },
    height: {
      type: 'number',
      description: 'Height of ant sprite (inherited)',
    },
    hp: {
      type: 'number',
      description: 'Hit points (6 for ants)',
    },
    maxHp: {
      type: 'number',
      description: 'Maximum hit points (6 for ants)',
    },
    damage: {
      type: 'number',
      description: 'Damage dealt (1 for ants)',
    },
    expValue: {
      type: 'number',
      description: 'Experience points given (2 for ants)',
    },
    speed: {
      type: 'number',
      description: 'Movement speed (1.5 for ants)',
    },
    animFrame: {
      type: 'number',
      description: 'Current animation frame (inherited)',
    },
    animTime: {
      type: 'number',
      description: 'Animation timing counter (inherited)',
    },
    color: {
      type: 'string',
      description: 'Ant color (saddle brown)',
    },
  };

  constructor(x, y) {
    super(x, y, 6, 1, 2);
    this.color = '#8B4513'; // Saddle brown
    this.speed = 1.5;
  }
}
