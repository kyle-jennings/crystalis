<script setup>
import {
  onMounted,
} from 'vue';
import LevelEditorClass from '@game/js/dev/LevelEditorV2';
import LevelEditorPallet from './LevelEditorPallet.vue';
import LevelEditorSettings from './LevelEditorSettings.vue';

onMounted(() => {
  if (!window.game) {
    console.log('game not initialized');
    return;
  }
  const LevelEditor = new LevelEditorClass(window.game, '#level-editor');
  LevelEditor.initialize();
});
</script>

<template>
  <div>
    <b-tabs :animated="false">
      <b-tab-item label="Pallet" icon="palette">
        <LevelEditorPallet />
      </b-tab-item>
      <b-tab-item label="Settings" icon="cog">
        <LevelEditorSettings />
      </b-tab-item>
    </b-tabs>

    <div id="level-editor"></div>
  </div>
</template>
