// Item.js - Item classes for Crystalis game

export default class ExperienceOrb {
  static constructorParams = {
    x: {
      type: 'number',
      description: 'X position of the experience orb',
    },
    y: {
      type: 'number',
      description: 'Y position of the experience orb',
    },
    value: {
      type: 'number',
      description: 'Experience points this orb gives when collected',
    },
    bobOffset: {
      type: 'number',
      description: 'Vertical bobbing animation offset',
    },
    bobSpeed: {
      type: 'number',
      description: 'Speed of the bobbing animation',
    },
  };

  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.bobOffset = 0;
    this.bobSpeed = 0.1;
  }

  update() {
    this.bobOffset = Math.sin(Date.now() * this.bobSpeed) * 3;
  }

  pickup(player) {
    player.gainExp(this.value);
  }

  draw(ctx) {
    const y = this.y + this.bobOffset;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(this.x, y, 8, 8);

    // Add sparkle effect
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.x + 2, y + 2, 4, 4);
  }
}
