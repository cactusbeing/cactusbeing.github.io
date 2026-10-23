import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

type FullscreenRoot = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void> | void;
};

export function useGameFullscreen(root: Ref<HTMLElement | undefined>) {
  const mode = ref<'native' | 'viewport' | null>(null);
  const active = computed(() => mode.value !== null);
  const changing = ref(false);
  const doc = document as FullscreenDocument;
  let scrollY = 0;
  let previousBodyOverflow = '';
  let previousHtmlOverflow = '';

  const ownsNativeFullscreen = () =>
    !!root.value &&
    (doc.fullscreenElement === root.value || doc.webkitFullscreenElement === root.value);

  function nativeChange() {
    if (ownsNativeFullscreen()) mode.value = 'native';
    else if (mode.value === 'native') mode.value = null;
  }

  async function exit() {
    if (ownsNativeFullscreen()) {
      if (doc.exitFullscreen) await doc.exitFullscreen();
      else await doc.webkitExitFullscreen?.();
    }
    mode.value = null;
  }

  async function toggle() {
    if (changing.value || !root.value) return;
    changing.value = true;
    try {
      if (active.value) await exit();
      else {
        scrollY = window.scrollY;
        const element = root.value as FullscreenRoot;
        try {
          if (element.requestFullscreen && doc.fullscreenEnabled !== false)
            await element.requestFullscreen({ navigationUI: 'hide' });
          else if (element.webkitRequestFullscreen) await element.webkitRequestFullscreen();
          mode.value = ownsNativeFullscreen() ? 'native' : 'viewport';
        } catch {
          // A browser may expose the API but reject it; the viewport mode still works.
          mode.value = 'viewport';
        }
      }
    } finally {
      changing.value = false;
    }
  }

  function escape(event: KeyboardEvent) {
    if (
      event.key !== 'Escape' ||
      mode.value !== 'viewport' ||
      root.value?.querySelector('dialog[open]')
    )
      return;
    event.preventDefault();
    event.stopImmediatePropagation();
    mode.value = null;
  }

  watch(
    active,
    (value) => {
      if (value) {
        previousBodyOverflow = document.body.style.overflow;
        previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousHtmlOverflow;
        // Restore scroll after the fixed fullscreen surface returns to document flow.
        void nextTick(() => window.scrollTo({ top: scrollY, behavior: 'instant' }));
      }
    },
    { flush: 'sync' },
  );

  onMounted(() => {
    doc.addEventListener('fullscreenchange', nativeChange);
    doc.addEventListener('webkitfullscreenchange', nativeChange);
    window.addEventListener('keydown', escape, true);
  });
  onBeforeUnmount(() => {
    if (ownsNativeFullscreen()) void exit().catch(() => {});
    mode.value = null;
    doc.removeEventListener('fullscreenchange', nativeChange);
    doc.removeEventListener('webkitfullscreenchange', nativeChange);
    window.removeEventListener('keydown', escape, true);
  });

  return { active, mode, changing, toggle };
}
