// Enemy.js - Enemy classes for Crystalis game

// Base Enemy class
export class Enemy {
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

  update(player) {
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

      // Check tree collisions (will be called from game class)
      this.originalX = originalX;
      this.originalY = originalY;
      this.attemptedMoveX = moveX;
      this.attemptedMoveY = moveY;
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
  constructor(x, y) {
    super(x, y, 8, 2, 3);
    this.color = '#90EE90'; // Light green
    this.speed = 0.5;
  }
}

export class Ant extends Enemy {
  constructor(x, y) {
    super(x, y, 6, 1, 2);
    this.color = '#8B4513'; // Saddle brown
    this.speed = 1.5;
  }
}
