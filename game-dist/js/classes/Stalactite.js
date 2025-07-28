// Stalactite.js - Cave stalactite/stalagmite class
export default class Stalactite {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the stalactite',
    },
    y: {
      type: 'number',
      description: 'Y position of the stalactite',
    },
    width: {
      type: 'number',
      description: 'Width of the stalactite',
    },
    height: {
      type: 'number',
      description: 'Height of the stalactite (varies by type)',
    },
    type: {
      type: 'string',
      description: 'Type identifier for this object (always "stalactite")',
    },
    isStalagtite: {
      type: 'boolean',
      description: 'True if hangs from ceiling, false if grows from floor',
    },
    collisionX: {
      type: 'number',
      description: 'X position of collision box',
    },
    collisionY: {
      type: 'number',
      description: 'Y position of collision box',
    },
    collisionWidth: {
      type: 'number',
      description: 'Width of collision box',
    },
    collisionHeight: {
      type: 'number',
      description: 'Height of collision box',
    },
  };

  constructor(x, y, isStalagtite = true) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = isStalagtite ? 32 : 28; // Stalactites hang down, stalagmites grow up
    this.type = 'stalactite';
    this.isStalagtite = isStalagtite; // true = hangs from ceiling, false = grows from floor

    // Collision box (smaller than visual for better gameplay)
    this.collisionX = x + 6;
    this.collisionY = isStalagtite ? y + 16 : y;
    this.collisionWidth = 8;
    this.collisionHeight = 16;
  }

  // Check if a rectangle collides with this stalactite
  checkCollision(x, y, width, height) {
    return x < this.collisionX + this.collisionWidth
               && x + width > this.collisionX
               && y < this.collisionY + this.collisionHeight
               && y + height > this.collisionY;
  }

  // Get collision bounds
  getCollisionBounds() {
    return {
      x: this.collisionX,
      y: this.collisionY,
      width: this.collisionWidth,
      height: this.collisionHeight,
    };
  }

  draw(ctx) {
    ctx.save();

    if (this.isStalagtite) {
      // Draw stalactite (hanging from ceiling)
      ctx.fillStyle = '#6A6A6A'; // Medium gray
      ctx.beginPath();
      ctx.moveTo(this.x + 10, this.y); // Top center
      ctx.lineTo(this.x + 2, this.y + 8);
      ctx.lineTo(this.x + 4, this.y + 16);
      ctx.lineTo(this.x + 8, this.y + 24);
      ctx.lineTo(this.x + 10, this.y + this.height); // Bottom point
      ctx.lineTo(this.x + 12, this.y + 24);
      ctx.lineTo(this.x + 16, this.y + 16);
      ctx.lineTo(this.x + 18, this.y + 8);
      ctx.closePath();
      ctx.fill();

      // Add highlights
      ctx.fillStyle = '#8A8A8A'; // Lighter gray
      ctx.fillRect(this.x + 9, this.y + 2, 2, 12);
    } else {
      // Draw stalagmite (growing from floor)
      ctx.fillStyle = '#6A6A6A'; // Medium gray
      ctx.beginPath();
      ctx.moveTo(this.x + 10, this.y + this.height); // Top point
      ctx.lineTo(this.x + 8, this.y + 20);
      ctx.lineTo(this.x + 4, this.y + 12);
      ctx.lineTo(this.x + 2, this.y + 4);
      ctx.lineTo(this.x + 18, this.y + 4);
      ctx.lineTo(this.x + 16, this.y + 12);
      ctx.lineTo(this.x + 12, this.y + 20);
      ctx.closePath();
      ctx.fill();

      // Add highlights
      ctx.fillStyle = '#8A8A8A'; // Lighter gray
      ctx.fillRect(this.x + 9, this.y + 6, 2, 12);
    }

    // Add some mineral deposits (light spots)
    ctx.fillStyle = '#B0B0B0'; // Light gray
    ctx.fillRect(this.x + 6, this.y + 10, 2, 2);
    ctx.fillRect(this.x + 12, this.y + 15, 2, 2);

    // Optional: Draw collision box for debugging
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(this.collisionX, this.collisionY, this.collisionWidth, this.collisionHeight);

    ctx.restore();
  }

  update() {
    // Stalactites don't need to update
  }
}
