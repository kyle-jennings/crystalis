// House.js - House class for village buildings
export default class House {
  constructor(x, y, style = 'normal') {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 48;
    this.style = style; // 'normal', 'shop', 'inn', 'temple', etc.
    this.type = 'house';

    // Collision box (full house area)
    this.collisionX = x;
    this.collisionY = y;
    this.collisionWidth = this.width;
    this.collisionHeight = this.height;
  }

  // Check if a rectangle collides with this house
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

    // House colors based on style
    let wallColor; let roofColor; let doorColor; let
      windowColor;

    switch (this.style) {
      case 'shop':
        wallColor = '#D2B48C'; // Tan
        roofColor = '#8B4513'; // Saddle brown
        doorColor = '#654321'; // Dark brown
        windowColor = '#87CEEB'; // Sky blue
        break;
      case 'inn':
        wallColor = '#DEB887'; // Burlywood
        roofColor = '#A0522D'; // Sienna
        doorColor = '#8B4513'; // Saddle brown
        windowColor = '#FFD700'; // Gold (warm light)
        break;
      case 'temple':
        wallColor = '#F5F5DC'; // Beige
        roofColor = '#4169E1'; // Royal blue
        doorColor = '#8B4513'; // Saddle brown
        windowColor = '#9370DB'; // Medium purple (stained glass)
        break;
      case 'blacksmith':
        wallColor = '#696969'; // Dim gray
        roofColor = '#2F4F4F'; // Dark slate gray
        doorColor = '#1C1C1C'; // Very dark
        windowColor = '#FF4500'; // Red orange (forge glow)
        break;
      default: // normal house
        wallColor = '#F4A460'; // Sandy brown
        roofColor = '#8B4513'; // Saddle brown
        doorColor = '#654321'; // Dark brown
        windowColor = '#87CEEB'; // Sky blue
    }

    // Draw house walls
    ctx.fillStyle = wallColor;
    ctx.fillRect(this.x, this.y + 12, this.width, this.height - 12);

    // Draw roof (triangular)
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(this.x - 4, this.y + 12); // Left edge
    ctx.lineTo(this.x + this.width + 4, this.y + 12); // Right edge
    ctx.lineTo(this.x + this.width / 2, this.y); // Top point
    ctx.closePath();
    ctx.fill();

    // Add roof outline
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw door (centered at bottom)
    const doorWidth = 12;
    const doorHeight = 20;
    const doorX = this.x + (this.width - doorWidth) / 2;
    const doorY = this.y + this.height - doorHeight;

    ctx.fillStyle = doorColor;
    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

    // Door outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);

    // Door handle
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.fillRect(doorX + doorWidth - 3, doorY + doorHeight / 2, 2, 2);

    // Draw 2 windows
    const windowWidth = 8;
    const windowHeight = 8;
    const windowY = this.y + 20;

    // Left window
    const leftWindowX = this.x + 12;
    ctx.fillStyle = windowColor;
    ctx.fillRect(leftWindowX, windowY, windowWidth, windowHeight);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(leftWindowX, windowY, windowWidth, windowHeight);

    // Window cross (left)
    ctx.strokeStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(leftWindowX + windowWidth / 2, windowY);
    ctx.lineTo(leftWindowX + windowWidth / 2, windowY + windowHeight);
    ctx.moveTo(leftWindowX, windowY + windowHeight / 2);
    ctx.lineTo(leftWindowX + windowWidth, windowY + windowHeight / 2);
    ctx.stroke();

    // Right window
    const rightWindowX = this.x + this.width - 12 - windowWidth;
    ctx.fillStyle = windowColor;
    ctx.fillRect(rightWindowX, windowY, windowWidth, windowHeight);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(rightWindowX, windowY, windowWidth, windowHeight);

    // Window cross (right)
    ctx.strokeStyle = '#654321';
    ctx.beginPath();
    ctx.moveTo(rightWindowX + windowWidth / 2, windowY);
    ctx.lineTo(rightWindowX + windowWidth / 2, windowY + windowHeight);
    ctx.moveTo(rightWindowX, windowY + windowHeight / 2);
    ctx.lineTo(rightWindowX + windowWidth, windowY + windowHeight / 2);
    ctx.stroke();

    // Add decorative elements based on house style
    if (this.style === 'shop') {
      // Shop sign
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(this.x + 4, this.y + 15, 16, 8);
      ctx.fillStyle = '#FFF';
      ctx.font = '8px Courier New';
      ctx.fillText('SHOP', this.x + 6, this.y + 21);
    } else if (this.style === 'inn') {
      // Inn sign
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(this.x + 4, this.y + 15, 14, 8);
      ctx.fillStyle = '#FFF';
      ctx.font = '8px Courier New';
      ctx.fillText('INN', this.x + 6, this.y + 21);
    } else if (this.style === 'temple') {
      // Temple cross
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(this.x + this.width / 2 - 1, this.y + 2, 2, 8);
      ctx.fillRect(this.x + this.width / 2 - 3, this.y + 4, 6, 2);
    } else if (this.style === 'blacksmith') {
      // Anvil symbol
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(this.x + 4, this.y + 16, 8, 4);
      ctx.fillRect(this.x + 6, this.y + 20, 4, 6);
    }

    // Optional: Draw collision box for debugging
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(this.collisionX, this.collisionY, this.collisionWidth, this.collisionHeight);

    ctx.restore();
  }

  update() {
    // Houses don't need to update
  }
}
