// CombatSystem.js - Combat system for Crystalis game
import { HitEffect, MeleeAttackEffect } from './Effect.js';
import { SwordProjectile } from './Projectile.js';

export default class CombatSystem {
  static constructorParams = {
    player: {
      type: 'object',
      description: 'Reference to the player character'
    },
    game: {
      type: 'object',
      description: 'Reference to the main game instance'
    }
  };

  constructor(player, game) {
    this.player = player;
    this.game = game;
    
    // Combat configuration
    this.meleeRange = this.player.width;
    this.knockbackStrength = {
      melee: 50,
      projectile: 35
    };
  }

  // Create charged sword projectile attack
  createSwordAttack(projectileData) {
    console.log('Creating sword attack with data:', projectileData);
    
    const projectile = new SwordProjectile(
      projectileData.x,
      projectileData.y,
      projectileData.angle,
      projectileData.swordType,
    );
    
    this.game.projectiles.push(projectile);
    console.log('Projectile created and added. Total projectiles:', this.game.projectiles.length);
  }

  // Perform melee sword attack
  performMeleeAttack() {
    // Trigger player attack animation
    this.player.attack();

    // Calculate attack parameters
    const angle = ((this.player.facing * Math.PI) / 4) - (Math.PI / 2);
    const attackX = this.player.x + (this.player.width / 2) + Math.cos(angle) * this.meleeRange;
    const attackY = this.player.y + (this.player.height / 2) + Math.sin(angle) * this.meleeRange;

    // Check for enemies in melee range
    for (const enemy of this.game.enemies) {
      if (this.isEnemyInMeleeRange(enemy, attackX, attackY)) {
        this.dealMeleeDamage(enemy);
      }
    }

    // Create visual effect for melee attack
    this.game.effects.push(new MeleeAttackEffect(attackX, attackY, angle));
  }

  // Check if enemy is within melee attack range
  isEnemyInMeleeRange(enemy, attackX, attackY) {
    const distance = this.game.getDistance(
      { x: attackX, y: attackY },
      { x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2 }
    );
    
    return distance <= this.meleeRange;
  }

  // Apply melee damage and knockback to enemy
  dealMeleeDamage(enemy) {
    // Calculate knockback direction (from player to enemy)
    const dx = (enemy.x + enemy.width / 2) - (this.player.x + this.player.width / 2);
    const dy = (enemy.y + enemy.height / 2) - (this.player.y + this.player.height / 2);
    const length = Math.sqrt(dx * dx + dy * dy);

    // Normalize and apply knockback
    const knockbackX = length > 0 ? (dx / length) * this.knockbackStrength.melee : 0;
    const knockbackY = length > 0 ? (dy / length) * this.knockbackStrength.melee : 0;

    // Deal damage with knockback
    enemy.takeDamage(this.player.attackPower, knockbackX, knockbackY);
    
    // Create hit effect
    this.game.effects.push(new HitEffect(
      enemy.x + enemy.width / 2, 
      enemy.y + enemy.height / 2
    ));
    
    console.log('Melee hit enemy for', this.player.attackPower, 'damage with knockback');
  }

  // Handle projectile vs enemy collisions
  checkProjectileCollisions() {
    for (const projectile of this.game.projectiles) {
      if (projectile.friendly) {
        for (const enemy of this.game.enemies) {
          if (this.game.getDistance(projectile, enemy) < 20) {
            this.dealProjectileDamage(enemy, projectile);
            break;
          }
        }
      }
    }
  }

  // Apply projectile damage and knockback
  dealProjectileDamage(enemy, projectile) {
    // Calculate knockback in projectile direction
    const knockbackX = Math.cos(projectile.angle) * this.knockbackStrength.projectile;
    const knockbackY = Math.sin(projectile.angle) * this.knockbackStrength.projectile;

    // Deal damage with knockback
    enemy.takeDamage(projectile.damage, knockbackX, knockbackY);
    projectile.shouldRemove = true;
    
    // Create hit effect
    this.game.effects.push(new HitEffect(enemy.x, enemy.y));
    console.log('Projectile hit enemy with knockback');
  }

  // Draw charge indicator for the charging attack system
  drawChargeIndicator() {
    if (this.game.isCharging) {
      const chargeTime = this.game.gameTime - this.game.chargeStartTime;

      // Only show indicator after the delay
      if (chargeTime >= this.game.chargeIndicatorDelay) {
        const chargeProgress = Math.min(chargeTime / this.game.chargeRequiredTime, 1.0);

        // Draw charge bar at bottom of screen
        const barWidth = 200;
        const barHeight = 20;
        const barX = (this.game.width - barWidth) / 2;
        const barY = this.game.height - 40;

        // Background
        this.game.ctx.fillStyle = '#333';
        this.game.ctx.fillRect(barX, barY, barWidth, barHeight);

        // Border
        this.game.ctx.strokeStyle = '#fff';
        this.game.ctx.lineWidth = 2;
        this.game.ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Charge progress
        const fillWidth = barWidth * chargeProgress;
        this.game.ctx.fillStyle = chargeProgress >= 1.0 ? '#00ff00' : '#ffff00';
        this.game.ctx.fillRect(barX, barY, fillWidth, barHeight);

        // Text
        this.game.ctx.fillStyle = '#fff';
        this.game.ctx.font = '14px Courier New';
        this.game.ctx.textAlign = 'center';
        const text = chargeProgress >= 1.0 ? 'READY!' : 'Charging...';
        this.game.ctx.fillText(text, this.game.width / 2, barY - 5);
      }
    }
  }

  // Future methods for additional combat features:
  
  // performComboAttack() {
  //   // Handle multi-hit combo attacks
  // }
  
  // performElementalAttack(elementType) {
  //   // Handle fire, ice, wind, thunder sword attacks
  // }
  
  // performChargedMelee(chargeLevel) {
  //   // Handle different charge levels for melee attacks
  // }
}
