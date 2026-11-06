<script setup lang="ts">
import CharacterArt from './CharacterArt.vue';
import type { SceneId, Emotion } from '../types.ts';
withDefaults(defineProps<{sceneId?:SceneId;npcId?:string;emotion?:Emotion;home?:boolean;passing?:boolean;turnKey?:string;showNames?:boolean;npcName?:string}>(),{sceneId:'classroom',npcId:'xiaoyu',emotion:'neutral',home:false,passing:false,turnKey:'',showNames:false,npcName:''});
</script>
<template><div class="scene-art" :class="{ 'home-art':home }" aria-hidden="true">
<svg class="scene-background" viewBox="0 0 720 540" preserveAspectRatio="xMidYMid slice">
<rect width="720" height="540" fill="#f4eddf"/>
<g stroke="#657465" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
<template v-if="['classroom','hallway','lunch','club'].includes(sceneId)">
<path d="M0 350h720v190H0Z" fill="#e2dbc8" stroke="none"/><path d="M0 351h720M0 455h720M170 350l-70 190m220-190-25 190m195-190 35 190m135-190 100 190" opacity=".22"/>
<rect x="43" y="44" width="260" height="210" rx="9" fill="#bfd6d2"/><rect x="55" y="57" width="236" height="185" rx="5" fill="#d9e6df" stroke="none"/>
<path d="M55 200q34-85 86-54 58-58 83-6 37-22 67 3v99H55" fill="#adc5a2" stroke="none"/><path d="M173 57v185M55 138h236" stroke="#fdf9ee" stroke-width="9"/>
<path d="M27 35h292m-283 0q-13 112 11 195m261-195q13 112-11 195" stroke="#bfac92" stroke-width="10"/>
<template v-if="sceneId==='classroom'"><rect x="370" y="64" width="299" height="170" rx="7" fill="#7f9c87"/><path d="M397 101h159m-159 29h115m-115 29h187" stroke="#e8efdf" stroke-width="4"/><path d="M353 244h326" stroke="#9e8c72" stroke-width="9"/>
<path d="m15 355 160-18 52 40-162 21Z" fill="#bfa98b"/><path d="m63 399-5 90m149-108-4 82M0 437l44-6v70" fill="none" stroke="#9a927b" stroke-width="6"/>
<path d="m527 348 160 19 48 46-166-19Z" fill="#c9b79a"/><path d="m570 395 5 89m127-74 5 84" stroke="#9a927b" stroke-width="6"/></template>
<template v-else-if="sceneId==='hallway'"><rect x="375" y="57" width="270" height="192" rx="6" fill="#c5ae88"/><path d="M394 80h70v112h-70Zm94 5h63v97h-63Zm78-8h58v129h-58Z" fill="#fff9ed"/><path d="m404 162 17-37 15 15 13-36m49 55 18-33 22 34m35-2 15-20 26 24" fill="#b2c5a1"/>
<path d="M569 305v91m92-91v91m-110-93h128" stroke="#a59379" stroke-width="12"/></template>
<template v-else-if="sceneId==='lunch'"><rect x="378" y="68" width="260" height="134" rx="9" fill="#faf5e7"/><path d="M407 97h120m-120 28h167m-167 28h88" stroke="#9eaa8e" stroke-width="7"/><path d="M0 350h232l-16 54H0m523-25h197v54H549Z" fill="#c0ab8e"/><ellipse cx="119" cy="358" rx="46" ry="16" fill="#f9f4e9"/><path d="M80 356q39-35 78 0" fill="#b1bd7b"/><path d="M605 365h43l-5 40h-32Z" fill="#c8d6bd"/></template>
<template v-else><rect x="391" y="60" width="235" height="174" rx="7" fill="#f9f3e7"/><path d="m419 190 55-87 42 59 36-32 45 60Z" fill="#bfd0ad"/><circle cx="553" cy="99" r="16" fill="#d7b56d"/><path d="m397 259 40 118m159-119-41 119m-154-112h194" stroke="#ac9778" stroke-width="8"/><path d="M12 330h185l30 48H0" fill="#c6ae8c"/><path d="m39 323 12-61h70l12 61Z" fill="#e6d9c3"/><path d="m65 261-7-48m17 48 10-49m12 49 15-39" stroke="#ba918c" stroke-width="6"/></template>
</template>
<template v-else><rect width="720" height="340" fill="#dce9e2" stroke="none"/><path d="M0 300q160-120 319-24 202-109 401-11v275H0" fill="#bacaac" stroke="none"/><path d="M0 349q328-83 720 0v191H0" fill="#e7dcc4" stroke="none"/>
<template v-if="sceneId==='playground'"><path d="M-30 441q365-170 780 0m-780 35q365-170 780 0m-780 35q365-170 780 0" fill="none" stroke="#d0af94" stroke-width="18"/><path d="M576 165v155m-39-151h78v54h-78Z" fill="#fcf7e8"/><path d="M565 229h30l-5 31h-18Z" fill="none"/><path d="M60 107v252" stroke="#9e9b72" stroke-width="15"/><path d="M-24 134q-20-85 60-91 34-66 99-11 70 21 48 94-27 50-90 23-82 36-117-15" fill="#9db78f"/></template>
<template v-else><path d="M14 303V129h170v174m-154-8h136m-152-170 85-29 85 29" fill="#c5c4ac"/><rect x="40" y="152" width="112" height="90" rx="6" fill="#f8f2df"/><path d="M63 179h68m-68 25h48" stroke="#94a28a" stroke-width="6"/><path d="M475 323V112h138v211m-159-214 88-28 91 28m-149 13h119v113H484Z" fill="#a8bca8"/><path d="M498 151h90m-90 27h60" stroke="#f9f2e2" stroke-width="6"/><path d="M467 287h160m-140 0v43m119-43v43" stroke="#9a9278" stroke-width="10"/></template>
<path d="M298 67q23-39 50 0 28-16 43 8H280q-1-12 18-8m192-32q15-26 33 0 19-11 30 6h-77" fill="#faf9e9" stroke="none"/>
</template>
<path d="M651 356v-62m0 22q-49-3-34-36 33 3 34 36m0-13q48-8 27-38-29 10-27 38" fill="#8eac86"/><path d="m626 341 8 46h34l9-46Z" fill="#c99f81"/>
</g></svg>
<div class="scene-person scene-player"><CharacterArt player :emotion="home?'happy':'neutral'"/><span v-if="showNames" class="scene-nameplate">你</span></div>
<div class="scene-person scene-npc"><CharacterArt :npc-id="npcId" :emotion="home?'happy':emotion"/><span v-if="showNames" class="scene-nameplate">{{npcName}}</span></div>
<svg v-if="home||passing" :key="turnKey" class="relay-ball" :class="{'ball-in-flight':passing&&!home}" viewBox="0 0 120 100"><path d="M103 43c0 25-29 40-55 29L20 85l7-27C0 20 45-4 79 10c15 5 24 16 24 33Z" fill="#fffaf2" stroke="#7e9e88" stroke-width="3"/><g fill="#7e9e88"><circle cx="42" cy="39" r="5"/><circle cx="60" cy="39" r="5"/><circle cx="78" cy="39" r="5"/></g></svg>
</div></template>

<style scoped>
.scene-art{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;border-radius:20px;background:#e3e7d7}
.scene-background{position:absolute;inset:0;width:100%;height:100%}
.scene-person{position:absolute;width:31%;bottom:9%}
.scene-player{left:12%;transform:rotate(-3deg)}.scene-npc{right:12%;transform:rotate(2deg)}
.character-art{display:block;width:100%;height:auto;max-height:340px}
.home-art{aspect-ratio:1.12;border-radius:0}.home-art .scene-person{width:33%;bottom:14%}
.home-art .scene-player{left:10%}.home-art .scene-npc{right:10%}
.relay-ball{position:absolute;top:25%;left:40%;width:21%;transform:rotate(7deg)}
.ball-in-flight{width:16%;top:44%;animation:ball-pass 320ms cubic-bezier(.2,.7,.3,1) both}@keyframes ball-pass{0%{left:30%;transform:translateY(12px) scale(.65) rotate(-20deg);opacity:.25}50%{transform:translateY(-15px) scale(.8) rotate(0deg);opacity:1}100%{left:43%;transform:scale(.65) rotate(15deg);opacity:1}}@media(prefers-reduced-motion:reduce){.ball-in-flight{animation:none;left:43%;transform:scale(.65)}}
</style>
