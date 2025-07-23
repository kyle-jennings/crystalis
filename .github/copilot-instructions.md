<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Game Development Project Instructions

This workspace contains multiple HTML5 Canvas-based games:

## Simple Platformer Game
- Basic 2D platformer with player movement, jumping, platforms, and collectible coins
- Uses classes for Game, Player, Platform, and Coin
- Features disappearing platforms, score system, and victory conditions

## Crystalis Clone
- Top-down action RPG inspired by the 1990 NES game Crystalis
- Post-apocalyptic setting with elemental sword combat
- Features player stats, enemies, magic system, and experience progression
- Implements 8-directional movement and real-time combat

## Code Style Guidelines
- Use ES6+ features and modern JavaScript syntax
- Follow consistent naming conventions (camelCase for variables and functions)
- Keep classes organized with clear separation of concerns
- Use meaningful variable and function names
- Add comments for complex game logic and mechanics

## Game Architecture
- Object-oriented structure with separate classes for entities
- Game loop pattern with update() and render() methods
- Input handling with keyboard events
- Canvas 2D rendering with proper coordinate systems
- Collision detection and physics systems

## Adding New Features
When extending these games, consider:
- Performance optimization for 60fps gameplay
- Modular code structure for easy feature additions
- Consistent visual style and user interface
- Proper game state management
- Clear separation between game logic and rendering

## Asset Guidelines
- Use simple geometric shapes and solid colors for sprites
- Maintain consistent pixel art aesthetic
- Keep visual elements readable and distinct
- Optimize for web performance
