import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { lessons } from '../src/features/chat-relay/data/lessons.ts';
import { scenarios } from '../src/features/chat-relay/data/scenarios/index.ts';
// Root-only interactive QA. The shared default browser stays open afterwards.
const url=process.argv[2]??'http://127.0.0.1:4178/game/chat-relay/';
const evidence=process.env.CHAT_RELAY_EVIDENCE??'/tmp/chat-relay';
const layoutOnly=process.argv.includes('--layout-only');
const report={url,difficulties:[],lessons:[],viewports:[],checks:[]};
function browser(...args){const raw=execFileSync('agent-browser',['--json',...args],{encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024});const result=JSON.parse(raw);if(!result.success)throw Error(JSON.stringify(result.error));return result.data;}
const evaluate=(fn,...args)=>browser('eval',`(${fn.toString()})(${args.map(x=>JSON.stringify(x)).join(',')})`).result;
function click(text){return evaluate(async text=>{const b=[...document.querySelectorAll('.chat-relay button')].find(b=>b.offsetParent!==null&&!b.disabled&&b.textContent.trim().replace(/^←\s*/, '').startsWith(text.replace(/^←\s*/, '')));if(!b)throw Error('Missing button '+text);b.click();await new Promise(r=>setTimeout(r,50));},text);}
function confirmIfNeeded(){evaluate(async()=>{const d=document.querySelector('.chat-relay dialog[open]');if(d){[...d.querySelectorAll('button')].find(b=>b.textContent==='確認').click();await new Promise(r=>setTimeout(r,50));}});}
function finishDialogue(narrationChoice){let turns=0;while(evaluate(()=>!!document.querySelector('.session-screen'))){const phase=evaluate(()=>({choose:!!document.querySelector('.choice-card'),reaction:!!document.querySelector('.reaction-area'),end:!!document.querySelector('.session-screen .actions .primary')&&!document.querySelector('.reaction-area')}));if(phase.choose){evaluate(async preferred=>{const buttons=[...document.querySelectorAll('.choice-card')];(buttons.find(b=>b.textContent===preferred)??buttons[0]).click();await new Promise(r=>setTimeout(r,25));},narrationChoice??null);turns++;}else if(phase.reaction){click(evaluate(()=>document.querySelector('.reaction-area .primary').textContent.trim()));}else if(phase.end){const ending=evaluate(()=>document.querySelector('.ending-speech').textContent.trim());assert.ok(!ending.includes('：「（'),'Narration must not be quoted as NPC speech');if(narrationChoice)assert.ok(ending.startsWith('（'),'Boundary exercise ends with narration');click(evaluate(()=>document.querySelector('.session-screen .actions .primary').textContent.trim()));}else throw Error('No actionable dialogue');if(turns>30)throw Error('Dialogue stuck');}return turns;}
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
  for(const list of choices){const buttons=[...list.querySelectorAll('button')].map(box);for(let i=1;i<buttons.length;i++)if(overlap(buttons[i-1],buttons[i]))issues.push('Answer choices overlap');}
  return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,issues};
 });
 assert.ok(result.scrollWidth<=result.width,`${label}: ${JSON.stringify(result)}`);
 assert.deepEqual(result.issues,[],`${label}: ${JSON.stringify(result)}`);return result;
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
 browser('set','viewport','1280','720');setPreference(3,26);click('實戰演練');confirmIfNeeded();chooseAndRead(0);
 const before=evaluate(()=>{const p=document.querySelector('.dialogue-panel');p.scrollTop=p.scrollHeight;return p.scrollTop;});assert.ok(before>0,'Regression setup overflows the dialogue panel');
 click('下一句');
 const position=evaluate(()=>{const p=document.querySelector('.dialogue-panel'),s=document.querySelector('.npc-speech').getBoundingClientRect();return{scroll:p.scrollTop,top:s.top,panelTop:p.getBoundingClientRect().top};});
 assert.equal(position.scroll,0,'New turn resets dialogue scroll');assert.ok(position.top>=position.panelTop,'New NPC line is visible');
 browser('set','viewport','390','844');chooseAndRead(0);evaluate(()=>document.querySelector('.reaction-area .primary').scrollIntoView());click('下一句');
 const mobile=evaluate(()=>{const r=document.querySelector('.npc-speech').getBoundingClientRect();return{top:r.top,bottom:r.bottom,height:innerHeight};});assert.ok(mobile.top>=0&&mobile.bottom<=mobile.height,'New NPC line is visible after mobile advance');
 click('遊戲首頁');confirmIfNeeded();assert.ok(evaluate(()=>document.querySelector('.home-actions').getBoundingClientRect().top>=0),'Mobile home returns to its controls');
 setPreference(2,18);browser('set','viewport','1440','900');evaluate(()=>window.scrollTo(0,0));click('跟著學');evaluate(async()=>{document.querySelector('[data-chapter="0"]').click();await new Promise(r=>setTimeout(r,40));});
 assert.equal(evaluate(()=>document.activeElement.id),'lessons-heading','Opening chapter focuses its heading');
 browser('focus','.demo-controls button.primary');browser('press','Enter');assert.ok(evaluate(()=>document.activeElement.matches('.demo-controls button.primary')),'Next-line button keeps keyboard focus');
 while(evaluate(()=>!!document.querySelector('.story-demo')))click(evaluate(()=>document.querySelector('.story-demo .primary').textContent.trim()));
 assert.ok(evaluate(()=>document.activeElement.matches('.exercise-guide h2')),'Demo completion focuses the first exercise');
 evaluate(async answer=>{document.querySelectorAll('.lesson-exercise .choice-list button')[answer].click();await new Promise(r=>setTimeout(r,30));},lessons[0].exercises[0].answer);click('下一個練習');
 assert.ok(evaluate(()=>document.activeElement.matches('.exercise-guide h2')),'Exercise advance focuses the new question');
 click('返回教學地圖');assert.equal(evaluate(()=>document.activeElement.id),'lessons-heading');click('遊戲首頁');
 report.checks.push('Desktop/mobile turn scroll reset, mobile home controls, demo keyboard focus and lesson transition focus verified');
}
browser('open',url);
assert.ok(evaluate(()=>!!document.querySelector('#site-header .site-banner')),'Shared site header is above game');
assert.equal(evaluate(()=>[...document.querySelectorAll('.chat-relay button')].some(b=>/老師設定|匯入|匯出/.test(b.textContent))),false);
assert.equal(evaluate(()=>document.querySelector('.chat-relay').textContent.includes('免登入 · 不限時')),false);
assert.equal(evaluate(()=>document.querySelector('.chat-relay').textContent.includes('隨機聊聊')),false);
assert.equal(evaluate(()=>/我的貼紙|今日三題/.test(document.querySelector('.chat-relay').textContent)),false);
setPreference(2,18);checkPreferences();checkReadingAndLessonFocus();
assert.equal(evaluate(()=>[...document.querySelectorAll('.chat-relay button')].some(b=>/[→↗]/.test(b.textContent))),false);
if(!layoutOnly){
for(const difficulty of [1,2,3]){
 setPreference(difficulty);click('實戰演練');confirmIfNeeded();
 assert.ok(evaluate(()=>!!document.querySelector('.session-screen')),'Random starts directly without a setup screen');
 assert.equal(evaluate(()=>document.querySelectorAll('.choice-card').length),difficulty===1?2:3);let turns=0;
 if(difficulty===1){browser('focus','.choice-card');browser('press','Enter');assert.ok(evaluate(()=>!!document.querySelector('.reaction-area')));turns++;report.checks.push('Keyboard focus/Enter selects a response');}
 if(difficulty===2){const a=chooseAndRead(0);click('換個選項');const b=chooseAndRead(1);assert.notEqual(a.reaction,b.reaction);assert.ok(b.focus.includes('reaction-area'));report.checks.push('Different responses and keyboard focus verified');browser('reload');click('繼續上次練習');assert.equal(evaluate(()=>document.querySelector('.npc-reaction p')?.textContent),b.reaction);report.checks.push('Refresh restores response and branch');turns++;}
 if(difficulty===3){chooseAndRead(0);turns++;click('下一句');const before=evaluate(()=>document.querySelector('.npc-speech').textContent);click('← 遊戲首頁');confirmIfNeeded();click('繼續上次練習');assert.equal(evaluate(()=>document.querySelector('.npc-speech').textContent),before);click('回上一回合');turns--;report.checks.push('Pause/resume and previous-turn retry verified');}
 browser('set','viewport','1440','900');checkWidth('desktop dialogue');checkRelayBall();browser('screenshot',`${evidence}-session-lv${difficulty}.png`);
 turns+=finishDialogue();assert.ok(evaluate(()=>document.querySelector('.results-screen h1')?.textContent.includes('完成了 3 個情境')));assert.equal(turns,3*(difficulty===1?2:difficulty===2?3:4));report.difficulties.push({difficulty,turns,completed:true});click('遊戲首頁');
}
setPreference(2);
for(let chapter=0;chapter<lessons.length;chapter++){
 click('跟著學');if(chapter===0){for(const [w,h] of [[1440,900],[1366,768],[1280,720],[1024,768]]){browser('set','viewport',String(w),String(h));checkWidth('unfinished chapter map '+w);browser('screenshot',`${evidence}-fresh-map-${w}.png`);}browser('set','viewport','1440','900');}evaluate(async i=>{document.querySelector(`[data-chapter="${i}"]`).click();await new Promise(r=>setTimeout(r,35));},chapter);
 checkWidth('chapter '+(chapter+1)+' demonstration');let demoLines=0;while(evaluate(()=>!!document.querySelector('.story-demo'))){const next=evaluate(()=>document.querySelector('.story-demo .primary').textContent.trim());click(next);if(++demoLines>25)throw Error('Demonstration stuck');}
 for(const exercise of lessons[chapter].exercises){checkWidth('chapter '+(chapter+1)+' exercise');
 if(exercise.kind==='sequence'){evaluate(async lines=>{for(let target=0;target<lines.length;target++){let guard=0;while(document.querySelectorAll('.sequence-list li span')[target].textContent!==lines[target]){const nodes=[...document.querySelectorAll('.sequence-list li')];const actual=nodes.findIndex(n=>n.querySelector('span').textContent===lines[target]);if(actual<=target||guard++>10)throw Error('Ordering stuck');nodes[actual].querySelector('button').click();await new Promise(r=>setTimeout(r,15));}}},exercise.lines);click('看看這個順序');}
 else if(exercise.kind==='dialogue'){click('進入對話');confirmIfNeeded();const close=scenarios.find(s=>s.id===exercise.scenarioId).nodes.close;finishDialogue(exercise.scenarioId==='classroom-10'?close.choices[0].text:undefined);click('回到章節練習');}
 else evaluate(async answer=>{document.querySelectorAll('.lesson-exercise .choice-list button')[answer].click();await new Promise(r=>setTimeout(r,25));},exercise.answer);
 const next=evaluate(()=>[...document.querySelectorAll('.lesson-exercise>button.primary')].find(b=>b.textContent.includes('下一個')||b.textContent.includes('生活小任務'))?.textContent.trim());assert.ok(next,`Chapter ${chapter+1}: feedback and next exist`);click(next);
 }
 assert.ok(evaluate(()=>!!document.querySelector('.lesson-task')));click('完成本章練習');report.lessons.push({chapter:chapter+1,exercises:lessons[chapter].exercises.length,demoLines,completed:true});click('遊戲首頁');
}
}
setPreference(2,18);
for(const [width,height] of [[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[390,844],[320,640]]){
 browser('set','viewport',String(width),String(height));if(layoutOnly&&width>=900){for(const size of [22,26]){setPreference(2,size);checkWidth('large-text home '+width+' '+size);click('跟著學');checkWidth('large-text map '+width+' '+size);click('遊戲首頁');}setPreference(2,18);}const home=checkWidth('home '+width);if(width>=900){evaluate(()=>{document.querySelector('.practice-preferences').open=true;});checkWidth('expanded preferences '+width);browser('screenshot',`${evidence}-preferences-${width}.png`);evaluate(()=>{document.querySelector('.practice-preferences').open=false;});}if(width===1440){checkHover('.home-actions button:first-child','Learning button');checkHover('.practice-start','Practice button');}browser('screenshot',`${evidence}-home-${width}.png`);click('跟著學');checkWidth('world map '+width);if(width===1440)for(let i=0;i<4;i++)checkHover(`[data-chapter="${i}"]`,'Chapter '+(i+1));browser('screenshot',`${evidence}-map-${width}.png`);click('遊戲首頁');if(width===320)setPreference(2,26);click('實戰演練');confirmIfNeeded();checkWidth('session '+width);if(width===1440)checkHover('.choice-card','Dialogue choice');browser('screenshot',`${evidence}-mobile-session-${width}.png`);if([1440,1024,390,320].includes(width)){browser('click','.relay-toolbar-actions button:last-child');checkWidth('fullscreen names '+width);browser('screenshot',`${evidence}-fullscreen-names-${width}.png`);click('離開全螢幕');}click('← 遊戲首頁');confirmIfNeeded();report.viewports.push({requested:width,actual:home.width,noOverflow:true});
}
browser('click','.chat-relay .relay-toolbar-actions button:last-child');assert.ok(evaluate(()=>document.querySelector('.chat-relay').classList.contains('is-fullscreen')));click('離開全螢幕');assert.equal(evaluate(()=>document.querySelector('.chat-relay').classList.contains('is-fullscreen')),false);report.checks.push('Fullscreen enter/exit verified');
setPreference(2,18);browser('set','viewport','1440','900');browser('screenshot',`${evidence}-final-home.png`);report.errors=browser('errors');writeFileSync(`${evidence}-browser-report.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
