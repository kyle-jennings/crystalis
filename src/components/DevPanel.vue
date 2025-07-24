<template>
  <div class="dev-panel">
    <b-tabs
      v-model="activeTab"
      type="is-boxed"
      @update:modelValue="handleTabChange"
    >

      <b-tab-item label="Debug" icon="bug">
        <div class="debug-content">
          <h3 class="title is-5">Debug Panel</h3>
          <div class="content">
            <!-- Debug content will go here -->
            <p>Debug information and controls</p>
            <div id="debug-content"></div>
          </div>
        </div>
      </b-tab-item>

      <b-tab-item label="Editor" icon="edit">
        <div class="editor-content">

          <h3 class="title is-5">Level Editor</h3>
            <h4 class="editor-tool-label">
                Selected Tool:<span></span>
            </h4>

            <div id="objectPalette" class="object-palette">
            </div>

            <div class="editor-actions">
                <button onclick="window.game.devMode.levelEditor?.exportLevel()"
                    class="export-button">
                    Export Level
                </button>
            </div>

            <div class="editor-instructions">
                <div>Left Click: Place | Right Click: Remove</div>
                <div>Grid shows placement guides</div>
            </div>
        </div>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);

// Handle tab change and update the global game state
const handleTabChange = (tabIndex: number) => {
  // TypeScript safe access to window object
  if (typeof window !== 'undefined' && (window as any).CrystalisGame?.devMode) {
    (window as any).CrystalisGame.devMode.currentTab = tabIndex;
    (window as any).CrystalisGame.devMode.toggleLevelEditor();
  }
};
</script>

<style scoped>
.dev-panel {
  width: 100%;
  height: 100%;
}

.debug-content,
.editor-content {
  padding: 1rem;
}

.content {
  margin-top: 1rem;
}
</style>
