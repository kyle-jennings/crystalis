// Player.js - Player class for Crystalis game
export default class Player {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the player',
    },
    y: {
      type: 'number',
      description: 'Y position of the player',
    },
    width: {
      type: 'number',
      description: 'Width of player sprite (fixed at 16)',
    },
    height: {
      type: 'number',
      description: 'Height of player sprite (fixed at 16)',
    },
    speed: {
      type: 'number',
      description: 'Movement speed of the player',
    },
    facing: {
      type: 'number',
      description: '8-directional facing (0=up, 2=right, 4=down, 6=left)',
    },
    level: {
      type: 'number',
      description: 'Player experience level',
    },
    hp: {
      type: 'number',
      description: 'Current hit points',
    },
    maxHp: {
      type: 'number',
      description: 'Maximum hit points',
    },
    mp: {
      type: 'number',
      description: 'Current magic points',
    },
    maxMp: {
      type: 'number',
      description: 'Maximum magic points',
    },
    exp: {
      type: 'number',
      description: 'Current experience points',
    },
    expToNext: {
      type: 'number',
      description: 'Experience points needed for next level',
    },
    currentSword: {
      type: 'string',
      description: 'Currently equipped sword element',
    },
    attackPower: {
      type: 'number',
      description: 'Base attack damage',
    },
    invulnerable: {
      type: 'boolean',
      description: 'Whether player is currently invulnerable',
    },
    invulnerabilityTime: {
      type: 'number',
      description: 'Time remaining for invulnerability',
    },
    dashInvulnerable: {
      type: 'boolean',
      description: 'Separate invulnerability for dashing',
    },
    isAttacking: {
      type: 'boolean',
      description: 'Whether player is currently attacking',
    },
    attackAnimationTime: {
      type: 'number',
      description: 'Time remaining for attack animation',
    },
    attackDuration: {
      type: 'number',
      description: 'Duration of attack animation (0.3 seconds)',
    },
    isDashing: {
      type: 'boolean',
      description: 'Whether player is currently dashing',
    },
    dashTime: {
      type: 'number',
      description: 'Time remaining for current dash',
    },
    dashDuration: {
      type: 'number',
      description: 'Duration of dash (0.2 seconds)',
    },
    dashSpeed: {
      type: 'number',
      description: 'Speed multiplier during dash',
    },
    dashCooldown: {
      type: 'number',
      description: 'Time remaining for dash cooldown',
    },
    dashCooldownTime: {
      type: 'number',
      description: 'Duration of dash cooldown (1 second)',
    },
    dashCharges: {
      type: 'number',
      description: 'Number of dash charges available',
    },
    maxDashCharges: {
      type: 'number',
      description: 'Maximum number of dash charges',
    },
    dashChargeRegenTime: {
      type: 'number',
      description: 'Time to regenerate one dash charge',
    },
    dashChargeFlash: {
      type: 'boolean',
      description: 'Flash effect when charge is regenerated',
    },
    dashChargeFlashTime: {
      type: 'number',
      description: 'Duration of flash effect',
    },
    animFrame: {
      type: 'number',
      description: 'Current animation frame',
    },
    animTime: {
      type: 'number',
      description: 'Animation timing counter',
    },
    isMoving: {
      type: 'boolean',
      description: 'Whether player is currently moving',
    },
  };

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 14;
    this.height = 33;
    this.speed = 2;
    this.facing = 0; // 0-7 for 8 directions (0=up, 2=right, 4=down, 6=left)

    // Stats
    this.level = 1;
    this.hp = 16;
    this.maxHp = 16;
    this.mp = 4;
    this.maxMp = 4;
    this.exp = 0;
    this.expToNext = 20;

    // Combat
    this.currentSword = 'Wind';
    this.attackPower = 4;
    this.invulnerable = false;
    this.invulnerabilityTime = 0;
    this.dashInvulnerable = false; // Separate invulnerability for dashing

    // Attack animation
    this.isAttacking = false;
    this.attackAnimationTime = 0;
    this.attackDuration = 0.3; // Attack animation lasts 0.3 seconds

    // Dash mechanics
    this.isDashing = false;
    this.dashTime = 0;
    this.dashDuration = 0.2; // Dash lasts 0.2 seconds
    this.dashSpeed = 8; // Dash speed multiplier
    this.dashCooldown = 0;
    this.dashCooldownTime = 1.0; // 1 second cooldown
    this.dashCharges = 2; // Number of dashes available
    this.maxDashCharges = 2; // Maximum dash charges
    this.dashChargeRegenTime = 1.0; // Time to regenerate one dash charge
    this.dashChargeFlash = false; // Flash effect when charge is regenerated
    this.dashChargeFlashTime = 0; // Duration of flash effect

    // Animation
    this.animFrame = 0;
    this.animTime = 0;
    this.isMoving = false;

    // Sprite animation properties
    this.spriteSheet = new Image();
    this.spriteSheet.src = '/assets/walking.png'; // Public assets path for Vite
    this.frameWidth = 14; // Width of each sprite frame
    this.frameHeight = 33; // Height of each sprite frame
    this.framesPerDirection = 2; // 3 frames per walking direction
    this.animationSpeed = 10; // Frames to wait between sprite updates (slower = higher number)
    this.animationTimer = 0;
    this.currentSpriteFrame = 0; // Current frame in the animation (0, 1, 2)
    
    // Direction mapping for sprite sheet rows
    // Your sprite sheet has: Down, Left, Right, Up, Down-Left, Down-Right, Up-Left, Up-Right
    this.spriteDirections = {
      0: 4,    // Up -> Row 3
      1: 4,    // Up-Right -> Row 7  
      2: 1,    // Right -> Row 1
      3: 2,    // Down-Right -> Row 5
      4: 0,    // Down -> Row 0
      5: 0,    // Down-Left -> Row 4
      6: 5,    // Left -> Row 1
      7: 5     // Up-Left -> Row 6
    };
  }

  move(dx, dy, worldWidth = 1024, worldHeight = 768) {
    // If dashing, override movement with dash movement
    if (this.isDashing) {
      dx = this.dashDirection.x * this.dashSpeed;
      dy = this.dashDirection.y * this.dashSpeed;
    } else {
      this.isMoving = dx !== 0 || dy !== 0;

      if (this.isMoving) {
        // Update facing direction using our new method
        this.updateFacing(dx, dy);
      }
    }

    // Store original position for collision checking
    const originalX = this.x;
    const originalY = this.y;

    // Move player
    this.x += dx;
    this.y += dy;

    // Keep player in world bounds (dynamically based on current level)
    this.x = Math.max(8, Math.min(this.x, worldWidth - this.width - 8));
    this.y = Math.max(8, Math.min(this.y, worldHeight - this.height - 8));
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

  // Method to check if player is inside mountains (called from game class)
  checkMountainSlowdown(mountains) {
    for (const mountain of mountains) {
      if (mountain.checkPlayerInside(this.x, this.y, this.width, this.height)) {
        return mountain; // Return the mountain player is inside
      }
    }
    return null; // Not in any mountain
  }

  // Method to check if player is inside caves (called from game class)
  checkCaveSlowdown(caves) {
    for (const cave of caves) {
      if (cave.checkPlayerInside && cave.checkPlayerInside(this.x, this.y, this.width, this.height)) {
        return cave; // Return the cave player is inside
      }
    }
    return null; // Not in any cave
  }

  // Method to check if player is in a cave opening portal (called from game class)
  checkCaveOpeningPortal(mountains) {
    for (const mountain of mountains) {
      if (mountain.hasCaveOpening && mountain.checkPlayerInCaveOpening(this.x, this.y, this.width, this.height)) {
        return mountain; // Return the mountain with cave opening
      }
    }
    return null; // Not in any cave opening
  }

  attack() {
    // Start attack animation
    this.isAttacking = true;
    this.attackAnimationTime = this.attackDuration;

    // Return projectile data for the game class to create
    const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      angle,
      swordType: this.currentSword,
      damage: this.attackPower,
    };
  }

  dash() {
    // Can only dash if not already dashing and has charges available
    if (!this.isDashing && this.dashCharges > 0) {
      this.isDashing = true;
      this.dashTime = this.dashDuration;
      this.dashCharges--; // Use one dash charge

      // Start cooldown timer if we just used the last charge
      if (this.dashCharges === 0) {
        this.dashCooldown = this.dashChargeRegenTime;
      }

      // Make player invincible during dash
      this.dashInvulnerable = true;

      // Calculate dash direction based on facing
      const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);
      this.dashDirection = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      return true; // Dash was successful
    }
    return false; // Dash failed (on cooldown or already dashing)
  }

  takeDamage(damage) {
    // Check both damage invulnerability and dash invulnerability
    if (!this.invulnerable && !this.dashInvulnerable) {
      this.hp = Math.max(0, this.hp - damage);
      this.invulnerable = true;
      this.invulnerabilityTime = 1.0; // 1 second of invulnerability

      if (this.hp <= 0) {
        // Handle player death
        this.respawn();
      }
    }
  }

  respawn() {
    this.hp = this.maxHp;
    this.x = 256;
    this.y = 400;
  }

  gainExp(amount) {
    this.exp += amount;

    if (this.exp >= this.expToNext) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.exp = 0;
    this.expToNext = this.level * 20;

    // Increase stats
    this.maxHp += 4;
    this.hp = this.maxHp;
    this.maxMp += 2;
    this.mp = this.maxMp;
    this.attackPower += 1;
  }

  update() {
    // Update sprite animation
    this.updateSpriteAnimation();

    // Update animation (keep existing logic for compatibility)
    if (this.isMoving && !this.isDashing) {
      this.animTime += 1 / 60;
      if (this.animTime > 0.2) {
        this.animFrame = (this.animFrame + 1) % 2;
        this.animTime = 0;
      }
    }

    // Update dash
    if (this.isDashing) {
      this.dashTime -= 1 / 60;
      if (this.dashTime <= 0) {
        this.isDashing = false;
        // End dash invincibility
        this.dashInvulnerable = false;
      }
    }

    // Update dash cooldown
    if (this.dashCooldown > 0) {
      this.dashCooldown -= 1 / 60;

      // Regenerate dash charges when cooldown expires
      if (this.dashCooldown <= 0 && this.dashCharges < this.maxDashCharges) {
        this.dashCharges++;

        // Trigger flash effect when charge is regenerated
        this.dashChargeFlash = true;
        this.dashChargeFlashTime = 0.5; // Flash for 0.5 seconds

        // If we still need more charges, start the timer again
        if (this.dashCharges < this.maxDashCharges) {
          this.dashCooldown = this.dashChargeRegenTime;
        }
      }
    }

    // Update dash charge flash effect
    if (this.dashChargeFlash) {
      this.dashChargeFlashTime -= 1 / 60;
      if (this.dashChargeFlashTime <= 0) {
        this.dashChargeFlash = false;
      }
    }

    // Update attack animation
    if (this.isAttacking) {
      this.attackAnimationTime -= 1 / 60;
      if (this.attackAnimationTime <= 0) {
        this.isAttacking = false;
      }
    }

    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerabilityTime -= 1 / 60;
      if (this.invulnerabilityTime <= 0) {
        this.invulnerable = false;
      }
    }

    // Regenerate MP slowly
    if (Math.random() < 0.01) {
      this.mp = Math.min(this.mp + 1, this.maxMp);
    }
  }

  draw(ctx) {
    ctx.save();

    // Flash when invulnerable from damage
    if (this.invulnerable && Math.floor(this.invulnerabilityTime * 10) % 2) {
      ctx.globalAlpha = 0.5;
    }

    // Check if player is in mountain for visual feedback
    let inMountain = false;
    if (window.game && window.game.mountains) {
      inMountain = this.checkMountainSlowdown(window.game.mountains) !== null;
    }

    // Dash effect - make player semi-transparent and add motion blur
    if (this.isDashing) {
      ctx.globalAlpha *= 0.7;

      // Draw dash trail
      ctx.fillStyle = 'rgba(65, 105, 225, 0.3)'; // Semi-transparent blue
      for (let i = 1; i <= 3; i++) {
        const trailX = this.x - (this.dashDirection.x * i * 4);
        const trailY = this.y - (this.dashDirection.y * i * 4);
        ctx.fillRect(trailX, trailY, this.width, this.height);
      }

      // Add invulnerability glow when dashing
      if (this.dashInvulnerable) {
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 10;
      }
    }

    // Flash effect when dash charge is regenerated
    if (this.dashChargeFlash) {
      ctx.shadowColor = '#00FFFF';
      ctx.shadowBlur = 10;
    }

    // Mountain slowdown visual effect
    if (inMountain && !this.isDashing) {
      ctx.globalAlpha *= 0.8; // Slightly transparent
      ctx.shadowColor = '#8B4513'; // Brown mountain color
      ctx.shadowBlur = 5;
    }

    // Draw player sprite
    this.drawSprite(ctx);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw facing direction indicator
    ctx.fillStyle = '#FFD700'; // Gold
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    // Adjust angle so that facing 0 (up) corresponds to -PI/2 radians
    const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);
    const dirX = Math.cos(angle) * 8;
    const dirY = Math.sin(angle) * 8;

    ctx.fillRect(centerX + dirX - 2, centerY + dirY - 2, 4, 4);

    // Draw attack animation
    if (this.isAttacking) {
      this.drawAttackAnimation(ctx, centerX, centerY);
    }

    ctx.restore();
  }

  drawAttackAnimation(ctx, centerX, centerY) {
    // Calculate attack animation progress (1.0 = start, 0.0 = end)
    const progress = this.attackAnimationTime / this.attackDuration;

    // Draw sword slash effect
    ctx.save();
    ctx.globalAlpha = progress;

    // Get attack direction
    const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);

    // Draw sword trail/slash
    ctx.strokeStyle = this.getSwordColor();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Draw an arc representing the sword slash
    const radius = 20;
    const startAngle = angle - Math.PI / 6; // 30 degrees before facing direction
    const endAngle = angle + Math.PI / 6; // 30 degrees after facing direction

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    // Draw sword blade extending in facing direction
    const bladeLength = 16 + (1 - progress) * 8; // Blade extends during attack
    const bladeX = centerX + Math.cos(angle) * bladeLength;
    const bladeY = centerY + Math.sin(angle) * bladeLength;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bladeX, bladeY);
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  getSwordColor() {
    switch (this.currentSword) {
      case 'Wind': return '#90EE90';
      case 'Fire': return '#FF4500';
      case 'Water': return '#1E90FF';
      case 'Thunder': return '#FFD700';
      default: return '#FFFFFF';
    }
  }

  /**
   * Update sprite animation based on movement and direction
   */
  updateSpriteAnimation() {
    if (this.isMoving && !this.isDashing) {
      // Increment animation timer
      this.animationTimer++;
      
      // Change frame when timer reaches speed threshold
      if (this.animationTimer >= this.animationSpeed) {
        this.currentSpriteFrame = (this.currentSpriteFrame + 1) % this.framesPerDirection;
        this.animationTimer = 0;
      }
    } else {
      // When not moving, use middle frame (frame 1) for idle pose
      this.currentSpriteFrame = 1;
      this.animationTimer = 0;
    }
  }

  /**
   * Get the sprite sheet row for the current facing direction
   */
  getSpriteRow() {
    return this.spriteDirections[this.facing] || 0;
  }

  /**
   * Update facing direction based on movement
   */
  updateFacing(dx, dy) {
    if (dx === 0 && dy === 0) return; // Don't change facing when not moving

    // Calculate 8-directional facing based on dx, dy
    if (dy < 0) { // Moving up
      if (dx < 0) this.facing = 7;      // Up-Left
      else if (dx > 0) this.facing = 1; // Up-Right
      else this.facing = 0;             // Up
    } else if (dy > 0) { // Moving down
      if (dx < 0) this.facing = 5;      // Down-Left
      else if (dx > 0) this.facing = 3; // Down-Right
      else this.facing = 4;             // Down
    } else { // Moving horizontally
      if (dx < 0) this.facing = 6;      // Left
      else this.facing = 2;             // Right
    }
  }

  /**
   * Draw the player sprite from the sprite sheet
   */
  drawSprite(ctx) {
    // Check if sprite sheet is loaded
    if (!this.spriteSheet.complete || this.spriteSheet.naturalWidth === 0) {
      // Fallback to rectangle if sprite isn't loaded yet
      ctx.fillStyle = this.isDashing ? '#87CEEB' : '#4169E1';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      return;
    }

    // Calculate source coordinates in sprite sheet
    const spriteRow = this.getSpriteRow();
    const sourceX = this.currentSpriteFrame * this.frameWidth;
    const sourceY = spriteRow * this.frameHeight;

    // Draw the sprite
    ctx.drawImage(
      this.spriteSheet,
      sourceX, sourceY, this.frameWidth, this.frameHeight, // Source rectangle
      this.x, this.y, this.width, this.height // Destination rectangle
    );
  }
}
