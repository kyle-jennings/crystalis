// Crystalis Clone - First Area Implementation
import Player from './classes/Player.js';
// import { Enemy, Slime, Ant } from './classes/Enemy.js';
import { SwordProjectile } from './classes/Projectile.js';
import { ExperienceOrb } from './classes/Item.js';
import {
    // Effect,
    HitEffect,
    HealEffect,
    MeleeAttackEffect } from './classes/Effect.js';
import { GAME_KEYS, MOVEMENT_KEYS, ACTION_KEYS, INPUT_CONFIG } from './inputMappings.js';
import DevMode from './classes/DevMode.js';

// Import all level modules as objects
import * as Level1 from './levels/level-1.js';
import * as Level2 from './levels/level-2.js';
import * as Level3 from './levels/level-3.js';

// Level registry for easy access
const LEVELS = {
    1: Level1,
    2: Level2,
    3: Level3,
};


class CrystalisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.currentLevel = 1;
        this.maxLevel = 3;
        this.currentLevelObj = null; // Will hold the active level module
        this.devMode = new DevMode(this); // Developer mode instance

        this.gameTime = 0;
        this.camera = { x: 0, y: 0 };
        this.worldWidth = 1024;
        this.worldHeight = 768;
        
        // Player stats and state
        this.player = new Player(256, 400); // Start in center of first area
        
        // Game entities
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.effects = [];
        this.trees = []; // Add trees array
        this.mountains = []; // Add mountains array
        this.caves = []; // Add caves array
        this.stalactites = []; // Add stalactites array
        this.houses = []; // Add houses array
        this.walls = []; // Add walls array

        
        // Input handling
        this.keys = {};
        this.lastAttackTime = 0;
        this.lastMagicTime = 0;
        this.enemiesCanMove = true; // Toggle for enemy movement
        
        // Charge attack system
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.chargeRequiredTime = INPUT_CONFIG.chargeRequiredTime;
        this.chargeIndicatorDelay = INPUT_CONFIG.chargeIndicatorDelay;
        
        // Check for dev mode before initializing
        this.devMode.initialize().then(() => {
            // Initialize world
            this.loadLevel(this.currentLevel);
            this.setupEventListeners();
            this.updateUI();
            
            // Make game instance globally accessible for button
            window.game = this;
            
            // Start game loop
            this.gameLoop();
        });
    }
    
    loadLevel(levelNumber) {
        // Set current level object
        this.currentLevelObj = LEVELS[levelNumber];
        
        if (!this.currentLevelObj) {
            console.warn(`Level ${levelNumber} not found, loading level 1`);
            this.currentLevelObj = LEVELS[1];
            this.currentLevel = 1;
        }
        
        // Get level configs if they exist
        const levelConfigs = this.currentLevelObj.canvasConfigs || {};
        
        // Reset player position to spawn point
        this.player.x = levelConfigs.playerX || 256;
        this.player.y = levelConfigs.playerY || 400;
        
        // Adjust canvas size based on level configs
        if (levelConfigs.canvasWidth && levelConfigs.canvasHeight) {
            // Level has custom canvas size
            this.canvas.width = levelConfigs.canvasWidth;
            this.canvas.height = levelConfigs.canvasHeight;
            this.width = levelConfigs.width || levelConfigs.canvasWidth;
            this.height = levelConfigs.height || levelConfigs.canvasHeight;
            this.worldWidth = levelConfigs.worldWidth || levelConfigs.canvasWidth;
            this.worldHeight = levelConfigs.worldHeight || levelConfigs.canvasHeight;
        } else {
            // Use default canvas size
            this.canvas.width = 512;
            this.canvas.height = 480;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.worldWidth = 1024;
            this.worldHeight = 768;
        }
        
        // Initialize the level using the level object's initialize function
        if (typeof this.currentLevelObj.initialize === 'function') {
            this.currentLevelObj.initialize(this);
        } else {
            console.error(`No initialize function found for level ${levelNumber}`);
        }
        
        console.log(`Loaded Level ${this.currentLevel}`);
    }
    
    switchLevel(direction) {
        const newLevel = this.currentLevel + direction;
        if (newLevel >= 1 && newLevel <= this.maxLevel) {
            this.currentLevel = newLevel;
            this.loadLevel(this.currentLevel);
            this.updateUI();
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // Start charging when space is first pressed
            if (e.code === ACTION_KEYS.attack && !this.keys[ACTION_KEYS.attack]) {
                this.isCharging = true;
                this.chargeStartTime = this.gameTime;
            }
            
            this.keys[e.code] = true;
            
            // Prevent default browser behavior for game keys
            if (GAME_KEYS.includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            // Handle space key release for attacks
            if (e.code === ACTION_KEYS.attack && this.isCharging) {
                const chargeTime = this.gameTime - this.chargeStartTime;
                
                console.log('Space released, charge time:', chargeTime, 'required:', this.chargeRequiredTime);
                
                // Check if charged long enough for projectile attack
                if (chargeTime >= this.chargeRequiredTime) {
                    console.log('Firing projectile...');
                    const projectileData = this.player.attack();
                    console.log('Projectile data:', projectileData);
                    this.createSwordAttack(projectileData);
                    this.lastAttackTime = this.gameTime;
                } else {
                    // Short press - perform melee attack
                    console.log('Performing melee attack');
                    this.performMeleeAttack();
                    this.lastAttackTime = this.gameTime;
                }
                
                // Reset charging state
                this.isCharging = false;
                this.chargeStartTime = 0;
            }
            
            this.keys[e.code] = false;
        });
        
        // Add keyboard shortcut for toggling enemy movement
        document.addEventListener('keydown', (e) => {
            if (e.code === ACTION_KEYS.toggleEnemies) {
                this.toggleEnemyMovement();
                e.preventDefault();
            }
            
            if (e.code === ACTION_KEYS.toggleInstructions) {
                window.toggleInstructions();
                e.preventDefault();
            }
            
            if (e.code === ACTION_KEYS.nextLevel) {
                this.switchLevel(1);
                e.preventDefault();
            }
            
            if (e.code === ACTION_KEYS.prevLevel) {
                this.switchLevel(-1);
                e.preventDefault();
            }
            
            // Dev mode specific controls
            if (this.devMode.enabled) {
                const handled = this.devMode.handleKeyInput(e.code);
                if (handled) {
                    e.preventDefault();
                }
            }
        });
    }
    
    update() {
        this.gameTime += 1/60;
        
        // Handle input
        this.handleInput();
        
        // Update player
        this.player.update();
        
        // Check for cave opening portal activation
        const portalMountain = this.player.checkCaveOpeningPortal(this.mountains);
        if (portalMountain && portalMountain.caveOpeningDestination) {
            console.log(`Entering portal to level ${portalMountain.caveOpeningDestination}`);
            this.currentLevel = portalMountain.caveOpeningDestination;
            this.loadLevel(this.currentLevel);
            this.updateUI();
            return; // Skip rest of update to avoid issues during level transition
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Only update enemy movement if enabled
            if (this.enemiesCanMove) {
                enemy.update(this.player);
                
                // Check for tree collisions and handle them
                const collidingTree = enemy.checkTreeCollisions(this.trees);
                const collidingMountain = enemy.checkMountainCollisions(this.mountains);
                const collidingStalactite = enemy.checkStalactiteCollisions(this.stalactites);
                const collidingHouse = enemy.checkHouseCollisions(this.houses);
                const collidingWall = enemy.checkWallCollisions(this.walls);
                
                if (collidingTree || collidingMountain || collidingStalactite || collidingHouse || collidingWall) {
                    enemy.tryAlternativeMovement(this.trees, this.mountains, this.stalactites, this.houses, this.walls);
                }
            } else {
                // Still update animation even when frozen
                enemy.updateAnimation();
            }
            
            // Remove dead enemies
            if (enemy.hp <= 0) {
                // Drop experience
                this.items.push(new ExperienceOrb(enemy.x, enemy.y, enemy.expValue));
                this.enemies.splice(i, 1);
            }
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update();
            
            if (projectile.shouldRemove) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update items
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update();
            
            // Check pickup
            if (this.getDistance(this.player, item) < 20) {
                item.pickup(this.player);
                this.items.splice(i, 1);
                this.updateUI();
            }
        }
        
        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.update();
            
            if (effect.shouldRemove) {
                this.effects.splice(i, 1);
            }
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Update camera to follow player
        this.updateCamera();
    }
    
    handleInput() {
        let speed = this.player.speed;
        let dx = 0, dy = 0;
        
        // Check if player is in a mountain or cave for speed reduction
        const inMountain = this.player.checkMountainSlowdown(this.mountains);
        const inCave = this.player.checkCaveSlowdown(this.caves);
        if (inMountain || inCave) {
            speed *= 0.4; // Reduce speed to 40% when in mountain or cave
        }
        
        // Movement (8-directional) using key mappings
        if (MOVEMENT_KEYS.up.some(key => this.keys[key])) dy -= speed;
        if (MOVEMENT_KEYS.down.some(key => this.keys[key])) dy += speed;
        if (MOVEMENT_KEYS.left.some(key => this.keys[key])) dx -= speed;
        if (MOVEMENT_KEYS.right.some(key => this.keys[key])) dx += speed;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707; // 1/sqrt(2)
            dy *= 0.707;
        }
        
        // Store player's current position
        const originalX = this.player.x;
        const originalY = this.player.y;
        
        // Try to move player with current world boundaries
        this.player.move(dx, dy, this.worldWidth, this.worldHeight);
        
        // Check for tree collisions and revert if necessary
        const collidingTree = this.player.checkTreeCollisions(this.trees);
        const collidingStalactite = this.player.checkStalactiteCollisions(this.stalactites);
        const collidingHouse = this.player.checkHouseCollisions(this.houses);
        const collidingWall = this.player.checkWallCollisions(this.walls);
        
        if (collidingTree || collidingStalactite || collidingHouse || collidingWall) {
            // Revert to original position
            this.player.x = originalX;
            this.player.y = originalY;
            
            // Try moving only horizontally
            this.player.move(dx, 0, this.worldWidth, this.worldHeight);
            if (this.player.checkTreeCollisions(this.trees) || this.player.checkStalactiteCollisions(this.stalactites) || this.player.checkHouseCollisions(this.houses) || this.player.checkWallCollisions(this.walls)) {
                // Horizontal movement also collides, revert and try vertical only
                this.player.x = originalX;
                this.player.y = originalY;
                this.player.move(0, dy, this.worldWidth, this.worldHeight);
                
                // If vertical also collides, stay in place
                if (this.player.checkTreeCollisions(this.trees) || this.player.checkStalactiteCollisions(this.stalactites) || this.player.checkHouseCollisions(this.houses) || this.player.checkWallCollisions(this.walls)) {
                    this.player.x = originalX;
                    this.player.y = originalY;
                }
            }
        }
        
        // Dash
        if (this.keys[ACTION_KEYS.dash]) {
            this.player.dash();
            // Clear the key to prevent repeated dashing
            this.keys[ACTION_KEYS.dash] = false;
        }
        
        // Magic/Item use
        if (this.keys[ACTION_KEYS.magic] && this.gameTime - this.lastMagicTime > INPUT_CONFIG.magicCooldown) {
            this.useMagic();
            this.lastMagicTime = this.gameTime;
        }
        
        // Change magic (placeholder)
        if (this.keys[ACTION_KEYS.changeMagic]) {
            // Cycle through magic spells
        }
    }
    
    createSwordAttack(projectileData) {
        console.log('Creating sword attack with data:', projectileData);
        // Create sword projectile using data from player's attack method
        const projectile = new SwordProjectile(
            projectileData.x, 
            projectileData.y, 
            projectileData.angle, 
            projectileData.swordType
        );
        this.projectiles.push(projectile);
        console.log('Projectile created and added. Total projectiles:', this.projectiles.length);
    }
    
    performMeleeAttack() {
        // Trigger player attack animation
        this.player.attack();
        
        // Calculate melee attack area based on player facing direction
        const meleeRange = this.player.width; // Same width as player
        const angle = (this.player.facing * Math.PI / 4) - (Math.PI / 2);
        
        // Calculate attack position in front of player
        const attackX = this.player.x + (this.player.width / 2) + Math.cos(angle) * meleeRange;
        const attackY = this.player.y + (this.player.height / 2) + Math.sin(angle) * meleeRange;
        
        // Check for enemies in melee range
        for (const enemy of this.enemies) {
            const distance = this.getDistance(
                { x: attackX, y: attackY },
                { x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2 }
            );
            
            // If enemy is within melee range
            if (distance <= meleeRange) {
                // Calculate knockback direction (from player to enemy)
                const knockbackStrength = 50; // pixels to knockback - increased from 15
                const dx = (enemy.x + enemy.width / 2) - (this.player.x + this.player.width / 2);
                const dy = (enemy.y + enemy.height / 2) - (this.player.y + this.player.height / 2);
                const length = Math.sqrt(dx * dx + dy * dy);
                
                // Normalize and apply knockback
                const knockbackX = length > 0 ? (dx / length) * knockbackStrength : 0;
                const knockbackY = length > 0 ? (dy / length) * knockbackStrength : 0;
                
                enemy.takeDamage(this.player.attackPower, knockbackX, knockbackY);
                this.effects.push(new HitEffect(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                console.log('Melee hit enemy for', this.player.attackPower, 'damage with knockback');
            }
        }
        
        // Create visual effect for melee attack
        this.effects.push(new MeleeAttackEffect(attackX, attackY, angle));
    }
    
    useMagic() {
        if (this.player.mp >= 2) {
            this.player.mp -= 2;
            
            // Create heal effect for now
            this.player.hp = Math.min(this.player.hp + 5, this.player.maxHp);
            this.effects.push(new HealEffect(this.player.x, this.player.y));
            this.updateUI();
        }
    }
    
    checkCollisions() {
        // Player vs Enemies - check both types of invulnerability
        for (const enemy of this.enemies) {
            if (this.getDistance(this.player, enemy) < 24 && 
                !this.player.invulnerable && !this.player.dashInvulnerable) {
                this.player.takeDamage(enemy.damage);
                this.updateUI();
            }
        }
        
        // Projectiles vs Enemies
        for (const projectile of this.projectiles) {
            if (projectile.friendly) {
                for (const enemy of this.enemies) {
                    if (this.getDistance(projectile, enemy) < 20) {
                        // Calculate knockback direction (projectile direction)
                        const knockbackStrength = 35; // Stronger knockback for projectiles - increased from 20
                        const knockbackX = Math.cos(projectile.angle) * knockbackStrength;
                        const knockbackY = Math.sin(projectile.angle) * knockbackStrength;
                        
                        enemy.takeDamage(projectile.damage, knockbackX, knockbackY);
                        projectile.shouldRemove = true;
                        this.effects.push(new HitEffect(enemy.x, enemy.y));
                        console.log('Projectile hit enemy with knockback');
                        break;
                    }
                }
            }
        }
    }
    
    updateCamera() {
        // Check if level has custom camera behavior
        const levelConfigs = this.currentLevelObj?.canvasConfigs || {};
        
        // If level canvas size matches world size, use fixed camera (like village)
        if (levelConfigs.canvasWidth === levelConfigs.worldWidth && 
            levelConfigs.canvasHeight === levelConfigs.worldHeight) {
            // Fixed camera - show entire level
            this.camera.x = 0;
            this.camera.y = 0;
        } else {
            // Dynamic camera - center on player
            this.camera.x = this.player.x - this.width / 2;
            this.camera.y = this.player.y - this.height / 2;
            
            // Clamp camera to world bounds
            this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.width));
            this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.height));
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Save context for camera transformation
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw world background
        this.drawBackground();
        
        // Draw mountains (behind everything for proper layering)
        for (const mountain of this.mountains) {
            mountain.draw(this.ctx);
        }
        
        // Draw houses (village buildings)
        for (const house of this.houses) {
            house.draw(this.ctx);
        }
        
        // Draw walls (village borders)
        for (const wall of this.walls) {
            wall.draw(this.ctx);
        }
        
        // Draw trees (before other entities for proper layering)
        for (const tree of this.trees) {
            tree.draw(this.ctx);
        }
        
        // Draw stalactites (cave decorations)
        for (const stalactite of this.stalactites) {
            stalactite.draw(this.ctx);
        }
        
        // Draw items
        for (const item of this.items) {
            item.draw(this.ctx);
        }
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw projectiles
        for (const projectile of this.projectiles) {
            projectile.draw(this.ctx);
        }
        
        // Draw effects
        for (const effect of this.effects) {
            effect.draw(this.ctx);
        }
        
        // Restore context
        this.ctx.restore();
        
        // Draw charge indicator (after camera transformation)
        this.drawChargeIndicator();
    }
    
    drawChargeIndicator() {
        if (this.isCharging) {
            const chargeTime = this.gameTime - this.chargeStartTime;
            
            // Only show indicator after the delay
            if (chargeTime >= this.chargeIndicatorDelay) {
                const chargeProgress = Math.min(chargeTime / this.chargeRequiredTime, 1.0);
                
                // Draw charge bar at bottom of screen
                const barWidth = 200;
                const barHeight = 20;
                const barX = (this.width - barWidth) / 2;
                const barY = this.height - 40;
                
                // Background
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(barX, barY, barWidth, barHeight);
                
                // Border
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(barX, barY, barWidth, barHeight);
                
                // Charge progress
                const fillWidth = barWidth * chargeProgress;
                this.ctx.fillStyle = chargeProgress >= 1.0 ? '#00ff00' : '#ffff00';
                this.ctx.fillRect(barX, barY, fillWidth, barHeight);
                
                // Text
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '14px Courier New';
                this.ctx.textAlign = 'center';
                const text = chargeProgress >= 1.0 ? 'READY!' : 'Charging...';
                this.ctx.fillText(text, this.width / 2, barY - 5);
            }
        }
    }

    drawBackground() {
        // Get background colors from current level configuration
        const backgroundConfigs = this.currentLevelObj?.backgroundConfigs || {};
        let backgroundColor = backgroundConfigs.backgroundColor || '#2d5016'; // Default to forest green
        let accentColor = backgroundConfigs.accentColor || '#1a3009'; // Default to darker green
        
        // Draw background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);
        
        // Add some simple terrain details
        this.ctx.fillStyle = accentColor;
        for (let x = 0; x < this.worldWidth; x += 64) {
            for (let y = 0; y < this.worldHeight; y += 64) {
                if ((x + y) % 128 === 0) {
                    this.ctx.fillRect(x, y, 32, 32);
                }
            }
        }
    }
    
    updateUI() {
        document.getElementById('level').textContent = this.player.level;
        document.getElementById('currentArea').textContent = this.currentLevel;
        document.getElementById('hp').textContent = this.player.hp;
        document.getElementById('maxHp').textContent = this.player.maxHp;
        document.getElementById('mp').textContent = this.player.mp;
        document.getElementById('maxMp').textContent = this.player.maxMp;
        document.getElementById('exp').textContent = this.player.exp;
        document.getElementById('currentSword').textContent = this.player.currentSword;
        
        // Update HP bar
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        document.getElementById('hpFill').style.width = hpPercent + '%';
        
        // Update MP bar
        const mpPercent = (this.player.mp / this.player.maxMp) * 100;
        document.getElementById('mpFill').style.width = mpPercent + '%';
    }
    
    getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    toggleEnemyMovement() {
        this.enemiesCanMove = !this.enemiesCanMove;
        
        // Update button appearance
        const button = document.getElementById('toggleEnemiesBtn');
        if (this.enemiesCanMove) {
            button.textContent = 'Freeze Enemies';
            button.classList.remove('enemies-frozen');
        } else {
            button.textContent = 'Unfreeze Enemies';
            button.classList.add('enemies-frozen');
        }
        
        console.log(`Enemy movement ${this.enemiesCanMove ? 'enabled' : 'disabled'}`);
    }
    
    gameLoop() {
        // Normal game update only if not in editor mode
        if (!this.devMode.editorMode) {
            this.update();
        } else {
            // Limited update for editor (no player movement, frozen enemies)
            this.updateEditor();
        }
        
        this.render();
        
        // Render editor if active
        if (this.devMode.editorMode && this.devMode.levelEditor) {
            this.devMode.levelEditor.updateEditorCamera();
            this.devMode.levelEditor.renderEditor();
        }
        
        // Update dev panel if dev mode is enabled
        if (this.devMode.enabled) {
            this.devMode.updateDevPanel();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    updateEditor() {
        // Only update essential systems for editor
        this.gameTime += 1/60;
        
        // Update camera for editor (could be independent of game camera)
        this.updateCamera();
        
        // Update items (for visual feedback)
        this.items.forEach(item => item.update());
        
        // Update effects (so they can finish and be removed)
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.update();
            
            if (effect.shouldRemove) {
                this.effects.splice(i, 1);
            }
        }
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new CrystalisGame();
});
