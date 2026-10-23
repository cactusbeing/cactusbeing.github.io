<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, useId } from 'vue';
import BaseButton from './BaseButton.vue';
const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
const titleId = `modal-title-${useId()}`;
let previousFocus: HTMLElement | null = null;
function trapFocus(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    emit('close');
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = Array.from(
    dialog.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? [],
  ).filter((element) => element.getClientRects().length > 0);
  const first = focusable[0],
    last = focusable.at(-1);
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  if (
    event.shiftKey &&
    (document.activeElement === first || document.activeElement === dialog.value)
  ) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last || document.activeElement === dialog.value)
  ) {
    event.preventDefault();
    first.focus();
  }
}
watch(
  () => props.open,
  async (open) => {
    await nextTick();
    if (open) {
      previousFocus = document.activeElement as HTMLElement;
      dialog.value?.showModal();
    } else {
      dialog.value?.close();
      previousFocus?.focus();
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  dialog.value?.close();
  previousFocus?.focus();
});
</script>
<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    @keydown="trapFocus"
    @cancel.prevent="emit('close')"
    @close="emit('close')"
  >
    <h2 :id="titleId">{{ title }}</h2>
    <slot />
    <div class="actions">
      <BaseButton variant="secondary" @click="emit('close')">取消</BaseButton
      ><slot name="actions" />
    </div>
  </dialog>
</template>
<style scoped>
dialog {
  width: min(30rem, calc(100% - 2rem));
  max-height: 85vh;
  padding: 1.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  color: var(--color-text);
}
dialog::backdrop {
  background: var(--color-backdrop);
}
</style>
