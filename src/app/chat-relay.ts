import './shell';
import { createApp } from 'vue';
import ChatRelayApp from '../features/chat-relay/ChatRelayApp.vue';
import '../features/chat-relay/chat-relay.css';
document.body.classList.add('chat-relay-page');
createApp(ChatRelayApp).mount('#chat-relay-app');

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}game/chat-relay/sw.js`, { scope: `${import.meta.env.BASE_URL}game/chat-relay/` }).catch(() => { /* Core game works without a service worker. */ });
  });
}
