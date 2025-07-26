// First Area
// canvas configuration (default size)
export const canvasConfigs = {
  canvasWidth: 540,
  canvasHeight: 566,
  width: 540,
  height: 566,
  worldWidth: 1024,
  worldHeight: 768,
  playerX: 256,
  playerY: 400,
  backgroundColor: '#2d5016', // Forest green
  accentColor: '#1a3009', // Darker green
  theme: 'forest',
};

// Starting area enemy configurations
export const enemyConfigs = [
  {
    type: 'Slime', x: 300, y: 300, area: 'Starting area',
  },
  {
    type: 'Slime', x: 200, y: 250, area: 'Starting area',
  },
  {
    type: 'Ant', x: 400, y: 350, area: 'Starting area',
  },
  {
    type: 'Ant', x: 150, y: 400, area: 'Starting area',
  },
];

// Item configurations (experience orbs scattered across map)
export const itemConfigs = [
  {
    x: 180, y: 200, value: 5, description: 'Starting area',
  },
  {
    x: 350, y: 280, value: 5, description: 'Starting area',
  },
  {
    x: 750, y: 150, value: 5, description: 'Far right',
  },
  {
    x: 900, y: 600, value: 5, description: 'Far bottom right',
  },
  {
    x: 100, y: 650, value: 5, description: 'Far bottom left',
  },
];

// Tree configurations (scattered across entire 1024x768 map)
export const treeConfigs = [
  // Starting area trees
  { x: 100, y: 100, area: 'Starting area' },
  { x: 200, y: 150, area: 'Starting area' },
  { x: 350, y: 120, area: 'Starting area' },
  { x: 450, y: 200, area: 'Starting area' },
  { x: 150, y: 300, area: 'Starting area' },

  // Middle area trees
  { x: 600, y: 250, area: 'Middle area' },
  { x: 750, y: 180, area: 'Middle area' },
  { x: 520, y: 400, area: 'Middle area' },
  { x: 680, y: 350, area: 'Middle area' },
  { x: 800, y: 300, area: 'Middle area' },

  // Right side trees
  { x: 900, y: 150, area: 'Right side' },
  { x: 950, y: 400, area: 'Right side' },
  { x: 850, y: 500, area: 'Right side' },

  // Bottom area trees
  { x: 300, y: 600, area: 'Bottom area' },
  { x: 500, y: 650, area: 'Bottom area' },
  { x: 700, y: 600, area: 'Bottom area' },
  { x: 50, y: 550, area: 'Bottom area' },
  { x: 150, y: 700, area: 'Bottom area' },

  // Top area trees
  { x: 600, y: 80, area: 'Top area' },
  { x: 800, y: 50, area: 'Top area' },
  { x: 400, y: 50, area: 'Top area' },

  // Left side trees
  { x: 50, y: 200, area: 'Left side' },
  { x: 80, y: 350, area: 'Left side' },
  { x: 30, y: 450, area: 'Left side' },
];

// Mountain configurations (various areas across map)
export const mountainConfigs = [
  {
    x: 750, y: 500, hasPortal: false, portalDestination: null, description: 'Lower right area',
  },
  {
    x: 100, y: 50, hasPortal: false, portalDestination: null, description: 'Upper left area',
  },
  {
    x: 850, y: 100, hasPortal: false, portalDestination: null, description: 'Upper right area',
  },
  {
    x: 300, y: 650, hasPortal: true, portalDestination: 2, description: 'Lower middle - PORTAL TO LEVEL 2',
  },
];

export default {
    ...canvasConfigs,
    enemyConfigs: enemyConfigs,
    items: itemConfigs,
    mountains: mountainConfigs,
    trees: treeConfigs,
}