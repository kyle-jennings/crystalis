<script setup>
import {
  computed,
  onMounted,
} from 'vue';
import LevelEditorPallet from './LevelEditorPallet.vue';
import LevelEditorSettings from './LevelEditorSettings.vue';
import useLevelEditor from './useLevelEditor';

// Use the level editor composable
const {
  selectedLevel,
  LevelEditor,
} = useLevelEditor();

onMounted(() => {
  window.game = new LevelEditor({
    isEditMode: true,
    $elm: '#level-editor-wrapper #level-editor',
  });
});

// Get available levels based on the levels directory
const availableLevels = computed(() => {
  const levels = [];
  // Based on the files in @game/js/levels directory
  for (let i = 1; i <= 3; i++) {
    levels.push({
      value: i,
      label: `Level ${i}`,
    });
  }
  return levels;
});

</script>

<template>
  <div>
    <!-- Level Selection -->
    <div class="level-selector mb-4">
      <b-field label="Select Level" grouped>
        <b-select
          v-model="selectedLevel"
          placeholder="Choose a level"
        >
          <option
            v-for="level in availableLevels"
            :key="level.value"
            :value="level.value"
          >
            {{ level.label }}
          </option>
        </b-select>
      </b-field>
    </div>

    <div id="editor-wrapper">

      <b-tabs :animated="false">
        <b-tab-item label="Pallet" icon="palette">
          <LevelEditorPallet />
        </b-tab-item>
        <b-tab-item label="Settings" icon="cog">
          <LevelEditorSettings />
        </b-tab-item>
      </b-tabs>

      <div id="level-editor-wrapper">
        <canvas id="level-editor"></canvas>
      </div>
    </div>

  </div>
</template>

<style>
#editor-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

#level-editor-wrapper {
  background: #f5f5f5;
  border: 1px solid #ddd;
  flex-grow: 1;
  padding: 10px;
  display: flex;
}

/* #level-editor {
  max-width: 100%;
  height: auto;
  width: 100%;
} */

.level-selector {
  margin-bottom: 1rem;
}

</style>
