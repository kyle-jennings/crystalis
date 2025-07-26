<script setup lang="ts">
import { ref, computed } from 'vue';
// import DevPanel from '@/components/DevPanel.vue';
import GameCanvas from '@/components/GameCanvas.vue';
import LevelEditor from '@/components/LevelEditor.vue';

const editorMode = ref(false);
const editorToggleLabel = computed(() => (editorMode.value ? 'Disable Editor' : 'Enable Editor'));
</script>

<template>
  <div id="app">
    <div class="container">
      <div>
        <b-button
          :label="editorToggleLabel"
          @click="editorMode = !editorMode"
        />
      </div>
      <div class="is-flex is-justify-content-space-between">
        <level-editor v-show="editorMode"/>
        <game-canvas v-show="!editorMode" />
      </div>
    </div>
  </div>
</template>
