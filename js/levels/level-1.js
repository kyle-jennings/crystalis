// Level 1 - First Area
import { Slime, Ant } from '../Enemy.js';
import { ExperienceOrb } from '../Item.js';
import Tree from '../Tree.js';
import Mountain from '../Mountain.js';

export function initializeLevel1(game) {
    // Clear existing entities
    game.enemies = [];
    game.items = [];
    game.trees = [];
    game.mountains = [];
    game.stalactites = [];
    
    // Add some basic enemies in the starting area (keep these near spawn)
    game.enemies.push(new Slime(300, 300));
    game.enemies.push(new Slime(200, 250));
    game.enemies.push(new Ant(400, 350));
    game.enemies.push(new Ant(150, 400));
    
    // Add some items/experience orbs scattered across the map
    game.items.push(new ExperienceOrb(180, 200, 5));
    game.items.push(new ExperienceOrb(350, 280, 5));
    game.items.push(new ExperienceOrb(750, 150, 5)); // Far right
    game.items.push(new ExperienceOrb(900, 600, 5)); // Far bottom right
    game.items.push(new ExperienceOrb(100, 650, 5)); // Far bottom left
    
    // Add trees scattered across the entire map (1024x768)
    // Starting area trees
    game.trees.push(new Tree(100, 100));
    game.trees.push(new Tree(200, 150));
    game.trees.push(new Tree(350, 120));
    game.trees.push(new Tree(450, 200));
    game.trees.push(new Tree(150, 300));
    
    // Middle area trees
    game.trees.push(new Tree(600, 250));
    game.trees.push(new Tree(750, 180));
    game.trees.push(new Tree(520, 400));
    game.trees.push(new Tree(680, 350));
    game.trees.push(new Tree(800, 300));
    
    // Right side trees
    game.trees.push(new Tree(900, 150));
    game.trees.push(new Tree(950, 400));
    game.trees.push(new Tree(850, 500));
    
    // Bottom area trees
    game.trees.push(new Tree(300, 600));
    game.trees.push(new Tree(500, 650));
    game.trees.push(new Tree(700, 600));
    game.trees.push(new Tree(50, 550));
    game.trees.push(new Tree(150, 700));
    
    // Top area trees
    game.trees.push(new Tree(600, 80));
    game.trees.push(new Tree(800, 50));
    game.trees.push(new Tree(400, 50));
    
    // Left side trees
    game.trees.push(new Tree(50, 200));
    game.trees.push(new Tree(80, 350));
    game.trees.push(new Tree(30, 450));
    
    // Add mountains in various areas (not just lower right)
    game.mountains.push(new Mountain(750, 500)); // Lower right area
    game.mountains.push(new Mountain(100, 50));  // Upper left area
    game.mountains.push(new Mountain(850, 100)); // Upper right area
    game.mountains.push(new Mountain(300, 650, true, 2)); // Lower middle - PORTAL TO LEVEL 2
}
