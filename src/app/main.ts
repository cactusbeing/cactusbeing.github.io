import { createApp } from 'vue';
import App from './App.vue';
import '../shared/styles/base.css';
import { installSiteBasePaths } from '../shared/site-path';
installSiteBasePaths();
createApp(App).mount('#app');
