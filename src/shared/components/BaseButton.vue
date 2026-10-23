<script setup lang="ts">
defineProps<{
  href?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>();
</script>
<template>
  <a v-if="href && !disabled" :href="href" class="button" :class="variant || 'primary'"><slot /></a>
  <button
    v-else
    :type="type || 'button'"
    :disabled="disabled"
    class="button"
    :class="variant || 'primary'"
  >
    <slot />
  </button>
</template>
<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.65rem 1.15rem;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  text-decoration: none;
  font-weight: 600;
  line-height: 1.6;
  transition:
    background 0.15s,
    transform 0.15s;
}
.primary {
  background: var(--color-primary);
  color: white;
}
.primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  color: white;
}
.secondary {
  background: white;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.secondary:hover:not(:disabled) {
  background: var(--color-primary-soft);
}
.danger {
  background: var(--color-danger);
  color: white;
}
.danger:hover:not(:disabled) {
  background: var(--color-danger-hover);
}
.button:active:not(:disabled) {
  transform: translateY(1px);
}
.button:disabled {
  background: var(--color-disabled-bg);
  color: var(--color-disabled-text);
  border-color: var(--color-disabled-border);
}
</style>
