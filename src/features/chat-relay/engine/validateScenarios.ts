import type { Scenario, DialogueGraph } from '../types.ts';
import { characters, scenes, skillTags } from '../data/manifest.ts';
import { graphFor } from './dialogue.ts';
export function validateScenarios(bank:readonly Scenario[],expected=60) {
 const errors:string[]=[];const ids=new Set<string>(); const openings=new Set<string>();let decisions=0,choices=0,paths=0;const byScene:Record<string,number>={};
 const fail=(id:string,message:string)=>errors.push(`${id}: ${message}`);
 function validateGraph(s:Scenario,g:DialogueGraph,min:number,max:number,label:string){
 const seen=new Set<string>();const lengths:number[]=[];
 function walk(id:string,stack:Set<string>,depth:number){
 const n=g.nodes[id];if(!n){fail(s.id,`${label} 缺節點 ${id}`);return;}
 if(stack.has(id)||depth>12){fail(s.id,`${label} 循環／深度異常`);return;}
 if(n.kind==='end'){if(!n.closingText.trim())fail(s.id,'空白收尾');lengths.push(depth);paths++;return;}
 if(!seen.has(id)){
 seen.add(id); if(label==='Lv3'){decisions++;choices+=n.choices.length;}
 if(!n.npcText.trim()||n.npcText.length>160)fail(s.id,'空白或過長台詞');
 if(n.choices.length<(label==='Lv1'?2:3)||n.choices.length>4)fail(s.id,`${label} 選項數不符`);
 for(const field of ['id','text'] as const)if(new Set(n.choices.map(c=>c[field])).size!==n.choices.length)fail(s.id,'重複選項');
 if(new Set(n.choices.map(c=>c.npcReaction.text)).size!==n.choices.length)fail(s.id,'選項反應重複');
 for(const c of n.choices){if(!c.text.trim()||!c.rationale.trim()||!c.npcReaction.text.trim())fail(s.id,'空白選項／反應／回饋');if(!['effective','acceptable','try_another'].includes(c.feedbackLevel))fail(s.id,'分級錯誤');if(!c.skillTags.length||c.skillTags.some(t=>!skillTags.includes(t)))fail(s.id,'技能錯誤');if(Object.values(c.scores).some(n=>![0,1,2].includes(n)))fail(s.id,'分數錯誤');}
 }
 const next=new Set(stack).add(id);for(const c of n.choices)walk(c.nextNodeId,next,depth+1);
 }
 if(g.nodes[g.startNodeId]?.kind!=='decision'){fail(s.id,'起點不是決策');return;} walk(g.startNodeId,new Set(),0);
 if(!lengths.length||lengths.some(n=>n<min||n>max))fail(s.id,`${label} 可達路徑長度不符 ${min}–${max}`);
 }
 for(const s of bank){
 if(ids.has(s.id))fail(s.id,'重複ID');ids.add(s.id);byScene[s.sceneId]=(byScene[s.sceneId]??0)+1;
 if(!s.title.trim()||!s.topic.trim()||!s.setting.trim()||s.skillTags.length<2)fail(s.id,'缺少情境資料');
 if(!characters.some(n=>n.id===s.npcId)||!scenes.some(n=>n.id===s.sceneId))fail(s.id,'美術 manifest 缺項');
 const opening=s.nodes[s.startNodeId];if(opening?.kind==='decision'){if(openings.has(opening.npcText))fail(s.id,'重複開場');openings.add(opening.npcText);if(new Set(opening.choices.map(c=>c.nextNodeId)).size<2)fail(s.id,'沒有不同後續分支');}
 for(const d of [1,2,3] as const) {if(!s.supportedDifficulties.includes(d))fail(s.id,'缺少難度');validateGraph(s,graphFor(s,d),d===1?2:d===2?3:4,d===1?2:d===2?3:5,`Lv${d}`);}
 }
 if(bank.length!==expected)errors.push(`完整情境應 ${expected} 組，實際 ${bank.length} 組。`);
 return {valid:errors.length===0,errors,scenarios:bank.length,byScene,decisionNodes:decisions,choices,terminalPaths:paths};
}
