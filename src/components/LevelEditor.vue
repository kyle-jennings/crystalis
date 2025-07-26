<script setup>

import LevelEditorPallet from './LevelEditorPallet.vue';
import LevelEditorSettings from './LevelEditorSettings.vue';

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
