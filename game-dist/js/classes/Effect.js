// Effect.js - Effect classes for Crystalis game

// Base Effect class
export class Effect {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the effect',
    },
    y: {
      type: 'number',
      description: 'Y position of the effect',
    },
    duration: {
      type: 'number',
      description: 'Total duration of the effect in seconds',
    },
    life: {
      type: 'number',
      description: 'Time remaining for the effect',
    },
    shouldRemove: {
      type: 'boolean',
      description: 'Flag to mark for removal from game',
    },
  };

  constructor(x, y, duration) {
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.life = duration;
    this.shouldRemove = false;
  }

  update() {
    this.life -= 1 / 60;
    if (this.life <= 0) {
      this.shouldRemove = true;
    }
  }
}

export class HitEffect extends Effect {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the hit effect',
    },
    y: {
      type: 'number',
      description: 'Y position of the hit effect',
    },
    duration: {
      type: 'number',
      description: 'Duration of hit effect (0.3 seconds)',
    },
    life: {
      type: 'number',
      description: 'Time remaining for the effect (inherited)',
    },
    shouldRemove: {
      type: 'boolean',
      description: 'Flag to mark for removal (inherited)',
    },
  };

  constructor(x, y) {
    super(x, y, 0.3);
  }

  draw(ctx) {
    const alpha = this.life / this.duration;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFFF00';

    const size = (1 - alpha) * 20;
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);

    ctx.restore();
  }
}

export class HealEffect extends Effect {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the heal effect',
    },
    y: {
      type: 'number',
      description: 'Y position of the heal effect',
    },
    duration: {
      type: 'number',
      description: 'Duration of heal effect (1.0 seconds)',
    },
    life: {
      type: 'number',
      description: 'Time remaining for the effect (inherited)',
    },
    shouldRemove: {
      type: 'boolean',
      description: 'Flag to mark for removal (inherited)',
    },
  };

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
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the melee attack effect',
    },
    y: {
      type: 'number',
      description: 'Y position of the melee attack effect',
    },
    duration: {
      type: 'number',
      description: 'Duration of attack effect (0.2 seconds)',
    },
    life: {
      type: 'number',
      description: 'Time remaining for the effect (inherited)',
    },
    shouldRemove: {
      type: 'boolean',
      description: 'Flag to mark for removal (inherited)',
    },
    angle: {
      type: 'number',
      description: 'Direction of the attack slash in radians',
    },
    size: {
      type: 'number',
      description: 'Size of the attack effect (fixed at 16)',
    },
  };

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
