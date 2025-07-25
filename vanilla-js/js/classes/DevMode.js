// DevMode.js - Encapsulates all developer mode functionality
import LevelEditor from './LevelEditor.js';

export default class DevMode {
  constructor(game) {
    this.game = game;
    this.isEnabled = false;
    this.godMode = false;
    this.levelEditor = null;
    this.editorMode = false;
    this.currentTab = 'debug'; // 'debug' or 'editor'
  }

  async initialize() {
    try {
      const response = await fetch('./.devmode');
      if (response.ok) {
        this.isEnabled = true;
        console.log('🔧 Developer mode enabled - .devmode file detected');
        this.setupDevMode();
      }
    } catch (error) {
      // .devmode file doesn't exist or can't be accessed
      this.isEnabled = false;
      console.log('🎮 Running in normal mode');
    }
  }

  setupDevMode() {
    if (!this.isEnabled) return;

    this.addDevModeIndicator();
    this.showDevControls();
    this.showDevPanel();
  }

  addDevModeIndicator() {
    // Create dev mode indicator in the UI
    const devIndicator = document.createElement('div');
    devIndicator.id = 'devModeIndicator';
    devIndicator.textContent = 'DEV MODE';
    devIndicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ff4444;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
            border: 2px solid #cc0000;
        `;
    document.body.appendChild(devIndicator);
  }

  showDevControls() {
    // Show dev mode controls in instructions
    const devControls = document.getElementById('devControls');
    if (devControls) {
      devControls.style.display = 'block';
    }
  }

  showDevPanel() {
    // Show dev panel
    const devPanel = document.getElementById('devPanel');
    if (devPanel) {
      devPanel.style.display = 'block';
    }
  }

  handleKeyInput(keyCode) {
    if (!this.isEnabled) return false;

    switch (keyCode) {
      case 'KeyG': // G key for god mode
        this.toggleGodMode();
        return true;
      case 'KeyL': // L key for level debug info
        this.logLevelDebugInfo();
        return true;
      case 'KeyE': // E key for level editor
        this.toggleLevelEditor();
        return true;
      default:
        return false;
    }
  }

  toggleLevelEditor() {
    console.log(`toggleLevelEditor called, current editorMode: ${this.editorMode}`);
    this.editorMode = !this.editorMode;

    if (this.editorMode) {
      console.log('Initializing level editor...');
      this.initializeLevelEditor();
    } else {
      console.log('Destroying level editor...');
      this.destroyLevelEditor();
    }

    console.log(`Level Editor: ${this.editorMode ? 'ON' : 'OFF'}`);
  }

  initializeLevelEditor() {
    console.log('initializeLevelEditor called');
    if (!this.levelEditor) {
      console.log('Creating new LevelEditor instance');
      this.levelEditor = new LevelEditor(this.game);
    }
    console.log('Calling levelEditor.initialize()');
    this.levelEditor.initialize();
  }

  destroyLevelEditor() {
    console.log('destroyLevelEditor called');
    if (this.levelEditor) {
      this.levelEditor.destroy();
    }
  }

  switchTab(tabName) {
    console.log(`switchTab called with: ${tabName}, current tab: ${this.currentTab}`);

    if (tabName === this.currentTab) {
      console.log('Already on this tab, no change needed');
      return;
    }

    this.currentTab = tabName;

    if (tabName === 'editor') {
      console.log('Switching to editor tab, enabling editor mode');
      if (!this.editorMode) {
        this.editorMode = true;
        this.initializeLevelEditor();
      }
    } else if (tabName === 'debug') {
      console.log('Switching to debug tab, disabling editor mode');
      if (this.editorMode) {
        this.editorMode = false;
        this.destroyLevelEditor();
      }
    }

    this.updateUI();
    console.log(`Tab switched to: ${this.currentTab}, editor mode: ${this.editorMode}`);
  }

  toggleGodMode() {
    if (!this.isEnabled) return;

    this.godMode = !this.godMode;
    this.game.player.invulnerable = this.godMode;
    console.log(`God Mode: ${this.godMode ? 'ON' : 'OFF'}`);

    // Visual feedback
    const indicator = document.getElementById('devModeIndicator');
    if (indicator) {
      indicator.textContent = this.godMode ? 'DEV MODE - GOD' : 'DEV MODE';
      indicator.style.background = this.godMode ? '#44ff44' : '#ff4444';
    }
  }

  logLevelDebugInfo() {
    if (!this.isEnabled) return;

    console.log('=== LEVEL DEBUG INFO ===');
    console.log('Current Level:', this.game.currentLevel);
    console.log('Level Object:', this.game.currentLevelObj);
    console.log('Canvas Config:', this.game.currentLevelObj?.canvasConfigs);
    console.log('Background Config:', this.game.currentLevelObj?.backgroundConfigs);
    console.log('Player Position:', { x: this.game.player.x, y: this.game.player.y });
    console.log('Camera Position:', this.game.camera);
    console.log('Entities Count:', {
      enemies: this.game.enemies.length,
      items: this.game.items.length,
      trees: this.game.trees.length,
      mountains: this.game.mountains.length,
      stalactites: this.game.stalactites.length,
      houses: this.game.houses.length,
      walls: this.game.walls.length,
    });
    console.log('========================');
  }

  // Method to add more dev information to the dev panel
  updateDevPanel() {
    if (!this.isEnabled) return;

    const devPanel = document.getElementById('devPanel-tab-content');
    if (!devPanel) return;

    getDebugPanelHTML();
    getEditorPanelHTML();
  }

  getDebugPanelHTML() {
    // Get canvas configs from current level
    const canvasConfigs = this.game.currentLevelObj?.canvasConfigs || {};

    return `
            <h3 style="margin: 0 0 10px 0; color: #ff4444;">Debug Info</h3>
            
            <div style="margin-bottom: 5px;"><strong>Player Position:</strong></div>
            <div style="margin-left: 10px; margin-bottom: 8px;">
                X: ${Math.round(this.game.player.x)} | Y: ${Math.round(this.game.player.y)}
            </div>
            
            <div style="margin-bottom: 5px;"><strong>Canvas Details:</strong></div>
            <div style="margin-left: 10px; margin-bottom: 8px;">
                Canvas: ${canvasConfigs.canvasWidth || 'default'} x ${canvasConfigs.canvasHeight || 'default'}<br>
                Width: ${canvasConfigs.width || this.game.width} | Height: ${canvasConfigs.height || this.game.height}<br>
                World: ${canvasConfigs.worldWidth || this.game.worldWidth} x ${canvasConfigs.worldHeight || this.game.worldHeight}
            </div>
            
            <div>Level: ${this.game.currentLevel}</div>
            <div>Camera: (${Math.round(this.game.camera.x)}, ${Math.round(this.game.camera.y)})</div>
            <div>God Mode: ${this.godMode ? 'ON' : 'OFF'}</div>
            <div>Enemies: ${this.game.enemies.length}</div>
            <div>Items: ${this.game.items.length}</div>
            
            <div style="margin-top: 10px; font-size: 10px;">
                <div>Hotkeys: G=God Mode, L=Log Info, E=Editor</div>
            </div>
        `;
  }

  getEditorPanelHTML() {
    const selectedTool = this.levelEditor?.selectedTool || 'tree';

    return {
      label: selectedTool,
      content: this.getObjectPaletteHTML(),
    };
  }

  getObjectPaletteHTML() {
    if (!this.levelEditor) return '';

    const tools = this.levelEditor.availableObjects;
    const { selectedTool } = this.levelEditor;

    return Object.entries(tools).map(([key, obj]) => `
            <button onclick="window.game.devMode.levelEditor?.setSelectedTool('${key}')" 
                    style="padding: 10px; background: ${selectedTool === key ? '#0066cc' : '#444'}; 
                           color: white; border: 2px solid ${selectedTool === key ? '#0af' : 'transparent'}; 
                           cursor: pointer; font-size: 10px;">
                <div style="width: 16px; height: 16px; background: ${obj.color}; margin: 0 auto 4px;"></div>
                ${obj.name}
            </button>
        `).join('');
  }

  // Helper method to check if dev mode is enabled
  get enabled() {
    return this.isEnabled;
  }
}
