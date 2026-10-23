<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import BaseCard from '../../shared/components/BaseCard.vue';
import BaseModal from '../../shared/components/BaseModal.vue';
import FormField from '../../shared/components/FormField.vue';
import FeedbackMessage from '../../shared/components/FeedbackMessage.vue';
import BehaviorChart from './BehaviorChart.vue';
import { useBehaviorSession } from './composables/useBehaviorSession';
import { elapsed, start, stop, pause, resume, record } from './domain/session';
import { averageInterval, formatElapsed, frequencyPerMinute } from './domain/calculations';
import { exportCsv, localDate, localTime } from './domain/export';
import { downloadText } from '../../shared/utils';
const { profile, sessions, activeId, active, now, locked, addBehavior, resetActive, clearAll } =
  useBehaviorSession();
const message = ref('');
const reset = ref<'session' | 'all' | null>(null);
const sortKey = ref<'count' | 'interval' | 'behavior'>('count');
const descending = ref(true);
const autoSort = ref(true);
const manualOrder = ref<number[]>([]);
function compare(a: typeof active.value, b: typeof active.value) {
  const difference =
    sortKey.value === 'behavior'
      ? a.behavior.localeCompare(b.behavior, 'zh-Hant')
      : sortKey.value === 'count'
        ? a.events.length - b.events.length
        : averageInterval(a) - averageInterval(b);
  return difference * (descending.value ? -1 : 1);
}
const summaries = computed(() => {
  const rows = [...sessions.value];
  if (autoSort.value) return rows.sort(compare);
  if (manualOrder.value.length)
    return rows.sort((a, b) => {
      const rank = (id: number) => {
        const index = manualOrder.value.indexOf(id);
        return index < 0 ? manualOrder.value.length : index;
      };
      return rank(a.id) - rank(b.id);
    });
  return rows;
});
function sort(key: typeof sortKey.value) {
  if (sortKey.value === key) descending.value = !descending.value;
  else {
    sortKey.value = key;
    descending.value = true;
  }
  manualOrder.value = [...sessions.value].sort(compare).map((session) => session.id);
}
function begin() {
  message.value = start(active.value, profile.value, Date.now()) ? '' : '請先輸入標的行為名稱。';
}
function recordEvent() {
  const result = record(active.value, Date.now());
  message.value = result === 'debounced' ? '已保留上一筆記錄；同一行為請間隔至少 1 秒再記錄。' : '';
}
function exportActive() {
  downloadText(
    exportCsv(active.value),
    `行為記錄_${active.value.behavior}.csv`,
    'text/csv;charset=utf-8',
  );
}
function confirmReset() {
  if (reset.value === 'all') clearAll();
  else resetActive();
  reset.value = null;
  message.value = '';
}
const statusLabel = computed(
  () =>
    ({ idle: '尚未開始', running: '記錄中', paused: '已暫停', stopped: '已結束' })[
      active.value.status
    ],
);
</script>
<template>
  <span class="eyebrow">OBSERVE & UNDERSTAND</span>
  <h1>行為記錄工具</h1>
  <p class="muted">記下每一次行為發生，從觀察開始理解。</p>
  <FeedbackMessage
    >資料僅在目前頁面記憶體中處理，不會儲存或上傳。關閉或重新整理前請先下載記錄。姓名與學號可留白。</FeedbackMessage
  >
  <div class="stack">
    <BaseCard
      ><h2>個案資料設定</h2>
      <div class="grid">
        <FormField
          id="class"
          v-model="profile.className"
          label="班級"
          :disabled="locked"
        /><FormField id="name" v-model="profile.name" label="姓名" :disabled="locked" /><FormField
          id="studentId"
          v-model="profile.studentId"
          label="學號"
          :disabled="locked"
        /></div
    ></BaseCard>
    <BaseCard
      ><h2>所有行為統整</h2>
      <label class="check-label"><input v-model="autoSort" type="checkbox" /> 次數自動排序</label>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th><button class="sort" @click="sort('behavior')">行為 ↕</button></th>
              <th><button class="sort" @click="sort('count')">次數 ↕</button></th>
              <th><button class="sort" @click="sort('interval')">平均間隔時間（秒）↕</button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in summaries" :key="session.id">
              <td>{{ session.behavior || '未命名行為' }}</td>
              <td>{{ session.events.length }}</td>
              <td>
                {{ session.events.length < 2 ? '尚不足兩筆' : averageInterval(session).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div></BaseCard
    >
  </div>
  <div class="tabs" aria-label="行為記錄分頁">
    <button
      v-for="session in sessions"
      :key="session.id"
      :aria-pressed="session.id === activeId"
      @click="
        activeId = session.id;
        message = '';
      "
    >
      {{ session.behavior || `行為 ${session.id}` }}</button
    ><BaseButton variant="secondary" @click="addBehavior">＋ 新增行為</BaseButton>
  </div>
  <BaseCard
    ><div class="section-heading">
      <h2>記錄行為{{ active.behavior ? `：${active.behavior}` : '' }}</h2>
      <span class="tag" role="status">{{ statusLabel }}</span>
    </div>
    <FormField
      :id="`behavior-${active.id}`"
      v-model="active.behavior"
      label="標的行為"
      :disabled="active.status !== 'idle'"
      required
    /><FeedbackMessage v-if="message" kind="error">{{ message }}</FeedbackMessage>
    <div class="actions recording-controls">
      <BaseButton :disabled="active.status !== 'idle'" @click="begin">開始記錄</BaseButton
      ><BaseButton
        v-if="active.status !== 'paused'"
        variant="secondary"
        :disabled="active.status !== 'running'"
        @click="pause(active, Date.now())"
        >暫停</BaseButton
      ><BaseButton v-else variant="secondary" @click="resume(active, Date.now())"
        >恢復記錄</BaseButton
      ><BaseButton
        variant="danger"
        :disabled="active.status !== 'running' && active.status !== 'paused'"
        @click="stop(active, Date.now())"
        >停止記錄</BaseButton
      >
    </div>
    <div class="recording-panel">
      <div class="timer" aria-label="有效記錄時間">{{ formatElapsed(elapsed(active, now)) }}</div>
      <span class="muted">有效記錄時間（不含暫停）</span
      ><BaseButton class="record-event" :disabled="active.status !== 'running'" @click="recordEvent"
        >記下行為發生時間</BaseButton
      >
      <p role="status">
        總次數：<strong>{{ active.events.length }}</strong> · 平均每次間隔：{{
          averageInterval(active).toFixed(2)
        }}
        秒
      </p>
      <p class="muted">頻率：{{ frequencyPerMinute(active, now).toFixed(2) }} 次／分鐘</p>
    </div>
    <p v-if="active.startedAt !== null">
      記錄開始：{{ localDate(active.startedAt) }} {{ localTime(active.startedAt)
      }}<span v-if="active.endedAt !== null"
        ><br />記錄結束：{{ localDate(active.endedAt) }} {{ localTime(active.endedAt) }}</span
      >
    </p>
    <p v-if="active.events.length" class="muted">
      首筆事件：{{ localTime(active.events[0].timestamp) }} · 末筆事件：{{
        localTime(active.events[active.events.length - 1].timestamp)
      }}
    </p>
    <h3>表格</h3>
    <p v-if="!active.events.length" class="muted">
      尚無記錄。開始後，按「記下行為發生時間」新增一筆事件。
    </p>
    <div v-else class="table-scroll">
      <table class="events">
        <thead>
          <tr>
            <th>日期</th>
            <th>時間</th>
            <th>姓名</th>
            <th>學號</th>
            <th>行為</th>
            <th>備註</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in active.events" :key="index">
            <td>{{ new Date(event.timestamp).toLocaleDateString('zh-TW') }}</td>
            <td>{{ localTime(event.timestamp) }}</td>
            <td>{{ active.profile.name }}</td>
            <td>{{ active.profile.studentId }}</td>
            <td>{{ active.behavior }}</td>
            <td>
              <label :for="`note-${active.id}-${index}`" class="visually-hidden"
                >第 {{ index + 1 }} 筆備註</label
              ><textarea
                :id="`note-${active.id}-${index}`"
                v-model="event.note"
                rows="2"
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BehaviorChart :session="active" />
    <div class="actions">
      <BaseButton :disabled="active.status !== 'stopped'" @click="exportActive"
        >下載表格（CSV，Excel 可開啟）</BaseButton
      ><BaseButton variant="secondary" @click="reset = 'session'">重設此行為</BaseButton
      ><BaseButton variant="secondary" @click="reset = 'all'">清除全部資料</BaseButton>
    </div>
  </BaseCard>
  <BaseModal
    :open="reset !== null"
    :title="reset === 'all' ? '清除全部資料？' : '重設此行為？'"
    @close="reset = null"
    ><p>
      此操作將清除{{
        reset === 'all' ? '所有個案資料與行為記錄' : '目前行為的記錄與備註'
      }}。請先下載需要保留的資料。
    </p>
    <template #actions
      ><BaseButton variant="danger" @click="confirmReset">確認清除</BaseButton></template
    ></BaseModal
  >
</template>
<style scoped>
.recording-controls {
  margin-top: 1.25rem;
}
.recording-panel {
  padding: 1.75rem;
  margin-block: 1.5rem;
  text-align: center;
  background: var(--color-surface-muted);
  border-radius: var(--radius-card);
}
.timer {
  font-size: 2.5rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}
.record-event {
  display: flex;
  width: 100%;
  max-width: 28rem;
  margin: 1.25rem auto;
  min-height: 64px;
  font-size: 1.15rem;
}
.check-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  margin-bottom: 0.5rem;
}
.sort {
  border: 0;
  background: transparent;
  padding: 0;
  min-height: 44px;
  text-align: left;
  color: var(--color-text);
}
.events {
  min-width: 660px;
}
.events textarea {
  min-width: 150px;
}
.recording-panel p {
  margin: 0.5rem 0;
}
@media (max-width: 767px) {
  .recording-panel {
    padding: 1rem;
  }
}
</style>
