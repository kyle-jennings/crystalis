// Mountain.js - Mountain obstacle class for Crystalis game
export default class Mountain {
  constructor(x, y, hasCaveOpening = false, caveOpeningDestination = null) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 60;
    this.type = 'mountain';
    this.hasCaveOpening = hasCaveOpening;
    this.caveOpeningDestination = caveOpeningDestination; // Level to transport to

    // Collision box for enemies (blocks enemies but not player)
    this.enemyCollisionX = x + 10;
    this.enemyCollisionY = y + 30; // Only bottom part blocks enemies
    this.enemyCollisionWidth = 60;
    this.enemyCollisionHeight = 30;

    // Cave opening area (if present) - creates a passage/portal
    if (this.hasCaveOpening) {
      this.caveOpeningX = x + 30;
      this.caveOpeningY = y + 35;
      this.caveOpeningWidth = 20;
      this.caveOpeningHeight = 25;
    }
  }

  // Check if an enemy collides with this mountain
  checkEnemyCollision(x, y, width, height) {
    // Cave openings now block enemies (they can't use portals)
    // Normal collision check for all enemies
    return x < this.enemyCollisionX + this.enemyCollisionWidth
               && x + width > this.enemyCollisionX
               && y < this.enemyCollisionY + this.enemyCollisionHeight
               && y + height > this.enemyCollisionY;
  }

  // Check if the player is in the cave opening (for portal activation)
  checkPlayerInCaveOpening(x, y, width, height) {
    if (!this.hasCaveOpening) return false;

    return x < this.caveOpeningX + this.caveOpeningWidth
               && x + width > this.caveOpeningX
               && y < this.caveOpeningY + this.caveOpeningHeight
               && y + height > this.caveOpeningY;
  }

  // Check if the player is inside the mountain (for speed reduction)
  checkPlayerInside(x, y, width, height) {
    // Cave openings no longer provide speed reduction bypass
    // Normal inside check for all areas of mountain
    return x < this.x + this.width
               && x + width > this.x
               && y < this.y + this.height
               && y + height > this.y;
  }

  // Get enemy collision bounds for easier collision checking
  getEnemyCollisionBounds() {
    return {
      x: this.enemyCollisionX,
      y: this.enemyCollisionY,
      width: this.enemyCollisionWidth,
      height: this.enemyCollisionHeight,
    };
  }

  draw(ctx) {
    ctx.save();

    // Draw mountain base (dark gray)
    ctx.fillStyle = '#696969'; // Dim gray
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + 20, this.y + 20);
    ctx.lineTo(this.x + 40, this.y + 10);
    ctx.lineTo(this.x + 60, this.y + 15);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    // Draw mountain peaks (lighter gray)
    ctx.fillStyle = '#A9A9A9'; // Dark gray
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + 20, this.y + 20);
    ctx.lineTo(this.x + 40, this.y + 10);
    ctx.lineTo(this.x + 60, this.y + 15);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x + 70, this.y + 35);
    ctx.lineTo(this.x + 50, this.y + 25);
    ctx.lineTo(this.x + 30, this.y + 30);
    ctx.lineTo(this.x + 10, this.y + 40);
    ctx.closePath();
    ctx.fill();

    // Draw cave opening if present
    if (this.hasCaveOpening) {
      // Draw cave opening (dark opening)
      ctx.fillStyle = '#000000'; // Black for cave entrance
      ctx.beginPath();
      ctx.arc(
        this.caveOpeningX + this.caveOpeningWidth / 2,
        this.caveOpeningY + this.caveOpeningHeight / 2,
        this.caveOpeningWidth / 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Draw cave opening rim (darker gray)
      ctx.strokeStyle = '#4A4A4A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        this.caveOpeningX + this.caveOpeningWidth / 2,
        this.caveOpeningY + this.caveOpeningHeight / 2,
        this.caveOpeningWidth / 2,
        0,
        Math.PI * 2,
      );
      ctx.stroke();

      // Add some depth to the cave opening
      ctx.fillStyle = '#1A1A1A'; // Very dark gray
      ctx.beginPath();
      ctx.arc(
        this.caveOpeningX + this.caveOpeningWidth / 2,
        this.caveOpeningY + this.caveOpeningHeight / 2,
        this.caveOpeningWidth / 3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    // Draw snow caps on peaks (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(this.x + 35, this.y + 10);
    ctx.lineTo(this.x + 40, this.y + 10);
    ctx.lineTo(this.x + 45, this.y + 15);
    ctx.lineTo(this.x + 35, this.y + 15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x + 55, this.y + 15);
    ctx.lineTo(this.x + 60, this.y + 15);
    ctx.lineTo(this.x + 65, this.y + 20);
    ctx.lineTo(this.x + 55, this.y + 20);
    ctx.closePath();
    ctx.fill();

    // Draw some rocky details (darker gray)
    ctx.fillStyle = '#555555';

    // Adjust rocky details to not overlap with cave opening
    if (!this.hasCaveOpening || this.x + 15 < this.caveOpeningX || this.x + 23 > this.caveOpeningX + this.caveOpeningWidth) {
      ctx.fillRect(this.x + 15, this.y + 35, 8, 6);
    }
    if (!this.hasCaveOpening || this.x + 45 < this.caveOpeningX || this.x + 51 > this.caveOpeningX + this.caveOpeningWidth) {
      ctx.fillRect(this.x + 45, this.y + 30, 6, 8);
    }
    ctx.fillRect(this.x + 65, this.y + 40, 7, 5);

    ctx.restore();
  }

  update() {
    // Mountains don't need to update, but method included for consistency
  }
}
