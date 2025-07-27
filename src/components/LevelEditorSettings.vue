<script setup lang="ts">
import { computed } from 'vue';
import useLevelEditorStore from '@/stores/levelEditorStore';

// Use the Pinia store
const store = useLevelEditorStore();

// Computed properties that sync with the current game instance
const levelWidth = computed({
  get: () => (store.gameInstance as any)?.worldWidth || 1024,
  set: (value) => {
    if (store.gameInstance) {
      (store.gameInstance as any).worldWidth = value;
      if ((store.gameInstance as any).Level) {
        (store.gameInstance as any).Level.worldWidth = value;
      }
    }
  },
});

const levelHeight = computed({
  get: () => (store.gameInstance as any)?.worldHeight || 768,
  set: (value) => {
    if (store.gameInstance) {
      (store.gameInstance as any).worldHeight = value;
      if ((store.gameInstance as any).Level) {
        (store.gameInstance as any).Level.worldHeight = value;
      }
    }
  },
});

// Camera settings (viewport/logical dimensions)
const cameraWidth = computed({
  get: () => (store.gameInstance as any)?.width || 800,
  set: (value) => {
    if (store.gameInstance) {
      (store.gameInstance as any).width = value;
      (store.gameInstance as any).canvas.width = value;
      if ((store.gameInstance as any).Level) {
        (store.gameInstance as any).Level.width = value;
        (store.gameInstance as any).Level.canvasWidth = value;
      }
    }
  },
});

const cameraHeight = computed({
  get: () => (store.gameInstance as any)?.height || 600,
  set: (value) => {
    if (store.gameInstance) {
      (store.gameInstance as any).height = value;
      (store.gameInstance as any).canvas.height = value;
      if ((store.gameInstance as any).Level) {
        (store.gameInstance as any).Level.height = value;
        (store.gameInstance as any).Level.canvasHeight = value;
      }
    }
  },
});

// Background color
const backgroundColor = computed({
  get: () => (store.gameInstance as any)?.Level?.backgroundColor || '#2c3e50',
  set: (value) => {
    if ((store.gameInstance as any)?.Level) {
      (store.gameInstance as any).Level.backgroundColor = value;
      // Trigger a re-render
      (store.gameInstance as any).render();
    }
  },
});

// Debug function to log available levels
const debugLevels = () => {
  /* eslint-disable-next-line no-console */
  console.log('Available Levels:', store.availableLevels);
  /* eslint-disable-next-line no-console */
  console.log('Game LEVELS:', (store.gameInstance as any)?.LEVELS);
};
</script>

<template>
  <div>
    <h4 class="title is-5">Level Settings</h4>

    <!-- Level Dimensions -->
    <b-field grouped>
      <b-field label="Level Width">
        <b-numberinput
          v-model="levelWidth"
          :min="400"
          :max="4000"
          controls-position="compact"
          placeholder="Level width in pixels"
        />
      </b-field>
      <b-field label="Level Height">
        <b-numberinput
          v-model="levelHeight"
          :min="300"
          :max="3000"
          controls-position="compact"
          placeholder="Level height in pixels"
        />
      </b-field>
    </b-field>

    <hr />

    <h4 class="title is-5">Camera Settings</h4>

    <!-- Camera Dimensions -->
    <b-field grouped>
      <b-field label="Camera Width">
        <b-numberinput
          v-model="cameraWidth"
          :min="320"
          :max="1920"
          controls-position="compact"
          placeholder="Camera viewport width"
        />
      </b-field>
      <b-field label="Camera Height">
        <b-numberinput
          v-model="cameraHeight"
          :min="240"
          :max="1080"
          controls-position="compact"
          placeholder="Camera viewport height"
        />
      </b-field>
    </b-field>

    <hr />

    <h4 class="title is-5">Visual Settings</h4>

    <!-- Background Color -->
    <b-field label="Background Color">
      <b-input
        v-model="backgroundColor"
        type="color"
        placeholder="Select background color"
      />
    </b-field>

    <hr />

    <h4 class="title is-5">Level Management</h4>

    <!-- Create New Level Button -->
    <b-field grouped>
      <b-button
        type="is-success"
        size="is-small"
        @click="store.createNewLevel"
        icon-left="plus"
      >
        Create New Level
      </b-button>
      <b-button
        type="is-warning"
        size="is-small"
        @click="debugLevels"
        icon-left="bug"
      >
        Debug Levels
      </b-button>
    </b-field>

    <hr />

    <h4 class="title is-5">Debug Tools</h4>

    <!-- Debug Button -->
    <b-field>
      <b-button
        type="is-info"
        size="is-small"
        @click="store.logGameInstance"
        icon-left="console"
      >
        Log Game Object to Console
      </b-button>
    </b-field>
  </div>
</template>

<style scoped>
.color-preview {
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  text-align: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
