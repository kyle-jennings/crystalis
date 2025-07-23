// Effect.js - Effect classes for Crystalis game

// Base Effect class
export class Effect {
    constructor(x, y, duration) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.life = duration;
        this.shouldRemove = false;
    }
    
    update() {
        this.life -= 1/60;
        if (this.life <= 0) {
            this.shouldRemove = true;
        }
    }
}

export class HitEffect extends Effect {
    constructor(x, y) {
        super(x, y, 0.3);
    }
    
    draw(ctx) {
        const alpha = this.life / this.duration;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFFF00';
        
        const size = (1 - alpha) * 20;
        ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
        
        ctx.restore();
    }
}

export class HealEffect extends Effect {
    constructor(x, y) {
        super(x, y, 1.0);
    }
    
    draw(ctx) {
        const alpha = this.life / this.duration;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#00FF00';
        
        const offset = (1 - alpha) * 20;
        ctx.fillRect(this.x - 2, this.y - offset, 4, 8);
        ctx.fillRect(this.x - 4, this.y - offset + 2, 8, 4);
        
        ctx.restore();
    }
}

// Melee Attack Effect
export class MeleeAttackEffect extends Effect {
    constructor(x, y, angle) {
        super(x, y, 0.2); // Short duration for melee effect
        this.angle = angle;
        this.size = 16;
    }
    
    draw(ctx) {
        const alpha = this.life / this.duration;
        const progress = 1 - alpha; // 0 to 1 as effect progresses
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw slash effect
        ctx.strokeStyle = '#FFD700'; // Gold color
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // Create a slash arc
        const radius = this.size + progress * 8;
        const startAngle = this.angle - Math.PI / 4;
        const endAngle = this.angle + Math.PI / 4;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, startAngle, endAngle);
        ctx.stroke();
        
        // Add some sparkle effects
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 3; i++) {
            const sparkleAngle = this.angle + (i - 1) * Math.PI / 6;
            const sparkleDistance = radius * 0.8;
            const sparkleX = this.x + Math.cos(sparkleAngle) * sparkleDistance;
            const sparkleY = this.y + Math.sin(sparkleAngle) * sparkleDistance;
            
            ctx.fillRect(sparkleX - 1, sparkleY - 1, 2, 2);
        }
        
        ctx.restore();
    }
}
