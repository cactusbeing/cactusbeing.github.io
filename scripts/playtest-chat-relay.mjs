import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { lessons } from '../src/features/chat-relay/data/lessons.ts';
import { createSession } from '../src/features/chat-relay/engine/dialogue.ts';
import { defaultSettings } from '../src/features/chat-relay/services/storage.ts';
import { scenarios } from '../src/features/chat-relay/data/scenarios/index.ts';
import { visibleFeedback } from '../src/features/chat-relay/feedback.ts';
// Root-only interactive QA. The shared default browser stays open afterwards.
const url=process.argv[2]??'http://127.0.0.1:4178/game/chat-relay/';
const evidence=process.env.CHAT_RELAY_EVIDENCE??'/tmp/chat-relay';
const layoutOnly=process.argv.includes('--layout-only');
const report={url,difficulties:[],lessons:[],viewports:[],checks:[]};
function browser(...args){const raw=execFileSync('agent-browser',['--json',...args],{encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024});const result=JSON.parse(raw);if(!result.success)throw Error(JSON.stringify(result.error));return result.data;}
const evaluate=(fn,...args)=>browser('eval',`(${fn.toString()})(${args.map(x=>JSON.stringify(x)).join(',')})`).result;
function click(text){return evaluate(async text=>{const b=[...document.querySelectorAll('.chat-relay button')].find(b=>b.offsetParent!==null&&!b.disabled&&b.textContent.trim().replace(/^←\s*/, '').startsWith(text.replace(/^←\s*/, '')));if(!b)throw Error('Missing button '+text);b.click();await new Promise(r=>setTimeout(r,50));},text);}
function teacherTools(){evaluate(async()=>{document.querySelector('.practice-preferences').open=true;await new Promise(r=>setTimeout(r,30));});}
function openLessons(){teacherTools();click('章節教學與練習');}
function resumePractice(){teacherTools();click('繼續上次練習');}
function authoredPractice(id,difficulty=2,overrides={}){
 const profile=evaluate(()=>JSON.parse(localStorage.getItem('cactus:chat-relay:v1:data')).profileId);
 const session=createSession([id],{...defaultSettings(),difficulty,...overrides},71,profile);
 evaluate(session=>{const key='cactus:chat-relay:v1:data',data=JSON.parse(localStorage.getItem(key));data.activeSession=session;localStorage.setItem(key,JSON.stringify(data));},session);
 browser('reload');resumePractice();
}
function answerText(text){return evaluate(async text=>{const button=[...document.querySelectorAll('.choice-card')].find(b=>b.querySelector('.choice-text').textContent===text);if(!button)throw Error('Missing authored reply '+text);button.click();await new Promise(r=>setTimeout(r,30));},text);}
function confirmIfNeeded(){evaluate(async()=>{const d=document.querySelector('.chat-relay dialog[open]');if(d){[...d.querySelectorAll('button')].find(b=>b.textContent==='確認').click();await new Promise(r=>setTimeout(r,50));}});}
function finishDialogue(narrationChoice){
 return evaluate(async preferred=>{
  let turns=0;
  for(let step=0;step<100;step++){
   const screen=document.querySelector('.session-screen');
   if(!screen)return turns;
   const choices=[...screen.querySelectorAll('.choice-card')];
   if(choices.length){(choices.find(b=>b.querySelector('.choice-text')?.textContent===preferred)??choices[0]).click();if(++turns>30)throw Error('Dialogue stuck');}
   else{
    const reaction=screen.querySelector('.reaction-area');
    if(reaction){
     if(reaction.querySelector('.npc-reaction p').textContent.includes('：「（'))throw Error('Narration quoted as speech');
     const next=reaction.querySelector('.primary');if(!next)throw Error('Reaction has no next action');next.click();
    }else{
     const ending=screen.querySelector('.ending-speech');
     if(!ending)throw Error('No actionable dialogue');
     if(ending.textContent.includes('：「（')||(preferred&&!ending.textContent.trim().startsWith('（')))throw Error('Ending narration is incorrect');
     screen.querySelector('.actions .primary').click();
    }
   }
   await new Promise(resolve=>setTimeout(resolve,50));
  }
  throw Error('Dialogue did not finish');
 },narrationChoice??null);
}
function chooseAndRead(index){return evaluate(async index=>{document.querySelectorAll('.choice-card')[index].click();await new Promise(r=>setTimeout(r,35));return{reaction:document.querySelector('.npc-reaction p')?.textContent,focus:document.activeElement?.className};},index);}
function checkWidth(label){
 const result=evaluate(()=>{
  const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
  const shown=e=>e&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0;
  const root=document.querySelector('.chat-relay'),main=document.querySelector('#relay-main');
  const issues=[];const overlap=(a,b)=>Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1;
  if(innerWidth>=900&&box(main).w<box(root).w-4)issues.push('Content failed to stretch across game grid');
  if(innerWidth>=900&&box(root).bottom>innerHeight+2)issues.push('Desktop game extends below viewport');
  const home=document.querySelector('.home-screen');
  if(shown(home)){
   const copy=box(home.querySelector('.home-copy')),art=box(home.querySelector('.hero-illustration')),bottom=box(home.querySelector('.home-bottom')),prefs=box(home.querySelector('.practice-preferences'));
   if(overlap(copy,art)||overlap(copy,bottom)||overlap(art,bottom)||overlap(bottom,prefs))issues.push('Home regions overlap');
  }
  const preferences=document.querySelector('.preferences-panel');
  if(shown(preferences)){
   const p=box(preferences),labels=[...preferences.querySelectorAll('.preference-option,.preference-toggle')].map(box);
   for(let i=0;i<labels.length;i++){const a=labels[i];if(a.x<p.x-1||a.right>p.right+1||a.y<p.y-1||a.bottom>p.bottom+1)issues.push('Preference control outside panel');for(let j=i+1;j<labels.length;j++)if(overlap(a,labels[j]))issues.push('Preference controls overlap');}
  }
  const map=document.querySelector('.world-map');
  if(shown(map)){
   const mapBox=box(map),buttons=[...map.querySelectorAll('button[data-chapter]')].map(box);
   if(mapBox.h<260)issues.push('World map collapsed');
   if(innerWidth>=900&&parseFloat(getComputedStyle(root).fontSize)===18&&mapBox.bottom>box(main).bottom+1)issues.push('Desktop map not fully visible');
   if(innerWidth>=900){for(const actor of map.querySelectorAll('.world-npc')){if(buttons.some(b=>overlap(box(actor),b)))issues.push('Chapter sign covers a character');}}
   for(let i=0;i<buttons.length;i++){
    const r=buttons[i];if(r.x<mapBox.x-1||r.right>mapBox.right+1||r.y<mapBox.y-1||r.bottom>mapBox.bottom+1)issues.push('Chapter button outside world');
    for(let j=i+1;j<buttons.length;j++)if(overlap(r,buttons[j]))issues.push('Chapter buttons overlap');
   }
  }
  const world=document.querySelector('.demo-world');
  if(shown(world)){const r=box(world),dialogue=box(world.querySelector('.demo-dialogue'));if(r.h<200)issues.push('Demonstration world collapsed');if(dialogue.y<r.y-1||dialogue.bottom>r.bottom+1)issues.push('Demonstration dialogue outside world');}
  const stage=document.querySelector('.stage .scene-art');
  if(shown(stage))for(const actor of stage.querySelectorAll('.scene-person')){
   const svg=actor.querySelector('.character-art'),tag=actor.querySelector('.scene-nameplate');
   if(!tag){issues.push('Actor name tag missing');continue;}
   const matrix=svg.getScreenCTM(),feet=[40,120].map(x=>new DOMPoint(x,249).matrixTransform(matrix)),footY=Math.max(...feet.map(p=>p.y)),r=box(tag),s=box(stage);
   const gap=r.y-footY;if(gap< -6||gap>18)issues.push('Name tag too far from actor feet: '+gap);
   if(r.x<s.x-1||r.right>s.right+1||r.y<s.y-1||r.bottom>s.bottom+1)issues.push('Name tag outside scene');
  }
  const choices=[...document.querySelectorAll('.choice-list')].filter(shown);
  for(const list of choices){const buttons=[...list.querySelectorAll('button')].map(box);if(list.closest('.session-screen')&&buttons.some(b=>b.h<56))issues.push('Answer target under 56px');for(let i=1;i<buttons.length;i++)if(overlap(buttons[i-1],buttons[i]))issues.push('Answer choices overlap');}
  return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,issues};
 });
 assert.ok(result.scrollWidth<=result.width,`${label}: ${JSON.stringify(result)}`);
 assert.deepEqual(result.issues,[],`${label}: ${JSON.stringify(result)}`);return result;
}
// Measure all authored text in the actual layout, including sticker width and feedback status.
function checkProjectionText(){
 authoredPractice('classroom-01');
 const nodes=scenarios.flatMap(s=>Object.values(s.nodes).filter(n=>n.kind==='decision').map(n=>({id:s.id+':'+n.id,text:n.npcText,choices:n.choices.map(c=>({text:c.text,sticker:!!c.sticker}))})));
 const reactions=scenarios.flatMap(s=>Object.values(s.nodes).filter(n=>n.kind==='decision').flatMap(n=>n.choices.map(c=>({id:s.id+':'+c.id,text:c.text,reaction:c.npcReaction.text,feedback:visibleFeedback(c).text,detailed:visibleFeedback(c).detailed,natural:s.turnPolicy==='natural',level:c.feedbackLevel,sticker:!!c.sticker}))));
 assert.ok(nodes.some(n=>n.choices.length===2),'Includes the two-choice natural branches');
 for(const [w,h] of [[1366,768],[1280,720]]){
  browser('set','viewport',String(w),String(h));
  const over=evaluate(nodes=>{
   const npc=document.querySelector('.npc-speech'),list=document.querySelector('.choice-list'),originalButtons=[...list.children],template=originalButtons[0],old=npc.textContent,over=[];
   try{
    for(const n of nodes){
     npc.textContent=n.text;
     list.replaceChildren(...n.choices.map((choice,i)=>{
      const button=template.cloneNode(true);button.querySelector('.choice-number').textContent=String(i+1);const text=button.querySelector('.choice-text');text.textContent=choice.text;
      if(choice.sticker){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('reply-sticker');button.insertBefore(svg,text);}
      return button;
     }));
     const panel=document.querySelector('.dialogue-panel').getBoundingClientRect();
     if(list.lastElementChild.getBoundingClientRect().bottom>panel.bottom+1)over.push(n.id);
    }
   }finally{npc.textContent=old;list.replaceChildren(...originalButtons);}
   return over;
  },nodes);
  assert.deepEqual(over,[],`All ${nodes.length} decision texts keep their actual answer counts visible at ${w}`);
 }
 chooseAndRead(0);
 for(const [w,h] of [[1366,768],[1280,720]]){
  browser('set','viewport',String(w),String(h));
  const over=evaluate(reactions=>{
   const answer=document.querySelector('.answered-text'),npc=document.querySelector('.npc-reaction p'),originalBox=document.querySelector('.reaction-area>.feedback'),old=[answer.textContent,npc.textContent],over=[];
   let currentBox=originalBox;
   try{
    for(const c of reactions){
     answer.textContent=c.text;npc.textContent=c.reaction;
     let box;
     if(c.natural&&!c.detailed){box=document.createElement('p');box.className='feedback-tip';box.textContent=c.feedback;}
     else{
      box=originalBox.cloneNode(true);box.querySelector('.feedback-title').textContent={effective:'接得很好！',acceptable:'這樣回也可以！',try_another:'這句可以再調整'}[c.level];box.querySelector('.feedback-explanation').textContent=c.feedback;box.dataset.feedback=c.level;box.querySelector('small')?.remove();
      if(c.natural){box.classList.add('natural-feedback');box.querySelector('.feedback-title').remove();}
      else if(c.level==='try_another'){const small=document.createElement('small');small.textContent='沒關係，可以換個回答再試試。';box.append(small);}
     }
     currentBox.replaceWith(box);currentBox=box;
     document.querySelector('[data-measure-sticker]')?.remove();
     if(c.sticker){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('reply-sticker');svg.dataset.measureSticker='true';answer.before(svg);}
     const panel=document.querySelector('.dialogue-panel').getBoundingClientRect();
     if(document.querySelector('.next-turn').getBoundingClientRect().bottom>panel.bottom+1)over.push(c.id);
    }
   }finally{answer.textContent=old[0];npc.textContent=old[1];currentBox.replaceWith(originalBox);document.querySelector('[data-measure-sticker]')?.remove();}
   return over;
  },reactions);
  assert.deepEqual(over,[],`All ${reactions.length} reactions keep the next-step button visible at ${w}`);
 }
 click('回首頁');confirmIfNeeded();browser('set','viewport','1440','900');
 report.checks.push(`Projection typography: ${nodes.length} decision texts with actual option counts and ${reactions.length} reactions with authored feedback states at 1366×768 and 1280×720`);
}
function checkDialogueRevision(){
 browser('set','viewport','1366','768');authoredPractice('club-02');
 assert.ok(evaluate(()=>!!document.querySelector('.message-channel')),'Message mode is explicit');
 assert.ok(evaluate(()=>document.querySelectorAll('.choice-card .reply-sticker').length>=2),'Actual original sticker choices are rendered');
 browser('screenshot',`${evidence}-message-choices-desktop.png`);
 answerText('貼圖：笑到打滾');
 assert.equal(evaluate(()=>document.querySelector('.reaction-area .feedback').dataset.feedback),'try_another');
 assert.equal(evaluate(()=>document.querySelector('.reaction-area .feedback-title').textContent),'這句可以再調整');
 assert.ok(evaluate(()=>document.querySelector('.reaction-area .feedback small').textContent.includes('沒關係')));
 assert.equal(evaluate(()=>document.querySelectorAll('.stage .relay-ball circle').length),3,'Relay animation uses conversation dots, not a misleading success check');
 browser('screenshot',`${evidence}-feedback-adjust-desktop.png`);
 click('換個回答');answerText('貼圖：拍拍，陪著你');
 assert.equal(evaluate(()=>document.querySelector('.reaction-area .feedback-title').textContent),'接得很好！');
 browser('screenshot',`${evidence}-feedback-good-desktop.png`);
 browser('set','viewport','390','844');checkWidth('message feedback mobile');browser('screenshot',`${evidence}-feedback-good-mobile.png`,'--full');
 click('回首頁');confirmIfNeeded();browser('set','viewport','1366','768');
 authoredPractice('classroom-01');
 assert.ok(evaluate(()=>document.querySelector('.npc-speech').textContent.startsWith('（')),'Opening practice lets learner initiate');
 browser('screenshot',`${evidence}-opening-desktop.png`);
 answerText('欸，你換新吊飾了喔？');assert.equal(evaluate(()=>document.querySelector('.feedback-title').textContent),'這樣回也可以！');
 browser('screenshot',`${evidence}-feedback-acceptable-desktop.png`);finishDialogue();click('回首頁');
 authoredPractice('club-07');answerText('我看過狗用鼻子一直推球。');click('下一句');answerText('貼圖：笑到打滾');
 assert.equal(evaluate(()=>document.querySelector('.reaction-area .feedback').dataset.feedback),'effective','Laugh sticker is suitable for a shared funny story');finishDialogue();click('回首頁');
 authoredPractice('outing-05');
 assert.ok(evaluate(()=>document.querySelector('.message-channel').textContent.includes('線上認識')));
 assert.equal(evaluate(()=>document.querySelectorAll('.session-screen input,.session-screen textarea').length),0,'Never asks learner to enter real private data');
 answerText('有免費道具耶，我馬上傳碼。');assert.equal(evaluate(()=>document.querySelector('.feedback').dataset.feedback),'try_another');
 click('換個回答');answerText('先不用，驗證碼我不傳。');assert.equal(evaluate(()=>document.querySelector('.feedback-title').textContent),'接得很好！');
 browser('screenshot',`${evidence}-online-friendship-desktop.png`);finishDialogue();click('回首頁');
 authoredPractice('hallway-02');answerText('好，等等見。');click('下一句');answerText('伸手拉他的手臂，想再說一句。');
 assert.match(evaluate(()=>document.querySelector('.npc-reaction p').textContent),/放手/);assert.equal(evaluate(()=>document.querySelector('.feedback').dataset.feedback),'try_another');
 click('換個回答');answerText('往旁邊移一點，讓他過。');assert.equal(evaluate(()=>document.querySelector('.feedback-title').textContent),'接得很好！');
 browser('screenshot',`${evidence}-body-boundary-desktop.png`);finishDialogue();click('回首頁');
 browser('set','viewport','1440','900');
 report.checks.push('All three encouraging feedback states verified; original sticker renders and reacts differently to sadness vs humour; learner initiation, bodily distance, and refusal of online code request exercised');
}
function checkRelayBall(){
 const result=evaluate(async()=>{await new Promise(r=>setTimeout(r,400));const ball=document.querySelector('.stage .ball-in-flight');if(!ball)return null;const a=ball.getBoundingClientRect();return [...document.querySelectorAll('.stage [data-layer="face"]')].filter(face=>{const b=face.getBoundingClientRect();return Math.min(a.right,b.right)-Math.max(a.left,b.left)>0&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>0;}).length;});
 if(result===null)return;assert.equal(result,0,'Relay ball must leave both faces unobstructed');report.checks.push('Relay ball leaves both faces unobstructed');
}
function checkHover(selector,label){
 const measure=()=>evaluate(selector=>{
  const button=document.querySelector(selector),rect=button.getBoundingClientRect(),style=getComputedStyle(button);
  const texts=[];const walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){const node=walker.currentNode;if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects())texts.push({text:node.textContent.trim(),x:r.x,y:r.y,right:r.right,bottom:r.bottom});}
  const issues=[];
  for(let i=0;i<texts.length;i++){
   const a=texts[i];if(a.x<rect.left-1||a.right>rect.right+1||a.y<rect.top-1||a.bottom>rect.bottom+1)issues.push('Button text clipped: '+a.text);
   for(let j=i+1;j<texts.length;j++){const b=texts[j];if(Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1)issues.push('Button text overlaps: '+a.text+' / '+b.text);}
  }
  const location=button.closest('.world-station')?.querySelector('.station-location');if(location&&location.getBoundingClientRect().bottom>rect.top+1)issues.push('Location label covers button');
  return{x:rect.x,y:rect.y,w:rect.width,h:rect.height,font:style.fontSize,weight:style.fontWeight,texts,issues};
 },selector);
 browser('hover','.relay-page-heading');const before=measure();browser('hover',selector);const after=measure();
 assert.deepEqual(after.issues,[],label+': '+JSON.stringify(after.issues));
 for(const key of ['x','y','w','h'])assert.ok(Math.abs(before[key]-after[key])<.5,label+' moves on hover: '+key);
 assert.equal(after.font,before.font,label+' changes font on hover');assert.equal(after.weight,before.weight,label+' changes weight on hover');
 assert.deepEqual(after.texts,before.texts,label+' reflows text on hover');
 report.checks.push(label+': stable hover geometry, no overlapping or clipped text');
}
function setPreference(difficulty,textSize=18){evaluate(async(difficulty,textSize)=>{const details=document.querySelector('.practice-preferences');details.open=true;details.querySelector(`input[name="relay-difficulty"][value="${difficulty}"]`).click();details.querySelector(`input[name="relay-text-size"][value="${textSize}"]`).click();await new Promise(r=>setTimeout(r,30));details.open=false;await new Promise(r=>setTimeout(r,30));},difficulty,textSize);}
function checkPreferences(){
 browser('click','.practice-preferences summary');
 browser('focus','input[name="relay-difficulty"][value="2"]');browser('press','ArrowRight');
 assert.equal(evaluate(()=>document.querySelector('input[name="relay-difficulty"]:checked').value),'3','Difficulty radio responds to keyboard');
 browser('focus','input[name="relay-text-size"][value="18"]');browser('press','ArrowRight');
 assert.equal(evaluate(()=>document.querySelector('input[name="relay-text-size"]:checked').value),'22','Text size radio responds to keyboard');
 const initial=evaluate(()=>document.querySelector('.preference-toggle:nth-child(2) input').checked);
 browser('focus','.preference-toggle:nth-child(2) input');browser('press','Space');
 assert.equal(evaluate(()=>document.querySelector('.preference-toggle:nth-child(2) input').checked),!initial,'Preference switch responds to Space');
 browser('press','Space');
 browser('reload');
 assert.equal(evaluate(()=>document.querySelector('input[name="relay-difficulty"]:checked').value),'3');
 assert.equal(evaluate(()=>document.querySelector('input[name="relay-text-size"]:checked').value),'22');
 setPreference(2,18);report.checks.push('Game-style preferences: keyboard radios, Space toggle and reload persistence verified');
}
function checkReadingAndLessonFocus(){
 browser('set','viewport','1280','720');setPreference(3,26);authoredPractice('classroom-01',3,{textSize:26});chooseAndRead(0);
 evaluate(()=>{const p=document.querySelector('.dialogue-panel');p.scrollTop=p.scrollHeight;});
 click('下一句');
 const position=evaluate(()=>{const p=document.querySelector('.dialogue-panel'),s=document.querySelector('.npc-speech').getBoundingClientRect();return{scroll:p.scrollTop,top:s.top,panelTop:p.getBoundingClientRect().top};});
 assert.equal(position.scroll,0,'New turn resets dialogue scroll');assert.ok(position.top>=position.panelTop,'New NPC line is visible');
 browser('set','viewport','390','844');chooseAndRead(0);evaluate(()=>document.querySelector('.reaction-area .primary').scrollIntoView());click('下一句');
 const mobile=evaluate(()=>{const r=document.querySelector('.npc-speech').getBoundingClientRect();return{top:r.top,bottom:r.bottom,height:innerHeight};});assert.ok(mobile.top>=0&&mobile.bottom<=mobile.height,'New NPC line is visible after mobile advance');
 click('回首頁');confirmIfNeeded();assert.ok(evaluate(()=>document.querySelector('.home-actions').getBoundingClientRect().top>=0),'Mobile home returns to its controls');
 setPreference(2,18);browser('set','viewport','1440','900');evaluate(()=>window.scrollTo(0,0));openLessons();evaluate(async()=>{document.querySelector('[data-chapter="0"]').click();await new Promise(r=>setTimeout(r,40));});
 assert.equal(evaluate(()=>document.activeElement.id),'lessons-heading','Opening chapter focuses its heading');
 browser('focus','.demo-controls button.primary');browser('press','Enter');assert.ok(evaluate(()=>document.activeElement.matches('.demo-controls button.primary')),'Next-line button keeps keyboard focus');
 while(evaluate(()=>!!document.querySelector('.story-demo')))click(evaluate(()=>document.querySelector('.story-demo .primary').textContent.trim()));
 assert.ok(evaluate(()=>document.activeElement.matches('.exercise-guide h2')),'Demo completion focuses the first exercise');
 evaluate(async answer=>{document.querySelectorAll('.lesson-exercise .choice-list button')[answer].click();await new Promise(r=>setTimeout(r,30));},lessons[0].exercises[0].answer);click('下一個練習');
 assert.ok(evaluate(()=>document.activeElement.matches('.exercise-guide h2')),'Exercise advance focuses the new question');
 click('返回教學地圖');assert.equal(evaluate(()=>document.activeElement.id),'lessons-heading');click('回首頁');
 report.checks.push('Desktop/mobile turn scroll reset, mobile home controls, demo keyboard focus and lesson transition focus verified');
}
browser('open',url);
const storageBackup=evaluate(()=>localStorage.getItem('cactus:chat-relay:v1:data'));
try {
evaluate(()=>localStorage.removeItem('cactus:chat-relay:v1:data'));browser('reload');
assert.ok(evaluate(()=>!!document.querySelector('#site-header .site-banner')),'Shared site header is above game');
assert.equal(evaluate(()=>[...document.querySelectorAll('.chat-relay button')].some(b=>/老師設定|匯入|匯出/.test(b.textContent))),false);
assert.equal(evaluate(()=>document.querySelector('.chat-relay').textContent.includes('免登入 · 不限時')),false);
assert.equal(evaluate(()=>document.querySelector('.chat-relay').textContent.includes('隨機聊聊')),false);
assert.equal(evaluate(()=>/我的貼紙|今日三題/.test(document.querySelector('.chat-relay').textContent)),false);
const fresh=evaluate(()=>localStorage.getItem('cactus:chat-relay:v1:data')===null);
assert.equal(evaluate(()=>document.querySelector('.teacher-tools').open),false,'Teacher tools begin collapsed');
assert.equal(evaluate(()=>document.querySelectorAll('.home-actions .primary').length),1,'One primary home action');
if(fresh){
 click('立即開始');
 const defaults=evaluate(()=>{const d=JSON.parse(localStorage.getItem('cactus:chat-relay:v1:data'));return d.activeSession;});
 assert.equal(defaults.settings.difficulty,2);assert.equal(defaults.settings.showImmediateFeedback,true);assert.equal(defaults.scenarioIds.length,3);assert.equal(new Set(defaults.scenarioIds).size,3);
 assert.equal(evaluate(()=>!!document.querySelector('dialog[open]')),false);report.checks.push('Fresh user: one click, three distinct scenarios, general difficulty, immediate feedback, no setup dialog');
 click('回首頁');confirmIfNeeded();
}
setPreference(2,18);checkPreferences();checkReadingAndLessonFocus();
click('先看示範');assert.ok(evaluate(()=>!!document.querySelector('.demo-screen')));
for(let i=0;i<3;i++){browser('focus','#relay-main');browser('press','Enter');}
assert.ok(evaluate(()=>!!document.querySelector('.session-screen')),'Short demonstration starts a practice directly');
for(const key of ['1','2','3']){
 const expected=evaluate(index=>document.querySelectorAll('.choice-card .choice-text')[index].textContent,Number(key)-1);
 browser('focus','.dialogue-panel');browser('press',key);
 assert.equal(evaluate(()=>document.querySelector('.answered-text').textContent),expected,'Number key selects the visible ordered option');
 assert.equal(evaluate(()=>!!document.querySelector('.choose-task')),false,'Reaction replaces the selection task');
 if(key!=='3')click('換個回答');
}
const previous=evaluate(()=>document.querySelector('.session-progress').textContent);browser('press','Enter');
assert.notEqual(evaluate(()=>document.querySelector('.session-progress').textContent),previous,'Enter advances one line');
assert.ok(evaluate(()=>!!document.querySelector('.choose-task')));click('回首頁');confirmIfNeeded();
report.checks.push('Short demo, keys 1/2/3, Enter advance and one-task-at-a-time feedback verified');
checkProjectionText();
checkDialogueRevision();
assert.equal(evaluate(()=>[...document.querySelectorAll('.chat-relay button')].some(b=>/[→↗]/.test(b.textContent))),false);
if(!layoutOnly){
for(const difficulty of [1,2,3]){
 setPreference(difficulty);click('立即開始');confirmIfNeeded();
 assert.ok(evaluate(()=>!!document.querySelector('.session-screen')),'Random starts directly without a setup screen');
 const expectedChoices=evaluate(()=>{const s=JSON.parse(localStorage.getItem('cactus:chat-relay:v1:data')).activeSession;return {id:s.scenarioIds[s.index],node:s.nodeId};});const expectedScenario=scenarios.find(s=>s.id===expectedChoices.id);assert.equal(evaluate(()=>document.querySelectorAll('.choice-card').length),(difficulty===1&&expectedScenario.turnPolicy!=='natural'?expectedScenario.easy:expectedScenario).nodes[expectedChoices.node].choices.length);let turns=0;
 if(difficulty===1){browser('focus','.choice-card');browser('press','Enter');assert.ok(evaluate(()=>!!document.querySelector('.reaction-area')));turns++;report.checks.push('Keyboard focus/Enter selects a response');}
 if(difficulty===2){const a=chooseAndRead(0);click('換個回答');const b=chooseAndRead(1);assert.notEqual(a.reaction,b.reaction);assert.ok(b.focus.includes('reaction-area'));report.checks.push('Different responses and keyboard focus verified');browser('reload');resumePractice();assert.equal(evaluate(()=>document.querySelector('.npc-reaction p')?.textContent),b.reaction);report.checks.push('Refresh restores response and branch');turns++;}
 if(difficulty===3){chooseAndRead(0);turns++;click('下一句');const before=evaluate(()=>document.querySelector('.npc-speech').textContent);click('回首頁');confirmIfNeeded();resumePractice();assert.equal(evaluate(()=>document.querySelector('.npc-speech').textContent),before);evaluate(()=>{document.querySelector('.turn-tools').open=true;});click('回上一句');turns--;report.checks.push('Pause/resume and previous-turn retry verified');}
 browser('set','viewport','1440','900');checkWidth('desktop dialogue');checkRelayBall();browser('screenshot',`${evidence}-session-lv${difficulty}.png`);
 turns+=finishDialogue();assert.ok(evaluate(()=>document.querySelector('#results-heading')?.textContent.includes('完成 3 個情境')));assert.equal(turns,evaluate(()=>JSON.parse(localStorage.getItem('cactus:chat-relay:v1:data')).activeSession.records.reduce((total,record)=>total+record.choices.filter(answer=>!answer.retried).length,0)),'Rendered turns match the completed authored routes');assert.equal(evaluate(()=>document.querySelector('.result-details').open),false,'Result detail starts collapsed');browser('screenshot',`${evidence}-results-lv${difficulty}.png`);report.difficulties.push({difficulty,turns,completed:true});click('回首頁');
}
setPreference(2);click('立即開始');
const firstPool=evaluate(()=>JSON.parse(localStorage.getItem('cactus:chat-relay:v1:data')).activeSession.scenarioIds);
finishDialogue();assert.equal(evaluate(()=>document.querySelector('.result-details').open),false);assert.equal(evaluate(()=>[...document.querySelectorAll('.chat-relay button')].filter(b=>b.offsetParent!==null&&b.textContent.trim()==='回首頁').length),1,'Result has only one home control');
browser('screenshot',`${evidence}-results-desktop.png`);
browser('click','.result-details summary');assert.equal(evaluate(()=>document.querySelectorAll('.review-record').length),3);browser('click','.result-details summary');
click('再玩三題');
const replayPool=evaluate(()=>JSON.parse(localStorage.getItem('cactus:chat-relay:v1:data')).activeSession.scenarioIds);
assert.equal(new Set([...firstPool,...replayPool]).size,6,'Replay supplies three new scenarios');assert.equal(evaluate(()=>!!document.querySelector('dialog[open]')),false);
finishDialogue();browser('set','viewport','390','844');browser('screenshot',`${evidence}-results-mobile.png`,'--full');click('回首頁');browser('set','viewport','1440','900');
report.checks.push('Replay starts directly with three new scenarios; collapsed analysis opens all three review records');
setPreference(2);
for(let chapter=0;chapter<lessons.length;chapter++){
 openLessons();if(chapter===0){for(const [w,h] of [[1440,900],[1366,768],[1280,720],[1024,768]]){browser('set','viewport',String(w),String(h));checkWidth('unfinished chapter map '+w);browser('screenshot',`${evidence}-fresh-map-${w}.png`);}browser('set','viewport','1440','900');}evaluate(async i=>{document.querySelector(`[data-chapter="${i}"]`).click();await new Promise(r=>setTimeout(r,35));},chapter);
 checkWidth('chapter '+(chapter+1)+' demonstration');let demoLines=0;while(evaluate(()=>!!document.querySelector('.story-demo'))){const next=evaluate(()=>document.querySelector('.story-demo .primary').textContent.trim());click(next);if(++demoLines>25)throw Error('Demonstration stuck');}
 for(const exercise of lessons[chapter].exercises){checkWidth('chapter '+(chapter+1)+' exercise');
 if(exercise.kind==='sequence'){evaluate(async lines=>{for(let target=0;target<lines.length;target++){let guard=0;while(document.querySelectorAll('.sequence-list li span')[target].textContent!==lines[target]){const nodes=[...document.querySelectorAll('.sequence-list li')];const actual=nodes.findIndex(n=>n.querySelector('span').textContent===lines[target]);if(actual<=target||guard++>10)throw Error('Ordering stuck');nodes[actual].querySelector('button').click();await new Promise(r=>setTimeout(r,15));}}},exercise.lines);click('看看這個順序');}
 else if(exercise.kind==='dialogue'){click('進入對話');confirmIfNeeded();const close=scenarios.find(s=>s.id===exercise.scenarioId).nodes.close;finishDialogue(exercise.scenarioId==='classroom-10'?close.choices[0].text:undefined);click('回到章節練習');}
 else evaluate(async answer=>{document.querySelectorAll('.lesson-exercise .choice-list button')[answer].click();await new Promise(r=>setTimeout(r,25));},exercise.answer);
 const next=evaluate(()=>[...document.querySelectorAll('.lesson-exercise>button.primary')].find(b=>b.textContent.includes('下一個')||b.textContent.includes('生活小任務'))?.textContent.trim());assert.ok(next,`Chapter ${chapter+1}: feedback and next exist`);click(next);
 }
 assert.ok(evaluate(()=>!!document.querySelector('.lesson-task')));click('完成本章練習');report.lessons.push({chapter:chapter+1,exercises:lessons[chapter].exercises.length,demoLines,completed:true});click('回首頁');
}
}
setPreference(2,18);
for(const [width,height] of [[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[390,844],[320,640]]){
 browser('set','viewport',String(width),String(height));if(layoutOnly&&width>=900){for(const size of [22,26]){setPreference(2,size);checkWidth('large-text home '+width+' '+size);openLessons();checkWidth('large-text map '+width+' '+size);click('回首頁');}setPreference(2,18);}const home=checkWidth('home '+width);if(width>=900){evaluate(()=>{document.querySelector('.practice-preferences').open=true;});checkWidth('expanded preferences '+width);browser('screenshot',`${evidence}-preferences-${width}.png`);evaluate(()=>{document.querySelector('.practice-preferences').open=false;});}if(width===1440){checkHover('.home-actions button:first-child','Learning button');checkHover('.practice-start','Practice button');}browser('screenshot',`${evidence}-home-${width}.png`,...(width<900?['--full']:[]));openLessons();checkWidth('world map '+width);if(width===1440)for(let i=0;i<4;i++)checkHover(`[data-chapter="${i}"]`,'Chapter '+(i+1));browser('screenshot',`${evidence}-map-${width}.png`);click('回首頁');if(width===320)setPreference(2,26);click('立即開始');confirmIfNeeded();checkWidth('session '+width);if(width>=900){assert.ok(evaluate(()=>{const p=document.querySelector('.dialogue-panel').getBoundingClientRect();return [...document.querySelectorAll('.choice-card')].every(b=>b.getBoundingClientRect().bottom<=p.bottom+1);}), 'Projection answers visible at '+width);assert.ok(evaluate(()=>parseFloat(getComputedStyle(document.querySelector('.npc-speech')).fontSize)>=24));}if(width===1440)checkHover('.choice-card','Dialogue choice');browser('screenshot',`${evidence}-mobile-session-${width}.png`,...(width<900?['--full']:[]));if([1440,1024,390,320].includes(width)){browser('click','.relay-toolbar-actions button:last-child');checkWidth('fullscreen names '+width);browser('screenshot',`${evidence}-fullscreen-names-${width}.png`);click('離開全螢幕');}click('回首頁');confirmIfNeeded();report.viewports.push({requested:width,actual:home.width,noOverflow:true});
}
browser('click','.chat-relay .relay-toolbar-actions button:last-child');assert.ok(evaluate(()=>document.querySelector('.chat-relay').classList.contains('is-fullscreen')));click('離開全螢幕');assert.equal(evaluate(()=>document.querySelector('.chat-relay').classList.contains('is-fullscreen')),false);report.checks.push('Fullscreen enter/exit verified');
setPreference(2,18);browser('set','viewport','1440','900');browser('screenshot',`${evidence}-final-home.png`);report.errors=browser('errors');writeFileSync(`${evidence}-browser-report.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

} catch(error) {
 browser('screenshot',`${evidence}-failure.png`);
 console.error(JSON.stringify(evaluate(()=>({view:document.querySelector('.chat-relay')?.dataset.view,phase:JSON.parse(localStorage.getItem('cactus:chat-relay:v1:data')??'{}').activeSession,dialogue:document.querySelector('.dialogue-panel')?.innerHTML,errors:document.querySelector('.storage-notice')?.textContent})),null,2));
 throw error;
} finally {
 evaluate(value=>{if(value===null)localStorage.removeItem('cactus:chat-relay:v1:data');else localStorage.setItem('cactus:chat-relay:v1:data',value);},storageBackup);
 browser('set','viewport','1440','900');browser('open',url);browser('reload');
}
