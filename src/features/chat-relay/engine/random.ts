export function hashSeed(value: string): number { let h=2166136261; for(const c of value) h=Math.imul(h^c.charCodeAt(0),16777619); return h>>>0; }
export function seededRandom(seed: number): () => number { let state=seed>>>0; return () => { state+=0x6D2B79F5; let t=state; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
export function shuffle<T>(items: readonly T[], rng: () => number): T[] { const result=[...items]; for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1)); [result[i],result[j]]=[result[j],result[i]];} return result; }
export function newSeed(): number { return typeof crypto!=='undefined' ? crypto.getRandomValues(new Uint32Array(1))[0] : Date.now()>>>0; }
