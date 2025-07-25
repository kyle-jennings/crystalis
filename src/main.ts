import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Buefy from 'buefy';
import App from '@/App.vue';
import '@/css/index.scss';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Buefy, {
  defaultIconPack: 'fas',
});

app.mount('#app');
