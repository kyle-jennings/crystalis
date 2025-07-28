// Wall.js - Wall class for village borders with brick texture
export default class Wall {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the wall',
    },
    y: {
      type: 'number',
      description: 'Y position of the wall',
    },
    width: {
      type: 'number',
      description: 'Width of the wall segment',
    },
    height: {
      type: 'number',
      description: 'Height of the wall segment',
    },
    isOpening: {
      type: 'boolean',
      description: 'If true, this is a gap in the wall (no collision)',
    },
    type: {
      type: 'string',
      description: 'Type identifier for this object (always "wall")',
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

  constructor(x, y, width, height, isOpening = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isOpening = isOpening; // If true, this is a gap in the wall
    this.type = 'wall';

    // Collision box (only if not an opening)
    this.collisionX = x;
    this.collisionY = y;
    this.collisionWidth = width;
    this.collisionHeight = height;
  }

  // Check if a rectangle collides with this wall (openings don't collide)
  checkCollision(x, y, width, height) {
    if (this.isOpening) return false; // Openings allow passage

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
    if (this.isOpening) return; // Don't draw openings

    ctx.save();

    // Base wall color
    const wallColor = '#8B7355'; // Dark tan/brown
    const mortarColor = '#696969'; // Dark gray
    const highlightColor = '#A0825A'; // Lighter tan
    const shadowColor = '#6B5B47'; // Darker brown

    // Draw base wall
    ctx.fillStyle = wallColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw brick pattern
    const brickWidth = 16;
    const brickHeight = 8;

    for (let y = 0; y < this.height; y += brickHeight) {
      for (let x = 0; x < this.width; x += brickWidth) {
        const brickX = this.x + x;
        const brickY = this.y + y;
        const row = Math.floor(y / brickHeight);

        // Offset every other row for brick pattern
        const offsetX = (row % 2) * (brickWidth / 2);
        const adjustedX = brickX + offsetX;

        // Skip if brick goes beyond wall bounds
        if (adjustedX >= this.x + this.width) continue;

        // Calculate actual brick width (may be clipped at edges)
        const actualWidth = Math.min(brickWidth, this.x + this.width - adjustedX);
        const actualHeight = Math.min(brickHeight, this.y + this.height - brickY);

        // Draw individual brick
        ctx.fillStyle = wallColor;
        ctx.fillRect(adjustedX, brickY, actualWidth, actualHeight);

        // Add brick texture with highlights and shadows
        // Top highlight
        ctx.fillStyle = highlightColor;
        ctx.fillRect(adjustedX, brickY, actualWidth, 1);

        // Left highlight
        ctx.fillRect(adjustedX, brickY, 1, actualHeight);

        // Bottom shadow
        ctx.fillStyle = shadowColor;
        ctx.fillRect(adjustedX, brickY + actualHeight - 1, actualWidth, 1);

        // Right shadow
        ctx.fillRect(adjustedX + actualWidth - 1, brickY, 1, actualHeight);

        // Mortar lines around brick
        ctx.fillStyle = mortarColor;
        ctx.fillRect(adjustedX + actualWidth, brickY, 1, actualHeight + 1); // Right mortar
        ctx.fillRect(adjustedX, brickY + actualHeight, actualWidth + 1, 1); // Bottom mortar
      }
    }

    // Add some random darker spots for weathering
    ctx.fillStyle = shadowColor;
    for (let i = 0; i < Math.floor((this.width * this.height) / 400); i++) {
      const spotX = this.x + Math.random() * this.width;
      const spotY = this.y + Math.random() * this.height;
      ctx.fillRect(spotX, spotY, 2, 2);
    }

    // Optional: Draw collision box for debugging
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(this.collisionX, this.collisionY, this.collisionWidth, this.collisionHeight);

    ctx.restore();
  }

  update() {
    // Walls don't need to update
  }
}
