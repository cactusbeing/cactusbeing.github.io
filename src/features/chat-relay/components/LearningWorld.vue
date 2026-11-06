<script setup lang="ts">
import { computed, useId } from 'vue';
import CharacterArt from './CharacterArt.vue';

const props = defineProps<{ completed: number[] }>();
const emit = defineEmits<{ enter: [index: number] }>();
const descriptionId = useId();
const stations = [
  { title: '距離與身體界線', place: '教室前', action: '留點空間，想碰先問', npc: 'xiaoyu' },
  { title: '自然開啟談話', place: '大樹下', action: '看時機，從小事聊起', npc: 'aqing' },
  { title: '把話題接下去', place: '社團小屋', action: '問一點，分享一點', npc: 'lele' },
  { title: '訊息與網路交友', place: '放學公車站', action: '看情緒，也保留隱私', npc: 'mia' },
];
const completedCount = computed(() => stations.filter((_, i) => props.completed.includes(i)).length);
</script>

<template>
  <div class="learning-world">
    <div class="world-guide">
      <p :id="descriptionId">沿著小路，選一站開始。<span>每一站都能自由進入，也能回來再練。</span></p>
      <span class="world-progress">已探索 {{ completedCount }}／4 站</span>
    </div>

    <div class="world-map">
      <svg class="campus-terrain" viewBox="0 0 1100 760" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <pattern :id="`${descriptionId}-grass`" width="88" height="72" patternUnits="userSpaceOnUse">
            <path d="m18 38 2-5 2 5m41 23 2-4 2 4" fill="none" stroke="#9bb18b" stroke-width="2" stroke-linecap="round" opacity=".5" />
          </pattern>
          <g :id="`${descriptionId}-tree`" stroke="#667b56" stroke-width="2.5" stroke-linejoin="round">
            <ellipse cx="0" cy="48" rx="43" ry="15" fill="#66845b" opacity=".17" stroke="none" />
            <path d="m-8 11-3 37q11 9 22 0L8 11" fill="#bca180" />
            <path d="M-5 27-22 10m28 8L23 2" fill="none" stroke="#927859" />
            <path d="M-46-11q-11-24 14-35 4-27 30-23 26-12 39 16 30 4 28 30 17 24-10 39-11 21-38 12-26 14-44-7-24 1-19-32Z" fill="#91ad80" />
            <path d="M-29-31q14-12 28-8m9-13q12 2 19 14m5 20q11 1 14 10" fill="none" stroke="#b7c99e" stroke-width="5" stroke-linecap="round" />
          </g>
          <g :id="`${descriptionId}-shrub`">
            <ellipse cx="0" cy="5" rx="25" ry="11" fill="#9eb78a" />
            <circle cx="-14" cy="-3" r="12" fill="#a9bf92" /><circle cx="3" cy="-7" r="15" fill="#a9bf92" /><circle cx="18" cy="0" r="11" fill="#a9bf92" />
          </g>
          <g :id="`${descriptionId}-flower`" stroke="#6f885f" stroke-width="2">
            <path d="M0 10V0m0 8-5-3" fill="none" /><path d="M-5-3q-4-8 4-8 5-7 8 0 8 3 1 8-2 7-8 2Z" fill="#f5d89b" stroke="none" /><circle cx="2" cy="-5" r="2.5" fill="#c2a45c" stroke="none" />
          </g>
        </defs>

        <path d="M0 0h1100v760H0Z" fill="#dfe8cd" />
        <path d="M0 112q98-64 200-28t170-26Q589-4 758 68t342 11v681H0Z" fill="#e7ecd7" />
        <path d="M0 0h1100v760H0Z" :fill="`url(#${descriptionId}-grass)`" />
        <path d="M73 646q-73-43-51-115t119-43q81 13 114 87-1 74-74 85Z" fill="#c9dabc" />
        <path d="M791 410q32-46 101-37t92 64q3 55-59 66t-116-30Z" fill="#c4d8ce" />
        <path d="M808 422q30-26 75-23t63 35q-7 24-42 34t-73-9" fill="none" stroke="#edf3df" stroke-width="4" stroke-linecap="round" />

        <path d="M191 308C365 383 483 146 756 222S1024 412 662 445 208 399 307 552 539 719 861 623" fill="none" stroke="#c8b98f" stroke-width="79" stroke-linecap="round" />
        <path d="M191 308C365 383 483 146 756 222S1024 412 662 445 208 399 307 552 539 719 861 623" fill="none" stroke="#f3e7ca" stroke-width="72" stroke-linecap="round" />
        <path d="M191 308C365 383 483 146 756 222S1024 412 662 445 208 399 307 552 539 719 861 623" fill="none" stroke="#d1be94" stroke-width="3" stroke-dasharray="3 16" stroke-linecap="round" />
        <path d="M365 64v66m-15-39h30m262-49v76m-15-45h30" fill="none" stroke="#c8d5ba" stroke-width="4" stroke-linecap="round" />

        <!-- The school and its open corridor. -->
        <g stroke="#867b62" stroke-width="2.5" stroke-linejoin="round">
          <ellipse cx="221" cy="261" rx="137" ry="28" fill="#a3af8b" opacity=".22" stroke="none" />
          <path d="m98 143 159-25 64 40v89l-158 31-65-40Z" fill="#e6cfaa" />
          <path d="m163 183 158-25v89l-158 31Z" fill="#fbefd3" />
          <path d="m98 143 65 40v95l-65-40Z" fill="#dcc19a" />
          <path d="m83 140 169-38 84 49-171 38Z" fill="#bd8e73" />
          <path d="m83 140 82 49v13l-82-47Zm82 49 171-38v13l-171 38Z" fill="#a57963" />
          <path d="m193 199 30-5v32l-30 6Zm68-11 30-5v32l-30 6Z" fill="#b8d2ca" />
          <path d="m208 198v31m68-43v32" fill="none" stroke="#fff7e6" stroke-width="4" />
          <path d="m230 231 29-5v33l-29 6Z" fill="#9b9479" />
          <path d="m180 274 139-27v10l-139 29Z" fill="#c9ba99" />
          <path d="m108 174 14 8v28l-14-8Zm25 15 14 8v28l-14-8Z" fill="#b8c8bd" />
          <path d="m212 145 30-7 17 10-30 7Z" fill="#f3e3bd" stroke="#a47c63" />
        </g>
        <g transform="translate(366 259)" stroke="#a28a63" stroke-width="2.5" stroke-linejoin="round">
          <path d="m0 0 49-8 18 10-50 10Z" fill="#cdb28c" /><path d="M17 12v14M56 5v14" fill="none" /><path d="m1-8 48-8v8L0 1Z" fill="#dcc7a3" />
        </g>

        <!-- A grove with room to sit, listen, or be quiet. -->
        <path d="M752 78q61-34 151-11t102 102q-47 48-127 37t-126-63Z" fill="#d2dfbf" />
        <use :href="`#${descriptionId}-tree`" transform="translate(785 130) scale(1.03)" />
        <use :href="`#${descriptionId}-tree`" transform="translate(913 107) scale(1.2)" />
        <g transform="translate(835 190)" stroke="#907b5b" stroke-width="2.5" stroke-linejoin="round">
          <path d="m0 0 58-7 18 12-59 8Z" fill="#cdb28c" /><path d="m0-10 58-7v10L0 1Z" fill="#e4cfab" /><path d="M17 13v14M65 7v14" fill="none" />
        </g>
        <use :href="`#${descriptionId}-shrub`" transform="translate(1008 213)" />

        <!-- The club room opens onto a small making table. -->
        <g stroke="#7f8168" stroke-width="2.5" stroke-linejoin="round">
          <ellipse cx="338" cy="492" rx="117" ry="24" fill="#a3af8b" opacity=".25" stroke="none" />
          <path d="m219 405 137-31 69 41v72l-137 29-69-40Z" fill="#d9d7bb" />
          <path d="m288 445 137-30v72l-137 29Z" fill="#f4e8cb" />
          <path d="m204 402 151-43 88 49-154 43Z" fill="#88a293" />
          <path d="m204 402 85 49v13l-85-48Zm85 49 154-43v13l-154 43Z" fill="#6f8b7a" />
          <path d="m310 458 30-6v28l-30 7Z" fill="#bed6cb" /><path d="m369 446 29-7v28l-29 7Z" fill="#bed6cb" />
          <path d="m347 481 19-5v23l-19 4Z" fill="#b59674" />
          <path d="m232 435 17 10v23l-17-10Z" fill="#c0cfc0" />
        </g>
        <g transform="translate(461 501)" stroke="#947f61" stroke-width="2.5" stroke-linejoin="round">
          <path d="m0 0 53-12 26 15-54 13Z" fill="#d9bd91" /><path d="M12 8v23m52-20v17" fill="none" /><path d="m22-5 19-4 10 6-20 5Z" fill="#fbf0d8" /><path d="m43-10 8-13 7 10-8 4Z" fill="#b8a5be" />
        </g>

        <!-- A little bus stop: a place where it is natural to say goodbye. -->
        <path d="m750 527 214-31 82 52-219 38Z" fill="#c9d1c0" />
        <g stroke="#77816c" stroke-width="2.5" stroke-linejoin="round">
          <path d="m768 496 104-20 47 28-104 22Z" fill="#8fa99a" /><path d="M782 507v58m104-74v54m16-33v50" fill="none" stroke-width="5" />
          <path d="m782 512 35 20 69-13v34l-69 15-35-21Z" fill="#d4dfc7" /><path d="m791 548 54-10 18 10-54 11Z" fill="#c7ac85" />
          <path d="m932 461 23-4v34l-23 4Z" fill="#fff2d3" /><path d="M944 493v55" fill="none" stroke-width="5" /><path d="m937 469 12-2v10l-12 3Z" fill="#779681" stroke="none" />
        </g>
        <g transform="translate(1000 591)" stroke="#7b8069" stroke-width="2.5" stroke-linejoin="round">
          <path d="m-43-33 58-11 36 21v49L-7 39l-36-22Z" fill="#dfc186" /><path d="m-7-12 58-11v49L-7 39Z" fill="#e9d49e" />
          <path d="m0-7 17-3V8L0 12Zm25-5 18-4V3l-18 4Z" fill="#b7d0c6" /><path d="m-36-26 20 11V5l-20-12Z" fill="#b7d0c6" />
          <ellipse cx="5" cy="34" rx="7" ry="10" fill="#718172" /><ellipse cx="40" cy="27" rx="7" ry="10" fill="#718172" /><circle cx="5" cy="34" r="3" fill="#dedac1" /><circle cx="40" cy="27" r="3" fill="#dedac1" />
        </g>

        <use :href="`#${descriptionId}-tree`" transform="translate(70 355) scale(.9)" />
        <use :href="`#${descriptionId}-tree`" transform="translate(614 77) scale(.72)" />
        <use :href="`#${descriptionId}-tree`" transform="translate(582 566) scale(.86)" />
        <use :href="`#${descriptionId}-tree`" transform="translate(94 692) scale(.93)" />
        <use :href="`#${descriptionId}-tree`" transform="translate(1021 365) scale(.8)" />
        <use :href="`#${descriptionId}-shrub`" transform="translate(114 97)" />
        <use :href="`#${descriptionId}-shrub`" transform="translate(539 330)" />
        <use :href="`#${descriptionId}-shrub`" transform="translate(706 713)" />
        <use :href="`#${descriptionId}-flower`" transform="translate(123 408)" />
        <use :href="`#${descriptionId}-flower`" transform="translate(142 418) scale(.8)" />
        <use :href="`#${descriptionId}-flower`" transform="translate(669 106)" />
        <use :href="`#${descriptionId}-flower`" transform="translate(690 115) scale(.85)" />
        <use :href="`#${descriptionId}-flower`" transform="translate(513 655)" />
        <use :href="`#${descriptionId}-flower`" transform="translate(529 666) scale(.8)" />
        <path d="m37 89 30-8m-13-9 26-6m966 658 24-7m-9-11 20-5" fill="none" stroke="#b8c69f" stroke-width="4" stroke-linecap="round" />
      </svg>

      <svg class="mobile-terrain" viewBox="0 0 360 1140" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 0h360v1140H0Z" fill="#e3e9d2" />
        <path d="M111 0C15 114 331 175 206 309S17 516 155 606 334 825 174 906 78 1075 164 1140" fill="none" stroke="#cfbe98" stroke-width="65" />
        <path d="M111 0C15 114 331 175 206 309S17 516 155 606 334 825 174 906 78 1075 164 1140" fill="none" stroke="#f2e6c9" stroke-width="60" />
        <path d="M111 0C15 114 331 175 206 309S17 516 155 606 334 825 174 906 78 1075 164 1140" fill="none" stroke="#c8b48d" stroke-width="2" stroke-dasharray="3 15" />
        <g stroke="#7f886d" stroke-width="2.5" stroke-linejoin="round">
          <path d="m241 43 61-13 29 20v47l-61 15-29-20Z" fill="#efdbb6" /><path d="m234 42 68-22 37 27-68 22Z" fill="#ba9077" /><path d="m278 77 16-3v17l-16 3Z" fill="#b7d0c6" />
          <path d="M34 327v41m-9-58q-23-32 8-42 24-19 39 10 22 14 7 37-28 24-54-5Z" fill="#99b186" /><path d="M42 310v46" fill="none" stroke="#9e8b68" stroke-width="6" />
          <path d="m245 625 59-14 29 20v45l-59 13-29-20Z" fill="#e7d6b5" /><path d="m238 623 67-22 37 26-68 21Z" fill="#89a393" /><path d="m284 657 15-3v17l-15 3Z" fill="#b7d0c6" />
          <path d="m28 930 60-13 27 17-59 13Z" fill="#91a899" /><path d="M40 941v52m61-53v49" fill="none" stroke-width="4" /><path d="m45 977 43-9 13 8-43 9Z" fill="#cfb58d" />
        </g>
        <g fill="#aec298"><ellipse cx="322" cy="398" rx="28" ry="15" /><ellipse cx="39" cy="733" rx="30" ry="14" /><ellipse cx="306" cy="1052" rx="25" ry="13" /></g>
        <g stroke="#a6b98c" stroke-width="2" fill="none" stroke-linecap="round"><path d="m44 173 3-7 3 7m264 357 3-7 3 7M78 824l3-7 3 7m218 304 3-7 3 7" /></g>
      </svg>

      <div class="world-npcs" aria-hidden="true">
        <span v-for="(station, i) in stations" :key="station.npc" class="world-npc" :class="`world-npc-${i + 1}`"><CharacterArt :npc-id="station.npc" emotion="happy" /></span>
      </div>

      <nav class="world-stations" aria-label="選擇練習章節" :aria-describedby="descriptionId">
        <ol>
          <li v-for="(station, i) in stations" :key="station.title" class="world-station" :class="[`world-station-${i + 1}`, { 'is-completed': props.completed.includes(i) }]">
            <span class="station-location">{{ station.place }}</span>
            <button class="station-button" type="button" :data-chapter="i" :aria-label="`第 ${i + 1} 章：${station.title}。${props.completed.includes(i) ? '已完成，可再次練習' : '進入這一站'}`" @click="emit('enter', i)">
              <span class="station-number" aria-hidden="true">{{ i + 1 }}</span>
              <span class="station-copy"><span class="station-chapter">第 {{ i + 1 }} 章</span><strong>{{ station.title }}</strong><span class="station-action">{{ props.completed.includes(i) ? '已完成，歡迎再練' : station.action }}</span></span>
              <svg v-if="props.completed.includes(i)" class="station-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
            </button>
          </li>
        </ol>
      </nav>
      <span class="world-gate" aria-hidden="true">聊天小校園</span>
    </div>
    <p class="world-footnote">不用趕路。想休息的時候，隨時可以停下來。</p>
  </div>
</template>

<style scoped>
.learning-world {
  --world-ink: #334f3c;
  --world-paper: #fff8e9;
  --world-post: #9d825d;
  width: 100%;
  min-width: 0;
  color: var(--world-ink);
  font-size: max(18px, 1em);
}
.learning-world ::selection { color: #fff9e9; background: #365e47; }
.world-guide { display: flex; justify-content: space-between; align-items: start; gap: 22px; margin: 0 0 24px; }
.world-guide p { margin: 0; line-height: 1.8; }
.world-guide p span { display: block; color: #4f614a; }
.world-progress { flex-shrink: 0; margin-top: 2px; padding-bottom: 5px; border-bottom: 2px solid #a2b28c; line-height: 1.8; font-variant-numeric: tabular-nums; }
.world-map { position: relative; width: 100%; aspect-ratio: 1100 / 760; min-height: 660px; isolation: isolate; border-radius: 38px 38px 28px 28px; background: #e3e9d2; animation: world-arrive 280ms cubic-bezier(.16, 1, .3, 1); }
.campus-terrain, .mobile-terrain { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: inherit; pointer-events: none; }
.mobile-terrain { display: none; }
.world-stations { position: absolute; inset: 0; z-index: 2; }
.world-stations ol { padding: 0; margin: 0; list-style: none; }
.world-station { position: absolute; width: 256px; max-width: 31%; transform: translate(-50%, -50%); }
.world-station-1 { left: 24%; top: 41%; }
.world-station-2 { left: 71%; top: 34%; }
.world-station-3 { left: 33%; top: 78%; }
.world-station-4 { left: 77%; top: 82%; }
.station-location { position: relative; z-index: 2; display: table; margin: 0 0 -1px 20px; padding: 3px 12px; background: #365e47; border-radius: 7px 7px 0 0; color: #fff8e9; font-size: 18px; font-weight: 650; line-height: 1.6; }
.learning-world .station-button { position: relative; display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 12px; align-items: center; width: 100%; min-width: 0; min-height: 112px; margin: 0; padding: 14px; border: 2px solid #8d9678; border-radius: 12px; background: var(--world-paper); color: var(--world-ink); text-align: left; font-size: 18px; font-weight: 500; line-height: 1.5; cursor: pointer; isolation: isolate; box-shadow: 0 4px 0 #a8b38e, 0 8px 16px #52674114; transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease; }
.station-button::before { position: absolute; z-index: -1; content: ''; width: 11px; height: 23px; top: 100%; left: 32px; background: var(--world-post); border-radius: 0 0 4px 4px; }
.station-button::after { position: absolute; content: ''; bottom: 100%; right: 19px; width: 6px; height: 6px; border-radius: 50%; background: #d0b792; }
.station-number { color: #6c805d; font-size: 30px; font-weight: 750; line-height: 1; font-variant-numeric: tabular-nums; }
.station-copy { display: block; min-width: 0; }
.station-copy > * { position:static; overflow-wrap:anywhere; }
.station-chapter { display: block; color: #56664c; font-size: 18px; }
.station-copy strong { display: block; margin: 3px 0 6px; color: #334f3c; font-size: 21px; font-weight: 750; line-height: 1.45; text-wrap: balance; }
.station-action { display: block; color: #56664c; font-size: 18px; line-height: 1.55; overflow-wrap: anywhere; }
.station-mark { position:absolute; top:10px; right:10px; width: 20px; height: 24px; fill: none; stroke: #365e47; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.is-completed .station-location { background: #596740; }
.is-completed .station-button { border-color: #688458; background: #fbf9e9; }
.learning-world .station-button:hover { background: #fffdf6; border-color: #526e47; box-shadow: 0 4px 0 #8fa17d, 0 8px 16px #52674120; }
.learning-world .station-button:active { background: #f6edda; box-shadow: inset 0 2px 0 #c7ba98, 0 1px 0 #a8b38e; }
.learning-world .station-button:focus-visible { outline: 4px solid #3c6d9d; outline-offset: 5px; }
.station-button:focus-visible .station-copy strong { color: #244a35; }
.world-npcs { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.world-npc { position: absolute; display: block; width: 6.1%; }
.world-npc :deep(svg) { width: 100%; height: auto; max-height: none; }
.world-npc-1 { left: 10.5%; top: 35%; transform: rotate(-4deg); }
.world-npc-2 { left: 85%; top: 25%; transform: rotate(3deg); }
.world-npc-3 { left: 18%; top: 61%; transform: rotate(-3deg); }
.world-npc-4 { left: 88%; top: 68%; transform: rotate(3deg); }
.world-gate { position: absolute; left: 5%; bottom: 5%; color: #637452; font-size: 18px; font-weight: 650; letter-spacing: .06em; transform: rotate(-7deg); }
.world-footnote { margin: 22px 0 0; color: #506148; font-size: 18px; line-height: 1.8; text-align: center; }
@keyframes world-arrive { from { transform: translateY(5px); } to { transform: translateY(0); } }
@media (min-width: 1100px) {
  .world-station { width: 270px; }
}
@media (min-width: 681px) and (max-width: 850px) {
  .world-map { min-height: 740px; }
  .world-station { max-width: 40%; width: 248px; }
  .world-station-1 { left: 23%; top: 39%; }
  .world-station-2 { left: 72%; top: 29%; }
  .world-station-3 { left: 30%; top: 77%; }
  .world-station-4 { left: 77%; top: 82%; }
  .learning-world .station-button { gap: 9px; padding: 12px; }
  .station-copy strong { font-size: 20px; }
  .world-npc { width: 8%; }
}
@media (max-width: 680px) {
  .world-guide { flex-direction: column; gap: 12px; margin-bottom: 20px; }
  .world-progress { align-self: flex-start; }
  .world-map { aspect-ratio: auto; min-height: 0; padding: 54px 18px 62px; border-radius: 26px; }
  .campus-terrain { display: none; }
  .mobile-terrain { display: block; }
  .world-stations { position: relative; }
  .world-stations ol { display: flex; flex-direction: column; gap: 76px; }
  .world-station { position: relative; inset: auto; width: min(100%, 340px); max-width: 100%; margin: 0; transform: none; }
  .world-station-1, .world-station-3 { align-self: flex-start; }
  .world-station-2, .world-station-4 { align-self: flex-end; }
  .learning-world .station-button { min-height: 132px; padding: 15px 13px; gap: 12px; }
  .station-copy strong { font-size: 22px; }
  .station-location { margin-left: 17px; }
  .world-npcs { z-index: 1; }
  .world-npc { width: 48px; }
  .world-npc-1 { left: auto; right: 9%; top: 1%; transform: rotate(4deg); }
  .world-npc-2 { left: 9%; top: 27%; transform: rotate(-4deg); }
  .world-npc-3 { left: auto; right: 8%; top: 52%; transform: rotate(3deg); }
  .world-npc-4 { left: 9%; top: 77%; transform: rotate(-3deg); }
  .world-gate { left: 50%; bottom: 15px; white-space: nowrap; transform: translateX(-50%); }
  .world-footnote { margin-top: 18px; text-align: left; }
}
@media (max-width: 360px) {
  .world-map { padding-inline: 12px; }
  .learning-world .station-button { grid-template-columns: 22px minmax(0, 1fr); padding: 14px 10px; gap: 9px; }
  .station-number { font-size: 26px; }
  .station-copy strong { font-size: 20px; }
  .station-mark { width: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .world-map { animation: none; }
  .learning-world .station-button { transition: none; }
  .learning-world .station-button:hover, .learning-world .station-button:active { transform: none; }
}

@media (min-width: 900px) {
  .learning-world { display:flex; flex-direction:column; flex:1; min-height:0; gap:8px; }
  .world-guide { align-items:center; gap:12px; margin:0; }
  .world-guide p { font-size:18px; line-height:1.5; }
  .world-guide p span { display:none; }
  .world-progress { margin:0; padding:0; font-size:18px; line-height:1.5; }
  .world-map { flex:1; min-height:280px; aspect-ratio:auto; border-radius:14px; }
  .world-station { width:244px; max-width:31%; }
  .world-station-1 { left:23%; top:26%; }
  .world-station-2 { left:72%; top:24%; }
  .world-station-3 { left:30%; top:72%; }
  .world-station-4 { left:77%; top:72%; }
  .learning-world .station-button { min-height:96px; padding:10px 12px; gap:8px; }
  .station-button::before { height:10px; }
  .station-copy strong { margin:2px 0; font-size:20px; }
  .station-chapter { font-size:18px; }
  .station-action { display:none; font-size:18px; line-height:1.4; }
  .station-number { font-size:26px; }
  .station-location { padding:1px 9px; font-size:18px; }
  .world-footnote { display:none; }
  .world-gate { display:none; }
  .world-npc { height:22%; width:auto; aspect-ratio:8/13; max-width:7%; }
  .world-npc-1 { left:auto; right:calc(77% + 130px); top:26%; }
  .world-npc-2 { left:calc(72% + 130px); top:24%; }
  .world-npc-3 { left:auto; right:calc(70% + 130px); top:64%; }
  .world-npc-4 { left:calc(77% + 130px); top:66%; }
}
@media (min-width:900px) and (min-height:850px) {
  .station-action { display:block; }
  .world-map { min-height:360px; }
}
</style>
