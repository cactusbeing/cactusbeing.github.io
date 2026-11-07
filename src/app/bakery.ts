import './shell';
import { createApp } from 'vue';
import BakeryApp from '../features/bakery/BakeryApp.vue';
import '../features/bakery/bakery.css';
document.body.classList.add('bakery-page');
createApp(BakeryApp).mount('#bakery-app');
