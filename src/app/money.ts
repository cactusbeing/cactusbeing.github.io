import './shell';
import { createApp } from 'vue';
import MoneyApp from '../features/money/MoneyApp.vue';
document.body.classList.add('money-page');
createApp(MoneyApp).mount('#money-app');
