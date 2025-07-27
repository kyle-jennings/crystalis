import {
  ref,
  computed,
  watch,
} from 'vue';
import { defineStore } from 'pinia';
import LevelEditor from '@/game/js/LevelEditor';

export default defineStore(
  'levelEditor',
  () => {
  // State (using refs for reactivity)
    const selectedLevel = ref(1);
    const selectedEntity = ref(null);
    const gameInstance = ref(null);
    const selectedTool = ref(null);
    const toolSettings = ref({});
    const jsonSettings = ref({});

    // Level settings state
    const levelSettings = ref({
      width: 1024,
      height: 768,
      backgroundColor: '#2c3e50',
      cameraWidth: 800,
      cameraHeight: 600,
    });

    // Computed properties
    const availableLevels = computed(() => [
      { value: 1, label: 'Level 1' },
      { value: 2, label: 'Level 2' },
      { value: 3, label: 'Level 3' },
    ]);

    // Actions
    const setSelectedLevel = (levelNumber) => {
    // Only change level if it's actually different
      if (selectedLevel.value === levelNumber) {
        return;
      }

      selectedLevel.value = levelNumber;
      // if (gameInstance.value?.loadLevel) {
      //   gameInstance.value.loadLevel(levelNumber);
      // }
    };

    const setSelectedEntity = (entity) => {
      selectedEntity.value = entity;
      // Make sure this doesn't trigger any level loading
    };

    const initializeEditor = (gameConfig) => {
      gameInstance.value = new LevelEditor(gameConfig);
      // Pass the setter to game for click handling
      gameInstance.value.setSelectedEntity = setSelectedEntity;
      window.game = gameInstance.value;
    };

    const updateLevelSettings = (newSettings) => {
      Object.assign(levelSettings.value, newSettings);
      // Apply settings to game instance if needed
      if (gameInstance.value) {
      // Update game canvas dimensions, etc.
      // You can add specific game instance updates here
      }
    };

    const setSelectedTool = (tool) => {
      selectedTool.value = tool;
    };

    const updateToolSettings = (settings) => {
      toolSettings.value = { ...toolSettings.value, ...settings };
    };

    const clearSelectedEntity = () => {
      selectedEntity.value = null;
    };

    const logGameInstance = () => {
      /* eslint-disable no-console */
      if (window.game) {
        const levelSettingsLocal = {
          worldWidth: window.game.Level.worldWidth,
          worldHeight: window.game.Level.worldHeight,
          canvasWidth: window.game.Level.canvasWidth,
          canvasHeight: window.game.Level.canvasHeight,
          playerX: window.game.Level.playerX,
          playerY: window.game.Level.playerY,
          backgroundColor: window.game.Level.backgroundColor,
          houses: window.game.houses?.length || 0,
          walls: window.game.walls || [],
          trees: window.game.trees || [],
          mountains: window.game.mountains || [],
          stalactites: window.game.stalactites || [],
          caves: window.game.caves || [],
          entries: window.game.entries || [],
        };
        jsonSettings.value = levelSettingsLocal;
        console.log('LevelBuilder settings:', levelSettingsLocal);
      }
      /* eslint-enable no-console */
    };

    // Watchers
    watch(selectedLevel, (newLevel, oldLevel) => {
      // Only load level if it's actually different and we have a game instance
      if (gameInstance.value && gameInstance.value.loadLevel && newLevel !== oldLevel) {
        gameInstance.value.loadLevel(newLevel);
      }
    });

    // Return all state and actions
    return {
    // State
      jsonSettings,
      selectedLevel,
      selectedEntity,
      gameInstance,
      selectedTool,
      toolSettings,
      levelSettings,
      // Computed
      availableLevels,
      // Actions
      setSelectedLevel,
      setSelectedEntity,
      initializeEditor,
      updateLevelSettings,
      setSelectedTool,
      updateToolSettings,
      clearSelectedEntity,
      logGameInstance,
    };
  },
);
