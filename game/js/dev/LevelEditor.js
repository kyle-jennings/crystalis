// LevelEditor.js - Level editing functionality for Crystalis game
import Tree from '../classes/Tree.js';
import Mountain from '../classes/Mountain.js';
import House from '../classes/House.js';
import Wall from '../classes/Wall.js';
import Entry from '../classes/Entry.js';
import { ExperienceOrb } from '../classes/Item.js';

export default class LevelEditor {
  constructor(game) {
    this.game = game;
    this.enabled = false;
    this.selectedTool = 'tree';
    this.deleteMode = false; // New delete mode flag
    this.editorCanvas = null;
    this.editorCtx = null;
    this.editorCamera = { x: 0, y: 0 };
    
    // Available tools/objects
    this.availableObjects = {
      tree: { name: 'Tree', class: Tree, color: '#228B22' },
      mountain: { name: 'Mountain', class: Mountain, color: '#8B4513' },
      house: { name: 'House', class: House, color: '#CD853F' },
      wall: { name: 'Wall', class: Wall, color: '#696969' },
      entry: { name: 'Level Entry', class: Entry, color: '#00ff00' },
      item: { name: 'Experience Orb', class: ExperienceOrb, color: '#FFD700' },
    };
  }

  async initialize() {
    this.createEditorCanvas();
    this.setupEditorEventListeners();
    this.enabled = true;
    console.log('Level Editor initialized');


    // const editorPanelData = this.getEditorPanelHTML();
    // const { label, content } = editorPanelData;
    // const selectedTool = document.querySelector('.editor-tool-label span');
    // if (selectedTool) selectedTool.innerHTML = label;

    // const devPanel = document.getElementById('objectPalette');
    // if (devPanel) devPanel.innerHTML = content;
  }

  createEditorCanvas() {
    // Get current level canvas dimensions
    const gameCanvas = this.game.canvas;

    // Create or get editor canvas
    this.editorCanvas = document.getElementById('editorCanvas');
    if (!this.editorCanvas) {
      console.error('Editor canvas not found in DOM');
      return;
    }

    this.editorCtx = this.editorCanvas.getContext('2d');
    console.log(gameCanvas.width);
    console.log(gameCanvas.height);
    // Match game canvas size
    this.editorCanvas.width = gameCanvas.width;
    this.editorCanvas.height = gameCanvas.height;

    // Sync editor camera with game camera initially
    this.editorCamera.x = this.game.camera.x;
    this.editorCamera.y = this.game.camera.y;

    // Show editor container
    const editorContainer = document.getElementById('editorContainer');
    if (editorContainer) {
      editorContainer.style.display = 'block';
    }

    console.log('Editor canvas created with size:', this.editorCanvas.width, 'x', this.editorCanvas.height);
  }

  setupEditorEventListeners() {
    if (!this.editorCanvas) return;

    this.editorCanvas.addEventListener('click', (e) => {
      const rect = this.editorCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left + this.editorCamera.x;
      const y = e.clientY - rect.top + this.editorCamera.y;

      // First check if we clicked on an existing object
      const clickedObject = this.getObjectAtPosition(x, y);
      if (clickedObject && typeof window !== 'undefined' && window.devPanelHandleObjectClick) {
        // Call the DevPanel function to populate the form
        window.devPanelHandleObjectClick(clickedObject);
        return;
      }

      // If no object was clicked, proceed with normal placement/deletion
      if (this.deleteMode) {
        this.removeObject(x, y);
      } else {
        this.placeObject(x, y);
      }
    });

    this.editorCanvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const rect = this.editorCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left + this.editorCamera.x;
      const y = e.clientY - rect.top + this.editorCamera.y;

      this.removeObject(x, y);
    });

    console.log('Editor event listeners set up');
  }

  placeObject(x, y) {
    const objectType = this.availableObjects[this.selectedTool];
    if (!objectType) return;

    // Create new object based on selected tool
    switch (this.selectedTool) {
      case 'tree':
        this.game.trees.push(new Tree(x, y));
        break;
      case 'mountain':
        this.game.mountains.push(new Mountain(x, y));
        break;
      case 'house':
        this.game.houses.push(new House(x, y, 'normal'));
        break;
      case 'wall':
        this.game.walls.push(new Wall(x, y, 32, 32, false));
        break;
      case 'entry':
        this.game.entries.push(new Entry(x, y, 32, 32, 2)); // Default to level 2
        break;
      case 'item':
        this.game.items.push(new ExperienceOrb(x, y, 5));
        break;
    }

    console.log(`Placed ${objectType.name} at (${Math.round(x)}, ${Math.round(y)})`);
  }

  getObjectAtPosition(x, y) {
    const clickDistance = 20; // Distance threshold for clicking

    // Check each object type for clicks
    const objectArrays = [
      { array: this.game.trees, name: 'tree' },
      { array: this.game.mountains, name: 'mountain' },
      { array: this.game.houses, name: 'house' },
      { array: this.game.walls, name: 'wall' },
      { array: this.game.entries, name: 'entry' },
      { array: this.game.items, name: 'item' },
    ];

    for (const { array, name } of objectArrays) {
      for (const obj of array) {
        // Check if click is within object bounds or within click distance
        let isWithinObject = false;
        
        if (obj.width && obj.height) {
          // For objects with defined width/height, check if click is within bounds
          isWithinObject = x >= obj.x && x <= obj.x + obj.width && 
                          y >= obj.y && y <= obj.y + obj.height;
        } else {
          // For objects without defined bounds, use distance threshold
          const distance = Math.sqrt((obj.x - x) ** 2 + (obj.y - y) ** 2);
          isWithinObject = distance <= clickDistance;
        }

        if (isWithinObject) {
          // Return a copy of the object with its type for the DevPanel
          return {
            ...obj,
            type: name
          };
        }
      }
    }

    return null; // No object found at this position
  }

  removeObject(x, y) {
    const removalDistance = 20; // Distance threshold for removal

    // Check each object type for removal
    const objectArrays = [
      { array: this.game.trees, name: 'tree' },
      { array: this.game.mountains, name: 'mountain' },
      { array: this.game.houses, name: 'house' },
      { array: this.game.walls, name: 'wall' },
      { array: this.game.entries, name: 'entry' },
      { array: this.game.items, name: 'item' },
    ];

    for (const { array, name } of objectArrays) {
      for (let i = array.length - 1; i >= 0; i--) {
        const obj = array[i];
        const distance = Math.sqrt((obj.x - x) ** 2 + (obj.y - y) ** 2);

        if (distance <= removalDistance) {
          array.splice(i, 1);
          console.log(`Removed ${name} at (${Math.round(obj.x)}, ${Math.round(obj.y)})`);
          return; // Remove only one object per click
        }
      }
    }
  }

  setSelectedTool(key) {
    if (this.availableObjects[key]) {
      this.selectedTool = key;
      console.log(`Selected tool: ${this.availableObjects[key].name}`);

      // Update visual selection state
      // First, remove 'selected' class from all tool buttons
      const allToolButtons = document.querySelectorAll('[data-tool-btn]');
      allToolButtons.forEach((btn) => {
        btn.classList.remove('selected');
      });

      // Then add 'selected' class to the current tool button
      const selectedToolButton = document.querySelector(`[data-tool-btn="${key}"]`);
      if (selectedToolButton) {
        selectedToolButton.classList.add('selected');
      }
    }
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    console.log(`Delete mode: ${this.deleteMode ? 'ON' : 'OFF'}`);

    // Update delete button visual state
    const deleteButton = document.querySelector('[data-delete-btn]');
    if (deleteButton) {
      if (this.deleteMode) {
        deleteButton.classList.add('is-danger', 'is-active');
        deleteButton.textContent = 'Exit Delete Mode';
      } else {
        deleteButton.classList.remove('is-danger', 'is-active');
        deleteButton.textContent = 'Delete Mode';
      }
    }

    // Update cursor style for editor canvas
    if (this.editorCanvas) {
      this.editorCanvas.style.cursor = this.deleteMode ? 'crosshair' : 'default';
    }

    return this.deleteMode;
  }

  renderEditor() {
    if (!this.enabled || !this.editorCanvas) return;

    // Clear canvas
    this.editorCtx.clearRect(0, 0, this.editorCanvas.width, this.editorCanvas.height);

    // Apply camera transformation
    this.editorCtx.save();
    this.editorCtx.translate(-this.editorCamera.x, -this.editorCamera.y);

    // Draw background (same as game)
    this.drawEditorBackground();

    // Draw all level objects (no player, no effects, frozen enemies)
    this.drawLevelObjects();

    // Draw editor-specific overlays
    this.drawEditorOverlays();

    this.editorCtx.restore();
  }

  drawEditorBackground() {
    // Get background colors from current level configuration
    const backgroundConfigs = this.game.currentLevelObj?.backgroundConfigs || {};
    const backgroundColor = backgroundConfigs.backgroundColor || '#2d5016';
    const accentColor = backgroundConfigs.accentColor || '#1a3009';

    // Draw background
    this.editorCtx.fillStyle = backgroundColor;
    this.editorCtx.fillRect(0, 0, this.game.worldWidth, this.game.worldHeight);

    // Add terrain details
    this.editorCtx.fillStyle = accentColor;
    for (let x = 0; x < this.game.worldWidth; x += 64) {
      for (let y = 0; y < this.game.worldHeight; y += 64) {
        if ((x + y) % 128 === 0) {
          this.editorCtx.fillRect(x, y, 32, 32);
        }
      }
    }
  }

  drawLevelObjects() {
    const { game } = this;

    // Draw static objects in proper order
    game.mountains.forEach((mountain) => {
      mountain.draw(this.editorCtx);
      this.drawSelectionBox(mountain, '#8B4513');
    });

    game.houses.forEach((house) => {
      house.draw(this.editorCtx);
      this.drawSelectionBox(house, '#CD853F');
    });

    game.walls.forEach((wall) => {
      wall.draw(this.editorCtx);
      this.drawSelectionBox(wall, '#696969');
    });

    game.trees.forEach((tree) => {
      tree.draw(this.editorCtx);
      this.drawSelectionBox(tree, '#228B22');
    });

    game.stalactites.forEach((stalactite) => {
      stalactite.draw(this.editorCtx);
      this.drawSelectionBox(stalactite, '#666666');
    });

    // Draw entries (invisible in game, bright green in editor)
    game.entries.forEach((entry) => {
      entry.draw(this.editorCtx, true); // Pass true for editor mode
      this.drawSelectionBox(entry, '#00ff00');
    });

    // Draw items
    game.items.forEach((item) => {
      item.draw(this.editorCtx);
      this.drawSelectionBox(item, '#FFD700');
    });

    // Draw frozen enemies (no animation updates)
    game.enemies.forEach((enemy) => {
      enemy.draw(this.editorCtx);
      this.drawSelectionBox(enemy, '#FF0000');
    });
  }

  drawSelectionBox(obj, color) {
    // Draw a subtle selection box around objects for easier identification
    this.editorCtx.strokeStyle = color;
    this.editorCtx.globalAlpha = 0.5;
    this.editorCtx.lineWidth = 1;
    this.editorCtx.strokeRect(obj.x - 2, obj.y - 2, (obj.width || 16) + 4, (obj.height || 16) + 4);
    this.editorCtx.globalAlpha = 1.0;
  }

  drawEditorOverlays() {
    // Draw grid for easier placement
    this.drawGrid();

    // Draw cursor indicator
    // This would need mouse position tracking to implement
  }

  drawGrid() {
    this.editorCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.editorCtx.lineWidth = 0.5;

    const gridSize = 32;

    // Vertical lines
    for (let x = 0; x <= this.game.worldWidth; x += gridSize) {
      this.editorCtx.beginPath();
      this.editorCtx.moveTo(x, 0);
      this.editorCtx.lineTo(x, this.game.worldHeight);
      this.editorCtx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.game.worldHeight; y += gridSize) {
      this.editorCtx.beginPath();
      this.editorCtx.moveTo(0, y);
      this.editorCtx.lineTo(this.game.worldWidth, y);
      this.editorCtx.stroke();
    }
  }

  updateEditorCamera() {
    // For now, sync with game camera
    // Later we can make this independent
    this.editorCamera.x = this.game.camera.x;
    this.editorCamera.y = this.game.camera.y;
  }

  exportLevel() {
    const levelData = {
      canvasConfigs: this.game.currentLevelObj.canvasConfigs,
      backgroundConfigs: this.game.currentLevelObj.backgroundConfigs,
      trees: this.game.trees.map((tree) => ({ x: tree.x, y: tree.y })),
      mountains: this.game.mountains.map((m) => ({
        x: m.x,
        y: m.y,
        hasPortal: m.hasPortal || false,
        portalDestination: m.portalDestination || null,
      })),
      houses: this.game.houses.map((h) => ({
        x: h.x,
        y: h.y,
        type: h.type || 'normal',
        name: h.name || 'House',
      })),
      walls: this.game.walls.map((w) => ({
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        isOpening: w.isOpening || false,
      })),
      entries: this.game.entries.map((e) => e.getExportData()),
      items: this.game.items.map((i) => ({
        x: i.x,
        y: i.y,
        type: i.constructor.name,
        value: i.expValue || 5,
      })),
    };

    // Convert to JSON and download
    const dataStr = JSON.stringify(levelData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `level-${this.game.currentLevel}-edited.json`;
    link.click();

    console.log('Level exported successfully');
  }

  destroy() {
    // Clean up editor
    const editorContainer = document.getElementById('editorContainer');
    if (editorContainer) {
      editorContainer.style.display = 'none';
    }

    this.enabled = false;
    console.log('Level Editor destroyed');
  }

  getEditorPanelHTML() {
    return {
      label: this.selectedTool,
      content: this.getObjectPaletteHTML(),
    };
  }

  getObjectPaletteHTML() {
    const tools = this.availableObjects;

    return Object.entries(tools).map(([key, obj]) => `
      <option value="${key}" >
        ${obj.name}
      </option>
    `).join('');
  }


  toggleLevelEditor() {
    this.enabled = !this.enabled;
    const $elm = document.getElementById('level-editor');
    if (!$elm) return;

    if (!this.enabled) {
      console.log('activating level editor...');
      $elm.classList.add('active');
    } else {
      console.log('deactivating level editor...');
      $elm.classList.remove('active');
      return;
    }
  }

}
