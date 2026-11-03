import type { Settings, History, Scenario } from '../types.ts';
import { hashSeed, seededRandom, shuffle } from './random.ts';
export const emptyHistory = (): History => ({recentScenarioIds:[],playCount:{},lastPlayed:{}});
export function selectScenarioPool(settings: Settings, history: History, count: number, rng: () => number, bank: readonly Scenario[]): {ids:string[];available:number;notice:string} {
 const pool=shuffle(bank.filter(s=>s.supportedDifficulties.includes(settings.difficulty)&&(!settings.sceneIds.length||settings.sceneIds.includes(s.sceneId))&&(!settings.skillTags.length||settings.skillTags.some(t=>s.skillTags.includes(t)))),rng);
 const selected:Scenario[]=[]; const recent=new Set(history.recentScenarioIds.slice(-12));
 function tier(s:Scenario) {return !history.playCount[s.id]?0:!recent.has(s.id)?1:2;}
 while(pool.length&&selected.length<count){
 pool.sort((a,b)=> {const level=tier(a)-tier(b);if(level)return level;
 // Unplayed and nonrecent tiers diversify. Recent fallback prioritizes least recently played.
 if(tier(a)===2){const age=(history.lastPlayed[a.id]??'').localeCompare(history.lastPlayed[b.id]??'');if(age)return age;}
 const penalty=(s:Scenario)=>selected.reduce((n,p)=>n+(p.sceneId===s.sceneId?3:0)+(p.npcId===s.npcId?2:0)+(p.topic===s.topic?4:0),0);
 return penalty(a)-penalty(b); }); selected.push(pool.shift()!);
 }
 const available=selected.length+pool.length;
 return {ids:selected.map(s=>s.id),available,notice:available<count?`目前條件有 ${available} 題，這次練習 ${selected.length} 題，不重複補題。可回設定放寬場景或技能。`:''};
}
export function taipeiDate(date=new Date()):string { const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date); return ['year','month','day'].map(t=>parts.find(p=>p.type===t)!.value).join('-'); }
export function dailyIds(dateKey:string, version:number, bank:readonly Scenario[]):string[]{ return shuffle([...bank].sort((a,b)=>a.id.localeCompare(b.id)),seededRandom(hashSeed(`${dateKey}:${version}`))).slice(0,3).map(s=>s.id); }
export function remember(history:History,id:string,date:string):void { history.recentScenarioIds=[...history.recentScenarioIds,id].slice(-100);history.playCount[id]=(history.playCount[id]??0)+1;history.lastPlayed[id]=date; }
