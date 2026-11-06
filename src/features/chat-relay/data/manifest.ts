import type { SceneId, SkillTag } from '../types.ts';
export const contentVersion = 3;
export const learningGoals = {
 distance: '建立社交距離與身體界線', opening: '開啟談話', continuing: '延續談話',
 message_emotion: '依情緒選擇訊息與貼圖', online_friendship: '網路交友與個人界線',
} as const;
export const scenes: { id: SceneId; name: string; detail: string }[] = [
 {id:'classroom',name:'教室',detail:'窗邊的課桌與今天的小事'}, {id:'hallway',name:'走廊',detail:'下課十分鐘，留一點空間'}, {id:'lunch',name:'午餐',detail:'一道菜，也能開啟一段聊天'}, {id:'playground',name:'操場',detail:'樹蔭下，交換運動與生活'}, {id:'club',name:'社團',detail:'每個人都有喜歡的事'}, {id:'outing',name:'校外生活',detail:'一起看見生活的小發現'},
];
export const characters = [
 {id:'xiaoyu',name:'小宇',color:'#82a5ba',hair:'#3f4754',style:0,interest:'動畫'},
 {id:'aqing',name:'阿晴',color:'#dca57f',hair:'#735246',style:1,interest:'點心'},
 {id:'azhe',name:'阿哲',color:'#8baf87',hair:'#3f443d',style:2,interest:'運動'},
 {id:'xiaomei',name:'小莓',color:'#bca4c4',hair:'#574743',style:3,interest:'畫畫'},
 {id:'lele',name:'樂樂',color:'#c8ad65',hair:'#494139',style:4,interest:'音樂'},
 {id:'zien',name:'子恩',color:'#8aa99f',hair:'#3d4146',style:5,interest:'閱讀'},
 {id:'chenchen',name:'晨晨',color:'#c98f92',hair:'#644b37',style:6,interest:'動物'},
 {id:'mia',name:'米亞老師',color:'#a2ac85',hair:'#483d37',style:7,interest:'一起練習'},
];
export const skillNames: Record<SkillTag,string> = {listen:'聆聽主題',respond:'接住話題',empathy:'回應感受',ask_question:'相關提問',share_related:'相關分享',respect_boundary:'尊重界線',close_conversation:'自然收尾'};
export const skillTags = Object.keys(skillNames) as SkillTag[];
export const difficultyNames = {1:'圖卡入門',2:'生活練習',3:'連續對話'};
