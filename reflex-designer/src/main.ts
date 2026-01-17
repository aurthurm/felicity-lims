import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Vue Flow styles
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

const app = createApp(App);

app.use(createPinia());

app.mount('#app');
