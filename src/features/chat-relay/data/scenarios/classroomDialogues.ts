import type { Choice, ChoiceContext, DecisionNode, DialogueNode, Emotion, Ending, Scenario, SkillTag } from '../../types.ts';

type Reply = {
  text: string; reaction: string; next: string; tip: string; feedback: string;
  skills: SkillTag[]; level?: Choice['feedbackLevel']; sticker?: Choice['sticker'];
  context?: ChoiceContext; emotion?: Emotion;
};
function reply(nodeId: string, r: Reply, index: number): Choice {
  const level = r.level ?? 'effective';
  return {
    id: `${nodeId}-${index}`, text: r.text, npcReaction: { text: r.reaction, emotion: r.emotion ?? (r.context?.endsInteraction ? 'leaving' : 'neutral') },
    nextNodeId: r.next, imageCue: r.skills[0], skillTags: r.skills,
    feedbackLevel: level, rationale: r.feedback, feedback: { brief: r.tip, detailed: level === 'try_another' },
    scores: Object.fromEntries(r.skills.map(skill => [skill, level === 'effective' ? 2 : level === 'acceptable' ? 1 : 0])),
    ...(r.context ? { context: r.context } : {}), ...(r.sticker ? { sticker: r.sticker } : {}),
  };
}
function node(id: string, npcText: string, replies: Reply[], requires: string[] = [], provides: string[] = []): DecisionNode {
  return { id, kind: 'decision', npcText, npcEmotion: 'neutral', context: { requires, provides }, choices: replies.map((r, i) => reply(id, r, i)) };
}
const end = (id: string, closingText: string, ending: Ending = 'respectful_close'): DialogueNode => ({ id, kind: 'end', closingText, ending });
function scenario(meta: Pick<Scenario, 'id' | 'title' | 'sceneId' | 'npcId' | 'setting' | 'topic' | 'learningGoal' | 'skillTags' | 'channel' | 'partnerName'>, nodes: DialogueNode[], initialFacts: string[]): Scenario {
  const graph = { startNodeId: 'start', nodes: Object.fromEntries(nodes.map(n => [n.id, n])) };
  // These four stories follow the conversation, rather than padding/truncating to a fixed turn count.
  return { ...meta, ...graph, initialFacts, turnPolicy: 'natural', supportedDifficulties: [1, 2, 3], contentVersion: 3, easy: graph };
}

export const drawingDialogue = scenario({
  id: 'classroom-drawing', title: '一起畫畫', sceneId: 'classroom', npcId: 'xiaomei', topic: '留出空間，也能調整後繼續聊',
  setting: '美術課，你和小莓共用一張桌子。你的手臂靠近她的畫紙，她畫線時碰到了你。',
  learningGoal: 'distance', skillTags: ['respect_boundary', 'respond', 'share_related', 'close_conversation'],
}, [
  node('start', '有點擠耶，我手不好動。', [
    { text: '喔，我移過去一點。這樣可以嗎？', reaction: '可以了，謝啦。你在畫什麼？', next: 'A3', tip: '你有移開，也問她這樣行不行。', feedback: '你移出了空間，也確認小莓現在好不好畫。', skills: ['respect_boundary'], context: { provides: ['space_adjusted', 'asked_drawing'] } },
    { text: '喔，好。', reaction: '你可以再移一點嗎？我的筆還是會碰到你。', next: 'A2', tip: '她還需要多一點空間。', feedback: '你有回應她，但位置還沒改變。可以再移一點。', skills: ['respond'], level: 'acceptable', context: { provides: ['space_unresolved'] } },
    { text: '才靠一點點，有什麼關係？', reaction: '可是我真的不好畫耶。', next: 'A2', tip: '先聽她說哪裡不舒服。', feedback: '你覺得距離還好，小莓卻不好活動。現在還來得及調整。', skills: ['respect_boundary'], level: 'try_another', context: { provides: ['space_unresolved'] } },
  ], [], ['space_requested']),
  node('A2', '我的手還是不好動。', [
    { text: '好，我移過去。這樣呢？', reaction: '這樣可以了。你在畫什麼？', next: 'A3', tip: '你聽懂後，願意調整位置。', feedback: '聽到她再說一次，你願意調整，兩個人就能繼續畫。', skills: ['respect_boundary'], context: { provides: ['space_adjusted', 'asked_drawing'] } },
    { text: '那我換到旁邊的空位畫。', reaction: '好啊，這樣比較放得下。', next: 'end-draw', tip: '換個位置，也能讓彼此舒服。', feedback: '你找到另一個位置，讓彼此都有足夠的空間。', skills: ['respect_boundary', 'close_conversation'], context: { endsInteraction: true } },
    { text: '一下而已，繼續畫啦。', reaction: '我想自己畫，先不要靠過來。', next: 'end-stop', tip: '她已經說不要再靠近了。', feedback: '小莓已經說不想再靠近。這時要停下來，留出她需要的空間。', skills: ['respect_boundary'], level: 'try_another', context: { endsInteraction: true }, emotion: 'sad' },
  ], ['space_unresolved']),
  node('A3', '你在畫什麼？', [
    { text: '想畫一隻貓，可是耳朵一直畫歪。', reaction: '我剛剛畫樹也歪掉，最後直接改成被風吹。', next: 'A4-wind', tip: '你分享了正在畫畫的小狀況。', feedback: '你回答了她的問題，也分享正在發生的小事，讓她有話可以接。', skills: ['respond', 'share_related'], context: { provides: ['wind_tree'] } },
    { text: '還沒想好，先亂畫。', reaction: '我也是先畫幾筆，才想到要畫樹。', next: 'A4-sketch', tip: '還沒想好，也可以照實說。', feedback: '你照實說自己還沒決定，聊天不需要每次都有特別的內容。', skills: ['respond'], context: { provides: ['sketch_tree'] } },
    { text: '等我畫完再給你看，我怕現在講一講又畫歪。', reaction: '好啊，畫完再看。', next: 'end-draw', tip: '你說明想先專心。', feedback: '你說明自己想先專心，也留下之後分享的機會。', skills: ['close_conversation'], context: { endsInteraction: true } },
  ], ['space_adjusted', 'asked_drawing']),
  node('A4-wind', '畫歪的地方，我就當成是被風吹的。', [
    { text: '被風吹喔，這招滿好用的耶。', reaction: '對啊，不然我一直擦，紙快破了。', next: 'A5', tip: '你接著她剛說的畫法聊。', feedback: '你接住她剛說的畫法，讓她能繼續分享。', skills: ['respond'], context: { requires: ['wind_tree'], provides: ['erasing_paper'] } },
    { text: '我先試試看，等等再給你看。', reaction: '好，我也先把這邊畫完。', next: 'end-draw', tip: '聊完，也可以回去畫畫。', feedback: '你有回應她，也自然回到原本的活動。', skills: ['close_conversation'], context: { endsInteraction: true } },
  ], ['wind_tree']),
  node('A4-sketch', '我也是畫了幾筆，才想到要畫樹。', [
    { text: '那我也先畫幾筆，說不定就想到了。', reaction: '對啊，我剛畫一條線，覺得滿像樹幹的。', next: 'end-draw', tip: '你接的是她先畫再想的做法。', feedback: '你接著她先畫再想的做法，說出自己想試試看的想法。', skills: ['respond'], context: { requires: ['sketch_tree'], endsInteraction: true } },
    { text: '你先畫，我想一下要畫什麼。', reaction: '好啊，慢慢想。', next: 'end-draw', tip: '各自畫畫，也很自然。', feedback: '你說明自己想先想一想，讓兩人都能繼續畫。', skills: ['close_conversation'], context: { endsInteraction: true } },
  ], ['sketch_tree']),
  node('A5', '我一直擦，紙快破了。', [
    { text: '那我也先不擦了，畫完再看。', reaction: '好啊，說不定畫完就不覺得怪了。', next: 'end-draw', tip: '你把她的經驗接回自己的畫。', feedback: '你把她的經驗接回自己的畫，聊完後也能繼續做事。', skills: ['respond', 'close_conversation'], context: { endsInteraction: true } },
    { text: '你先畫，我也趕一下進度。', reaction: '好，等等再看你的。', next: 'end-draw', tip: '你清楚說出想先完成的事。', feedback: '你注意到作品還沒完成，清楚收尾，也保留交流的機會。', skills: ['close_conversation'], context: { endsInteraction: true } },
  ], ['erasing_paper']),
  end('end-draw', '（兩人留出足夠的空間，繼續畫畫。）'),
  end('end-stop', '（小莓把畫紙移到另一邊，這次互動到這裡。）', 'repair'),
], ['shared_desk']);

export const readingDialogue = scenario({
  id: 'classroom-05', title: '朋友在看書', sceneId: 'classroom', npcId: 'chenchen', topic: '觀察情境、一起看書和延續細節',
  setting: '下課，晨晨在看海洋動物圖鑑。你看得到書名，還看不清楚他正在看的那一頁。',
  learningGoal: 'opening', skillTags: ['listen', 'ask_question', 'respond', 'share_related', 'respect_boundary', 'close_conversation'],
}, [
  node('start', '（晨晨正在翻海洋動物圖鑑。）', [
    { text: '你在看海洋動物喔？可以一起看嗎？', reaction: '可以啊。這張有章魚，我剛找超久，牠躲在石頭旁邊。', next: 'B3', tip: '你先問他願不願意一起看。', feedback: '你從看得到的書名開口，也先問晨晨願不願意一起看。', skills: ['ask_question', 'respect_boundary'], context: { requires: ['marine_book'], provides: ['octopus', 'stone', 'shared_book'] } },
    { text: '這本照片好多喔。', reaction: '對啊。這張章魚躲在石頭旁邊，我剛剛一直找不到。', next: 'B3', tip: '你從眼前的書開啟話題。', feedback: '你從眼前的書開口，晨晨也願意把照片轉過來分享。', skills: ['respond'], context: { provides: ['octopus', 'stone', 'shared_book'] } },
    { text: '欸，我昨天打電動……', reaction: '蛤？你剛說什麼？我在看這張照片。', next: 'B2', tip: '他還在看書，可以先接他的狀況。', feedback: '晨晨剛才還在專心看書，可能沒跟上你的話。可以先確認他的狀況。', skills: ['listen'], level: 'acceptable' },
  ]),
  node('B2', '我剛剛沒聽清楚，還在看這張照片。', [
    { text: '喔，你在看什麼？', reaction: '這張有章魚，躲在石頭旁邊。你看得出來嗎？', next: 'B3', tip: '你回到他正在看的內容。', feedback: '你先回到他正在看的內容，讓兩個人有共同的話題。', skills: ['ask_question'], context: { provides: ['octopus', 'stone', 'shared_book'] } },
    { text: '沒事，我晚點再跟你講。', reaction: '好，我想先看完這頁。', next: 'end-read', tip: '換個時間聊，也可以。', feedback: '你發現現在不太適合，願意換個時間再聊。', skills: ['respect_boundary', 'close_conversation'], context: { endsInteraction: true } },
    { text: '先別看了，聽我講啦。', reaction: '我現在想先看書，晚點再說。', next: 'end-stop', tip: '他已經說想先看書了。', feedback: '晨晨已經說想先看書。先停下來，等他方便時再聊。', skills: ['respect_boundary'], level: 'try_another', context: { endsInteraction: true } },
  ]),
  node('B3', '（晨晨把章魚照片轉向你，章魚躲在石頭旁邊。）', [
    { text: '真的耶，牠跟石頭幾乎一樣顏色。', reaction: '對啊，我看到那兩點，才發現是眼睛。', next: 'B4', tip: '你接著照片裡的細節聊。', feedback: '你說出照片裡的細節，晨晨就能接著分享他的發現。', skills: ['respond'], context: { requires: ['octopus', 'stone'], provides: ['eyes'] } },
    { text: '我之前也看過躲在沙子裡的章魚照片。', reaction: '真的假的？原來章魚也會躲在沙子裡喔！那張看得出來嗎？', next: 'B5', tip: '你分享了和章魚有關的經驗。', feedback: '你順著章魚話題分享相關經驗，晨晨也產生了好奇。', skills: ['share_related'], context: { requires: ['octopus'], provides: ['sand_photo_question'] } },
    { text: '喔。', reaction: '你看這裡，這兩個小點是眼睛，不然真的找不到。', next: 'B4', tip: '他繼續分享，可以再接一句。', feedback: '簡短回應也可能讓對方繼續分享。可以接著看他指出的地方。', skills: ['respond'], level: 'acceptable', context: { provides: ['eyes'] } },
  ], ['octopus', 'stone', 'shared_book']),
  node('B4', '這兩個小點就是眼睛。', [
    { text: '眼睛在哪？我還是找不到。', reaction: '右邊這兩點，我指給你看。', next: 'B6', tip: '沒看清楚，可以直接問。', feedback: '你把沒看懂的地方問清楚，晨晨就知道可以怎麼幫你看。', skills: ['ask_question'], context: { provides: ['eyes_located'] } },
    { text: '牠不動的話，真的很像一塊石頭。', reaction: '對啊，我剛剛還以為這張只有石頭。', next: 'B6', tip: '你接著他的發現說下去。', feedback: '你接著他的發現說下去，兩個人在聊同一個細節。', skills: ['respond'], context: { requires: ['stone'] } },
    { text: '原來喔。你先看，我去裝水。', reaction: '好，等等見。', next: 'end-read', tip: '回應後再道別，很自然。', feedback: '你有回應他的分享，也清楚說出自己要離開。', skills: ['close_conversation'], context: { endsInteraction: true } },
  ], ['eyes']),
  node('B5', '那張躲在沙子裡的照片，看得出來嗎？', [
    { text: '只露出兩隻眼睛。旁邊有放大圖，我才看懂。', reaction: '原來有放大圖！我來看這本旁邊有沒有提示。', next: 'B7', tip: '你回答了他剛才的問題。', feedback: '你回答了他的問題，也補上自己怎麼看懂照片的經過。', skills: ['respond', 'share_related'] },
    { text: '有點忘了，只記得旁邊都是白白的沙。', reaction: '喔，我沒看過那種耶。', next: 'B7', tip: '記不清楚，也可以照實說。', feedback: '記不清楚可以直接說，不需要為了聊天而編細節。', skills: ['respond'] },
  ], ['sand_photo_question']),
  node('B6', '（你們繼續看石頭旁邊的章魚照片。）', [
    { text: '看到了！難怪剛剛找不到。', reaction: '對吧。我繼續往下看囉。', next: 'end-read', tip: '他要繼續看書，可以收尾了。', feedback: '你回應了他的說明；他想繼續閱讀，這時就可以收尾。', skills: ['respond', 'close_conversation'], context: { endsInteraction: true } },
    { text: '我再看一下這張，可以嗎？', reaction: '可以啊，一起看。', next: 'end-together', tip: '一起看圖，不必一直說話。', feedback: '你先問他是否願意。兩人也可以安靜看圖，不必一直找話說。', skills: ['ask_question', 'respect_boundary'], context: { endsInteraction: true } },
  ], ['shared_book', 'octopus', 'stone']),
  node('B7', '（你們還一起看著這本海洋動物圖鑑。）', [
    { text: '這本還有別的章魚照片嗎？', reaction: '目錄好像還有一頁，我翻看看。', next: 'end-together', tip: '你從同一個話題再問一步。', feedback: '你從章魚話題再問一步，晨晨也願意一起找。', skills: ['ask_question'], context: { requires: ['octopus'], endsInteraction: true } },
    { text: '你先看，下次找到那張照片再給你看。', reaction: '好啊，我想看看長怎樣。', next: 'end-read', tip: '你留下之後可以分享的話題。', feedback: '你留下之後可以分享的話題，也讓晨晨繼續看書。', skills: ['close_conversation'], context: { requires: ['sand_photo_question'], endsInteraction: true } },
  ], ['shared_book']),
  end('end-read', '（晨晨繼續閱讀，這次聊天先到這裡。）'),
  end('end-together', '（兩人安靜地一起看書。）', 'extended'),
  end('end-stop', '（晨晨回去看書，這時不再打斷他。）', 'repair'),
], ['marine_book']);

export const modelDialogue = scenario({
  id: 'club-03', title: '模型倒了', sceneId: 'club', npcId: 'xiaoyu', topic: '先理解情緒，再判斷是否提供建議',
  setting: '放學後，小宇傳來模型照片。屋頂歪在旁邊，桌上有膠水。他還附了一句訊息。',
  learningGoal: 'message_emotion', channel: 'message', skillTags: ['ask_question', 'empathy', 'respect_boundary', 'share_related', 'close_conversation'],
}, [
  node('start', '模型又倒了，我弄了一下午耶。', [
    { text: '哪邊倒了？', reaction: '屋頂一直歪啊！我都重黏三次了，煩死了。', next: 'C2', tip: '你先了解他卡在哪裡。', feedback: '你先問發生了什麼，讓小宇能把困擾說出來。', skills: ['ask_question'], context: { provides: ['three_attempts'] } },
    { text: '貼圖：拍拍', sticker: 'comfort', reaction: '唉，我都重黏三次了，屋頂還是歪。', next: 'C2', tip: '圖卡表達了安慰。', feedback: '這張圖卡表達了安慰，小宇也接著說出他在煩什麼。', skills: ['empathy'], context: { provides: ['three_attempts'] } },
    { text: '屋頂先扶著，等膠乾了再放手？', reaction: '我現在不想弄了。', next: 'C3', tip: '他現在想先停一下。', feedback: '你想幫忙固定屋頂，但他現在沒有心情繼續做。可以先回應他的感受。', skills: ['respect_boundary'], level: 'try_another', context: { requires: ['crooked_roof'], provides: ['pause_requested'] } },
  ], [], ['afternoon_work']),
  node('C2', '我都重黏三次了，屋頂還是歪。', [
    { text: '黏三次還倒，真的會很煩。', reaction: '對啊，明明就剩屋頂了。', next: 'C4', tip: '你有聽見他反覆重做的挫折。', feedback: '你注意到他反覆重做的挫折，他不用再解釋自己為什麼生氣。', skills: ['empathy'], context: { requires: ['three_attempts'], provides: ['nearly_done'] } },
    { text: '要不要先扶著屋頂，等膠乾？', reaction: '我現在不想弄了。', next: 'C3', tip: '方法可以等等，先聽他的狀況。', feedback: '扶著等膠乾也許有用，但小宇現在想停一下。先跟著他的狀況調整。', skills: ['respect_boundary'], level: 'try_another', context: { requires: ['crooked_roof'], provides: ['pause_requested'] } },
    { text: '要不要先放著，休息一下？', reaction: '好，我先休息一下。', next: 'end-rest', tip: '你讓他自己決定要不要休息。', feedback: '你提出暫停的選擇，也讓他自己決定要不要休息。', skills: ['empathy', 'respect_boundary'], context: { endsInteraction: true } },
  ], ['three_attempts']),
  node('C3', '我現在真的不想弄了。', [
    { text: '好，那先放著。弄一下午真的會煩。', reaction: '對啊，本來以為快好了。', next: 'C4', tip: '你願意先把建議收回。', feedback: '你沒有繼續催他試方法，而是回應他花了很多時間的心情。', skills: ['empathy', 'respect_boundary'], context: { requires: ['afternoon_work'], provides: ['nearly_done'] } },
    { text: '喔，那先休息？晚點再弄也可以。', reaction: '嗯，我先休息一下。', next: 'end-rest', tip: '他想停，你也跟著調整。', feedback: '你聽見他不想繼續，願意把建議收回，讓他休息。', skills: ['respect_boundary', 'close_conversation'], context: { endsInteraction: true } },
    { text: '試一下而已，現在扶著看看啦。', reaction: '我真的不想弄了，也先不聊了。', next: 'end-stop', tip: '他已經說先不聊了。', feedback: '他已經說不想繼續做，也不想再聊。這時要停止催促，讓他休息。', skills: ['respect_boundary'], level: 'try_another', context: { endsInteraction: true }, emotion: 'sad' },
  ], ['pause_requested']),
  node('C4', '就差屋頂，還以為快好了。', [
    { text: '都快好了又倒，真的很氣耶。', reaction: '對啊，都準備收東西了，結果又倒。', next: 'C5-tired', tip: '你接住他快完成卻又失敗的心情。', feedback: '你回應差一點就完成的失望，讓小宇能把話說完。', skills: ['empathy'], context: { provides: ['tired_only'] } },
    { text: '我上次也是快做好才倒，超煩。', reaction: '你也有喔。我剛剛差點想整個拆掉。', next: 'C5-dismantle', tip: '你分享了相似的經驗。', feedback: '你分享相似的經驗，讓他知道不是只有自己遇過這種事。', skills: ['share_related'], context: { provides: ['dismantle_mentioned'] } },
    { text: '晚點想一起找方法，再叫我？', reaction: '好，我先休息。', next: 'end-rest', tip: '他說晚點，就先讓他休息。', feedback: '你把幫忙的時間留給他決定，現在先讓他休息。', skills: ['ask_question', 'respect_boundary'], context: { endsInteraction: true } },
  ], ['nearly_done']),
  node('C5-tired', '都準備收東西了，結果又倒。', [
    { text: '先放旁邊吧，晚點再看。', reaction: '嗯，我先不碰它了。', next: 'end-rest', tip: '先停一下，也是一個選擇。', feedback: '你提出暫停的做法，沒有要求他立刻修好模型。', skills: ['respect_boundary', 'close_conversation'], context: { endsInteraction: true } },
    { text: '你先休息，要聊再找我。', reaction: '好，謝啦。', next: 'end-rest', tip: '你留下陪伴，也留出空間。', feedback: '你讓他知道之後還能找你，也留給他休息的空間。', skills: ['empathy', 'close_conversation'], context: { endsInteraction: true } },
  ], ['tired_only']),
  node('C5-dismantle', '我剛剛差點想整個拆掉。', [
    { text: '先別拆啦，放到旁邊，晚點再看。', reaction: '嗯，我先不碰它了。', next: 'end-rest', tip: '你回應了他剛才想拆掉的話。', feedback: '你接住他想拆掉的氣話，提出可以先暫停的做法。', skills: ['empathy', 'close_conversation'], context: { requires: ['dismantle_mentioned'], endsInteraction: true } },
    { text: '你先休息，要聊再找我。', reaction: '好，謝啦。', next: 'end-rest', tip: '你留下陪伴，也留出空間。', feedback: '你讓他知道之後還能找你，也留給他休息的空間。', skills: ['empathy', 'close_conversation'], context: { endsInteraction: true } },
  ], ['dismantle_mentioned']),
  end('end-rest', '（小宇把模型放到一旁，先去休息。）'),
  end('end-stop', '（小宇暫時不再回訊息，這時讓他休息。）', 'repair'),
], ['crooked_roof', 'glue_on_desk']);

export const onlineDialogue = scenario({
  id: 'outing-01', title: '剛認識的遊戲玩家', sceneId: 'outing', npcId: 'azhe', partnerName: '小星（網友）', topic: '遊戲好友和私人聯絡方式分開決定',
  setting: '你和剛配對到的玩家完成一場合作遊戲，最後倒數幾秒才過關。你們還不知道彼此的真實身分。',
  learningGoal: 'online_friendship', channel: 'message', skillTags: ['respect_boundary', 'ask_question', 'respond', 'share_related', 'close_conversation'],
}, [
  node('start', '剛剛配合得不錯耶！要加遊戲好友嗎？', [
    { text: '好啊，加遊戲好友。', reaction: '加了！我剛在中間轉角卡超久，還好你有回來。', next: 'D3', tip: '這次只決定遊戲內的好友。', feedback: '你同意的是遊戲內好友，不代表也同意交換私人聯絡方式。', skills: ['respect_boundary'], context: { provides: ['game_friend', 'corner_lost'] } },
    { text: '我先不加了，今天玩得滿開心的！', reaction: '沒問題，下次遇到再玩。', next: 'end-bye', tip: '不加好友，也能友善道別。', feedback: '你可以不加好友，也能友善表達一起玩的感受。', skills: ['respect_boundary', 'close_conversation'], context: { endsInteraction: true } },
    { text: '先聊一下就好，你也常玩這張圖？', reaction: '滿常的，但我還是會在中間轉角走錯。', next: 'D3', tip: '還沒加好友，也可以先聊遊戲。', feedback: '你先保留加好友的決定，也用共同的遊戲內容繼續認識對方。', skills: ['ask_question', 'respect_boundary'], context: { provides: ['corner_lost'] } },
  ]),
  node('D3', '我剛剛在中間那個轉角一直走錯。', [
    { text: '你有看到地上的箭頭嗎？我也是後來才發現。', reaction: '蛤，原來地上有！我都看前面。', next: 'D4', tip: '你分享了遊戲裡的發現。', feedback: '你回應他迷路的經驗，也分享和遊戲有關的發現。', skills: ['ask_question', 'share_related'] },
    { text: '我也常迷路，剛剛差點又繞回去。', reaction: '難怪我們一直走同一邊，哈哈。', next: 'D4', tip: '你用相似的經驗接話。', feedback: '你分享自己的小失誤，讓對方知道不是只有他會走錯。', skills: ['share_related'] },
    { text: '嗯，過了就好。', reaction: '也是啦，至少最後有過。', next: 'D4', tip: '短短回應後，也能再接一句。', feedback: '你回應了結果，話題可能停一下。想繼續時，可以再接剛才的經過。', skills: ['respond'], level: 'acceptable' },
  ], ['corner_lost']),
  node('D4', '（你們還留在遊戲內聊天室。）', [
    { text: '最後那段倒數，我還以為來不及。', reaction: '我也是！欸，要交換 LINE 嗎？之後比較好約。', next: 'D-line', tip: '這是另一個決定，可以另外想。', feedback: '聊得開心之後，對方又提出私人聯絡方式。這件事可以重新決定，不必跟加好友一起答應。', skills: ['share_related'], context: { requires: ['countdown'], provides: ['line_invited'] } },
    { text: '我先下線，下次遇到再玩。', reaction: '好，掰掰。', next: 'end-bye', tip: '想離開時，可以清楚道別。', feedback: '你清楚說明要離開，也友善地結束這次互動。', skills: ['close_conversation'], context: { endsInteraction: true } },
  ], ['game_chat']),
  node('D-line', '要交換 LINE 嗎？之後比較好約。', [
    { text: 'LINE 先不用，在遊戲裡遇到再玩就好。', reaction: '好啊，下次遇到再玩。', next: 'D5', tip: '你說清楚私人帳號先不交換。', feedback: '你保留私人聯絡方式，也說明願意在遊戲裡繼續互動。', skills: ['respect_boundary'], context: { provides: ['line_declined'] } },
    { text: '我先不交換，今天也先玩到這。', reaction: '好，今天謝啦，掰。', next: 'end-bye', tip: '任何階段都能拒絕或結束。', feedback: '即使剛才聊得開心，你仍可以不交換帳號，也可以決定現在離開。', skills: ['respect_boundary', 'close_conversation'], context: { endsInteraction: true } },
    { text: '好啊，我把 LINE 給你！', reaction: '（練習先停在送出之前，不會要求你填寫帳號。）', next: 'D2', tip: '先停一下，想想要不要提供。', feedback: 'LINE 是私人聯絡方式。你們還不熟，可以先留在遊戲裡聊，再決定要不要交換。', skills: ['respect_boundary'], level: 'try_another', context: { provides: ['privacy_paused'] } },
  ], ['line_invited']),
  node('D2', '（尚未提供任何帳號。你可以重新決定。）', [
    { text: '想了一下，LINE 先不用，在遊戲裡聊就好。', reaction: '好啊，下次遇到再玩。', next: 'D5', tip: '你可以改變主意。', feedback: '你可以改變主意，選自己覺得安心的方式，也能保持友善。', skills: ['respect_boundary'], context: { provides: ['line_declined'] } },
    { text: '我先不交換帳號，今天先這樣。', reaction: '好，掰掰。', next: 'end-bye', tip: '保留帳號，也能清楚道別。', feedback: '你清楚說出自己的決定，不必因為怕對方失望而交換帳號。', skills: ['respect_boundary', 'close_conversation'], context: { endsInteraction: true } },
    { text: '我還沒決定，先聊遊戲就好。', reaction: '可以啊，先在這裡聊。', next: 'D5', tip: '還沒決定，就先保留。', feedback: '你保留私人帳號的決定。聊天也可以只留在遊戲內容。', skills: ['respect_boundary'], context: { provides: ['line_undecided'] } },
  ], ['line_invited', 'privacy_paused']),
  node('D5', '（你們繼續留在遊戲內聊天，沒有交換 LINE。）', [
    { text: '下次慢慢找路好了，剛剛跑太快。', reaction: '真的。我先下線了，掰。', next: 'end-bye', tip: '不交換 LINE，也能聊完再道別。', feedback: '你繼續聊共同經歷；對方準備離開，這時就讓聊天結束。', skills: ['respond', 'close_conversation'], context: { endsInteraction: true } },
    { text: '今天先玩到這，我也要下了。', reaction: '好，今天謝啦。', next: 'end-bye', tip: '你也能按照自己的時間結束。', feedback: '你按照自己的時間決定結束，不需要一直陪玩才能維持友善。', skills: ['close_conversation'], context: { endsInteraction: true } },
  ], ['game_chat', 'corner_lost']),
  end('end-bye', '（這次遊戲聊天結束，沒有輸入或交換真實私人資料。）'),
], ['game_chat', 'countdown']);

export const classroomDialogues = [drawingDialogue, readingDialogue, modelDialogue, onlineDialogue];
