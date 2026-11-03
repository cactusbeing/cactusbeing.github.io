<script setup lang="ts">
defineProps<{ kind: 'book' | 'chat' | 'settings' | 'expand' | 'home' }>();
</script>

<template>
  <svg class="game-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="kind === 'book'"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/><path d="m6 9 3 1m6 0 3-1"/></template>
    <template v-else-if="kind === 'chat'"><path d="M20 11c0 5-5 8-10 6l-6 3 1-6C0 8 5 3 12 3c5 0 8 3 8 8Z"/><path d="M7 9h9m-9 4h5"/></template>
    <template v-else-if="kind === 'settings'"><path d="M4 7h4m5 0h7M4 17h8m5 0h3"/><circle cx="10.5" cy="7" r="2.5"/><circle cx="14.5" cy="17" r="2.5"/></template>
    <path v-else-if="kind === 'expand'" d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>
    <template v-else><path d="m3 10 9-7 9 7m-16-1v11h14V9"/><path d="M9 20v-7h6v7"/></template>
  </svg>
</template>
