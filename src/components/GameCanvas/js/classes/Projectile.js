// Projectile.js - Projectile classes for Crystalis game

export class SwordProjectile {
    constructor(x, y, angle, swordType) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 4;
        this.damage = 4;
        this.swordType = swordType;
        this.friendly = true;
        this.shouldRemove = false;
        this.life = 0.5; // Lives for 0.5 seconds
        this.size = 8;
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        this.life -= 1/60;
        if (this.life <= 0) {
            this.shouldRemove = true;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.getSwordColor();
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    
    getSwordColor() {
        switch (this.swordType) {
            case 'Wind': return '#90EE90';
            case 'Fire': return '#FF4500';
            case 'Water': return '#1E90FF';
            case 'Thunder': return '#FFD700';
            default: return '#FFFFFF';
        }
    }
}
