<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useGameFullscreen } from '../campus/useGameFullscreen';
import SceneArt from './components/SceneArt.vue';
import GameIcon from './components/GameIcon.vue';
import LobbyBackdrop from './components/LobbyBackdrop.vue';
import PictureCue from './components/PictureCue.vue';
import StickerArt from './components/StickerArt.vue';
import { feedbackTitles, visibleFeedback, sceneFeedback } from './feedback.ts';
import LessonStudy from './components/LessonStudy.vue';
import StoryDemo from './components/StoryDemo.vue';
import { lessons } from './data/lessons.ts';
import { scenarios } from './data/scenarios/index.ts';
import { characters, scenes, skillNames, difficultyNames, learningGoals } from './data/manifest.ts';
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
const view=ref<'home'|'session'|'results'|'lessons'|'demo'>('home');
const session=computed(()=>data.activeSession);const current=computed(()=>session.value?scenarios.find(s=>s.id===session.value!.scenarioIds[session.value!.index]):undefined);
const graph=computed(()=>current.value&&session.value?graphFor(current.value,session.value.settings.difficulty):undefined);
const node=computed(()=>session.value?graph.value?.nodes[session.value.nodeId]:undefined);
const choices=computed(()=>node.value?.kind==='decision'&&session.value?orderedChoices(session.value,node.value):[]);
const isNarration=computed(()=>node.value?.kind==='decision'&&node.value.npcText.startsWith('（'));
const selected=computed(()=>node.value?.kind==='decision'?node.value.choices.find(c=>c.id===session.value?.selectedChoiceId):undefined);
function rationaleFor(id:string,difficulty:1|2|3,a:Answer){const s=scenarios.find(s=>s.id===id);if(!s)return '';const n=graphFor(s,difficulty).nodes[a.nodeId];return n?.kind==='decision'?n.choices.find(c=>c.id===a.choiceId)?.rationale:'';}
const naturalDialogue=computed(()=>current.value?.turnPolicy==='natural');
const immediateFeedback=computed(()=>selected.value?visibleFeedback(selected.value):undefined);
const endingFeedback=computed(()=>current.value&&session.value?sceneFeedback(current.value,session.value.settings.difficulty,session.value.records[session.value.index].choices):[]);
const sceneName=computed(()=>scenes.find(s=>s.id===current.value?.sceneId)?.name);
const npc=computed(()=>({...characters.find(c=>c.id===current.value?.npcId)??characters[0],name:current.value?.partnerName??characters.find(c=>c.id===current.value?.npcId)?.name??characters[0].name}));
const messaging=computed(()=>current.value?.channel==='message');
const hint=computed(()=>node.value?.kind==='decision'?node.value.choices.find(c=>c.feedbackLevel==='effective'):undefined);
const summary=computed(()=>summarize(session.value?.records??[]));
const recommendation=computed(()=>recommendedSkill(session.value?.records??[]));
const nextSuggested=computed(()=>scenarios.find(s=>s.skillTags.includes(recommendation.value)&&!session.value?.scenarioIds.includes(s.id)));
const activeTextSize=computed(()=>view.value==='session'?session.value?.settings.textSize??18:data.settings.textSize);
const lessonMode=ref(false);const lessonRef=ref<InstanceType<typeof LessonStudy>>();
const dialog=ref<HTMLDialogElement>();let afterConfirm:()=>void=()=>{};const dialogTitle=ref('');const dialogText=ref('');let dialogOpener:HTMLElement|null=null;
const speechError=ref('');
const quickDemo=lessons[0].demos.slice(0,1);
const turnCount=computed(()=>session.value?.settings.difficulty===1?2:session.value?.settings.difficulty===3?4:3);
const turnNumber=computed(()=>naturalDialogue.value&&session.value?session.value.records[session.value.index].choices.filter(a=>!a.retried).length+(session.value.phase==='choose'?1:0):node.value?.id==='start'?1:node.value?.id==='a'||node.value?.id==='b'?2:node.value?.id==='extra'?3:turnCount.value);
const hintVisible=computed(()=>!!session.value&&(session.value.usedHint||session.value.settings.showHints||session.value.settings.difficulty===1));
const nextLabel=computed(()=>naturalDialogue.value&&selected.value&&graph.value?.nodes[selected.value.nextNodeId]?.kind==='end'?'看看這次練習':selected.value&&graph.value?.nodes[selected.value.nextNodeId]?.kind==='end'?(session.value&&session.value.index+1===session.value.scenarioIds.length?'看看結果':'下一題'):'下一句');
const encouragement=computed(()=>{
 const skill=[...summary.value].sort((a,b)=>b.effective-a.effective)[0];
 if(!skill?.effective)return session.value?.records.some(r=>r.choices.some(a=>a.retried))?'你願意換個回答，看看對方不同的反應。':'你完成了每段對話，也看見了不同回答帶來的反應。';
 return {listen:'你有注意對方正在說什麼，再接著回應。',respond:'你有接住對方的話題，讓聊天有來有往。',empathy:'你有注意對方的心情，選擇能接住它的回應。',ask_question:'你有問出相關的小問題，讓對方能再分享一點。',share_related:'你有分享相關經驗，也讓對方有機會回應。',respect_boundary:'你有在需要時保留空間，或清楚表達自己的界線。',close_conversation:'你有用簡短的話或行動，自然結束聊天。'}[skill.skill];
});
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
function begin(ids:string[],mode:Session['mode']='free',replace=false){
 if(!ids.length){notice.value='目前沒有可用的情境，請重新整理再試。';return;}
 const start=()=>{const seed=newSeed();data.activeSession=createSession(ids,data.settings,seed,data.profileId,mode);persist();navigate('session');sayCurrent();};
 if(!replace&&session.value&&!session.value.completed&&session.value.records.some(r=>r.choices.length))confirmAction('開始新的練習？','目前未完成的練習會被新題組取代。需要的話可先回首頁續玩。',start);else start();
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
function advance(){if(!session.value||!current.value)return;stopSpeech();if(!continueDialogue(session.value,current.value))return;if(session.value.phase==='end'&&!naturalDialogue.value){finishScenario();return;}persist();focusDialogue('.dialogue-panel');sayCurrent();}
function retry(){if(!session.value)return;stopSpeech();retryChoice(session.value);persist();focusDialogue('.choice-card');}
function back(){if(!session.value)return;stopSpeech();backOne(session.value);persist();focusDialogue('.dialogue-panel');}
function useHint(demo=false){if(!session.value)return;session.value.usedHint=true;if(demo)session.value.usedDemo=true;persist();}
function finishScenario(){const s=session.value;if(!s||!current.value||s.phase!=='end')return;const h=historyFor(data);remember(h,current.value.id,new Date().toISOString());
 if(!nextScenario(s)){const saved=JSON.parse(JSON.stringify(s)) as Session;data.records=data.records.filter(r=>r.session.id!==s.id);data.records.push({session:saved});persist();if(s.mode==='lesson')lessonRef.value?.dialogueDone();navigate('results');}else{persist();focusDialogue('.dialogue-panel');sayCurrent();}}
function pause(){confirmAction('先休息一下？','目前的選擇已儲存在這台裝置。回到首頁後，可在「教師工具」裡繼續上次練習。',()=>{persist();navigate('home');});}
function randomStart(){lessonMode.value=false;data.settings.sceneIds=[];data.settings.skillTags=[];data.settings.sessionLength=3;const settings={...data.settings,sceneIds:[],skillTags:[],sessionLength:3 as const};const result=selectScenarioPool(settings,historyFor(data),3,seededRandom(newSeed()),scenarios);notice.value=result.notice;begin(result.ids,'free',true);}
function newThree(){randomStart();}
function launchLesson(id:string){if(!scenarios.some(s=>s.id===id)){notice.value='這組情境目前無法載入。';return;}lessonMode.value=true;begin([id],'lesson');}
function completeLesson(i:number){if(!data.lessons.includes(i))data.lessons.push(i);persist();}
function onShortcut(event:KeyboardEvent){
 if(event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||dialog.value?.open)return;
 const target=event.target instanceof Element?event.target:null;
 if(target?.closest('input,textarea,select,summary,[contenteditable="true"]'))return;
 if(target&&target!==document.body&&!gameRoot.value?.contains(target))return;
 if(view.value==='session'&&session.value){
  const index=['1','2','3'].indexOf(event.key);
  if(session.value.phase==='choose'&&index>=0&&choices.value[index]){event.preventDefault();select(choices.value[index]);return;}
  if(event.key==='Enter'&&!target?.closest('button,a')){
   if(session.value.phase==='reaction'){event.preventDefault();advance();}
   else if(session.value.phase==='end'){event.preventDefault();finishScenario();}
  }
 }else if(view.value==='demo'&&event.key==='Enter'&&!target?.closest('button,a')){event.preventDefault();gameRoot.value?.querySelector<HTMLButtonElement>('.story-demo button.primary')?.click();}
}
function pageHidden(){if(document.hidden)stopSpeech();}
document.addEventListener('visibilitychange',pageHidden);
document.addEventListener('keydown',onShortcut);
onBeforeUnmount(()=>{stopSpeech();document.removeEventListener('visibilitychange',pageHidden);document.removeEventListener('keydown',onShortcut);});
</script>
<template>
  <div class="chat-relay-page-content">
    <div class="relay-page-heading">
      <a class="relay-back" :href="`${base}game/`">← 遊戲百寶箱</a>
      <h1>社會技巧：聊天傳接球</h1>
    </div>
    <div ref="gameRoot" class="chat-relay classroom-relay" :data-view="view" :class="{'is-fullscreen':fullscreen.active.value,'reduce-motion':data.settings.reducedMotion||(view==='session'&&session?.settings.reducedMotion)}" :style="{'--relay-font':`${activeTextSize}px`}">
      <a class="skip-link" href="#relay-main">跳到主要內容</a>
      <div class="relay-toolbar">
        <button v-if="view!=='home'" class="relay-home-button" @click="view==='session'?pause():navigate('home')"><GameIcon kind="home"/>回首頁</button>
        <span v-else class="relay-toolbar-label"><GameIcon kind="chat"/>聊天小校園</span>
        <nav class="relay-toolbar-actions" aria-label="遊戲工具">
          <button v-if="view==='session'&&session?.settings.readAloud" class="stop-speech" @click="stopSpeech">停止朗讀</button>
          <button :aria-pressed="fullscreen.active.value" @click="fullscreen.toggle"><GameIcon kind="expand"/>{{fullscreen.active.value?'離開全螢幕':'全螢幕'}}</button>
        </nav>
      </div>
      <p v-if="notice" class="storage-notice" role="status">{{notice}}</p>
      <main id="relay-main" tabindex="-1">
        <section v-if="view==='home'" class="home-screen">
          <LobbyBackdrop/>
          <div class="home-hero">
            <div class="home-copy">
              <p class="eyebrow">把聊天，變成一場傳接球</p>
              <h2>聽一句，<br/>接住話題。</h2>
              <p class="home-subtitle">看情境、聽對話，再選一句你想說的話。</p>
              <div class="home-actions">
                <button class="primary practice-start" @click="randomStart"><GameIcon kind="chat"/>立即開始</button>
                <button class="demo-start" @click="navigate('demo')"><GameIcon kind="book"/>先看示範</button>
              </div>
            </div>
            <div class="hero-illustration"><SceneArt home/><div class="illustration-caption">可以慢慢想，也可以先休息。</div></div>
          </div>
          <div class="home-bottom"><ul class="home-facts" aria-label="教材資訊"><li>適合需練習社會溝通的學生</li><li>建議 5–10 分鐘</li><li>免登入</li></ul></div>
          <details class="practice-preferences teacher-tools" @toggle="onPreferencesToggle">
  <summary><GameIcon kind="settings"/><span>教師工具與說明</span><span class="preference-current">{{data.settings.difficulty===2?'一般難度':difficultyNames[data.settings.difficulty]}}</span><span class="preference-expand" aria-hidden="true"></span></summary>
  <div class="preferences-panel">
    <div class="teacher-note"><strong>教學目標</strong><ul><li v-for="(label,key) in learningGoals" :key="key">{{label}}</li></ul><p>可投影討論，或個別／小組輪流練習；不要求眼神接觸，也不把拒絕當成失敗。網路情境為模擬練習，不會傳送真實訊息。</p></div>
    <div class="teacher-actions"><button @click="navigate('lessons')"><GameIcon kind="book"/>章節教學與練習</button><button v-if="session&&!session.completed" class="resume-button" @click="resume">繼續上次練習 · {{session.index+1}}／{{session.scenarioIds.length}} 題</button></div>
    <div class="preference-fields">
      <fieldset><legend>練習難度</legend><div class="preference-options">
        <label v-for="level in ([1,2,3] as const)" :key="level" class="preference-option"><input v-model="data.settings.difficulty" type="radio" name="relay-difficulty" :value="level"/><span><strong>{{level===2?'一般難度':difficultyNames[level]}}</strong><small>{{level+1}} 回合{{level===1?' · 圖卡輔助':''}}</small></span></label>
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
    <p class="preference-note">按「立即開始」會直接抽出不重複的三題。對話依情境收尾，預設顯示即時回饋；調整會用在下一場練習。</p>
  </div>
</details>
        </section>
        <section v-if="view==='demo'" class="demo-screen content-screen" aria-labelledby="demo-heading">
          <h2 id="demo-heading">先看看怎麼接話</h2>
          <p>聽一聽他們怎麼聊，接著換你接球。</p>
          <StoryDemo :demos="quickDemo" scene-id="classroom" done-label="立即開始" @done="randomStart"/>
        </section>
        <LessonStudy v-show="view==='lessons'" ref="lessonRef" class="content-screen" :completed="data.lessons" @launch="launchLesson" @complete="completeLesson"/>
        <section v-if="view==='session'&&session&&current&&node" class="session-screen">
          <header class="session-top"><h2>{{current.title}}</h2><p class="session-progress">第 {{session.index+1}}／{{session.scenarioIds.length}} 題<span v-if="naturalDialogue">第 {{turnNumber}} 句</span><span v-else>{{turnNumber}}／{{turnCount}} 句</span></p></header>
          <div class="session-layout">
            <div class="stage" :class="{'message-stage':messaging}">
              <p v-if="messaging" class="message-channel">訊息練習<span>{{current.partnerName?'線上認識的帳號':'認識的同學'}}</span></p>
              <SceneArt :scene-id="current.sceneId" :npc-id="current.npcId" :npc-name="npc.name" show-names :passing="session.phase==='reaction'" :turn-key="`${current.id}:${node.id}:${session.attempt}`" :emotion="selected?.npcReaction.emotion??(node.kind==='decision'?node.npcEmotion:'leaving')"/>
              <div class="stage-context"><span>{{messaging?learningGoals[current.learningGoal]:sceneName}}</span><p>{{current.setting}}</p></div>
            </div>
            <div class="dialogue-panel" tabindex="-1">
              <template v-if="node.kind==='decision'">
                <div v-if="session.phase==='choose'" class="choose-task">
                  <div class="speaker-row"><strong>{{isNarration?'看一看':npc.name}}</strong><button class="speech-button" :disabled="!speechAvailable()" @click="speakText(node.npcText)"><GameIcon kind="sound"/>{{isNarration?'聽情境':messaging?'聽訊息':'聽對話'}}</button></div>
                  <p class="npc-speech" aria-live="polite" aria-atomic="true">{{node.npcText}}</p>
                  <p v-if="speechError" class="small-note" role="status">{{speechError}}</p>
                  <div class="question-row"><p class="question-label">{{isNarration?'接下來，你想怎麼做？':messaging?'換你回訊息。':'換你接球，選一句。'}}</p><button class="hint-button text-button" @click="useHint()" :aria-expanded="hintVisible">提示</button></div>
                  <div class="choice-list" :class="{'picture-choices':session.settings.difficulty===1}">
                    <button v-for="(c,i) in choices" :key="`${current.id}-${node.id}-${c.id}`" class="choice-card" @click="select(c)"><span class="choice-number" aria-hidden="true">{{i+1}}</span><StickerArt v-if="c.sticker" :kind="c.sticker"/><PictureCue v-else-if="session.settings.difficulty===1" :kind="c.imageCue"/><span class="choice-text">{{c.text}}</span></button>
                  </div>
                  <div v-if="hintVisible" class="hint"><p>{{hint?.rationale}}</p></div>
                  <details class="turn-tools"><summary>更多協助</summary><button v-if="session.settings.showDemo" @click="useHint(true)">看一句示範</button><button :disabled="!session.records[session.index].choices.some(a=>!a.retried)" @click="back">回上一句</button><div v-if="session.usedDemo&&hint" class="demo"><p>可以試著說：「{{hint.text}}」</p><p>{{npcLine(hint.npcReaction.text)}}</p></div></details>
                </div>
                <div v-else-if="selected" class="reaction-area" tabindex="-1" aria-live="polite" aria-atomic="true">
                  <p class="answered-line"><span>{{messaging?'你的選擇':'你說'}}</span><StickerArt v-if="selected.sticker" :kind="selected.sticker"/><span class="answered-text">{{selected.text}}</span></p>
                  <div class="npc-reaction"><strong>{{selected.npcReaction.text.startsWith('（')?'接下來':`${npc.name}回應`}}</strong><p>{{selected.npcReaction.text}}</p></div>
                  <template v-if="session.settings.showImmediateFeedback">
                    <p v-if="naturalDialogue&&!immediateFeedback?.detailed" class="feedback-tip">{{immediateFeedback?.text}}</p>
                    <div v-else class="feedback" :class="{'natural-feedback':naturalDialogue}" :data-feedback="selected.feedbackLevel"><strong v-if="!naturalDialogue" class="feedback-title">{{feedbackTitles[selected.feedbackLevel]}}</strong><p class="feedback-explanation">{{immediateFeedback?.text}}</p><small v-if="!naturalDialogue&&selected.feedbackLevel==='try_another'">沒關係，可以換個回答再試試。</small></div>
                  </template>
                  <div class="actions"><button class="primary next-turn" @click="advance">{{nextLabel}}</button><button class="text-button retry-button" @click="retry">換個回答</button></div>
                  <p class="keyboard-note">Enter 下一步</p>
                </div>
              </template>
              <template v-else>
                <p class="eyebrow">這段聊天，到這裡</p><p class="npc-speech ending-speech" aria-live="polite">{{npcLine(node.closingText)}}</p>
                <div v-if="naturalDialogue" class="scene-feedback"><p>這次練習到的技巧</p><ul><li v-for="text in endingFeedback" :key="text">{{text}}</li></ul></div>
                <div class="actions"><button class="primary" @click="finishScenario">{{session.index+1===session.scenarioIds.length?'看看結果':'下一題'}}</button><button class="text-button" @click="back">換個回答</button></div>
              </template>
            </div>
          </div>
        </section>
        <section v-if="view==='results'&&session" class="content-screen results-screen" aria-labelledby="results-heading">
          <div class="result-welcome"><PictureCue kind="respond"/><h2 id="results-heading">完成 {{session.records.filter(r=>r.completed).length}} 個情境！</h2><p class="result-encouragement">{{encouragement}}</p></div>
          <div class="actions result-actions"><button class="primary" @click="newThree">再玩三題</button><button v-if="lessonMode" @click="navigate('lessons')">回到章節練習</button></div>
          <details class="result-details"><summary>查看能力分析與本次紀錄</summary>
            <p class="small-note">這些結果只代表本次情境，是觀察與練習的線索。</p>
            <div class="skill-results"><article v-for="s in summary" :key="s.skill"><PictureCue :kind="s.skill"/><div><h3>{{skillNames[s.skill]}}</h3><p>{{s.label}}</p><small v-if="s.total">{{s.effective}}／{{s.total}} 次適切回應 · {{s.independent}} 次未用提示或示範</small></div></article></div>
            <div class="next-practice"><h3>可以再練：{{skillNames[recommendation]}}</h3><p v-if="nextSuggested">換個情境，試試「{{nextSuggested.title}}」。</p><button v-if="nextSuggested" @click="lessonMode=false;begin([nextSuggested.id])">練習推薦情境</button></div>
            <article v-for="r in session.records" :key="r.scenarioId" class="review-record"><h3>{{scenarios.find(s=>s.id===r.scenarioId)?.title}}</h3><div v-for="(a,i) in r.choices" :key="i"><p>{{a.retried?'曾嘗試：':'你說：'}}{{a.text}} <small>{{a.usedHint?'（使用提示）':''}}{{a.usedDemo?'（看過示範）':''}}</small></p><p>{{a.reaction.startsWith('（')?'情境':'對方'}}：{{a.reaction}}</p><p>{{rationaleFor(r.scenarioId,r.difficulty,a)}}</p></div></article>
          </details>
        </section>
      </main>
      <dialog ref="dialog" class="relay-dialog" aria-labelledby="dialog-title" @cancel="dialogOpener?.focus()"><h2 id="dialog-title">{{dialogTitle}}</h2><p>{{dialogText}}</p><div class="actions"><button @click="closeDialog">先不要</button><button class="primary" @click="confirm">確認</button></div></dialog>
    </div>
  </div>
</template>
