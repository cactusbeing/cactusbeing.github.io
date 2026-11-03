<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useGameFullscreen } from '../campus/useGameFullscreen';
import SceneArt from './components/SceneArt.vue';
import GameIcon from './components/GameIcon.vue';
import LobbyBackdrop from './components/LobbyBackdrop.vue';
import PictureCue from './components/PictureCue.vue';
import LessonStudy from './components/LessonStudy.vue';
import { scenarios } from './data/scenarios/index.ts';
import { characters, scenes, skillNames, difficultyNames } from './data/manifest.ts';
import { graphFor, createSession, orderedChoices, choose, continueDialogue, retryChoice, backOne, nextScenario } from './engine/dialogue.ts';
import { newSeed, seededRandom } from './engine/random.ts';
import { remember, selectScenarioPool } from './engine/selector.ts';
import { summarize, recommendedSkill } from './engine/scoring.ts';
import { loadData, saveData, historyFor } from './services/storage.ts';
import { speechAvailable, speak, stopSpeech } from './services/speech.ts';
import type { Session, Choice, Answer } from './types.ts';
const gameRoot=ref<HTMLElement>();
const fullscreen=useGameFullscreen(gameRoot);
const base=import.meta.env.BASE_URL;
const loaded=loadData(scenarios);const data=reactive(loaded.data);const notice=ref(loaded.notice);
const view=ref<'home'|'session'|'results'|'lessons'>('home');
const session=computed(()=>data.activeSession);const current=computed(()=>session.value?scenarios.find(s=>s.id===session.value!.scenarioIds[session.value!.index]):undefined);
const graph=computed(()=>current.value&&session.value?graphFor(current.value,session.value.settings.difficulty):undefined);
const node=computed(()=>session.value?graph.value?.nodes[session.value.nodeId]:undefined);
const choices=computed(()=>node.value?.kind==='decision'&&session.value?orderedChoices(session.value,node.value):[]);
const isNarration=computed(()=>node.value?.kind==='decision'&&node.value.npcText.startsWith('（'));
const selected=computed(()=>node.value?.kind==='decision'?node.value.choices.find(c=>c.id===session.value?.selectedChoiceId):undefined);
function rationaleFor(id:string,difficulty:1|2|3,a:Answer){const s=scenarios.find(s=>s.id===id);if(!s)return '';const n=graphFor(s,difficulty).nodes[a.nodeId];return n?.kind==='decision'?n.choices.find(c=>c.id===a.choiceId)?.rationale:'';}
const sceneName=computed(()=>scenes.find(s=>s.id===current.value?.sceneId)?.name);
const npc=computed(()=>characters.find(c=>c.id===current.value?.npcId)??characters[0]);
const hint=computed(()=>node.value?.kind==='decision'?node.value.choices.find(c=>c.feedbackLevel==='effective'):undefined);
const summary=computed(()=>summarize(session.value?.records??[]));
const recommendation=computed(()=>recommendedSkill(session.value?.records??[]));
const nextSuggested=computed(()=>scenarios.find(s=>s.skillTags.includes(recommendation.value)&&!session.value?.scenarioIds.includes(s.id)));
const activeTextSize=computed(()=>view.value==='session'?session.value?.settings.textSize??18:data.settings.textSize);
const lessonMode=ref(false);const lessonRef=ref<InstanceType<typeof LessonStudy>>();
const dialog=ref<HTMLDialogElement>();let afterConfirm:()=>void=()=>{};const dialogTitle=ref('');const dialogText=ref('');let dialogOpener:HTMLElement|null=null;
const speechError=ref('');
const strengths=computed(()=>summary.value.find(s=>s.effective>0));
function persist(){const count=data.records.length;const saved=saveData(data);if(data.records.length<count)notice.value=`為了讓儲存保持順暢，目前保留最近 ${data.records.length} 場練習紀錄。`;if(!saved)notice.value='目前不會保存紀錄（瀏覽器儲存可能停用或已滿）。這次仍可繼續遊玩。';}
watch(()=>data.settings,()=>persist(),{deep:true});
function onPreferencesToggle(event:Event){
 const details=event.currentTarget as HTMLDetailsElement;
 nextTick(()=>{const main=document.getElementById('relay-main');if(!main||!matchMedia('(min-width:900px)').matches)return;
  if(details.open)main.scrollTop+=details.getBoundingClientRect().top-main.getBoundingClientRect().top-8;
  else main.scrollTop=0;
 });
}
function navigate(next:typeof view.value){stopSpeech();view.value=next;nextTick(()=>{
 const main=document.getElementById('relay-main');
 if(main)main.scrollTop=0;
 main?.focus({preventScroll:true});
 if(matchMedia('(max-width:899px)').matches&&gameRoot.value&&gameRoot.value.getBoundingClientRect().top<0)gameRoot.value.scrollIntoView({block:'start',behavior:'instant'});
});}
function confirmAction(title:string,text:string,action:()=>void){stopSpeech();dialogTitle.value=title;dialogText.value=text;afterConfirm=action;dialogOpener=document.activeElement instanceof HTMLElement?document.activeElement:null;nextTick(()=>dialog.value?.showModal());}
function closeDialog(){dialog.value?.close();dialogOpener?.focus();}
function confirm(){closeDialog();afterConfirm();}
function speakText(text:string){if(!speak(text))speechError.value='這台裝置目前沒有可用的本機語音。可檢查系統語音設定，或直接閱讀台詞繼續。';}
function sayCurrent(){if(!session.value?.settings.readAloud)return;const n=node.value;if(n)speakText(n.kind==='end'?n.closingText:n.npcText);}
function begin(ids:string[],mode:Session['mode']='free'){
 if(!ids.length){notice.value='目前沒有可用的情境，請重新整理再試。';return;}
 const start=()=>{const seed=newSeed();data.activeSession=createSession(ids,data.settings,seed,data.profileId,mode);persist();navigate('session');sayCurrent();};
 if(session.value&&!session.value.completed&&session.value.records.some(r=>r.choices.length))confirmAction('開始新的練習？','目前未完成的練習會被新題組取代。需要的話可先回首頁續玩。',start);else start();
}
function resume(){if(!session.value)return;lessonMode.value=session.value.mode==='lesson';if(lessonMode.value)lessonRef.value?.restoreDialogue(session.value.scenarioIds[session.value.index]);navigate(session.value.completed?'results':'session');sayCurrent();}
function focusDialogue(selector:string){nextTick(()=>{
 const panel=document.querySelector<HTMLElement>('.dialogue-panel');
 const target=document.querySelector<HTMLElement>(selector);
 if(panel)panel.scrollTop=0;
 target?.focus({preventScroll:true});
 if(matchMedia('(max-width:899px)').matches)(selector==='.reaction-area'?target:panel)?.scrollIntoView({block:'start',behavior:'instant'});
});}
function npcLine(text:string){return text.startsWith('（')?text:`${npc.value.name}：「${text}」`;}
function select(c:Choice){if(!session.value||!current.value||!choose(session.value,current.value,c.id))return;persist();focusDialogue('.reaction-area');stopSpeech();if(session.value.settings.readAloud)speakText(c.npcReaction.text);}
function advance(){if(!session.value||!current.value)return;stopSpeech();continueDialogue(session.value,current.value);persist();focusDialogue('.dialogue-panel');sayCurrent();}
function retry(){if(!session.value)return;stopSpeech();retryChoice(session.value);persist();focusDialogue('.choice-card');}
function back(){if(!session.value)return;stopSpeech();backOne(session.value);persist();focusDialogue('.dialogue-panel');}
function useHint(demo=false){if(!session.value)return;session.value.usedHint=true;if(demo)session.value.usedDemo=true;persist();}
function finishScenario(){const s=session.value;if(!s||!current.value||s.phase!=='end')return;const h=historyFor(data);remember(h,current.value.id,new Date().toISOString());
 if(!nextScenario(s)){const saved=JSON.parse(JSON.stringify(s)) as Session;data.records=data.records.filter(r=>r.session.id!==s.id);data.records.push({session:saved});persist();if(s.mode==='lesson')lessonRef.value?.dialogueDone();navigate('results');}else{persist();focusDialogue('.dialogue-panel');sayCurrent();}}
function pause(){confirmAction('先休息一下？','目前的選擇已儲存在這台裝置。回到首頁後，可以按「繼續上次練習」。',()=>{persist();navigate('home');});}
function retryScenario(){if(!current.value)return;lessonMode.value=false;begin([current.value.id]);}
function randomStart(){lessonMode.value=false;data.settings.sceneIds=[];data.settings.skillTags=[];data.settings.sessionLength=3;const settings={...data.settings,sceneIds:[],skillTags:[],sessionLength:3 as const};const result=selectScenarioPool(settings,historyFor(data),3,seededRandom(newSeed()),scenarios);notice.value=result.notice;begin(result.ids);}
function newThree(){randomStart();}
function launchLesson(id:string){if(!scenarios.some(s=>s.id===id)){notice.value='這組情境目前無法載入。';return;}lessonMode.value=true;begin([id],'lesson');}
function completeLesson(i:number){if(!data.lessons.includes(i))data.lessons.push(i);persist();}
function pageHidden(){if(document.hidden)stopSpeech();}
document.addEventListener('visibilitychange',pageHidden);onBeforeUnmount(()=>{stopSpeech();document.removeEventListener('visibilitychange',pageHidden);});
</script>
<template><div class="chat-relay-page-content"><div class="relay-page-heading"><a class="relay-back" :href="`${base}game/`">← 遊戲百寶箱</a><h1>社會技巧：聊天傳接球</h1></div><div ref="gameRoot" class="chat-relay" :data-view="view" :class="{'is-fullscreen':fullscreen.active.value,'reduce-motion':data.settings.reducedMotion||(view==='session'&&session?.settings.reducedMotion)}" :style="{'--relay-font':`${activeTextSize}px`}">
<a class="skip-link" href="#relay-main">跳到主要內容</a>
<div class="relay-toolbar"><button v-if="view!=='home'" class="relay-home-button" @click="view==='session'?pause():navigate('home')"><GameIcon kind="home"/>遊戲首頁</button><span v-else class="relay-toolbar-label"><GameIcon kind="chat"/>聊天小校園</span><nav class="relay-toolbar-actions" aria-label="遊戲工具"><button v-if="view==='session'" @click="stopSpeech">停止朗讀</button><button :aria-pressed="fullscreen.active.value" @click="fullscreen.toggle"><GameIcon kind="expand"/>{{fullscreen.active.value?'離開全螢幕':'全螢幕'}}</button></nav></div>
<p v-if="notice" class="storage-notice" role="status">{{notice}}</p>
<main id="relay-main" tabindex="-1">
<section v-if="view==='home'" class="home-screen"><LobbyBackdrop/><div class="home-hero"><div class="home-copy"><p class="eyebrow">一場可以慢慢來的聊天練習</p><h2>一句一句，<br/>慢慢聊。</h2><p class="home-subtitle">聽一聽、接一句、分享一點點。</p><p>也可以說「我想先休息」。</p><div class="home-actions"><button class="primary" @click="navigate('lessons')"><GameIcon kind="book"/>跟著學</button><button class="practice-start" @click="randomStart"><GameIcon kind="chat"/>實戰演練</button></div><button v-if="session&&!session.completed" class="resume-button" @click="resume">繼續上次練習 · {{session.index+1}}／{{session.scenarioIds.length}} 題</button></div><div class="hero-illustration"><SceneArt home/><div class="illustration-caption">你的步調，就是剛剛好的步調。</div></div></div>
<div class="home-bottom"><div class="welcome-note"><PictureCue kind="respect_boundary"/><p>這裡沒有「壞答案的學生」。<br/><span>每一題都能再試，看看不同的回應會發生什麼。</span></p></div></div>
<details class="practice-preferences" @toggle="onPreferencesToggle">
  <summary><GameIcon kind="settings"/><span>練習偏好</span><span class="preference-current">{{difficultyNames[data.settings.difficulty]}}</span><span class="preference-expand" aria-hidden="true"></span></summary>
  <div class="preferences-panel">
    <div class="preference-fields">
      <fieldset><legend>練習難度</legend><div class="preference-options">
        <label v-for="level in ([1,2,3] as const)" :key="level" class="preference-option"><input v-model="data.settings.difficulty" type="radio" name="relay-difficulty" :value="level"/><span><strong>{{difficultyNames[level]}}</strong><small>{{level+1}} 回合{{level===1?' · 圖卡輔助':''}}</small></span></label>
      </div></fieldset>
      <fieldset><legend>文字大小</legend><div class="preference-options text-size-options">
        <label v-for="(size,i) in ([18,22,26] as const)" :key="size" class="preference-option"><input v-model="data.settings.textSize" type="radio" name="relay-text-size" :value="size"/><span><strong>{{['標準','大字','特大字'][i]}}</strong><small>{{['一般閱讀','加大閱讀','更清楚'][i]}}</small></span></label>
      </div></fieldset>
    </div>
    <div class="preference-toggles">
      <label class="preference-toggle"><span><strong>自動朗讀</strong><small>{{speechAvailable()?'操作後朗讀角色台詞':'此瀏覽器沒有朗讀功能，可閱讀台詞'}}</small></span><input v-model="data.settings.readAloud" type="checkbox" :disabled="!speechAvailable()"/></label>
      <label class="preference-toggle"><span><strong>顯示提示</strong><small>先看看可以注意的線索</small></span><input v-model="data.settings.showHints" type="checkbox"/></label>
      <label class="preference-toggle"><span><strong>即時回饋</strong><small>每回合看見回應與說明</small></span><input v-model="data.settings.showImmediateFeedback" type="checkbox"/></label>
      <label class="preference-toggle"><span><strong>減少動態</strong><small>簡化傳球與切換動畫</small></span><input v-model="data.settings.reducedMotion" type="checkbox"/></label>
    </div>
    <p class="preference-note">每局隨機 3 題，按「實戰演練」就直接開始。偏好會用在下一場練習。</p>
  </div>
</details></section>
<LessonStudy v-show="view==='lessons'" ref="lessonRef" class="content-screen" :completed="data.lessons" @launch="launchLesson" @complete="completeLesson"/>
<section v-if="view==='session'&&session&&current&&node" class="session-screen"><div class="session-top"><div><p class="eyebrow">{{session.mode==='lesson'?'章節對話':'實戰演練'}} · 第 {{session.index+1}}／{{session.scenarioIds.length}} 題</p><h1>{{current.title}}</h1></div><span class="difficulty-label">{{difficultyNames[session.settings.difficulty]}} · {{node.kind==='end'?'收尾':`回合 ${node.id==='start'?1:node.id==='a'||node.id==='b'?2:node.id==='extra'?3:session.settings.difficulty===1?2:session.settings.difficulty===2?3:4}／${session.settings.difficulty===1?2:session.settings.difficulty===2?3:4}`}}</span></div>
<div class="session-layout"><div class="stage"><SceneArt :scene-id="current.sceneId" :npc-id="current.npcId" :npc-name="npc.name" show-names :passing="session.phase==='reaction'" :turn-key="`${current.id}:${node.id}:${session.attempt}`" :emotion="selected?.npcReaction.emotion??(node.kind==='decision'?node.npcEmotion:'leaving')"/><div class="stage-context"><span>{{sceneName}} · {{npc.name}}</span><p>{{current.setting}}</p></div><p class="expression-note">表情只是線索，也聽聽對方怎麼說。</p></div>
<div class="dialogue-panel" tabindex="-1"><template v-if="node.kind==='decision'"><div class="speaker-row"><strong>{{isNarration?'情境觀察':npc.name}}</strong><button class="speech-button" :disabled="!speechAvailable()" @click="speakText(node.kind==='decision'?node.npcText:'')">重聽 NPC 說話</button></div><p class="npc-speech" aria-live="polite" aria-atomic="true">{{node.npcText}}</p><p v-if="!speechAvailable()" class="small-note">此瀏覽器沒有朗讀功能，可直接閱讀。</p><p v-if="speechError" class="small-note" role="status">{{speechError}}</p>
<div v-if="session.phase==='choose'"><p class="question-label">{{isNarration?'接下來，你想怎麼做？':'你想怎麼接這句話？'}}</p><div class="choice-list" :class="{'picture-choices':session.settings.difficulty===1}"><button v-for="c in choices" :key="`${current.id}-${node.id}-${c.id}`" class="choice-card" @click="select(c)"><PictureCue v-if="session.settings.difficulty===1" :kind="c.imageCue"/><span>{{c.text}}</span></button></div>
<div class="support-actions"><button @click="useHint()" :aria-expanded="session.usedHint||session.settings.showHints||session.settings.difficulty===1">提示</button><button v-if="session.settings.showDemo" @click="useHint(true)" :aria-expanded="session.usedDemo">看示範</button><button :disabled="!session.records[session.index].choices.some(a=>!a.retried)" @click="back">回上一回合</button></div>
<div v-if="session.usedHint||session.settings.showHints||session.settings.difficulty===1" class="hint"><strong>想一想</strong><p>{{hint?.rationale}}</p></div><div v-if="session.usedDemo&&hint" class="demo"><strong>可以試著這樣說</strong><p>「{{hint.text}}」</p><p>{{npcLine(hint.npcReaction.text)}}</p></div></div>
<div v-else-if="selected" class="reaction-area" tabindex="-1" aria-live="polite" aria-atomic="true"><div class="player-speech"><small>你說</small><p>{{selected.text}}</p></div><div class="npc-reaction"><strong>{{selected.npcReaction.text.startsWith('（')?'接下來':`${npc.name}回應`}}</strong><p>{{selected.npcReaction.text}}</p></div><div v-if="session.settings.showImmediateFeedback" class="feedback"><strong>{{selected.feedbackLevel==='effective'?'這樣能接住當下的需要':selected.feedbackLevel==='acceptable'?'這樣說也可以':'看看另一種做法'}}</strong><p>{{selected.rationale}}</p></div><div class="actions"><button class="primary" @click="advance">{{graph?.nodes[selected.nextNodeId]?.kind==='end'?'看看收尾':'下一句'}}</button><button @click="retry">換個選項</button></div></div></template>
<template v-else><p class="eyebrow">這次聊天，先到這裡</p><h2>謝謝你願意試試看。</h2><p class="npc-speech ending-speech" aria-live="polite">{{npcLine(node.closingText)}}</p><p>可以慢慢想，也可以用短句。<br/>尊重自己的需要，也尊重對方。</p><div class="actions"><button class="primary" @click="finishScenario">{{session.index+1===session.scenarioIds.length?'看看這次的練習':'下一個情境'}}</button><button @click="back">回上一回合</button></div></template>
</div></div></section>
<section v-if="view==='results'&&session" class="content-screen results-screen"><p class="eyebrow">每一次嘗試，都多認識一點</p><h1>你完成了 {{session.records.filter(r=>r.completed).length}} 個情境。</h1><p v-if="strengths" class="result-strength">這次，你在「{{skillNames[strengths.skill]}}」有 {{strengths.effective}} 次接住情境的需要。</p><p>這些結果只代表本次遊戲作答情境，是觀察與練習的線索。</p><div class="skill-results"><article v-for="s in summary" :key="s.skill"><PictureCue :kind="s.skill"/><div><h2>{{skillNames[s.skill]}}</h2><p>{{s.label}}</p><small v-if="s.total">{{s.effective}}／{{s.total}} 次適切回應 · {{s.independent}} 次未用提示或示範</small></div></article></div><div class="next-practice"><h2>下一步：{{skillNames[recommendation]}}</h2><p v-if="nextSuggested">可以換個情境，試試「{{nextSuggested.title}}」。不需要一次做到全部。</p><button v-if="nextSuggested" @click="lessonMode=false;begin([nextSuggested.id])">練習推薦情境</button></div>
<details><summary>看看這次的回應與教學回饋</summary><article v-for="r in session.records" :key="r.scenarioId" class="review-record"><h3>{{scenarios.find(s=>s.id===r.scenarioId)?.title}}</h3><div v-for="(a,i) in r.choices" :key="i"><p>{{a.retried?'曾嘗試：':'你說：'}}{{a.text}} <small>{{a.usedHint?'（使用提示）':''}}{{a.usedDemo?'（看過示範）':''}}</small></p><p>{{a.reaction.startsWith('（')?'情境':'對方'}}：{{a.reaction}}</p><p>{{rationaleFor(r.scenarioId,r.difficulty,a)}}</p></div></article></details>
<div class="actions"><button v-if="lessonMode" class="primary" @click="navigate('lessons')">回到章節練習</button><button v-else class="primary" @click="newThree">再玩三題</button><button @click="navigate('home')">回首頁選難度</button><button @click="retryScenario">重試本題</button><button @click="navigate('home')">返回首頁</button></div></section>

</main>
<dialog ref="dialog" class="relay-dialog" aria-labelledby="dialog-title" @cancel="dialogOpener?.focus()"><h2 id="dialog-title">{{dialogTitle}}</h2><p>{{dialogText}}</p><div class="actions"><button @click="closeDialog">先不要</button><button class="primary" @click="confirm">確認</button></div></dialog>
</div></div></template>
