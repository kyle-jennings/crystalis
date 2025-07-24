<script>
import { ref } from 'vue';
import DevPanel from './components/DevPanel.vue';
import GameCanvas from './components/GameCanvas/GameCanvas.vue';

export default {
  name: 'App',
  components: {
    DevPanel,
    GameCanvas,
  },
  setup() {
    const counter = ref(0);

    const showMessage = () => {
      // Buefy toast notification
      this.$buefy.toast.open({
        message: 'Hello from Buefy!',
        type: 'is-success',
      });
    };

    const incrementCounter = () => {
      counter.value++;
    };

    return {
      counter,
      showMessage,
      incrementCounter,
    };
  },
};
</script>

<template>
  <div id="app">
    <div id="mainFlexWrapper" class="container">
      <DevPanel />

      <GameCanvas />
    </div>
  </div>
</template>
