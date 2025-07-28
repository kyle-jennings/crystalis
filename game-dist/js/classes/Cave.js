// Cave.js - Cave wall/formation class for cave levels
export default class Cave {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the cave formation',
    },
    y: {
      type: 'number',
      description: 'Y position of the cave formation',
    },
    width: {
      type: 'number',
      description: 'Width of the cave formation',
    },
    height: {
      type: 'number',
      description: 'Height of the cave formation',
    },
    type: {
      type: 'string',
      description: 'Type identifier for this object (always "cave")',
    },
    enemyCollisionX: {
      type: 'number',
      description: 'X position of enemy collision box',
    },
    enemyCollisionY: {
      type: 'number',
      description: 'Y position of enemy collision box',
    },
    enemyCollisionWidth: {
      type: 'number',
      description: 'Width of enemy collision box',
    },
    enemyCollisionHeight: {
      type: 'number',
      description: 'Height of enemy collision box',
    },
  };
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 60;
    this.type = 'cave';

    // Collision box for enemies (blocks enemies but not player, like mountains)
    this.enemyCollisionX = x + 10;
    this.enemyCollisionY = y + 30;
    this.enemyCollisionWidth = 60;
    this.enemyCollisionHeight = 30;
  }

  // Check if an enemy collides with this cave formation
  checkEnemyCollision(x, y, width, height) {
    return x < this.enemyCollisionX + this.enemyCollisionWidth
               && x + width > this.enemyCollisionX
               && y < this.enemyCollisionY + this.enemyCollisionHeight
               && y + height > this.enemyCollisionY;
  }

  // Check if the player is inside the cave formation (for speed reduction)
  checkPlayerInside(x, y, width, height) {
    return x < this.x + this.width
               && x + width > this.x
               && y < this.y + this.height
               && y + height > this.y;
  }

  // Get enemy collision bounds
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

    // Draw cave wall base (dark brown/gray)
    ctx.fillStyle = '#4A4A4A'; // Dark gray
    ctx.fillRect(this.x, this.y + 20, this.width, this.height - 20);

    // Draw cave wall texture with jagged edges
    ctx.fillStyle = '#5A5A5A'; // Lighter gray
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 20);
    ctx.lineTo(this.x + 15, this.y + 10);
    ctx.lineTo(this.x + 30, this.y + 15);
    ctx.lineTo(this.x + 45, this.y + 8);
    ctx.lineTo(this.x + 60, this.y + 12);
    ctx.lineTo(this.x + this.width, this.y + 18);
    ctx.lineTo(this.x + this.width, this.y + 35);
    ctx.lineTo(this.x + 65, this.y + 30);
    ctx.lineTo(this.x + 50, this.y + 25);
    ctx.lineTo(this.x + 35, this.y + 28);
    ctx.lineTo(this.x + 20, this.y + 32);
    ctx.lineTo(this.x + 5, this.y + 35);
    ctx.lineTo(this.x, this.y + 40);
    ctx.closePath();
    ctx.fill();

    // Add darker shadows for depth
    ctx.fillStyle = '#333333'; // Very dark gray
    ctx.fillRect(this.x + 5, this.y + 45, this.width - 10, 10);

    // Add some cave crystal details (light blue/white)
    ctx.fillStyle = '#E6F3FF'; // Very light blue
    ctx.fillRect(this.x + 20, this.y + 15, 4, 6);
    ctx.fillRect(this.x + 45, this.y + 20, 3, 5);
    ctx.fillRect(this.x + 60, this.y + 12, 5, 4);

    // Add mineral veins (darker lines)
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y + 25);
    ctx.lineTo(this.x + 70, this.y + 40);
    ctx.moveTo(this.x + 25, this.y + 35);
    ctx.lineTo(this.x + 55, this.y + 20);
    ctx.stroke();

    ctx.restore();
  }

  update() {
    // Cave formations don't need to update
  }
}
