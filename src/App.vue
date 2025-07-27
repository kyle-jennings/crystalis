<script setup lang="ts">
import { ref, computed } from 'vue';
// import DevPanel from '@/components/DevPanel.vue';
import GameCanvas from '@/components/GameCanvas.vue';
import LevelEditor from '@/components/LevelEditor.vue';

const editorMode = ref(true);
const editorToggleLabel = computed(() => (editorMode.value ? 'Disable Editor' : 'Enable Editor'));
</script>

<template>
  <div id="app">
    <div class="container pt-4">
      <div class="mb-4">
        <b-button
          :label="editorToggleLabel"
          @click="editorMode = !editorMode"
        />
      </div>

      <div>
        <level-editor v-if="editorMode"/>
        <div v-else>
          <div class="is-flex is-justify-content-space-between">
            <game-canvas />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
