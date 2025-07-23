// Player.js - Player class for Crystalis game
export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.speed = 2;
        this.facing = 0; // 0-7 for 8 directions (0=up, 2=right, 4=down, 6=left)
        
        // Stats
        this.level = 1;
        this.hp = 16;
        this.maxHp = 16;
        this.mp = 4;
        this.maxMp = 4;
        this.exp = 0;
        this.expToNext = 20;
        
        // Combat
        this.currentSword = 'Wind';
        this.attackPower = 4;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.dashInvulnerable = false; // Separate invulnerability for dashing
        
        // Attack animation
        this.isAttacking = false;
        this.attackAnimationTime = 0;
        this.attackDuration = 0.3; // Attack animation lasts 0.3 seconds
        
        // Dash mechanics
        this.isDashing = false;
        this.dashTime = 0;
        this.dashDuration = 0.2; // Dash lasts 0.2 seconds
        this.dashSpeed = 8; // Dash speed multiplier
        this.dashCooldown = 0;
        this.dashCooldownTime = 1.0; // 1 second cooldown
        
        // Animation
        this.animFrame = 0;
        this.animTime = 0;
        this.isMoving = false;
    }
    
    move(dx, dy) {
        // If dashing, override movement with dash movement
        if (this.isDashing) {
            dx = this.dashDirection.x * this.dashSpeed;
            dy = this.dashDirection.y * this.dashSpeed;
        } else {
            this.isMoving = dx !== 0 || dy !== 0;
            
            if (this.isMoving) {
                // Update facing direction only when not dashing
                if (dy < 0 && dx === 0) this.facing = 0; // Up
                else if (dy < 0 && dx > 0) this.facing = 1; // Up-Right
                else if (dy === 0 && dx > 0) this.facing = 2; // Right
                else if (dy > 0 && dx > 0) this.facing = 3; // Down-Right
                else if (dy > 0 && dx === 0) this.facing = 4; // Down
                else if (dy > 0 && dx < 0) this.facing = 5; // Down-Left
                else if (dy === 0 && dx < 0) this.facing = 6; // Left
                else if (dy < 0 && dx < 0) this.facing = 7; // Up-Left
            }
        }
        
        // Move player
        this.x += dx;
        this.y += dy;
        
        // Keep player in world bounds
        this.x = Math.max(8, Math.min(this.x, 1016));
        this.y = Math.max(8, Math.min(this.y, 760));
    }
    
    attack() {
        // Start attack animation
        this.isAttacking = true;
        this.attackAnimationTime = this.attackDuration;
        
        // Return projectile data for the game class to create
        const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            angle: angle,
            swordType: this.currentSword,
            damage: this.attackPower
        };
    }
    
    dash() {
        // Can only dash if not already dashing and cooldown is over
        if (!this.isDashing && this.dashCooldown <= 0) {
            this.isDashing = true;
            this.dashTime = this.dashDuration;
            this.dashCooldown = this.dashCooldownTime;
            
            // Make player invincible during dash
            this.dashInvulnerable = true;
            
            // Calculate dash direction based on facing
            const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);
            this.dashDirection = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
            
            return true; // Dash was successful
        }
        return false; // Dash failed (on cooldown or already dashing)
    }
    
    takeDamage(damage) {
        // Check both damage invulnerability and dash invulnerability
        if (!this.invulnerable && !this.dashInvulnerable) {
            this.hp = Math.max(0, this.hp - damage);
            this.invulnerable = true;
            this.invulnerabilityTime = 1.0; // 1 second of invulnerability
            
            if (this.hp <= 0) {
                // Handle player death
                this.respawn();
            }
        }
    }
    
    respawn() {
        this.hp = this.maxHp;
        this.x = 256;
        this.y = 400;
    }
    
    gainExp(amount) {
        this.exp += amount;
        
        if (this.exp >= this.expToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.exp = 0;
        this.expToNext = this.level * 20;
        
        // Increase stats
        this.maxHp += 4;
        this.hp = this.maxHp;
        this.maxMp += 2;
        this.mp = this.maxMp;
        this.attackPower += 1;
    }
    
    update() {
        // Update animation
        if (this.isMoving && !this.isDashing) {
            this.animTime += 1/60;
            if (this.animTime > 0.2) {
                this.animFrame = (this.animFrame + 1) % 2;
                this.animTime = 0;
            }
        }
        
        // Update dash
        if (this.isDashing) {
            this.dashTime -= 1/60;
            if (this.dashTime <= 0) {
                this.isDashing = false;
                // End dash invincibility
                this.dashInvulnerable = false;
            }
        }
        
        // Update dash cooldown
        if (this.dashCooldown > 0) {
            this.dashCooldown -= 1/60;
        }
        
        // Update attack animation
        if (this.isAttacking) {
            this.attackAnimationTime -= 1/60;
            if (this.attackAnimationTime <= 0) {
                this.isAttacking = false;
            }
        }
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTime -= 1/60;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Regenerate MP slowly
        if (Math.random() < 0.01) {
            this.mp = Math.min(this.mp + 1, this.maxMp);
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Flash when invulnerable from damage
        if (this.invulnerable && Math.floor(this.invulnerabilityTime * 10) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Dash effect - make player semi-transparent and add motion blur
        if (this.isDashing) {
            ctx.globalAlpha *= 0.7;
            
            // Draw dash trail
            ctx.fillStyle = 'rgba(65, 105, 225, 0.3)'; // Semi-transparent blue
            for (let i = 1; i <= 3; i++) {
                const trailX = this.x - (this.dashDirection.x * i * 4);
                const trailY = this.y - (this.dashDirection.y * i * 4);
                ctx.fillRect(trailX, trailY, this.width, this.height);
            }
            
            // Add invulnerability glow when dashing
            if (this.dashInvulnerable) {
                ctx.shadowColor = '#00FFFF';
                ctx.shadowBlur = 10;
            }
        }
        
        // Draw player (simple colored rectangle for now)
        ctx.fillStyle = this.isDashing ? '#87CEEB' : '#4169E1'; // Light blue when dashing
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Draw facing direction indicator
        ctx.fillStyle = '#FFD700'; // Gold
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        // Adjust angle so that facing 0 (up) corresponds to -PI/2 radians
        const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);
        const dirX = Math.cos(angle) * 8;
        const dirY = Math.sin(angle) * 8;
        
        ctx.fillRect(centerX + dirX - 2, centerY + dirY - 2, 4, 4);
        
        // Draw attack animation
        if (this.isAttacking) {
            this.drawAttackAnimation(ctx, centerX, centerY);
        }
        
        ctx.restore();
    }
    
    drawAttackAnimation(ctx, centerX, centerY) {
        // Calculate attack animation progress (1.0 = start, 0.0 = end)
        const progress = this.attackAnimationTime / this.attackDuration;
        
        // Draw sword slash effect
        ctx.save();
        ctx.globalAlpha = progress;
        
        // Get attack direction
        const angle = (this.facing * Math.PI / 4) - (Math.PI / 2);
        
        // Draw sword trail/slash
        ctx.strokeStyle = this.getSwordColor();
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Draw an arc representing the sword slash
        const radius = 20;
        const startAngle = angle - Math.PI / 6; // 30 degrees before facing direction
        const endAngle = angle + Math.PI / 6;   // 30 degrees after facing direction
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.stroke();
        
        // Draw sword blade extending in facing direction
        const bladeLength = 16 + (1 - progress) * 8; // Blade extends during attack
        const bladeX = centerX + Math.cos(angle) * bladeLength;
        const bladeY = centerY + Math.sin(angle) * bladeLength;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(bladeX, bladeY);
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.restore();
    }
    
    getSwordColor() {
        switch (this.currentSword) {
            case 'Wind': return '#90EE90';
            case 'Fire': return '#FF4500';
            case 'Water': return '#1E90FF';
            case 'Thunder': return '#FFD700';
            default: return '#FFFFFF';
        }
    }
}
