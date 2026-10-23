<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import IncidentFilm from './IncidentFilm.vue';
import TeacherCorrection from './TeacherCorrection.vue';
import { supportDraft } from './data/supportDraft';
import {
  choicesFor,
  eventCaptions,
  newRunSeed,
  returnNarration,
  shuffledChoices,
} from './game/schedule';
import { stories, contentSources, type Choice } from './data/stories';
import {
  atGate,
  currentSlot,
  currentStep,
  currentStory,
  optionFor,
  questDestination,
  revealEvent,
  runStories,
  finishDay,
  freshProgress,
  parseProgress,
  recordChoice,
  SAVE_KEY,
} from './game/progress';
import { canStand, createNpcs, guideTarget, mapNames, portals, START } from './game/world';
import type { GameBridge } from './game/CampusScene';
const host = ref<HTMLDivElement>(),
  playfield = ref<HTMLElement>(),
  reader = ref<HTMLDialogElement>(),
  readerTitle = ref<HTMLElement>();
const ready = ref(false),
  loadError = ref(false),
  started = ref(false),
  paused = ref(false),
  incidentPlaying = ref(false);
const panel = ref<
  'incident' | 'correction' | 'story' | 'journal' | 'help' | 'reset' | 'outcome' | null
>(null);
const progress = ref(freshProgress(newRunSeed())),
  storageOk = ref(true),
  nearby = ref<string | null>(null),
  notice = ref(''),
  transitionLabel = ref(''),
  routeSnapshot = ref('[]'),
  routeBlocked = ref(false),
  guideLabel = ref('以安'),
  npcSnapshot = ref('[]');
const eventFrames = ref<Record<string, string[]>>({});
const announced = new Set<string>();
const selected = ref(stories[0].id),
  stage = ref(0),
  result = ref<Choice | null>(null);
const position = ref({ ...START }),
  tabHidden = ref(false),
  inView = ref(true);
const motion = window.matchMedia('(prefers-reduced-motion: reduce)'),
  reduced = ref(motion.matches);
let game: { destroy: (removeCanvas: boolean) => void } | undefined;
let observer: IntersectionObserver | undefined,
  saveTimer: ReturnType<typeof setTimeout> | undefined;
let statusTimer = 0,
  disposed = false;
let previousFocus: HTMLElement | null = null;
const pressed = new Set<string>();
const dayStories = computed(() => runStories(progress.value));
const current = computed(() => dayStories.value.find((s) => s.id === selected.value)!);
const objective = computed(() => currentStory(progress.value));
const slot = computed(() => currentSlot(progress.value));
const phase = computed(() => currentStep(progress.value));
const quest = computed(() => questDestination(progress.value));
const waiting = computed(
  () => !!objective.value && !progress.value.revealed.includes(objective.value.id),
);
const currentSlotData = computed(() =>
  progress.value.schedule.find((s) => s.id === current.value.id)!,
);
const support = computed(() => supportDraft[current.value.id]);
let onsetElapsed = 0;
const allDone = computed(() => progress.value.completed.length === stories.length);
const terminal = computed(() => progress.value.status !== 'playing');
const isAtGate = computed(() => progress.value.map === 'campus' && atGate(position.value));
const door = computed(() => {
  const local = portals.filter(
    (p) =>
      p.map === progress.value.map &&
      Math.hypot(p.x - position.value.x, p.y - position.value.y) < 65,
  );
  return (
    local.find((p) => p.to === quest.value.map) ||
    local.sort(
      (a, b) =>
        Math.hypot(a.x - position.value.x, a.y - position.value.y) -
        Math.hypot(b.x - position.value.x, b.y - position.value.y),
    )[0]
  );
});
const taskPortal = computed(() => {
  const target = guideTarget(progress.value.map, quest.value.id, [], quest.value);
  return 'to' in target ? target : null;
});
const atCurrentNpc = computed(
  () => !waiting.value && !!objective.value && nearby.value === quest.value.id,
);
const atTaskDoor = computed(() => !!taskPortal.value && door.value?.id === taskPortal.value.id);
const actionLabel = computed(() =>
  atCurrentNpc.value
    ? phase.value === 1
      ? `向${supportDraft[objective.value!.id].teacher}說明`
      : phase.value === 2
        ? `回應${objective.value!.name}`
        : `和${objective.value!.name}說話`
    : atTaskDoor.value
      ? taskPortal.value!.label
      : allDone.value && isAtGate.value
        ? '放學離校'
        : '靠近目標',
);
const canAct = computed(
  () => atCurrentNpc.value || atTaskDoor.value || (allDone.value && isAtGate.value),
);
const taskInstruction = computed(() => {
  if (atCurrentNpc.value)
    return `${actionLabel.value}，${phase.value === 1 ? '如實描述剛才的經過' : phase.value === 2 ? '完成現場的後續行動' : `開始「${objective.value!.title}」`}`;
  if (waiting.value)
    return taskPortal.value
      ? `先${taskPortal.value.label}，準備${slot.value!.period}`
      : `在${mapNames[quest.value.map]}準備${slot.value!.period}，留意同學的狀況`;
  if (objective.value && phase.value === 1) return supportDraft[objective.value.id].objective;
  if (objective.value && phase.value === 2) return supportDraft[objective.value.id].returnObjective;
  if (taskPortal.value)
    return objective.value
      ? `先${taskPortal.value.label}，再找${objective.value.name}`
      : '先回校園，再到南門放學';
  return objective.value
    ? `到${objective.value.location}找${objective.value.name}`
    : '回南門，完成今天的挑戰';
});
const taskHelp = computed(() => {
  if (atCurrentNpc.value) return `已經到達。按 E／Enter，或點「${actionLabel.value}」。`;
  if (atTaskDoor.value) return `已到入口。按 E，或點「${taskPortal.value!.label}」進入下一張地圖。`;
  if (allDone.value && isAtGate.value) return '已到南門。按 E，或點「放學離校」，查看總結。';
  if (routeBlocked.value) return '路線暫時不通；請稍微移動，虛線會重新規劃。';
  if (taskPortal.value)
    return `沿地面虛線前往「${taskPortal.value.label}」的門口，靠近後按 E 或走進入口。`;
  if (waiting.value) return '事件會在適合的時段隨機出現；可以自由走動，不設倒數。';
  return `沿地面虛線前往${phase.value === 1 ? supportDraft[objective.value!.id].teacher : objective.value?.name || '南門'}的目標圈，靠近後互動。`;
});
const currentChoices = computed(() =>
  choicesFor(current.value, currentSlotData.value.variant, stage.value),
);
const displayChoices = computed(() =>
  shuffledChoices(currentChoices.value, progress.value.seed, current.value.id, stage.value),
);
const scenePrompt = computed(() =>
  stage.value === 0
    ? current.value.question
    : stage.value === 1
      ? support.value.prompt
      : current.value.followup,
);
const sceneNarration = computed(() =>
  stage.value === 0
    ? current.value.intro
    : stage.value === 1
      ? `${support.value.teacher}看向你，等你說明剛才發生的事。`
      : returnNarration(currentSlotData.value),
);
const blocked = computed(
  () =>
    !!transitionLabel.value ||
    !started.value ||
    paused.value ||
    !!panel.value ||
    terminal.value ||
    tabHidden.value ||
    !inView.value,
);
const lastDecision = computed(() => progress.value.decisions.at(-1));
const failedStory = computed(() =>
  dayStories.value.find((s) => s.id === lastDecision.value?.storyId),
);
const failedOption = computed(() =>
  lastDecision.value ? optionFor(progress.value, lastDecision.value) : null,
);
const correctAlternative = computed(() => {
  const d = lastDecision.value,
    s = failedStory.value;
  return d && s
    ? choicesFor(s, progress.value.schedule.find((slot) => slot.id === s.id)!.variant, d.step).find(
        (c) => c.correct,
      )
    : null;
});
const correctCount = computed(
  () => progress.value.decisions.filter((d) => optionFor(progress.value, d)?.correct).length,
);
const bridge: GameBridge = {
  position: { ...START },
  map: 'campus',
  npcs: createNpcs(),
  requestPortal: null,
  input: { x: 0, y: 0 },
  paused: true,
  completed: [],
  activeId: null,
  destination: quest.value,
  reducedMotion: reduced.value,
  tick: (delta) => {
    if (blocked.value || !waiting.value || !objective.value || bridge.map !== objective.value.map)
      return;
    onsetElapsed += delta;
    const npc = bridge.npcs.find((n) => n.id === objective.value!.id)!;
    if (
      onsetElapsed >= slot.value!.delay ||
      Math.hypot(npc.x - bridge.position.x, npc.y - bridge.position.y) < 90
    ) {
      progress.value = revealEvent(progress.value);
      save();
      showIncident();
    }
  },
  update: (p, npc, guide) => {
    if (performance.now() - statusTimer < 32) return;
    statusTimer = performance.now();
    position.value = p;
    nearby.value = npc;
    routeSnapshot.value = JSON.stringify(guide.path);
    routeBlocked.value = guide.blocked;
    guideLabel.value = guide.label;
    npcSnapshot.value = JSON.stringify(
      bridge.npcs
        .filter((n) => n.map === bridge.map)
        .map((n) => ({ id: n.id, x: Math.round(n.x), y: Math.round(n.y), moving: n.moving })),
    );
    if (Math.hypot(p.x - progress.value.position.x, p.y - progress.value.position.y) > 8) {
      progress.value.position = p;
      if (!saveTimer)
        saveTimer = setTimeout(() => {
          saveTimer = undefined;
          save();
        }, 800);
    }
  },
  visit: (id) => {
    if (progress.value.visited.includes(id)) return;
    progress.value.visited.push(id);
    save();
  },
  interact: (id) => {
    if (bridge.paused) return;
    if (nearby.value !== id) {
      notice.value = '走近當前目標，才能處理情境。';
      return;
    }
    openStory(id === quest.value.id && objective.value ? objective.value.id : id);
  },
  transition: (label) => {
    transitionLabel.value = label;
    clearInput();
    bridge.paused = blocked.value;
  },
  travel: (portal) => {
    bridge.map = portal.to;
    bridge.position = { ...portal.arrival };
    progress.value.map = portal.to;
    progress.value.position = { ...portal.arrival };
    position.value = { ...portal.arrival };
    nearby.value = null;
    save();
  },
  previews: (frames) => {
    eventFrames.value = frames;
  },
  ready: () => {
    ready.value = true;
  },
};
watch(
  blocked,
  (value) => {
    bridge.paused = value;
    clearInput();
  },
  { immediate: true },
);
watch(
  () => [
    progress.value.seed,
    progress.value.completed.length,
    progress.value.decisions.length,
    progress.value.revealed.length,
  ],
  () => {
    bridge.completed = [...progress.value.completed];
    bridge.destination = quest.value;
    bridge.activeId = quest.value.id === 'prepare' ? null : quest.value.id;
    const active = objective.value;
    const existing = bridge.npcs.filter((n) => n.id !== 'adult-onsite');
    if (active && phase.value > 0 && supportDraft[active.id].destination === 'office') {
      const points = [
        { x: active.x + 50, y: active.y + 50 },
        { x: active.x - 50, y: active.y + 40 },
        { x: active.x + 70, y: active.y },
      ];
      const point =
        points.find((p) =>
          canStand(
            p,
            active.map,
            existing.filter((n) => n.map === active.map),
          ),
        ) || points[2];
      existing.push({
        id: 'adult-onsite',
        name: '陳老師',
        map: active.map,
        ...point,
        facing: 'down',
        moving: false,
        waypoint: 0,
      });
    }
    bridge.npcs = existing;
  },
  { deep: true },
);
watch(panel, async (value, oldValue) => {
  clearInput();
  await nextTick();
  if (value) {
    if (!oldValue) previousFocus = document.activeElement as HTMLElement;
    if (!reader.value?.open) reader.value?.showModal();
    readerTitle.value?.focus();
  } else {
    reader.value?.close();
    previousFocus?.focus();
    if (started.value) playfield.value?.focus({ preventScroll: true });
  }
});
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress.value));
    storageOk.value = true;
  } catch {
    storageOk.value = false;
  }
}
function clearInput() {
  pressed.clear();
  bridge.input.x = 0;
  bridge.input.y = 0;
}
function updateInput() {
  bridge.input.x = Number(pressed.has('right')) - Number(pressed.has('left'));
  bridge.input.y = Number(pressed.has('down')) - Number(pressed.has('up'));
}
const keyDirections: Record<string, string> = {
  ArrowUp: 'up',
  w: 'up',
  ArrowDown: 'down',
  s: 'down',
  ArrowLeft: 'left',
  a: 'left',
  ArrowRight: 'right',
  d: 'right',
};
function keydown(event: KeyboardEvent) {
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    !started.value ||
    panel.value ||
    terminal.value
  )
    return;
  if (
    event.key !== 'Escape' &&
    event.target instanceof Element &&
    event.target.closest('button, a, input, select, textarea')
  )
    return;
  const direction = keyDirections[event.key] || keyDirections[event.key.toLowerCase()];
  if (direction && !blocked.value) {
    event.preventDefault();
    pressed.add(direction);
    updateInput();
  }
  if (['e', 'E', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
    if (!event.repeat) interact();
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    togglePause();
  }
}
function keyup(event: KeyboardEvent) {
  const direction = keyDirections[event.key] || keyDirections[event.key.toLowerCase()];
  if (direction) {
    pressed.delete(direction);
    updateInput();
  }
}
function touchDown(event: PointerEvent, direction: string) {
  if (blocked.value) return;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  pressed.add(direction);
  updateInput();
}
function touchUp(direction: string) {
  pressed.delete(direction);
  updateInput();
}
async function start() {
  started.value = true;
  paused.value = false;
  if (terminal.value) {
    viewOutcome();
    return;
  }
  if (
    objective.value &&
    progress.value.revealed.includes(objective.value.id) &&
    !announced.has(objective.value.id) &&
    phase.value === 0
  )
    showIncident();
  await nextTick();
  if (!panel.value) playfield.value?.focus({ preventScroll: true });
  playfield.value
    ?.closest('.game-shell')
    ?.scrollIntoView({ block: 'start', behavior: reduced.value ? 'instant' : 'smooth' });
}
function showIncident() {
  if (!objective.value || terminal.value || waiting.value) return;
  selected.value = objective.value.id;
  announced.add(objective.value.id);
  incidentPlaying.value =
    !reduced.value && !!eventFrames.value[`${current.value.id}:${currentSlotData.value.variant}`];
  panel.value = 'incident';
}
function closeReader() {
  if (panel.value === 'incident' && incidentPlaying.value) return;
  panel.value = null;
}
function nextLocation() {
  panel.value = null;
  onsetElapsed = 0;
}
function viewOutcome() {
  panel.value =
    progress.value.status === 'failed' && lastDecision.value?.step === 1 ? 'correction' : 'outcome';
}
function togglePause() {
  if (paused.value) start();
  else {
    paused.value = true;
    clearInput();
  }
}
function interact() {
  if (blocked.value) return;
  if (allDone.value && isAtGate.value) {
    leaveSchool();
    return;
  }
  if (atCurrentNpc.value) {
    openStory(objective.value!.id);
    return;
  }
  if (door.value) {
    bridge.requestPortal = door.value.id;
    return;
  }
  if (nearby.value) openStory(nearby.value);
  else
    notice.value = objective.value
      ? `現在是 ${objective.value.time}，請前往${objective.value.location}，靠近${objective.value.name}再按 E。`
      : '所有情境已完成，請回南門放學。';
}
function openStory(id: string) {
  if (terminal.value) {
    panel.value = 'outcome';
    return;
  }
  if (id !== objective.value?.id) {
    notice.value = objective.value
      ? `先完成 ${objective.value.time}「${objective.value.title}」，一天會依時間推進。`
      : '今天的情境都完成了，請回南門放學。';
    return;
  }
  if (!atCurrentNpc.value || waiting.value) {
    notice.value = taskInstruction.value;
    panel.value = null;
    return;
  }
  selected.value = id;
  stage.value = phase.value;
  result.value = null;
  panel.value = 'story';
}
function choose(choice: Choice) {
  if (result.value || panel.value !== 'story') return;
  progress.value.position = { ...bridge.position };
  progress.value.map = bridge.map;
  const next = recordChoice(
    progress.value,
    current.value.id,
    stage.value,
    currentChoices.value.indexOf(choice),
  );
  if (next === progress.value) return;
  progress.value = next;
  result.value = choice;
  save();
  if (!choice.correct) {
    notice.value = '本輪已失敗。查看選擇後果與回饋後，從校門重新開始一天。';
    panel.value = stage.value === 1 ? 'correction' : 'outcome';
    clearInput();
  }
  nextTick(() => readerTitle.value?.focus());
}
function advance() {
  if (!result.value?.correct || terminal.value) return;
  if (stage.value < 2) {
    notice.value = stage.value === 0 ? support.value.objective : support.value.returnObjective;
    result.value = null;
    panel.value = null;
  } else {
    stage.value = 3;
    notice.value = objective.value
      ? `下一時段：${objective.value.period}。事件會依當輪課表發生。`
      : '八個情境都已通過，回南門取得總結。';
  }
  nextTick(() => readerTitle.value?.focus());
}
function leaveSchool() {
  progress.value.position = { ...bridge.position };
  const next = finishDay(progress.value);
  if (next === progress.value) {
    notice.value = '完成全部八個情境，回到南門後才能放學結算。';
    return;
  }
  progress.value = next;
  save();
  panel.value = 'outcome';
}
function reset() {
  progress.value = freshProgress(newRunSeed());
  bridge.position = { ...START };
  bridge.map = 'campus';
  bridge.npcs = createNpcs();
  announced.clear();
  bridge.requestPortal = null;
  bridge.completed = [];
  bridge.activeId = null;
  bridge.destination = quest.value;
  onsetElapsed = 0;
  position.value = { ...START };
  nearby.value = null;
  notice.value = '從南門重新開始。目標：八個情境全數通過，再回校門放學。';
  panel.value = null;
  save();
  start();
}
function visibility() {
  tabHidden.value = document.hidden;
  if (document.hidden) {
    clearInput();
    save();
  }
}
function blur() {
  clearInput();
  if (started.value && !panel.value && !terminal.value) paused.value = true;
}
function motionChange() {
  reduced.value = motion.matches;
  bridge.reducedMotion = reduced.value;
}
async function boot() {
  loadError.value = false;
  try {
    const { createCampusGame } = await import('./game/CampusScene');
    if (!disposed && host.value) game = createCampusGame(host.value, bridge);
  } catch {
    loadError.value = true;
  }
}
onMounted(() => {
  try {
    progress.value = parseProgress(localStorage.getItem(SAVE_KEY), progress.value.seed);
  } catch {
    storageOk.value = false;
  }
  bridge.position = { ...progress.value.position };
  bridge.map = progress.value.map;
  bridge.completed = [...progress.value.completed];
  bridge.destination = quest.value;
  bridge.activeId = quest.value.id === 'prepare' ? null : quest.value.id;
  position.value = { ...bridge.position };
  window.addEventListener('keyup', keyup);
  window.addEventListener('blur', blur);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pagehide', save);
  motion.addEventListener('change', motionChange);
  observer = new IntersectionObserver(([entry]) => {
    inView.value = entry.isIntersecting;
  });
  if (playfield.value) observer.observe(playfield.value);
  boot();
});
onBeforeUnmount(() => {
  disposed = true;
  save();
  if (saveTimer) clearTimeout(saveTimer);
  game?.destroy(true);
  observer?.disconnect();
  reader.value?.close();
  window.removeEventListener('keyup', keyup);
  window.removeEventListener('blur', blur);
  document.removeEventListener('visibilitychange', visibility);
  window.removeEventListener('pagehide', save);
  motion.removeEventListener('change', motionChange);
});
const directions = [
  { id: 'up', label: '向上移動', path: 'm6 14 6-6 6 6' },
  { id: 'left', label: '向左移動', path: 'm14 6-6 6 6 6' },
  { id: 'down', label: '向下移動', path: 'm6 10 6 6 6-6' },
  { id: 'right', label: '向右移動', path: 'm10 6 6 6-6 6' },
];
</script>
<template>
  <section class="campus-app" aria-labelledby="campus-title">
    <div class="campus-heading">
      <div>
        <h1 id="campus-title">同一座校園<span>從進校門，到放學的一天。</span></h1>
        <p>目標：完成八個校園情境、做出二十四次適切選擇，最後回南門放學。</p>
      </div>
      <a href="/awareness/" class="back-link">互動宣導 <SiteIcon name="arrow" :size="16" /></a>
    </div>
    <div class="game-shell">
      <div class="game-toolbar">
        <span class="mission"
          ><SiteIcon name="clock" :size="18" /><span
            >{{
              terminal
                ? progress.status === 'finished'
                  ? '15:30 放學・本日通關'
                  : '本輪挑戰失敗'
                : objective
                  ? `${objective.time} ${objective.period}`
                  : '15:30 回南門放學'
            }}<small
              >{{
                objective && !terminal
                  ? `目標：${objective.location}・${objective.name}`
                  : terminal
                    ? `適切選擇 ${correctCount} / 24`
                    : '回到地圖下方的南門，按 E 或放學離校'
              }}<span class="landmark-count"
                >・情境 {{ progress.completed.length }} / {{ stories.length }}</span
              ></small
            ></span
          ></span
        >
        <div class="game-tools">
          <button aria-label="探索手冊" @click="panel = 'journal'">
            <SiteIcon name="book" :size="18" /><span>探索手冊</span></button
          ><button aria-label="操作說明" @click="panel = 'help'">
            <svg
              class="help-symbol"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 8.8a2.6 2.6 0 0 1 5.1.6c0 1.8-2.6 2.2-2.6 4" />
              <circle cx="12" cy="16.5" r=".8" fill="currentColor" stroke="none" />
            </svg></button
          ><button
            v-if="started && !terminal"
            :aria-label="paused ? '繼續探索' : '暫停遊戲'"
            @click="togglePause"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path :d="paused ? 'M7 3v18l14-9Z' : 'M6 4h4v16H6zM14 4h4v16h-4z'" />
            </svg>
          </button>
        </div>
      </div>
      <div v-if="started && !terminal" class="current-task" aria-live="polite" aria-atomic="true">
        <strong>{{ taskInstruction }}</strong>
        <p class="route-destination">
          <svg width="30" height="12" viewBox="0 0 30 12" fill="none" aria-hidden="true">
            <path d="M1 6h21" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" />
            <circle cx="26" cy="6" r="3" stroke="currentColor" stroke-width="2" />
          </svg>
          虛線終點：{{ guideLabel }}
        </p>
        <p>{{ taskHelp }}</p>
        <button v-if="!waiting" class="text-action event-revisit" @click="showIncident">
          重看目前事件
        </button>
      </div>
      <div
        ref="playfield"
        class="playfield"
        tabindex="0"
        role="region"
        aria-label="向陽中學地圖，方向鍵或 WASD 移動，靠近當前目標按 E 或 Enter 互動"
        :data-ready="ready"
        :data-map="progress.map"
        :data-transition="transitionLabel"
        :data-guide="guideLabel"
        :data-route="routeSnapshot"
        :data-route-blocked="routeBlocked"
        :data-npcs="npcSnapshot"
        :data-player-x="Math.round(position.x)"
        :data-player-y="Math.round(position.y)"
        :data-nearby="nearby || ''"
        :data-paused="blocked"
        :data-objective="objective?.id || 'gate'"
        :data-status="progress.status"
        :data-phase="waiting ? 'waiting' : phase"
        :data-target="quest.id"
        :data-seed="progress.seed"
        @keydown="keydown"
        @pointerdown.self="playfield?.focus({ preventScroll: true })"
      >
        <div
          ref="host"
          class="phaser-host"
          @pointerdown="playfield?.focus({ preventScroll: true })"
        ></div>
        <div v-if="transitionLabel" class="map-transition" role="status">
          {{ transitionLabel }}…
        </div>
        <div v-if="!started" class="departure-overlay">
          <div class="departure-paper">
            <SiteIcon class="school-mark" name="book" :size="38" />
            <h2>今天，你會怎麼回應？</h2>
            <p>從早晨進校門到 15:30 放學，<br />沿著當輪課表，處理八個隨機微事件。</p>
            <p class="challenge-rule">
              二十四次選擇必須全部通過。<br />任一選項選錯，本輪立即失敗，需重開一天。
            </p>
            <button v-if="!loadError" class="primary-action" :disabled="!ready" @click="start">
              {{
                !ready
                  ? '正在準備校園…'
                  : terminal
                    ? '查看本輪結果'
                    : progress.decisions.length
                      ? '繼續今天的挑戰'
                      : '從校門開始'
              }}<SiteIcon name="arrow" :size="18" />
            </button>
            <div v-else role="alert">
              <p>校園未能載入，請檢查連線後重試。</p>
              <button class="primary-action" @click="boot">重新載入校園</button>
            </div>
            <span class="departure-note">鍵盤與觸控皆可・進度儲存在此瀏覽器</span>
          </div>
        </div>
        <div v-else-if="terminal" class="pause-overlay outcome-overlay">
          <div>
            <h2>{{ progress.status === 'failed' ? '本輪挑戰失敗' : '今天，平安放學了。' }}</h2>
            <p>
              {{
                progress.status === 'failed'
                  ? '先看這個選擇的後果，再重新開始一天。'
                  : '八個情境、二十四次選擇，已全部通過。'
              }}
            </p>
            <button class="primary-action" @click="viewOutcome">
              {{
                progress.status === 'failed'
                  ? lastDecision?.step === 1
                    ? '繼續和老師談'
                    : '查看失敗回饋'
                  : '查看放學總結'
              }}
            </button>
          </div>
        </div>
        <div v-else-if="paused" class="pause-overlay">
          <div>
            <h2>先停一下，準備好再繼續。</h2>
            <p>目前進度已保留。</p>
            <button class="primary-action" @click="start">
              繼續探索 <SiteIcon name="arrow" :size="18" />
            </button>
          </div>
        </div>
        <div v-if="started && !paused && !terminal && canAct" class="nearby-prompt">
          <span>{{
            atCurrentNpc ? '已到達・現在可以對話' : atTaskDoor ? '已到入口' : '今天的挑戰已完成'
          }}</span>
          <button @click="interact"><kbd>E</kbd> {{ actionLabel }}</button>
        </div>
        <span v-if="started" class="map-location">向陽中學 · {{ mapNames[progress.map] }}</span>
      </div>
      <div class="game-bottom">
        <p class="keyboard-hint">
          <kbd>↑ ↓ ← →</kbd> / WASD 移動・<kbd>E</kbd> 互動・<kbd>Esc</kbd> 暫停
        </p>
        <div class="touch-controls" aria-label="觸控操作">
          <div class="d-pad">
            <button
              v-for="direction in directions"
              :key="direction.id"
              :class="direction.id"
              :aria-label="direction.label"
              :disabled="blocked"
              @pointerdown.prevent="touchDown($event, direction.id)"
              @pointerup="touchUp(direction.id)"
              @pointercancel="touchUp(direction.id)"
              @lostpointercapture="touchUp(direction.id)"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path :d="direction.path" />
              </svg></button
            ><span class="d-pad-center" aria-hidden="true"></span>
          </div>
          <span class="touch-hint">按住方向鍵移動<br />找到當前目標</span
          ><button
            class="touch-interact"
            :disabled="blocked || !canAct"
            :aria-label="actionLabel"
            @click="interact"
          >
            <SiteIcon name="person" :size="22" /><span v-if="atCurrentNpc"
              >對話<br />{{
                phase === 1 ? supportDraft[objective!.id].teacher : objective?.name
              }}</span
            ><span v-else>{{
              atTaskDoor ? taskPortal?.label : allDone ? '放學' : '靠近目標'
            }}</span>
          </button>
        </div>
        <span class="save-status">{{
          storageOk ? '進度自動儲存於此裝置' : '無法儲存：目前進度僅保留至關閉頁面'
        }}</span>
      </div>
    </div>
    <p class="exploration-notice" role="status" aria-live="polite">
      {{
        notice ||
        (terminal
          ? '這輪已結束；可查看回饋，或從校門重新開始。'
          : allDone
            ? '八個情境已通過，回南門放學後才會產生最終總結。'
            : '依課表完成當前情境。任何一步選錯，本輪立即失敗。')
      }}
    </p>
    <details class="learning-note">
      <summary>情境現實性與內容來源</summary>
      <p>
        人物與事件為虛構。對話以當下可觀察的言行呈現，不讓每個角色自行講解診斷。表達與自我理解有個別差異，不能一概假定智能障礙者不能說明自己的狀況。
      </p>
      <p>
        打人不等於情緒行為障礙；不回應不等於故意忽略；如廁意外不等於智能障礙。遊戲不以單一事件判定診斷。遇到安全、身體照護或衛生事件，學生應求助師長，不自行壓制、診斷或處理身體清潔。
      </p>
      <p>
        以安全、尊重、自主、隱私與可參與性判斷選項。手冊提供當前情境的文字入口，和地圖共用同一挑戰進度，無法跳關或跳過失敗。
      </p>
      <ul>
        <li v-for="source in contentSources" :key="source.href">
          <a :href="source.href" target="_blank" rel="noopener noreferrer"
            >{{ source.title }}（另開視窗）</a
          >
        </li>
      </ul>
    </details>
    <dialog
      ref="reader"
      class="campus-reader"
      :class="{ 'story-reader': panel === 'story', 'outcome-reader': panel === 'outcome' }"
      aria-labelledby="reader-title"
      @cancel.prevent="closeReader"
    >
      <div class="reader-heading">
        <h2 id="reader-title" ref="readerTitle" tabindex="-1">
          {{
            panel === 'correction'
              ? `${failedStory ? supportDraft[failedStory.id].teacher : '老師'}・談談剛才的回報`
              : panel === 'incident'
                ? `${current.time} ${current.location}・有事情發生了`
                : panel === 'story'
                  ? current.title
                  : panel === 'journal'
                    ? '今天的課表與相處手冊'
                    : panel === 'reset'
                      ? '重新開始這一天？'
                      : panel === 'outcome'
                        ? progress.status === 'finished'
                          ? '15:30 放學總結：本日通關'
                          : '本輪挑戰失敗'
                        : '挑戰規則與操作'
          }}
        </h2>
        <button
          class="close-reader"
          aria-label="關閉視窗"
          :disabled="panel === 'incident' && incidentPlaying"
          @click="closeReader"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <template v-if="panel === 'correction' && failedStory && failedOption">
        <TeacherCorrection
          :teacher="supportDraft[failedStory.id].teacher"
          :statement="failedOption.text"
          :correction="failedOption.response"
          :alternative="correctAlternative?.text || ''"
          @complete="panel = 'outcome'"
        />
      </template>
      <template v-else-if="panel === 'incident'">
        <IncidentFilm
          v-if="eventFrames[`${current.id}:${currentSlotData.variant}`]"
          :key="current.id"
          :frames="eventFrames[`${current.id}:${currentSlotData.variant}`]"
          :captions="eventCaptions(currentSlotData)"
          :reduced="reduced"
          @playing="incidentPlaying = $event"
        />
        <h3 class="incident-title">{{ current.title }}</h3>
        <p class="incident-destination">接下來：{{ taskInstruction }}。</p>
        <p class="incident-note" role="status">
          {{
            incidentPlaying ? '情境播放中，播完即可前往查看。' : '情境已完整呈現，可以前往查看。'
          }}
        </p>
        <div class="reader-actions">
          <span>移動 → 靠近角色 → 按 E 對話</span
          ><button class="primary-action" :disabled="incidentPlaying" @click="closeReader">
            前往查看 <SiteIcon name="arrow" :size="18" />
          </button>
        </div>
      </template>
      <template v-else-if="panel === 'story'"
        ><div class="character-intro">
          <span
            class="pixel-portrait"
            :style="{ '--shirt': stage === 1 ? '#69776b' : current.color }"
            aria-hidden="true"
            ><i></i
          ></span>
          <div>
            <strong>{{ stage === 1 ? support.teacher : current.name }}</strong>
            ><span
              >{{ current.time }} {{ current.period }}・{{
                stage === 1 ? support.destinationLabel : current.location
              }}</span
            >
          </div>
          <span class="chapter">{{
            stage === 3
              ? '情境通過'
              : `${stage === 0 ? '現場' : stage === 1 ? '回報' : '返回'}・選擇 ${stage + 1} / 3`
          }}</span>
        </div>
        <template v-if="stage < 3"
          ><p class="story-narrative">{{ sceneNarration }}</p>
          <template v-if="!result"
            ><h3 class="story-question">{{ scenePrompt }}</h3>
            <p class="choice-rule">請依當下資訊選擇；選錯即結束本輪。</p>
            <div class="story-choices">
              <button
                v-for="(choice, index) in displayChoices"
                :key="choice.text"
                @click="choose(choice)"
              >
                <span>{{ index + 1 }}</span
                >{{ choice.text }}<SiteIcon name="arrow" :size="17" />
              </button></div
          ></template>
          <div v-else class="story-feedback">
            <p class="character-response"><strong>現場後續</strong>{{ result.response }}</p>
            <div class="knowledge-feedback">
              <SiteIcon name="leaf" :size="20" />
              <p>{{ result.feedback }}</p>
            </div>
            <p v-if="stage === 0" class="travel-narration">{{ support.beforeTravel }}</p>
            <p v-if="stage === 1" class="travel-narration">{{ support.returnObjective }}</p>
            <div class="reader-actions">
              <span class="correct-choice">此步通過</span
              ><button class="primary-action" @click="advance">
                {{
                  stage === 0
                    ? `前往${support.destinationLabel}`
                    : stage === 1
                      ? '回到現場'
                      : '完成這個情境'
                }}<SiteIcon name="arrow" :size="17" />
              </button>
            </div></div></template
        ><template v-else
          ><p class="story-narrative">{{ result?.next }}</p>
          <div class="takeaway">
            <SiteIcon name="book" :size="24" />
            <h3>{{ current.takeaway }}</h3>
            <p>{{ current.myth }}</p>
          </div>
          <div class="reader-actions">
            <span class="correct-choice"
              >情境 {{ progress.completed.length }} / {{ stories.length }} 通過</span
            ><button class="primary-action" @click="nextLocation">
              {{ allDone ? '回南門放學' : `前往 ${objective?.time} 下一站`
              }}<SiteIcon name="arrow" :size="17" />
            </button></div></template
      ></template>
      <template v-else-if="panel === 'outcome'"
        ><p class="outcome-intro">
          {{
            progress.status === 'finished'
              ? '你從校門出發，完成了上學一天的八個情境，並在南門結束挑戰。'
              : '這一輪已停止。失敗的是這次選擇，不是對你或任何一位同學的評價。'
          }}
        </p>
        <p class="day-score">
          適切選擇 <strong>{{ correctCount }} / 24</strong>・完成情境
          {{ progress.completed.length }} / {{ stories.length }}
        </p>
        <template v-if="progress.status === 'failed' && failedStory && failedOption"
          ><div class="failure-feedback">
            <p>
              <strong
                >{{ failedStory.time }} {{ failedStory.title }}・第
                {{ (lastDecision?.step || 0) + 1 }} 步</strong
              >
            </p>
            <p>你選擇：{{ failedOption.text }}</p>
            <h3>{{ lastDecision?.step === 1 ? '老師的指正' : '發生了什麼' }}</h3>
            <p>{{ failedOption.response }}</p>
            <h3>為什麼本輪未通過</h3>
            <p>{{ failedOption.feedback }}</p>
            <h3>下次可以怎麼做</h3>
            <p>{{ correctAlternative?.text }}</p>
          </div>
          <p class="choice-rule">
            本輪不能改選或跳到下一關；重新開始會回到到校時段的校門。
          </p></template
        ><template v-else
          ><div class="takeaway">
            <SiteIcon name="leaf" :size="24" />
            <h3>能求助、會詢問、守隱私，讓彼此都能上學。</h3>
            <p>你沒有替同學診斷、代替所有決定，或獨自承擔危險；你依現場需要採取行動。</p>
          </div>
          <h3 class="summary-title">今天的八次相遇</h3></template
        >
        <div v-if="progress.status === 'failed'" class="reader-actions">
          <button class="text-action" @click="panel = 'journal'">查看相處手冊</button>
          <button class="primary-action" @click="reset">
            重新開始一天 <SiteIcon name="arrow" :size="17" />
          </button>
        </div>
        <ol class="day-review">
          <li v-for="s in dayStories.filter((s) => progress.completed.includes(s.id))" :key="s.id">
            <div>
              <time>{{ s.time }}</time
              ><strong>{{ s.title }}</strong>
            </div>
            <p>{{ s.takeaway }}</p>
            <details>
              <summary>回顧這次的三個選擇</summary>
              <p v-for="d in progress.decisions.filter((d) => d.storyId === s.id)" :key="d.step">
                {{ d.step + 1 }}. {{ optionFor(progress, d)?.text }}
              </p>
            </details>
          </li>
        </ol>
        <p v-if="progress.status === 'finished'" class="completion-note">
          回到生活：下次遇到沉默、衝突或私密意外，先描述你確定看見的事，保留安全與尊嚴，必要時找師長。你不需要知道對方的診斷，才能做出適切回應。
        </p>
        <div v-if="progress.status === 'finished'" class="reader-actions">
          <button class="text-action" @click="panel = 'journal'">查看相處手冊</button
          ><button class="primary-action" @click="reset">
            重新開始一天 <SiteIcon name="arrow" :size="17" />
          </button></div
      ></template>
      <template v-else-if="panel === 'journal'"
        ><p class="journal-summary">
          目標：八個情境、二十四次選擇全數通過，再回南門放學。<span>{{
            progress.status === 'failed'
              ? '本輪已失敗，必須重新開始一天。'
              : progress.status === 'finished'
                ? '本日已通關，可回顧放學總結。'
                : '課表依序推進；文字入口與地圖共用同一輪進度。'
          }}</span>
        </p>
        <ol class="day-timeline">
          <li
            v-for="s in dayStories"
            :key="s.id"
            :class="{
              'is-current': objective?.id === s.id && !terminal,
              'is-complete': progress.completed.includes(s.id),
            }"
          >
            <time>{{ s.time }}</time
            ><span
              ><strong>{{ s.title }}</strong
              ><small
                >{{ s.location }}・{{
                  progress.completed.includes(s.id)
                    ? '已通過'
                    : objective?.id === s.id && !terminal
                      ? '目前目標'
                      : '待完成'
                }}</small
              ></span
            ><button
              v-if="objective?.id === s.id && !terminal && atCurrentNpc"
              class="text-action"
              @click="openStory(s.id)"
            >
              開始情境
            </button>
          </li>
          <li :class="{ 'is-current': allDone && !terminal }">
            <time>15:30</time
            ><span
              ><strong>回南門放學</strong><small>必須回到地圖南門，才能完成本日挑戰。</small></span
            >
          </li>
        </ol>
        <h3>相處知識</h3>
        <nav class="journal-tabs" aria-label="障礙與支持需求圖鑑">
          <button
            v-for="s in dayStories"
            :key="s.id"
            :aria-pressed="selected === s.id"
            @click="selected = s.id"
          >
            {{ s.category }}
          </button>
        </nav>
        <article class="encyclopedia">
          <h3>{{ current.category }}</h3>
          <p>{{ current.knowledge }}</p>
          <h4>可以這樣回應</h4>
          <ul>
            <li v-for="tip in current.tips" :key="tip">{{ tip }}</li>
          </ul>
          <p class="myth-note">{{ current.myth }}</p>
        </article>
        <button v-if="terminal" class="text-action" @click="panel = 'outcome'">
          {{ progress.status === 'failed' ? '查看失敗回饋' : '查看放學總結' }}</button
        ><button class="reset-link" @click="panel = 'reset'">清除本輪進度並重玩</button></template
      >
      <template v-else-if="panel === 'help'"
        ><div class="help-content">
          <p>
            你是向陽中學的學生。目標是在上學的一天完成八個情境、二十四次適切選擇，最後回南門放學。每個情境有現場、回報、返回三個決定；任一步選錯，整輪立即失敗。
          </p>
          <dl>
            <dt>順著一天前進</dt>
            <dd>
              沿地面虛線走到目標圈；轉角會畫出完整走法。跨地圖時虛線先接到正確門口，進門轉場後，再接到老師或同學身邊。靠近門口可按
              E，或直接走入。
              校園、教室、操場、教師辦公室可以往返，體育課請去操場。只有目前情境可以開始；完成後才推進時間，沒有即時倒數。
            </dd>
            <dt>電腦</dt>
            <dd>點一下地圖，方向鍵或 WASD 移動；E、Enter、空白鍵互動；Esc 暫停。</dd>
            <dt>手機與平板</dt>
            <dd>按住方向鍵移動，靠近目標後按「互動」。完成所有情境後，回南門按「放學」。</dd>
            <dt>文字入口</dt>
            <dd>
              手冊中的「開始情境」提供同一個目前階段；只有抵達目前對話對象附近才開放；回報與返回現場也需要實際走到目的地。
            </dd>
            <dt>失敗與總結</dt>
            <dd>
              失敗會說明所選行動、後果與適切做法，不能改選接關。通關後逐項回顧今天的選擇與相處重點。
            </dd>
            <dt>儲存</dt>
            <dd>
              只存在此瀏覽器；失敗狀態也會保留，重新整理不能消除失敗。新版不沿用舊版兩階段挑戰的完成數。
            </dd>
          </dl>
        </div></template
      >
      <template v-else-if="panel === 'reset'"
        ><p>會清除這一輪的選擇與結果，回到到校時段 南門重新開始。網站其他工具的資料不受影響。</p>
        <div class="reader-actions">
          <button class="text-action" @click="panel = 'journal'">保留進度</button
          ><button class="primary-action" @click="reset">重新開始一天</button>
        </div></template
      >
    </dialog>
  </section>
</template>
<style src="./campus.css"></style>
