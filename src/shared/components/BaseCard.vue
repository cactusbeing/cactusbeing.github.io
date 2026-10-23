<script setup lang="ts">
defineProps<{ href?: string }>();
</script>
<template>
  <component :is="href ? 'a' : 'section'" :href="href" class="base-card" :class="{ linked: href }"
    ><slot
  /></component>
</template>
<style scoped>
.base-card {
  display: block;
  min-width: 0;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  text-decoration: none;
  color: var(--color-text);
  box-shadow: var(--shadow);
}
.linked {
  transition:
    border-color 0.15s,
    transform 0.15s;
}
.linked:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  color: var(--color-text);
}
.linked:active {
  transform: translateY(0);
}
</style>
