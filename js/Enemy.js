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
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
        
        this.updateAnimation();
    }
    
    updateAnimation() {
        // Update animation
        this.animTime += 1/60;
        if (this.animTime > 0.3) {
            this.animFrame = (this.animFrame + 1) % 2;
            this.animTime = 0;
        }
    }
    
    takeDamage(damage) {
        this.hp -= damage;
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
