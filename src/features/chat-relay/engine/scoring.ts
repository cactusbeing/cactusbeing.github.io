import type { AttemptRecord, SkillTag } from '../types.ts';
import { skillTags } from '../data/manifest.ts';
export function summarize(records:AttemptRecord[]) {return skillTags.map(skill=>{const answers=records.flatMap(r=>r.choices).filter(a=>!a.retried&&a.scores[skill]!==undefined);const independent=answers.filter(a=>!a.usedHint&&!a.usedDemo);const effective=answers.filter(a=>a.scores[skill]===2).length;return {skill,total:answers.length,effective,independent:independent.length,label:!answers.length?'本次未練習':effective/answers.length>=.8?'能在此題運用':effective/answers.length>=.5?'漸漸熟悉':'正在練習'};});}
export function recommendedSkill(records:AttemptRecord[]):SkillTag {return [...summarize(records)].sort((a,b)=>(a.total?a.effective/a.total:0)-(b.total?b.effective/b.total:0))[0].skill;}
