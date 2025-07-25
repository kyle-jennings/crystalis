import { ref, computed } from 'vue';
import Tree from '@game/js/classes/Tree.js';
import Mountain from '@game/js/classes/Mountain.js';
import House from '@game/js/classes/House.js';
import Wall from '@game/js/classes/Wall.js';
import Entry from '@game/js/classes/Entry.js';
import ExperienceOrb from '@game/js/classes/ExperienceOrb.js';

type ToolKey = 'tree' | 'mountain' | 'house' | 'wall' | 'entry' | 'item';

export default function useLevelEditor(game: any) {
  // Reactive state
  const enabled = ref(false);
  const selectedTool = ref<ToolKey>('tree');
  const deleteMode = ref(false);

  // Available tools/objects with their constructor arguments
  const availableObjects: Record<ToolKey, { name: string; class: any; color: string; args: ToolArg[] }> = {
    tree: {
      name: 'Tree',
      class: Tree,
      color: '#228B22',
      args: [
        { name: 'x', type: 'number', required: true },
        { name: 'y', type: 'number', required: true },
      ],
    },
    mountain: {
      name: 'Mountain',
      class: Mountain,
      color: '#8B4513',
      args: [
        { name: 'x', type: 'number', required: true },
        { name: 'y', type: 'number', required: true },
        {
          name: 'hasCaveOpening',
          type: 'boolean',
          default: false,
          required: false,
        },
        {
          name: 'caveOpeningDestination',
          type: 'number',
          default: null,
          required: false,
        },
      ],
    },
    house: {
      name: 'House',
      class: House,
      color: '#CD853F',
      args: [
        { name: 'x', type: 'number', required: true },
        { name: 'y', type: 'number', required: true },
        {
          name: 'style',
          type: 'select',
          default: 'normal',
          required: false,
          options: ['normal', 'shop', 'inn', 'temple'],
        },
      ],
    },
    wall: {
      name: 'Wall',
      class: Wall,
      color: '#696969',
      args: [
        { name: 'x', type: 'number', required: true },
        { name: 'y', type: 'number', required: true },
        { name: 'width', type: 'number', required: true },
        { name: 'height', type: 'number', required: true },
        {
          name: 'isOpening',
          type: 'boolean',
          default: false,
          required: false,
        },
      ],
    },
    entry: {
      name: 'Level Entry',
      class: Entry,
      color: '#00ff00',
      args: [
        { name: 'x', type: 'number', required: true },
        { name: 'y', type: 'number', required: true },
        {
          name: 'width',
          type: 'number',
          default: 32,
          required: false,
        },
        {
          name: 'height',
          type: 'number',
          default: 32,
          required: false,
        },
        {
          name: 'destinationLevel',
          type: 'number',
          default: 1,
          required: false,
        },
        {
          name: 'destinationX',
          type: 'number',
          default: null,
          required: false,
        },
        {
          name: 'destinationY',
          type: 'number',
          default: null,
          required: false,
        },
      ],
    },
    item: {
      name: 'Experience Orb',
      class: ExperienceOrb,
      color: '#FFD700',
      args: [
        { name: 'x', type: 'number', required: true },
        { name: 'y', type: 'number', required: true },
        { name: 'value', type: 'number', required: true },
      ],
    },
  };

  // Computed properties
  const currentTool = computed(() => availableObjects[selectedTool.value]);

  // Core methods
  const setSelectedTool = (key: string) => {
    if (key in availableObjects) {
      selectedTool.value = key as ToolKey;
    }
  };

  const toggleDeleteMode = () => {
    deleteMode.value = !deleteMode.value;
    return deleteMode.value;
  };

  const initialize = async () => {
    enabled.value = true;
  };

  const destroy = () => {
    enabled.value = false;
  };

  const exportLevel = () => {
    const levelData = {
      canvasConfigs: game.currentLevelObj.canvasConfigs,
      backgroundConfigs: game.currentLevelObj.backgroundConfigs,
      trees: game.trees.map((tree: any) => ({ x: tree.x, y: tree.y })),
      mountains: game.mountains.map((m: any) => ({
        x: m.x,
        y: m.y,
        hasPortal: m.hasPortal || false,
        portalDestination: m.portalDestination || null,
      })),
      houses: game.houses.map((h: any) => ({
        x: h.x,
        y: h.y,
        type: h.type || 'normal',
        name: h.name || 'House',
      })),
      walls: game.walls.map((w: any) => ({
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        isOpening: w.isOpening || false,
      })),
      entries: game.entries.map((e: any) => e.getExportData()),
      items: game.items.map((i: any) => ({
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
    link.download = `level-${game.currentLevel}-edited.json`;
    link.click();
  };

  // Return the composable API
  return {
    // State
    enabled,
    selectedTool,
    deleteMode,
    availableObjects,

    // Computed
    currentTool,

    // Methods
    initialize,
    setSelectedTool,
    toggleDeleteMode,
    exportLevel,
    destroy,
  };
}
