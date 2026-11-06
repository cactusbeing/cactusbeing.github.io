<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import LearningWorld from './LearningWorld.vue';
import StoryDemo from './StoryDemo.vue';
import CharacterArt from './CharacterArt.vue';
import { categories, lessons } from '../data/lessons.ts';
const props=defineProps<{completed:number[]}>();
const emit=defineEmits<{launch:[id:string];complete:[index:number]}>();
const root=ref<HTMLElement>();
const chapter=ref<number|null>(null);const stage=ref<'demo'|'practice'|'task'>('demo');const index=ref(0);const answered=ref(false);const success=ref(false);const order=ref<number[]>([]);const message=ref('');
const lesson=computed(()=>chapter.value===null?null:lessons[chapter.value]);const exercise=computed(()=>lesson.value?.exercises[index.value]);
function resetExercise(){answered.value=false;success.value=false;message.value='';const e=exercise.value;order.value=e?.kind==='sequence'?e.lines.map((_,i)=>i).reverse():[];}
function open(i:number){chapter.value=i;stage.value='demo';index.value=0;resetExercise();}
function answer(i:number){const e=exercise.value;if(!e||!(e.kind==='choice'||e.kind==='compare'||e.kind==='categorize'))return;answered.value=true;success.value=i===e.answer;message.value=e.feedback;}
function checkOrder(){const e=exercise.value;if(e?.kind!=='sequence')return;answered.value=true;success.value=order.value.every((n,i)=>n===i);message.value=success.value?e.feedback:'先聽到對方說什麼，再回應。可以調整順序後再試。';}
function move(i:number,d:number){const t=i+d;if(t<0||t>=order.value.length)return;[order.value[i],order.value[t]]=[order.value[t],order.value[i]];answered.value=false;success.value=false;}
function next(){if(!success.value)return;if(index.value+1===(lesson.value?.exercises.length??0)){stage.value='task';}else{index.value++;resetExercise();}}
function dialogueDone(){if(exercise.value?.kind==='dialogue'){answered.value=true;success.value=true;message.value=exercise.value.feedback;}}
function restoreDialogue(id:string){const c=lessons.findIndex(l=>l.exercises.some(e=>e.kind==='dialogue'&&e.scenarioId===id));if(c<0)return;chapter.value=c;stage.value='practice';index.value=lessons[c].exercises.findIndex(e=>e.kind==='dialogue'&&e.scenarioId===id);resetExercise();}
watch([chapter,stage,index],()=>nextTick(()=>{
 if(!root.value||root.value.offsetParent===null)return;
 const target=root.value.querySelector<HTMLElement>(stage.value==='practice'&&chapter.value!==null?'.exercise-guide h2':stage.value==='task'&&chapter.value!==null?'.lesson-task h2':'#lessons-heading');
 const main=root.value.closest<HTMLElement>('#relay-main');
 if(main)main.scrollTop=0;
 target?.focus({preventScroll:true});
 if(matchMedia('(max-width:899px)').matches)target?.scrollIntoView({block:'start',behavior:'instant'});
}));
defineExpose({dialogueDone,restoreDialogue});
</script>
<template><section ref="root" :class="{'lesson-map-screen':chapter===null,'lesson-chapter-screen':chapter!==null}" aria-labelledby="lessons-heading"><template v-if="chapter===null"><p class="eyebrow">一步一步，慢慢練習</p><h1 id="lessons-heading" tabindex="-1">聊天練習地圖</h1><p>先看示範，再用自己的步調練習。可以暫停，也可以再試。</p><LearningWorld :completed="props.completed" @enter="open"/></template>
<template v-else-if="lesson"><button class="text-button" @click="chapter=null">← 返回教學地圖</button><p class="eyebrow">第 {{chapter+1}} 章 · {{stage==='demo'?'示範':stage==='practice'?'練習與回饋':'生活小任務'}}</p><h1 id="lessons-heading" tabindex="-1">{{lesson.title}}</h1><p>{{lesson.intro}}</p>
<div v-if="stage==='demo'" class="lesson-demos"><StoryDemo :key="chapter" :demos="lesson.demos" :scene-id="chapter===0?'classroom':chapter===1?'playground':chapter===2?'club':'outing'" @done="stage='practice';resetExercise()"/></div>
<div v-else-if="stage==='practice'&&exercise" class="lesson-exercise"><p class="eyebrow">練習 {{index+1}}／{{lesson.exercises.length}} · 不限時</p><div class="exercise-guide"><CharacterArt npc-id="mia" emotion="happy"/><div><span>米亞老師陪你練習</span><h2 tabindex="-1">{{exercise.prompt}}</h2></div></div>
<div v-if="exercise.kind==='choice'||exercise.kind==='compare'" class="choice-list"><button v-for="(option,i) in exercise.options.filter(Boolean)" :key="i" @click="answer(i)">{{option}}</button></div>
<div v-else-if="exercise.kind==='categorize'" class="choice-list"><button v-for="(name,i) in categories" :key="name" @click="answer(i)">{{name}}</button></div>
<template v-else-if="exercise.kind==='sequence'"><p>使用上下按鈕排順，不需要拖曳。</p><ol class="sequence-list"><li v-for="(n,i) in order" :key="n"><span>{{exercise.lines[n]}}</span><button :disabled="i===0" @click="move(i,-1)" :aria-label="`第${i+1}句往上移`">↑</button><button :disabled="i===order.length-1" @click="move(i,1)" :aria-label="`第${i+1}句往下移`">↓</button></li></ol><button @click="checkOrder">看看這個順序</button></template>
<template v-else-if="exercise.kind==='dialogue'"><p>進入完整對話練習。完成後回到這裡，接著看生活小任務。</p><button class="primary" @click="emit('launch',exercise.scenarioId)">{{success?'再練一次':'進入對話'}}</button></template>
<div v-if="answered" class="feedback" :data-feedback="success?'effective':'try_another'" aria-live="polite"><strong class="feedback-title">{{success?'接得很好！':exercise.kind==='sequence'?'順序可以再調整':'這句可以再調整'}}</strong><p>{{message}}</p><small v-if="!success">沒關係，換個回答或調整順序，再試試。</small></div><button v-if="success" class="primary" @click="next">{{index+1===lesson.exercises.length?'看看生活小任務':'下一個練習'}}</button>
</div>
<div v-else class="lesson-task"><h2 tabindex="-1">把聊天帶進生活</h2><p>{{lesson.task}}</p><p>由老師陪同練習，不自動評分。願意表達拒絕或休息也很好。</p><button class="primary" @click="emit('complete',chapter);chapter=null">完成本章練習</button></div>
</template></section></template>
