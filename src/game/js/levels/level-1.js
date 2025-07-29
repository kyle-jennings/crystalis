// Village Area (Safe Zone)
const canvasWidth = 540; // Width of village interior
const canvasHeight = 566; // Height of village interior

export const canvasConfigs = {
  // Village level - resize canvas to match wall perimeter
  canvasWidth, // Width of village interior
  canvasHeight, // Height of village interior
  width: canvasWidth,
  height: canvasHeight,
  worldWidth: canvasWidth,
  worldHeight: canvasHeight,

  playerX: 270, // Center horizontally
  playerY: 283, // Center vertically

  backgroundColor: '#478120', // Forest green
  accentColor: '#294f0c', // Darker green
  theme: 'village',
};


// Village house configurations
export const houseConfigs = [
  {
    x: 100, y: 70, type: 'normal', name: 'House 1',
  },
  {
    x: 270, y: 40, type: 'normal', name: 'House 2',
  },
  {
    x: 440, y: 100, type: 'normal', name: 'House 3',
  },
  {
    x: 140, y: 220, type: 'shop', name: 'Village Shop',
  },
  {
    x: 400, y: 240, type: 'inn', name: 'Village Inn',
  },
  {
    x: 20, y: 270, type: 'blacksmith', name: 'Blacksmith',
  },
];

export const EntryConfgs = [
  {
    x: 180,
    y: 0,
    width: 180,
    height: 16,
    name: 'North opening (gap)',
    destinationLevel: 2,
  },
  {
    x: 520,
    y: 215,
    width: 32,
    height: 120,
    destinationLevel: 0,
  }
];

// Village wall configurations
export const wallConfigs = [
  // North wall with opening in the middle
  {
    x: 0, y: 0, width: 180, height: 16, isOpening: false, name: 'North wall left section',
  },
  {
    x: 180, y: 0, width: 180, height: 16, isOpening: true, name: 'North opening (gap)',
  },
  {
    x: 360, y: 0, width: 180, height: 16, isOpening: false, name: 'North wall right section',
  },

  // South wall (complete)
  {
    x: 0, y: 550, width: 540, height: 16, isOpening: false, name: 'Full south wall',
  },

  // West wall (complete)
  {
    x: 0, y: 16, width: 16, height: 534, isOpening: false, name: 'Full west wall',
  },

  // East wall with opening near the middle
  {
    x: 524, y: 16, width: 16, height: 200, isOpening: false, name: 'East wall top section',
  },
  {
    x: 524, y: 216, width: 16, height: 60, isOpening: true, name: 'East opening (gap)',
  },
  {
    x: 524, y: 276, width: 16, height: 274, isOpening: false, name: 'East wall bottom section',
  },
];

// Village decorative tree configurations
export const treeConfigs = [
  // Corner trees for natural village boundaries
  { x: 50, y: 50, area: 'Northwest corner' },
  { x: 480, y: 45, area: 'Northeast corner' },
  { x: 45, y: 500, area: 'Southwest corner' },
  { x: 470, y: 510, area: 'Southeast corner' },

  // Trees around houses for atmosphere
  { x: 80, y: 120, area: 'Near House 1' },
  { x: 180, y: 85, area: 'Between House 1 & 2' },
  { x: 380, y: 75, area: 'Near House 2' },
  { x: 420, y: 140, area: 'Near House 3' },

  // Central village green area
  { x: 240, y: 160, area: 'Village center' },
  { x: 320, y: 180, area: 'Village center' },

  // Trees near shops for shade
  { x: 90, y: 190, area: 'Near Village Shop' },
  { x: 450, y: 200, area: 'Near Village Inn' },
  { x: 60, y: 320, area: 'Near Blacksmith' },

  // Scattered decorative trees
  { x: 200, y: 350, area: 'South village area' },
  { x: 350, y: 320, area: 'East village area' },
  { x: 160, y: 450, area: 'South village area' },
  { x: 380, y: 450, area: 'South village area' },
];

export default {
  ...canvasConfigs,
  houses: houseConfigs,
  walls: wallConfigs,
  trees: treeConfigs,
  entries: EntryConfgs,
}