# Game Development Collection

This repository contains multiple HTML5 Canvas-based games built with vanilla JavaScript.

## 🎮 Games

### 1. Simple Platformer (`index.html`)
A basic 2D platformer game featuring:
- **Player Movement**: Smooth left/right movement with arrow keys or WASD
- **Jumping**: Responsive jump mechanics with spacebar, W, or up arrow
- **Physics**: Realistic gravity and friction system
- **Platforms**: Multiple platforms including disappearing ones
- **Collectibles**: 8 golden coins to collect for points
- **UI**: Live score and coin counter with victory screen

**Controls:**
- Move: Arrow keys or WASD
- Jump: Spacebar, Up Arrow, or W

### 2. Crystalis Clone (`index.html`)
A top-down action RPG inspired by the 1990 NES classic:
- **8-Directional Movement**: Smooth character movement in all directions
- **Combat System**: Sword attacks with elemental projectiles
- **RPG Elements**: Level progression, HP/MP, experience points
- **Enemy AI**: Various creatures with different behaviors
- **Magic System**: Healing and other magical abilities
- **Real-time Combat**: Fast-paced action gameplay

**Controls:**
- Move: WASD or Arrow keys
- Attack: Spacebar (sword)
- Magic: Q key
- Change Magic: E key

## 🛠️ Technical Features

### Game Architecture
- **Object-Oriented Design**: Separate classes for players, enemies, items, and effects
- **Game Loop**: 60fps update/render cycle using requestAnimationFrame
- **Collision Detection**: Efficient bounding box collision systems
- **Camera System**: Smooth following camera (Crystalis)
- **Input Handling**: Responsive keyboard controls with proper event management

### Visual Systems
- **Canvas 2D Rendering**: Optimized drawing with proper layering
- **Animation**: Sprite animation systems for characters and effects
- **UI Elements**: Health bars, score displays, and game information
- **Visual Effects**: Hit effects, healing animations, and particle systems

## 🚀 Getting Started

1. **Simple Setup**: Open any HTML file directly in a web browser
2. **Local Server** (recommended): 
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## 📁 Project Structure

```
game/
├── index.html         # Crystalis game main page
├── js/                    # JavaScript modules
│   ├── crystalis-game.js  # Crystalis game logic
│   ├── Player.js          # Player class
│   ├── Enemy.js           # Enemy classes
│   ├── Projectile.js      # Projectile classes
│   ├── Item.js            # Item classes
│   └── Effect.js          # Effect classes
├── README.md              # This file
└── .github/
    └── copilot-instructions.md
```

## 🎯 Game Design Philosophy

### Simple Platformer
- **Accessibility**: Easy to learn, challenging to master
- **Classic Mechanics**: Traditional platforming with modern touches
- **Progressive Difficulty**: Disappearing platforms add timing challenges
- **Clear Objectives**: Collect all coins for completion

### Crystalis Clone
- **Faithful Recreation**: Stays true to the original's core mechanics
- **Post-Apocalyptic Setting**: Reflects the game's unique atmosphere
- **Action RPG Elements**: Combines real-time combat with character progression
- **Elemental Combat**: Different sword types for strategic gameplay

## 🔧 Development Notes

### Performance Considerations
- Efficient collision detection algorithms
- Optimized rendering with minimal canvas operations
- Proper memory management for game objects
- 60fps target with requestAnimationFrame

### Extensibility
- Modular class structure for easy feature additions
- Clear separation between game logic and rendering
- Event-driven architecture for input and interactions
- Configurable game parameters

## 🎮 Future Enhancements

### Platformer Ideas
- Multiple levels with different themes
- Power-ups and special abilities
- Moving platforms and hazards
- Boss battles

### Crystalis Ideas
- Complete world map recreation
- All four elemental swords
- Magic spell system
- Towns and NPCs
- Quest system
- Save/load functionality

## 🌐 Browser Compatibility

These games work in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- requestAnimationFrame API

## 📄 License

Open source - feel free to use, modify, and learn from these games!
