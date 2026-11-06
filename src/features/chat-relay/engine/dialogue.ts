import type { Scenario, Difficulty, DialogueGraph, Session, Settings, Choice, DecisionNode } from '../types.ts';
import { hashSeed, seededRandom, shuffle } from './random.ts';
export function graphFor(scenario:Scenario,difficulty:Difficulty):DialogueGraph {
 if(scenario.turnPolicy==='natural')return scenario;
 if(difficulty===1)return scenario.easy;
 if(difficulty===3)return scenario;
 return {startNodeId:scenario.startNodeId,nodes:Object.fromEntries(Object.entries(scenario.nodes).filter(([id])=>id!=='extra').map(([id,node])=>[id,node.kind==='end'?node:{...node,choices:node.choices.map(c=>({...c,nextNodeId:c.nextNodeId==='extra'?'close':c.nextNodeId}))}]))};
}
export function createSession(ids:string[],settings:Settings,seed:number,profileId:string,mode:Session['mode']='free'):Session {
 if(!ids.length)throw new Error('沒有可用的情境。');
 return {id:`relay-${Date.now()}-${seed}`,profileId,mode,settings:JSON.parse(JSON.stringify(settings)) as Settings,seed,scenarioIds:[...ids],index:0,nodeId:'start',phase:'choose',selectedChoiceId:null,usedHint:false,usedDemo:false,attempt:1,records:ids.map(scenarioId=>({scenarioId,difficulty:settings.difficulty,dateISO:new Date().toISOString(),choices:[],completed:false})),completed:false,createdAt:new Date().toISOString()};
}
export function orderedChoices(session:Session,node:DecisionNode):Choice[]{return session.settings.shuffleChoices?shuffle(node.choices,seededRandom(hashSeed(`${session.seed}:${session.index}:${node.id}`))):node.choices;}
export function choose(session:Session,scenario:Scenario,choiceId:string):boolean {
 if(session.phase!=='choose'||session.completed)return false;
 const node=graphFor(scenario,session.settings.difficulty).nodes[session.nodeId]; if(node?.kind!=='decision')return false;
 const choice=node.choices.find(c=>c.id===choiceId);if(!choice)return false;
 session.records[session.index].choices.push({nodeId:node.id,choiceId,feedbackLevel:choice.feedbackLevel,usedHint:session.usedHint||session.settings.showHints||session.settings.difficulty===1,usedDemo:session.usedDemo,retried:false,attempt:session.attempt,scores:{...choice.scores},text:choice.text,reaction:choice.npcReaction.text});
 session.selectedChoiceId=choiceId;session.phase='reaction';return true;
}
export function continueDialogue(session:Session,scenario:Scenario):boolean {
 if(session.phase!=='reaction')return false;
 const graph=graphFor(scenario,session.settings.difficulty);const node=graph.nodes[session.nodeId];if(node?.kind!=='decision')return false;
 const choice=node.choices.find(c=>c.id===session.selectedChoiceId);if(!choice||!graph.nodes[choice.nextNodeId])return false;
 session.nodeId=choice.nextNodeId;session.selectedChoiceId=null;session.usedHint=false;session.usedDemo=false;
 const next=graph.nodes[session.nodeId];session.phase=next.kind==='end'?'end':'choose';
 if(next.kind==='end'){const r=session.records[session.index];r.completed=true;r.ending=next.ending;}
 return true;
}
export function retryChoice(session:Session):void {if(session.phase!=='reaction')return;const last=session.records[session.index].choices.at(-1);if(last)last.retried=true;session.phase='choose';session.selectedChoiceId=null;session.attempt++;}
export function backOne(session:Session):void {
 if(session.phase==='reaction'){retryChoice(session);return;}
 const r=session.records[session.index];const last=[...r.choices].reverse().find(a=>!a.retried);if(!last)return;
 last.retried=true;session.nodeId=last.nodeId;session.phase='choose';session.selectedChoiceId=null;session.usedHint=last.usedHint;session.usedDemo=last.usedDemo;session.attempt++;r.completed=false;delete r.ending;
}
export function nextScenario(session:Session):boolean {if(session.phase!=='end')return false;if(session.index===session.scenarioIds.length-1){session.completed=true;return false;}session.index++;session.nodeId='start';session.phase='choose';session.selectedChoiceId=null;session.usedHint=false;session.usedDemo=false;session.attempt=1;return true;}
