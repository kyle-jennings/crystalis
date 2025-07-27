<script setup>
import { onMounted } from 'vue';
import LevelEditorPallet from './LevelEditorPallet.vue';
import LevelEditorSettings from './LevelEditorSettings.vue';
import useLevelEditorStore from '@/stores/levelEditorStore';

// Use the Pinia store
const store = useLevelEditorStore();

onMounted(() => {
  store.initializeEditor({
    isEditMode: true,
    $elm: '#level-editor-wrapper #level-editor',
  });
});

</script>

<template>
  <div>
    <!-- Level Selection -->
    <div class="level-selector mb-4">
      <b-field label="Select Level" grouped>
        <b-select
          :model-value="store.selectedLevel"
          @update:model-value="store.setSelectedLevel"
          placeholder="Choose a level"
        >
          <option
            v-for="level in store.availableLevels"
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
        <b-tab-item label="Settings" icon="cog">
          <LevelEditorSettings />
        </b-tab-item>
        <b-tab-item label="Pallet" icon="palette">
          <LevelEditorPallet />
        </b-tab-item>
        <b-tab-item label="JSON" icon="code">
          <b-button
            type="is-info"
            size="is-small"
            icon-left="console"
            label=" Log Game Object to Console"
            @click="store.logGameInstance"
          />
          <hr />
          <pre>{{ store.jsonSettings }}</pre>
        </b-tab-item>
      </b-tabs>

      <div id="level-editor-wrapper">
        <canvas id="level-editor"></canvas>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
#editor-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

#level-editor-wrapper {
  // background: #f5f5f5;
  // border: 1px solid #ddd;
  flex-grow: 1;
  padding: 10px;
  // display: flex;

  #level-editor {
    border: 1px solid #ddd;

  }
}

.level-selector {
  margin-bottom: 1rem;
}

// Set fixed width for tabs column
.b-tabs {
  width: 300px;
  flex-shrink: 0;
}

// Mobile styles - stack everything vertically and make full width
@media (max-width: 768px) {
  #editor-wrapper {
    display: block;
    gap: 0;
  }

  #level-editor-wrapper {
    width: 100%;
    margin-top: 20px;
    flex-grow: unset;
  }

  .level-selector {
    width: 100%;
  }

  // Make tabs full width on mobile
  .b-tabs {
    width: 100%;
    margin-bottom: 20px;
    flex-shrink: unset;
  }
}

</style>
