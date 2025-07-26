<script setup lang="ts">
import { ref } from 'vue';

// Level settings
const levelWidth = ref(1024);
const levelHeight = ref(768);

// Camera settings
const cameraWidth = ref(800);
const cameraHeight = ref(600);

// Background color
const backgroundColor = ref('#2c3e50');
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

    <!-- Color Preview -->
    <b-field label="Preview">
      <div
        class="color-preview"
        :style="{ backgroundColor: backgroundColor }"
      >
        Background Color Preview
      </div>
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
