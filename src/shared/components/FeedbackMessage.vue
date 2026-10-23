<script setup lang="ts">
defineProps<{ kind?: 'info' | 'error' | 'success' }>();
</script>
<template>
  <div class="feedback" :class="kind || 'info'" :role="kind === 'error' ? 'alert' : 'status'">
    <slot />
  </div>
</template>
<style scoped>
.feedback {
  border-radius: var(--radius-control);
  padding: 1rem 1.25rem;
  background: var(--color-surface-muted);
  border-left: 4px solid var(--color-primary);
  margin-block: 1rem;
}
.error {
  border-color: var(--color-danger);
}
.success {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}
</style>
