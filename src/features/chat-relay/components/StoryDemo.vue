<script setup lang="ts">
import { computed, ref } from 'vue';
import SceneArt from './SceneArt.vue';
import { characters } from '../data/manifest.ts';
import { speak, speechAvailable, stopSpeech } from '../services/speech.ts';
import type { SceneId } from '../types.ts';
const props=withDefaults(defineProps<{demos:{title:string;lines:string[]}[];sceneId:SceneId;doneLabel?:string}>(),{doneLabel:'看完了，來練習'});
const emit=defineEmits<{done:[]}>();
const demoIndex=ref(0);const lineIndex=ref(0);const voiceNotice=ref('');
const demo=computed(()=>props.demos[demoIndex.value]);
const line=computed(()=>demo.value.lines[lineIndex.value]);
const speaker=computed(()=>line.value.split('：')[0]);
const speech=computed(()=>line.value.includes('：')?line.value.slice(line.value.indexOf('：')+1):line.value);
const npcId=computed(()=>characters.find(c=>speaker.value.startsWith(c.name)||speaker.value==='米亞'&&c.id==='mia')?.id??'xiaoyu');
function next(){stopSpeech();if(lineIndex.value<demo.value.lines.length-1)lineIndex.value++;else if(demoIndex.value<props.demos.length-1){demoIndex.value++;lineIndex.value=0;}else emit('done');}
function read(){if(!speak(speech.value))voiceNotice.value='這台裝置沒有可用的本機中文語音，直接閱讀也可以。';}
</script>
<template><div class="story-demo"><div class="demo-world"><SceneArt :scene-id="sceneId" :npc-id="npcId" emotion="happy"/><div class="demo-sign"><span>示範 {{demoIndex+1}}／{{demos.length}}</span><strong>{{demo.title}}</strong></div><div class="demo-dialogue"><strong>{{speaker}}</strong><p aria-live="polite" aria-atomic="true">{{speech}}</p><div class="demo-controls"><span>{{lineIndex+1}}／{{demo.lines.length}} 句</span><button v-if="speechAvailable()" @click="read">朗讀這句</button><button class="primary" @click="next">{{lineIndex<demo.lines.length-1?'下一句':demoIndex<demos.length-1?'下一個示範':doneLabel}}</button></div></div></div><p v-if="voiceNotice" role="status">{{voiceNotice}}</p></div></template>
<style scoped>
.story-demo{margin:24px 0}.demo-world{position:relative;overflow:hidden;border-radius:22px;border:4px solid #c7c5ac;background:#f4eedd;isolation:isolate}.demo-world :deep(.scene-art){aspect-ratio:1.65;border-radius:0;min-height:480px}.demo-world :deep(.scene-person){bottom:25%;width:25%}.demo-world :deep(.scene-player){left:15%}.demo-world :deep(.scene-npc){right:15%}.demo-sign{position:absolute;top:20px;left:22px;background:#fffaf2f5;border:1px solid #d2cbb9;border-radius:7px;padding:10px 16px;transform:rotate(-2deg)}.demo-sign span{font-size:.76em;display:block;color:#55615d}.demo-sign strong{font-size:1em}.demo-dialogue{position:absolute;bottom:20px;left:24px;right:24px;border:2px solid #80977d;border-radius:8px 22px 22px 22px;background:#fffdf6fa;padding:20px 24px;box-shadow:0 5px 0 #6d7f5424;animation:line-arrives 200ms ease-out}.demo-dialogue>strong{color:#365e47;font-size:.94em}.demo-dialogue p{font-size:1.1em;min-height:2em;line-height:1.8;margin:7px 0 15px}.demo-controls{display:flex;align-items:center;gap:10px;justify-content:flex-end}.demo-controls>span{margin-right:auto;color:#55615d;font-size:.76em}.demo-controls button{font-size:.83em;padding:6px 12px;min-height:44px}@keyframes line-arrives{from{opacity:.2;transform:translateY(6px)}to{opacity:1;transform:none}}@media(max-width:599px){.demo-world :deep(.scene-art){aspect-ratio:1;min-height:570px}.demo-world :deep(.scene-person){bottom:38%;width:37%}.demo-world :deep(.scene-player){left:6%}.demo-world :deep(.scene-npc){right:6%}.demo-sign{top:14px;left:14px;padding:8px 12px}.demo-dialogue{left:12px;right:12px;bottom:12px;padding:16px}.demo-dialogue p{font-size:1em}.demo-controls{flex-wrap:wrap;gap:7px}.demo-controls>span{width:100%}.demo-controls button{font-size:.8em}.demo-controls button.primary{flex:1}}@media(prefers-reduced-motion:reduce){.demo-dialogue{animation:none}}

@media(min-width:900px) {
  .story-demo { height:100%; min-height:0; margin:0; }
  .demo-world { height:100%; min-height:0; border:0; border-radius:12px; }
  .demo-world :deep(.scene-art) { min-height:0; height:100%; aspect-ratio:auto; }
  .demo-world :deep(.scene-person) { height:65%; width:auto; aspect-ratio:8/13; max-width:20%; bottom:28%; }
  .demo-sign { top:12px; left:14px; padding:6px 12px; }
  .demo-dialogue { bottom:12px; left:16px; right:16px; padding:12px 18px; border-width:1px; }
  .demo-dialogue p { font-size:1em; min-height:0; margin:5px 0 10px; }
  .demo-controls button { min-height:40px; }
}
</style>
