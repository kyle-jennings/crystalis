import {
  // Effect,
  HitEffect,
  HealEffect,
} from '@game/js/classes/Effect.js';

export default class MagicSystem {
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
    
    // Magic system properties
    this.currentSpell = 'heal';
    this.spellCooldowns = {
      heal: 0,
      teleport: 0,
      barrier: 0,
      thunder: 0
    };
    
    // Spell definitions
    this.spells = {
      heal: {
        name: 'Heal',
        mpCost: 2,
        cooldown: 1.0, // seconds
        cast: this.castHeal.bind(this)
      },
      teleport: {
        name: 'Teleport',
        mpCost: 4,
        cooldown: 3.0,
        cast: this.castTeleport.bind(this)
      },
      barrier: {
        name: 'Barrier',
        mpCost: 3,
        cooldown: 5.0,
        cast: this.castBarrier.bind(this)
      },
      thunder: {
        name: 'Thunder',
        mpCost: 5,
        cooldown: 2.0,
        cast: this.castThunder.bind(this)
      }
    };
  }

  update(deltaTime) {
    // Update spell cooldowns
    for (const spellName in this.spellCooldowns) {
      if (this.spellCooldowns[spellName] > 0) {
        this.spellCooldowns[spellName] -= deltaTime;
      }
    }
  }

  castSpell(spellName = this.currentSpell) {
    const spell = this.spells[spellName];
    
    if (!spell) {
      console.warn(`Unknown spell: ${spellName}`);
      return false;
    }

    // Check MP cost
    if (this.player.mp < spell.mpCost) {
      console.log(`Not enough MP for ${spell.name}`);
      return false;
    }

    // Check cooldown
    if (this.spellCooldowns[spellName] > 0) {
      console.log(`${spell.name} is on cooldown`);
      return false;
    }

    // Cast the spell
    this.player.mp -= spell.mpCost;
    this.spellCooldowns[spellName] = spell.cooldown;
    spell.cast();
    
    return true;
  }

  castHeal() {
    const healAmount = 5;
    this.player.hp = Math.min(this.player.hp + healAmount, this.player.maxHp);
    this.game.effects.push(new HealEffect(this.player.x, this.player.y));
    console.log(`Healed for ${healAmount} HP`);
  }

  castTeleport() {
    // Teleport in facing direction
    const teleportDistance = 64;
    const angle = ((this.player.facing * Math.PI) / 4) - (Math.PI / 2);
    
    const newX = this.player.x + Math.cos(angle) * teleportDistance;
    const newY = this.player.y + Math.sin(angle) * teleportDistance;
    
    // Check bounds and collisions before teleporting
    if (newX >= 0 && newX <= this.game.worldWidth - this.player.width &&
        newY >= 0 && newY <= this.game.worldHeight - this.player.height) {
      
      const oldX = this.player.x;
      const oldY = this.player.y;
      
      this.player.x = newX;
      this.player.y = newY;
      
      // Check for collisions at new position
      if (this.player.checkTreeCollisions(this.game.trees) ||
          this.player.checkStalactiteCollisions(this.game.stalactites) ||
          this.player.checkHouseCollisions(this.game.houses) ||
          this.player.checkWallCollisions(this.game.walls)) {
        // Revert if collision
        this.player.x = oldX;
        this.player.y = oldY;
        console.log('Teleport blocked by obstacle');
      } else {
        console.log('Teleported successfully');
      }
    }
  }

  castBarrier() {
    // Temporary invulnerability
    this.player.invulnerable = true;
    setTimeout(() => {
      this.player.invulnerable = false;
    }, 3000); // 3 seconds of protection
    console.log('Barrier activated');
  }

  castThunder() {
    // Area damage around player
    const thunderRange = 80;
    
    for (const enemy of this.game.enemies) {
      const distance = this.game.getDistance(this.player, enemy);
      if (distance <= thunderRange) {
        const damage = 15;
        enemy.takeDamage(damage, 0, 0);
        this.game.effects.push(new HitEffect(enemy.x, enemy.y));
      }
    }
    console.log('Thunder spell cast');
  }

  cycleSpell() {
    const spellNames = Object.keys(this.spells);
    const currentIndex = spellNames.indexOf(this.currentSpell);
    const nextIndex = (currentIndex + 1) % spellNames.length;
    this.currentSpell = spellNames[nextIndex];
    
    console.log(`Switched to ${this.spells[this.currentSpell].name}`);
    return this.currentSpell;
  }

  getCurrentSpellName() {
    return this.spells[this.currentSpell].name;
  }
}