import type { LocalData, Settings, Session, History, Scenario, Answer } from '../types.ts';
import { skillTags, scenes } from '../data/manifest.ts';
import { graphFor } from '../engine/dialogue.ts';
export const STORAGE_KEY='cactus:chat-relay:v1:data';
export const defaultSettings=():Settings=>({difficulty:2,sceneIds:[],skillTags:[],sessionLength:3,readAloud:false,showImmediateFeedback:true,showHints:false,showDemo:true,textSize:18,reducedMotion:false,shuffleChoices:true});
export const initialData=():LocalData=>({version:1,settings:defaultSettings(),profileId:'本機使用者',histories:{},records:[],achievements:[],lessons:[],dailySelection:{},activeSession:null});
const obj=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const str=(x:unknown,max=200)=>typeof x==='string'&&x.length<=max;
const strings=(x:unknown,max=100):x is string[]=>Array.isArray(x)&&x.length<=max&&x.every(v=>str(v));
const bool=(x:unknown)=>typeof x==='boolean';
const finite=(x:unknown)=>typeof x==='number'&&Number.isFinite(x);
function safeTree(x:unknown,depth=0):boolean {if(depth>30)return false;if(Array.isArray(x))return x.every(v=>safeTree(v,depth+1));if(obj(x))return Object.entries(x).every(([k,v])=>!['__proto__','constructor','prototype'].includes(k)&&safeTree(v,depth+1));return x===null||['string','boolean','number'].includes(typeof x);}
export function validSettings(x:unknown,_bank:readonly Scenario[]):x is Settings {
 return obj(x)&&[1,2,3].includes(x.difficulty as number)&&[3,5,10].includes(x.sessionLength as number)&&[18,22,26].includes(x.textSize as number)&&strings(x.sceneIds,6)&&x.sceneIds.every(id=>scenes.some(s=>s.id===id))&&strings(x.skillTags,7)&&x.skillTags.every(t=>skillTags.includes(t as never))&&['readAloud','showImmediateFeedback','showHints','showDemo','reducedMotion','shuffleChoices'].every(k=>bool(x[k]));
}
function validAnswer(x:unknown,scenario:Scenario,difficulty:1|2|3):x is Answer {
 if(!obj(x)||!str(x.nodeId)||!str(x.choiceId)||!str(x.text,300)||!str(x.reaction,300)||!Number.isInteger(x.attempt)||Number(x.attempt)<1||!['usedHint','usedDemo','retried'].every(k=>bool(x[k])))return false;
 const n=graphFor(scenario,difficulty).nodes[x.nodeId as string];const c=n?.kind==='decision'?n.choices.find(c=>c.id===x.choiceId):null;
 return !!c&&c.feedbackLevel===x.feedbackLevel&&obj(x.scores)&&JSON.stringify(c.scores)===JSON.stringify(x.scores)&&c.text===x.text&&c.npcReaction.text===x.reaction;
}
export function validSession(x:unknown,bank:readonly Scenario[]):x is Session {
 if(!obj(x)||!validSettings(x.settings,bank)||!str(x.id)||!str(x.profileId,30)||!['free','daily','lesson'].includes(x.mode as string)||!finite(x.seed)||!strings(x.scenarioIds,60)||!x.scenarioIds.length||new Set(x.scenarioIds).size!==x.scenarioIds.length||!Number.isInteger(x.index)||Number(x.index)<0||Number(x.index)>=x.scenarioIds.length||!str(x.nodeId)||!['choose','reaction','end'].includes(x.phase as string)||!(x.selectedChoiceId===null||str(x.selectedChoiceId))||!['usedHint','usedDemo','completed'].every(k=>bool(x[k]))||!Number.isInteger(x.attempt)||Number(x.attempt)<1||!str(x.createdAt)||!Number.isFinite(Date.parse(x.createdAt as string))||!Array.isArray(x.records)||x.records.length!==x.scenarioIds.length)return false;
 const settings=x.settings;const scenarioIds=x.scenarioIds;
 for(let i=0;i<x.records.length;i++){const r=x.records[i];const s=bank.find(s=>s.id===scenarioIds[i]);if(!s||!obj(r)||r.scenarioId!==s.id||r.difficulty!==settings.difficulty||!str(r.dateISO)||!Number.isFinite(Date.parse(r.dateISO as string))||!bool(r.completed)||!Array.isArray(r.choices)||r.choices.length>1000||!r.choices.every(a=>validAnswer(a,s,settings.difficulty))||(r.ending!==undefined&&!['extended','brief','respectful_close','repair'].includes(r.ending as string)))return false;}
 for(let i=0;i<x.records.length;i++){
 const r=x.records[i] as {choices:Answer[];completed:boolean;ending?:string};
 const scenario=bank.find(s=>s.id===scenarioIds[i])!;
 const g=graphFor(scenario,settings.difficulty);let at=g.startNodeId;
 const activeAnswers=r.choices.filter(a=>!a.retried);
 for(const a of activeAnswers){const n=g.nodes[at];if(n?.kind!=='decision'||a.nodeId!==at)return false;const c=n.choices.find(c=>c.id===a.choiceId);if(!c)return false;at=c.nextNodeId;}
 if(i<Number(x.index)&&(!r.completed||g.nodes[at]?.kind!=='end'))return false;
 if(i>Number(x.index)&&(r.choices.length||r.completed))return false;
 if(i===Number(x.index)){
  if(x.phase==='reaction'){const last=activeAnswers.at(-1);if(!last||last.nodeId!==x.nodeId||last.choiceId!==x.selectedChoiceId||r.completed)return false;}
  else if(at!==x.nodeId||r.completed!==(x.phase==='end'))return false;
 }
 if(r.completed){const end=g.nodes[at];if(end?.kind!=='end'||r.ending!==end.ending)return false;}
 }
 const scenario=bank.find(s=>s.id===scenarioIds[Number(x.index)]);if(!scenario)return false;
 const node=graphFor(scenario,settings.difficulty).nodes[x.nodeId as string];if(!node)return false;
 if(x.phase==='end'&&node.kind!=='end'||x.phase!=='end'&&node.kind!=='decision')return false;
 if(x.phase==='reaction'&&(node.kind!=='decision'||!node.choices.some(c=>c.id===x.selectedChoiceId)))return false;if(x.phase!=='reaction'&&x.selectedChoiceId!==null)return false;
 return !x.completed||x.records.every(r=>obj(r)&&r.completed===true);
}
export function decodeStoredData(text:string,bank:readonly Scenario[]):LocalData {
 if(new TextEncoder().encode(text).length>2*1024*1024)throw new Error('本機資料超過可讀取的大小上限。');
 let x:unknown;try{x=JSON.parse(text);}catch{throw new Error('目前的本機紀錄格式無法讀取。');}
 if(!safeTree(x)||!obj(x)||x.version!==1)throw new Error('資料版本不符或含不安全欄位。');
 if(!validSettings(x.settings,bank)||!str(x.profileId,30)||['__proto__','constructor','prototype'].includes(x.profileId as string)||!obj(x.histories)||Object.keys(x.histories).length>100||!Array.isArray(x.records)||x.records.length>100||!strings(x.achievements,20)||!Array.isArray(x.lessons)||x.lessons.some(n=>!Number.isInteger(n)||n<0||n>3)||!obj(x.dailySelection)||!(x.activeSession===null||validSession(x.activeSession,bank)))throw new Error('本機紀錄或未完成題組不符。題庫更新後請重新開始練習。');
 for(const h of Object.values(x.histories)){if(!obj(h)||!strings(h.recentScenarioIds)||!obj(h.playCount)||!obj(h.lastPlayed)||Object.entries(h.playCount).some(([id,n])=>!bank.some(s=>s.id===id)||!Number.isInteger(n)||Number(n)<0)||Object.values(h.lastPlayed).some(d=>!str(d)))throw new Error('出題紀錄格式不符。');}
 if(x.records.some(r=>!obj(r)||!validSession(r.session,bank)))throw new Error('學習紀錄格式不符。');
 for(const [date,d] of Object.entries(x.dailySelection)){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!obj(d)||!finite(d.version)||!strings(d.ids,3)||d.ids.length!==3||new Set(d.ids).size!==3)throw new Error('每日題組格式不符。');}
 return x as unknown as LocalData;
}
export interface StorageLike {getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
export function loadData(bank:readonly Scenario[],storage?:StorageLike):{data:LocalData;notice:string} {try{const s=storage??globalThis.localStorage;const text=s.getItem(STORAGE_KEY);return {data:text?decodeStoredData(text,bank):initialData(),notice:''};}catch{return {data:initialData(),notice:'目前無法讀取本機紀錄，或題庫已更新。可以繼續練習。'};}}
export function saveData(data:LocalData,storage?:StorageLike):boolean {try{data.records=data.records.slice(-100);while(data.records.length&&new TextEncoder().encode(JSON.stringify(data)).length>1900000)data.records.shift();const dates=Object.keys(data.dailySelection).sort();for(const key of dates.slice(0,-30))delete data.dailySelection[key];(storage??globalThis.localStorage).setItem(STORAGE_KEY,JSON.stringify(data));return true;}catch{return false;}}
export function historyFor(data:LocalData):History {if(!Object.hasOwn(data.histories,data.profileId))Object.defineProperty(data.histories,data.profileId,{value:{recentScenarioIds:[],playCount:{},lastPlayed:{}},writable:true,enumerable:true,configurable:true});return data.histories[data.profileId];}
