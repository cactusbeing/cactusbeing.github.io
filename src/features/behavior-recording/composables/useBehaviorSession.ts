import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { blankProfile, createSession } from '../domain/session';
export function useBehaviorSession() {
  const profile = ref(blankProfile());
  const sessions = ref([createSession(1)]);
  const activeId = ref(1);
  const now = ref(Date.now());
  const active = computed(() => sessions.value.find((session) => session.id === activeId.value)!);
  const locked = computed(() =>
    sessions.value.some((session) => session.status === 'running' || session.status === 'paused'),
  );
  let timer: ReturnType<typeof setInterval> | undefined;
  function beforeLeave(event: BeforeUnloadEvent) {
    if (locked.value || sessions.value.some((session) => session.events.length > 0)) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now();
    }, 200);
    window.addEventListener('beforeunload', beforeLeave);
  });
  onBeforeUnmount(() => {
    clearInterval(timer);
    window.removeEventListener('beforeunload', beforeLeave);
  });
  function addBehavior() {
    const id = Math.max(...sessions.value.map((session) => session.id)) + 1;
    sessions.value.push(createSession(id));
    activeId.value = id;
  }
  function resetActive() {
    const index = sessions.value.findIndex((session) => session.id === activeId.value);
    sessions.value[index] = createSession(activeId.value, active.value.behavior);
  }
  function clearAll() {
    sessions.value = [createSession(1)];
    activeId.value = 1;
    profile.value = blankProfile();
  }
  return { profile, sessions, activeId, now, active, locked, addBehavior, resetActive, clearAll };
}
