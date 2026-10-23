<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{ disabled: boolean }>();
const emit = defineEmits<{ move: [vector: { x: number; y: number }] }>();
const surface = ref<HTMLButtonElement>();
const engaged = ref(false);
const offset = ref({ x: 0, y: 0 });
const heldKeys = new Set<string>();
const deadZone = 0.13;
let pointerId: number | null = null;
let center = { x: 0, y: 0 };
let radius = 1;

function measure() {
  const bounds = surface.value!.getBoundingClientRect();
  center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  radius = bounds.width * 0.29;
}

function steer(x: number, y: number) {
  const distance = Math.hypot(x, y);
  const clamped = Math.min(distance, radius);
  const scale = distance ? clamped / distance : 0;
  offset.value = { x: x * scale, y: y * scale };
  const strength = Math.max(0, (clamped / radius - deadZone) / (1 - deadZone));
  emit('move', {
    x: distance ? (x / distance) * strength : 0,
    y: distance ? (y / distance) * strength : 0,
  });
}

function reset() {
  const capturedPointer = pointerId;
  pointerId = null;
  heldKeys.clear();
  engaged.value = false;
  offset.value = { x: 0, y: 0 };
  emit('move', { x: 0, y: 0 });
  if (capturedPointer !== null && surface.value?.hasPointerCapture(capturedPointer))
    surface.value.releasePointerCapture(capturedPointer);
}

function pointerDown(event: PointerEvent) {
  if (props.disabled || pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0))
    return;
  event.preventDefault();
  measure();
  heldKeys.clear();
  pointerId = event.pointerId;
  engaged.value = true;
  surface.value!.setPointerCapture(event.pointerId);
  steer(event.clientX - center.x, event.clientY - center.y);
}

function pointerMove(event: PointerEvent) {
  if (event.pointerId !== pointerId) return;
  event.preventDefault();
  steer(event.clientX - center.x, event.clientY - center.y);
}

function pointerEnd(event: PointerEvent) {
  if (event.pointerId === pointerId) reset();
}

const keyDirections: Record<string, string> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
};
function keyboardInput(event: KeyboardEvent, down: boolean) {
  const direction = keyDirections[event.key.toLowerCase()];
  if (
    !direction ||
    props.disabled ||
    pointerId !== null ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  if (down) heldKeys.add(event.key.toLowerCase());
  else heldKeys.delete(event.key.toLowerCase());
  const heldDirections = new Set([...heldKeys].map((key) => keyDirections[key]));
  measure();
  engaged.value = heldKeys.size > 0;
  steer(
    (Number(heldDirections.has('right')) - Number(heldDirections.has('left'))) * radius,
    (Number(heldDirections.has('down')) - Number(heldDirections.has('up'))) * radius,
  );
}

function visibilityChange() {
  if (document.hidden) reset();
}
defineExpose({ reset });
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) reset();
  },
);
onMounted(() => {
  window.addEventListener('blur', reset);
  window.addEventListener('resize', reset);
  document.addEventListener('visibilitychange', visibilityChange);
});
onBeforeUnmount(() => {
  reset();
  window.removeEventListener('blur', reset);
  window.removeEventListener('resize', reset);
  document.removeEventListener('visibilitychange', visibilityChange);
});
</script>

<template>
  <button
    ref="surface"
    type="button"
    class="virtual-joystick"
    :class="{ 'is-engaged': engaged }"
    :disabled="disabled"
    aria-label="移動搖桿"
    aria-describedby="campus-joystick-instructions"
    @pointerdown="pointerDown"
    @pointermove="pointerMove"
    @pointerup="pointerEnd"
    @pointercancel="pointerEnd"
    @lostpointercapture="pointerEnd"
    @keydown="keyboardInput($event, true)"
    @keyup="keyboardInput($event, false)"
    @blur="reset"
    @contextmenu.prevent
    @dragstart.prevent
  >
    <svg class="joystick-directions" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="28" />
      <path d="M50 8v7M50 85v7M8 50h7M85 50h7" />
    </svg>
    <span
      class="joystick-thumb"
      :style="{ transform: `translate(${offset.x}px, ${offset.y}px)` }"
      aria-hidden="true"
      ><span></span
    ></span>
    <span id="campus-joystick-instructions" class="joystick-description">
      朝想走的方向拖曳，輕推慢走，放開停止。也可使用方向鍵或 WASD。
    </span>
  </button>
</template>

<style scoped>
.virtual-joystick {
  position: relative;
  width: clamp(120px, 32vw, 140px);
  aspect-ratio: 1;
  flex-shrink: 0;
  padding: 0;
  border: 2px solid #8b9c78;
  border-radius: 50%;
  background: #e8edd9;
  color: #6d825b;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}
.virtual-joystick:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
}
.joystick-directions {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  pointer-events: none;
}
.joystick-directions circle {
  stroke: #b9c7a8;
}
.joystick-thumb {
  position: absolute;
  inset: 29%;
  display: grid;
  place-items: center;
  border: 2px solid #f5f4df;
  border-radius: 50%;
  background: var(--color-primary);
  color: #f5f4df;
  box-shadow: 0 3px 7px rgb(45 68 35 / 22%);
  pointer-events: none;
  transition: transform 140ms ease-out;
}
.joystick-thumb > span {
  width: 10px;
  height: 10px;
  border: 2px solid currentColor;
  border-radius: 50%;
}
.is-engaged {
  border-color: var(--color-primary);
  cursor: grabbing;
}
.is-engaged .joystick-thumb {
  transition: none;
}
.virtual-joystick:disabled {
  opacity: 0.5;
  cursor: default;
}
.joystick-description {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (prefers-reduced-motion: reduce) {
  .joystick-thumb {
    transition: none;
  }
}
</style>
