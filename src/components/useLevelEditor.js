import {
  ref, watch,
} from 'vue';

import LevelEditor from '@/game/js/LevelEditor';

export default function useLevelEditor() {
  const selectedLevel = ref(1);

  // Watch for level changes and update the game
  watch(selectedLevel, (newLevel) => {
    if (window.game && window.game.loadLevel) {
      window.game.loadLevel(newLevel);
    }
  });

  return {
    selectedLevel,
    LevelEditor,
  };
}
