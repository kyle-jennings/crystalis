// Tree.js - Tree obstacle class for Crystalis game
export default class Tree {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.type = 'tree';
        
        // Collision box (slightly smaller than visual for better gameplay)
        this.collisionX = x + 4;
        this.collisionY = y + 32; // Only bottom part blocks movement
        this.collisionWidth = 24;
        this.collisionHeight = 16;
    }
    
    // Check if a rectangle collides with this tree
    checkCollision(x, y, width, height) {
        return x < this.collisionX + this.collisionWidth &&
               x + width > this.collisionX &&
               y < this.collisionY + this.collisionHeight &&
               y + height > this.collisionY;
    }
    
    // Get collision bounds for easier collision checking
    getCollisionBounds() {
        return {
            x: this.collisionX,
            y: this.collisionY,
            width: this.collisionWidth,
            height: this.collisionHeight
        };
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw tree trunk
        ctx.fillStyle = '#8B4513'; // Brown
        ctx.fillRect(this.x + 12, this.y + 32, 8, 16);
        
        // Draw tree canopy (multiple circles for a fuller look)
        ctx.fillStyle = '#228B22'; // Forest green
        
        // Main canopy
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y + 20, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Additional foliage for depth
        ctx.fillStyle = '#32CD32'; // Lime green (lighter)
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 16, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 16, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Dark green shadows
        ctx.fillStyle = '#006400'; // Dark green
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y + 24, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Optional: Draw collision box for debugging (comment out for final version)
        // ctx.strokeStyle = 'red';
        // ctx.lineWidth = 1;
        // ctx.strokeRect(this.collisionX, this.collisionY, this.collisionWidth, this.collisionHeight);
        
        ctx.restore();
    }
    
    update() {
        // Trees don't need to update, but method included for consistency
    }
}
