// Level 2 - Cave Area
import { Slime, Ant } from '../Enemy.js';
import { ExperienceOrb } from '../Item.js';
import Tree from '../Tree.js';
import Mountain from '../Mountain.js';
import Stalactite from '../Stalactite.js';

export function initializeLevel2(game) {
    // Clear existing entities
    game.enemies = [];
    game.items = [];
    game.trees = [];
    game.mountains = [];
    game.stalactites = [];
    
    // Cave-themed enemies (more numerous and aggressive)
    // Cave entrance area enemies
    game.enemies.push(new Slime(200, 300));
    game.enemies.push(new Slime(350, 250));
    game.enemies.push(new Ant(400, 400));
    game.enemies.push(new Ant(150, 350));
    
    // Deeper cave enemies
    game.enemies.push(new Slime(600, 200));
    game.enemies.push(new Slime(750, 350));
    game.enemies.push(new Ant(500, 500));
    game.enemies.push(new Ant(800, 450));
    game.enemies.push(new Slime(900, 250));
    
    // Cave tunnels enemies
    game.enemies.push(new Ant(300, 600));
    game.enemies.push(new Slime(450, 650));
    game.enemies.push(new Ant(700, 600));
    
    // Experience orbs scattered throughout cave
    game.items.push(new ExperienceOrb(180, 180, 8)); // Higher value in caves
    game.items.push(new ExperienceOrb(450, 300, 8));
    game.items.push(new ExperienceOrb(700, 200, 10)); // Rare find
    game.items.push(new ExperienceOrb(850, 400, 8));
    game.items.push(new ExperienceOrb(300, 550, 8));
    game.items.push(new ExperienceOrb(600, 650, 10)); // Deep cave treasure
    game.items.push(new ExperienceOrb(100, 400, 8));
    
    // Cave "mountains" - these represent large rock formations/cave walls
    // Major cave chambers separated by rock walls
    game.mountains.push(new Mountain(150, 50));  // North chamber wall
    game.mountains.push(new Mountain(700, 80));  // Northeast wall
    game.mountains.push(new Mountain(50, 450));  // West wall
    game.mountains.push(new Mountain(850, 350)); // East wall
    game.mountains.push(new Mountain(400, 500, true, 1)); // Central cave formation - PORTAL BACK TO LEVEL 1
    
    // Stalactites and Stalagmites - Cave atmosphere and minor obstacles
    // Entry chamber stalactites
    game.stalactites.push(new Stalactite(120, 100, true));  // Stalactite (hanging)
    game.stalactites.push(new Stalactite(180, 150, false)); // Stalagmite (floor)
    game.stalactites.push(new Stalactite(280, 80, true));   // Stalactite
    game.stalactites.push(new Stalactite(320, 200, false)); // Stalagmite
    
    // Main chamber stalactites
    game.stalactites.push(new Stalactite(450, 120, true));  // Stalactite
    game.stalactites.push(new Stalactite(480, 350, false)); // Stalagmite
    game.stalactites.push(new Stalactite(550, 180, true));  // Stalactite
    game.stalactites.push(new Stalactite(620, 300, false)); // Stalagmite
    
    // Deep cave stalactites
    game.stalactites.push(new Stalactite(750, 200, true));  // Stalactite
    game.stalactites.push(new Stalactite(780, 280, false)); // Stalagmite
    game.stalactites.push(new Stalactite(850, 150, true));  // Stalactite
    game.stalactites.push(new Stalactite(920, 250, false)); // Stalagmite
    
    // Lower tunnel stalactites
    game.stalactites.push(new Stalactite(200, 580, true));  // Stalactite
    game.stalactites.push(new Stalactite(250, 620, false)); // Stalagmite
    game.stalactites.push(new Stalactite(380, 570, true));  // Stalactite
    game.stalactites.push(new Stalactite(650, 590, true));  // Stalactite
    game.stalactites.push(new Stalactite(720, 630, false)); // Stalagmite
}
