import { createApp } from 'vue';
import App from '@/components/GameCanvas.vue';
import '@/css/index.scss';

const app = createApp(App);

app.mount('#app');
