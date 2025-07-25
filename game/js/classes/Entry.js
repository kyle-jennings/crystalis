// Entry.js - Invisible collision areas for level transitions
export default class Entry {
    constructor(x, y, width = 32, height = 32, destinationLevel = 1, destinationX = null, destinationY = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.destinationLevel = destinationLevel;
        this.destinationX = destinationX; // null means use level's default spawn
        this.destinationY = destinationY; // null means use level's default spawn
        this.type = 'entry';
    }
    
    // Check if player is colliding with this entry
    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    // Handle level transition
    activate(game) {
        console.log(`Entry activated: transitioning to level ${this.destinationLevel}`);
        
        // Store destination coordinates for the new level
        if (this.destinationX !== null && this.destinationY !== null) {
            // Set player position after level loads
            game.pendingPlayerPosition = {
                x: this.destinationX,
                y: this.destinationY,
            };
        }
        
        // Switch to destination level
        game.currentLevel = this.destinationLevel;
        game.loadLevel(this.destinationLevel);
        game.updateUI();
        
        return true; // Indicates level transition occurred
    }
    
    // Draw method - invisible in game, bright neon green in editor
    draw(ctx, isEditorMode = false) {
        if (!isEditorMode) return; // Invisible in normal game mode
        
        // Bright neon green for editor visibility
        ctx.fillStyle = '#00ff00';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Bright neon green border
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Draw destination level number in center
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `→${this.destinationLevel}`,
            this.x + this.width / 2,
            this.y + this.height / 2 + 4,
        );
        
        // Reset alpha
        ctx.globalAlpha = 1.0;
    }
    
    // Get entry data for level export
    getExportData() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            destinationLevel: this.destinationLevel,
            destinationX: this.destinationX,
            destinationY: this.destinationY,
            type: 'entry',
        };
    }
    
    // Create entry from exported data
    static fromExportData(data) {
        return new Entry(
            data.x,
            data.y,
            data.width || 32,
            data.height || 32,
            data.destinationLevel || 1,
            data.destinationX || null,
            data.destinationY || null,
        );
    }
}
