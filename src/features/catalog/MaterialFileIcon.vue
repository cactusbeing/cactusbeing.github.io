<script setup lang="ts">
defineProps<{ format: string }>();
</script>

<template>
  <svg class="file-format-icon" :class="`format-${format.toLowerCase()}`" width="28" height="32"
    viewBox="0 0 28 32" fill="none" aria-hidden="true" focusable="false">
    <path d="M6 1.5h11l7 7v21H6z" fill="white" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
    <path d="M17 1.5v7h7" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
    <rect x="1" y="14" width="26" height="12" rx="2" fill="currentColor" />
    <text x="14" y="22.6" text-anchor="middle" fill="white" font-family="Arial, sans-serif"
      :font-size="format.length > 3 ? 6.8 : 8" font-weight="700">{{ format }}</text>
  </svg>
</template>

<style scoped>
.file-format-icon { display: block; flex: 0 0 28px; color: var(--color-primary); }
.format-pdf { color: #a6322c; }
.format-pptx { color: #a34b1b; }
.format-docx { color: #245aa2; }
</style>
