import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { createSession } from '../src/features/chat-relay/engine/dialogue.ts';
import { defaultSettings, initialData } from '../src/features/chat-relay/services/storage.ts';
const url = process.argv[2] ?? 'http://127.0.0.1:5197/game/chat-relay/';
const output = process.env.CHAT_RELAY_EVIDENCE ?? '/tmp/chat-relay-branches';
function browser(...args) {
  const r = JSON.parse(execFileSync('agent-browser', ['--json', ...args], { encoding: 'utf8', timeout: 60000, maxBuffer: 4*1024*1024 }));
  if (!r.success) throw Error(JSON.stringify(r.error)); return r.data;
}
const evaluate = (fn, ...args) => browser('eval', `(${fn.toString()})(${args.map(x=>JSON.stringify(x)).join(',')})`).result;
function start(id, viewport) {
  browser('set', 'viewport', ...viewport.map(String));
  const data = initialData(); data.activeSession = createSession([id], { ...defaultSettings(), shuffleChoices:false }, 1, data.profileId);
  evaluate(data=>localStorage.setItem('cactus:chat-relay:v1:data',JSON.stringify(data)),data);
  browser('reload');
  evaluate(async()=>{
    const tools=document.querySelector('.practice-preferences');tools.open=true;
    await new Promise(r=>setTimeout(r,30));document.querySelector('.resume-button').click();await new Promise(r=>setTimeout(r,50));
  });
}
function answer(index, detailed=false) {
  const result = evaluate(async index=>{
    document.querySelectorAll('.choice-card')[index].click();await new Promise(r=>setTimeout(r,25));
    const reaction=document.querySelector('.npc-reaction p'),feedback=document.querySelector('.natural-feedback'),tip=document.querySelector('.feedback-tip');
    return {reaction:reaction?.textContent, detailed:!!feedback,tip:!!tip,npcFont:parseFloat(getComputedStyle(reaction).fontSize),feedbackFont:parseFloat(getComputedStyle(feedback??tip).fontSize),choiceCount:document.querySelectorAll('.choice-card').length};
  },index);
  assert.ok(result.reaction);assert.equal(result.detailed,detailed);assert.equal(result.tip,!detailed);
  assert.ok(result.npcFont>result.feedbackFont,'NPC speech is more prominent than teaching feedback');
  assert.equal(result.choiceCount,0,'Only the NPC reaction task is visible after answering');
  return result;
}
function advance() { evaluate(async()=>{document.querySelector('.reaction-area .primary').click();await new Promise(r=>setTimeout(r,30));}); }
function text() {return evaluate(()=>document.querySelector('.npc-speech')?.textContent);}
function choices() {return evaluate(()=>[...document.querySelectorAll('.choice-text')].map(e=>e.textContent));}
function finish() {
  assert.ok(evaluate(()=>!!document.querySelector('.scene-feedback')),'Summary appears after each scene');
  evaluate(async()=>{document.querySelector('.session-screen .primary').click();await new Promise(r=>setTimeout(r,30));});
  assert.ok(evaluate(()=>document.querySelector('.result-welcome h2')?.textContent.includes('完成 1 個情境')));
}
const checks=[];
browser('open',url);
start('classroom-drawing',[1366,768]);
answer(0);advance();answer(1);advance();
assert.ok(!choices().some(t=>t.includes('風吹')),'Sketch branch cannot know about wind');
browser('screenshot',`${output}-drawing-desktop.png`);answer(0);advance();finish();checks.push('drawing sketch branch excludes future wind information');
start('classroom-drawing',[1366,768]);
answer(2,true);advance();answer(0);advance();answer(0);advance();assert.ok(choices()[0].includes('風吹'));answer(0);advance();answer(1);advance();finish();checks.push('drawing repair and wind route complete');
start('classroom-drawing',[390,844]);
answer(2,true);advance();answer(2,true);advance();assert.equal(choices().length,0);finish();checks.push('explicit physical boundary ends without forced continuation');
start('classroom-05',[390,844]);
assert.ok(!choices().some(t=>t.includes('章魚')));answer(0);advance();assert.ok(text().includes('章魚'));answer(1);advance();answer(0);advance();answer(1);advance();finish();checks.push('book introduces octopus before player photo sharing and completes real continuation');
start('club-03',[1366,768]);
answer(0);advance();answer(0);advance();answer(0);advance();assert.ok(!choices().some(t=>t.includes('拆')));answer(0);advance();finish();checks.push('model tired route never refers to dismantling');
start('club-03',[390,844]);
assert.ok(evaluate(()=>!!document.querySelector('.choice-card [data-sticker=comfort]')));answer(2,true);advance();answer(0);advance();answer(1);advance();assert.ok(choices()[0].includes('拆'));answer(0);advance();finish();checks.push('model advice repair and separate dismantling route');
start('outing-01',[1366,768]);
assert.ok(!choices().some(t=>t.includes('LINE')));answer(0);advance();answer(0);advance();answer(0);advance();assert.ok(text().includes('LINE'));answer(2,true);
assert.ok(evaluate(()=>!document.querySelector('.session-screen input,.session-screen textarea')),'No personal-data input');
browser('screenshot',`${output}-privacy-desktop.png`);advance();assert.ok(text().includes('尚未提供'));answer(0);advance();answer(0);advance();finish();checks.push('game friend then separate LINE invitation; privacy pause, reconsideration, no input');
start('outing-01',[390,844]);
answer(2);advance();answer(2);advance();answer(0);advance();answer(0);advance();answer(1);advance();
browser('screenshot',`${output}-summary-mobile.png`);finish();checks.push('chat without game friend, decline LINE, positive ending on mobile');
start('outing-01',[390,844]);answer(1);advance();assert.equal(choices().length,0);finish();checks.push('friendly game-friend decline ends positively');
const errors=browser('errors');
writeFileSync(`${output}-browser.json`,JSON.stringify({url,checks,errors},null,2)+'\n');
console.log(JSON.stringify({checks:checks.length,errors,evidence:output},null,2));
