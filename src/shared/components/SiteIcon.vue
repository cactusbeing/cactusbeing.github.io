<script setup lang="ts">
withDefaults(
  defineProps<{
    name:
      | 'home'
      | 'book'
      | 'leaf'
      | 'tools'
      | 'person'
      | 'search'
      | 'mail'
      | 'calendar'
      | 'folder'
      | 'clock'
      | 'arrow'
      | 'heart'
      | 'tag'
      | 'megaphone'
      | 'copy';
    size?: number;
  }>(),
  { size: 18 },
);
const paths = {
  home: 'm3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8',
  book: 'M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z',
  leaf: 'M20 3c1 10-3 15-10 14-5-1-7-7-3-10 3-3 7-1 13-4ZM5 21 16 10',
  tools: 'M14 6a5 5 0 0 0-6 6L3 17a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z',
  person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  search: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 6 6 6',
  mail: 'M3 5h18v14H3ZM3 5l9 8 9-8',
  calendar: 'M4 5h16v16H4ZM8 2v6M16 2v6M4 10h16M8 14h2M14 14h2M8 17h2',
  folder: 'M3 7V4h6l3 3h9v14H3ZM3 11h18',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  heart: 'M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-5 5 2 11 8 15 6-4 13-10 8-15Z',
  tag: 'M3 3h9l9 9-9 9-9-9ZM7 7h.01',
  megaphone: 'M3 10v5h5l11 5V4L8 10ZM8 15l2 6H6l-2-6M22 9v6',
  copy: 'M8 4h12v14H8zM4 8H3v13h12v-1',
};
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name]" />
  </svg>
</template>
