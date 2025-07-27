// Entry.js - Invisible collision areas for level transitions
export default class Entry {
    static constructorParams = {
        x: {
            type: 'number',
            description: 'X position of the entry area',
            default: 0,
        },
        y: {
            type: 'number',
            description: 'Y position of the entry area',
            default: 0,
        },
        width: {
            type: 'number',
            description: 'Width of the entry area (default 32)',
            default: 32,
        },
        height: {
            type: 'number',
            description: 'Height of the entry area (default 32)',
            default: 32,
        },
        destinationLevel: {
            type: 'number',
            description: 'Level ID to transition to (default 1)',
            default: 1,
        },
        destinationX: {
            type: 'number|null',
            description: 'X spawn position in destination (null = use default)',
            default: null,
        },
        destinationY: {
            type: 'number|null',
            description: 'Y spawn position in destination (null = use default)',
            default: null,
        },
        type: {
            type: 'string',
            description: 'Type identifier for this object (always "entry")',
            default: 'entry',
        },
        color: {
            type: 'string',
            description: 'Color for the preview (bright green for visibility)',
            default: '#00ff00',
        },
    };

    constructor(options = {}) {
        // Support both old positional arguments and new options object
        if (typeof options === 'number') {
            // Old style: constructor(x, y, width, height, destinationLevel, destinationX, destinationY)
            this.x = options;
            this.y = arguments[1] || 0;
            this.width = arguments[2] || 32;
            this.height = arguments[3] || 32;
            this.destinationLevel = arguments[4] || 1;
            this.destinationX = arguments[5] || null;
            this.destinationY = arguments[6] || null;
        } else {
            // New style: constructor({x, y, width, height, ...})
            this.x = options.x || 0;
            this.y = options.y || 0;
            this.width = options.width || 32;
            this.height = options.height || 32;
            this.destinationLevel = options.destinationLevel || 1;
            this.destinationX = options.destinationX || null;
            this.destinationY = options.destinationY || null;
        }
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
