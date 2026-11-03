export type Exercise = {kind:'choice'|'compare';prompt:string;options:[string,string,string?];answer:number;feedback:string}|{kind:'categorize';prompt:string;answer:number;feedback:string}|{kind:'sequence';prompt:string;lines:string[];feedback:string}|{kind:'dialogue';prompt:string;scenarioId:string;feedback:string};
export interface Lesson { title:string;skill:string;intro:string;demos:{title:string;lines:string[]}[];exercises:Exercise[];task:string }
export const categories=['回應內容','問問題','分享相關','禮貌收尾'];
export const lessons:Lesson[]=[
{title:'認識聊天球',skill:'聽到 → 接住 → 傳回 → 收尾',intro:'聊天像傳球，可以輪流，也可以先把球放下休息。',demos:[
{title:'先聽主題',lines:['阿晴：我帶了草莓麵包。','小宇：草莓聞起來很香耶。','米亞：先接住「麵包」這個主題。']},
{title:'問一個相關問題',lines:['晨晨：我看到窗邊有小鳥。','樂樂：牠的翅膀是什麼顏色？','米亞：小問題讓對方有機會再說一點。']},
{title:'分享也可以不同',lines:['小莓：我喜歡慢慢的音樂。','阿哲：我喜歡有節奏的，跑步會聽。','米亞：不同喜好也能互相認識。']},
{title:'收尾也是接球',lines:['子恩：我想先看完這頁。','阿晴：好，你先看，有空再聊。','米亞：不用一直聊，也不用強迫看著對方。']},
],exercises:[
{kind:'compare',prompt:'對方說「我想先喝水」。哪段更能尊重他？',options:['「你先喝，等等再說。」','「不行，先把我的故事聽完。」'],answer:0,feedback:'先讓對方照顧自己的需要，也是好的回應。'},
{kind:'categorize',prompt:'「你後來怎麼把模型修好的？」是哪一種傳球方式？',answer:1,feedback:'這是問問題，邀請對方說相關細節。'},
{kind:'categorize',prompt:'「聽起來你準備得很用心。」放在哪一類？',answer:0,feedback:'這句話接住了對方付出的努力。'},
{kind:'sequence',prompt:'把一小段聊天排順。',lines:['聽同學說：「我種的豆子發芽了。」','回應：「真的長出綠芽了耶。」','提問：「你把盆栽放在哪裡？」','收尾：「你先澆水，下次再聊。」'],feedback:'先聽見主題，再接話、延伸，最後尊重地收尾。'},
{kind:'compare',prompt:'同學分享點心。A「喔，知道了。」B「你在哪裡買的？」怎麼看？',options:['A 一定不禮貌。','兩者都可以；B 較容易延伸。'],answer:1,feedback:'短回應也有禮貌。想多聊時，再問一個相關問題。'},
{kind:'dialogue',prompt:'試著接住小宇的新吊飾話題。',scenarioId:'classroom-01',feedback:'接球可以欣賞、提問或分享，也能自然結束。'},
],task:'老師邀請大家選一件願意分享的小物；也可以用指圖卡或「先不分享」來回應。'},
{title:'接住話題',skill:'找主題，回應內容與感受',intro:'表情是線索，還要聽對方說的內容。猜不確定時，可以輕聲確認。',demos:[{title:'不急著給建議',lines:['小莓：我考試前有點緊張。','晨晨：你想聊聊，還是先安靜？','小莓：我想先自己看一下筆記。','晨晨：好，需要幫忙再說。']}],exercises:[
{kind:'choice',prompt:'「我昨天看到一本海底動物的書。」主題是什麼？',options:['海底動物的書','明天的午餐','今天的體育課'],answer:0,feedback:'抓住對方剛說的關鍵字「海底動物」「書」。'},
{kind:'choice',prompt:'「我的鞋子被雨淋濕，好不舒服。」可以怎麼接？',options:['你一定很開心。','濕濕的很難受，要先處理嗎？','不要說鞋子了。'],answer:1,feedback:'回應已說出的不舒服，再讓對方選擇是否需要協助。'},
{kind:'compare',prompt:'同學說報告打完了，哪句接到他的努力？',options:['「你終於完成了，可以休息一下。」','「我的鉛筆是藍色的。」'],answer:0,feedback:'完成報告是當下的主題，先回應它。'},
{kind:'categorize',prompt:'「差一球，真的有點可惜。」屬於哪類？',answer:0,feedback:'這句話回應了比賽後的感受。'},
{kind:'choice',prompt:'對方皺眉但說「我想先休息」。我們知道什麼？',options:['他一定討厭我。','他現在想休息。','他一定生氣了。'],answer:1,feedback:'直接說出的需要比猜測表情可靠；不用推測他對你的看法。'},
{kind:'compare',prompt:'同學說新座位太亮。哪句比較合適？',options:['「大家都沒事，你也不能不舒服。」','「太亮會不舒服，要不要先問老師？」'],answer:1,feedback:'每個人對環境的感受不同，協助也要讓對方選擇。'},
{kind:'choice',prompt:'同學喜歡橘子，你不喜歡。可以怎麼說？',options:['喜歡橘子很奇怪。','我比較喜歡蘋果，你喜歡橘子的什麼？','你也不可以喜歡。'],answer:1,feedback:'可以有不同喜好，同時接著對方的主題問。'},
{kind:'dialogue',prompt:'練習回應小考前的緊張。',scenarioId:'classroom-04',feedback:'讓對方選擇聊聊或安靜，不逼問私人原因。'},
],task:'老師說一件今天的小事，學生可選主題圖卡、短句、提問或先聽；不要求眼神對視。'},
{title:'把球傳回去',skill:'問一點、分享一點，留給彼此',intro:'不用連續問很多題。說完一小段，留空間給對方，也能清楚表達自己。',demos:[{title:'問與分享輪流',lines:['阿哲：我最近練羽毛球。','樂樂：你在練發球嗎？','阿哲：對，還有點不穩。','樂樂：我剛學時也會打歪。你想再練還是先休息？']}],exercises:[
{kind:'choice',prompt:'「我自己剪貼了這張卡片。」哪個問題最相關？',options:['你用什麼紙做的？','你家住幾樓？','下週有幾節課？'],answer:0,feedback:'問卡片的材料，對方容易接著介紹。'},
{kind:'categorize',prompt:'「我上次也騎到河邊，看到很多白鷺鷥。」是哪類？',answer:2,feedback:'分享與騎車路線有關的自身經驗。'},
{kind:'sequence',prompt:'讓雙方輪流說一點。',lines:['同學說：「我在學新歌。」','你問：「哪一段比較難？」','同學回答：「副歌太快。」','你說：「我也會先放慢練習。」'],feedback:'問題接住主題；等對方回答，再分享相關經驗。'},
{kind:'compare',prompt:'同學在談畫畫，哪句分享更容易接上？',options:['我也喜歡畫動物，常畫小鳥。','我把昨天所有事情從頭講到尾。'],answer:0,feedback:'挑一小段相關經驗即可，不需要一次說完全部。'},
{kind:'choice',prompt:'你問了問題，對方還在想。可以怎麼做？',options:['再連續問三題。','停一下，讓他有時間想。','說他反應很慢。'],answer:1,feedback:'聊天不用計時，停頓也是溝通的一部分。'},
{kind:'choice',prompt:'同學說「我只想說書名，內容先不爆雷」。哪句尊重他？',options:['直接把結局說出來。','好，我先問書名就好。','要求他把全部講完。'],answer:1,feedback:'先接受分享範圍，不要求更多內容。'},
{kind:'sequence',prompt:'把相關提問與收尾接起來。',lines:['「我剛投進第一顆球！」','「你從哪個位置投的？」','「籃框旁邊；我想再練一次。」','「好，你先練，我在旁邊休息。」'],feedback:'提問後也要聽見新的需要，讓對方去做自己的事。'},
{kind:'dialogue',prompt:'在社團交換畫畫的想法。',scenarioId:'club-01',feedback:'提問和分享都可以；不同喜好也能輪流。'},
],task:'兩人自願選一個共同主題，每人說或指一件事；不想繼續時，練習說「先到這裡」。'},
{title:'聊天的收尾',skill:'聽見界線，安心結束',intro:'對方可以拒絕，你也可以休息。收尾不是失敗，是照顧雙方的時間與意願。',demos:[{title:'有事就先停下',lines:['子恩：車子快到了，我要準備上車。','阿晴：好，我先讓開，路上小心。','子恩：謝謝，下次再聊。']}],exercises:[
{kind:'choice',prompt:'「我只帶一包餅乾，想自己吃。」怎麼回應？',options:['好，你留著吃。','我想吃，你一定要分。','直接拿一片。'],answer:0,feedback:'食物的主人可以決定是否分享，接受拒絕就很好。'},
{kind:'sequence',prompt:'同學要回教室，怎麼自然結束？',lines:['聽到：「快打鐘，我要回教室。」','回應：「好，我知道了。」','說：「等等上課見。」','讓開路，讓彼此回教室。'],feedback:'收尾後也用行動留出空間，不繼續攔住對方。'},
{kind:'compare',prompt:'你累了，不想聊天。哪句能清楚表達？',options:['我想先休息，有空再說。','勉強聊到自己更累。'],answer:0,feedback:'你也有界線，可以短句、圖卡或輔助溝通表達。'},
{kind:'choice',prompt:'「我不想被拍照。」這時應該？',options:['說拍一張沒關係。','先停止拍攝並收起相機。','偷偷拍。'],answer:1,feedback:'明確拒絕就是停止的訊號，拍照要先得到同意。'},
{kind:'categorize',prompt:'「你先看書，我下課再問你有沒有空。」屬於哪類？',answer:3,feedback:'這是尊重現在的意願並收尾；下次也要重新確認。'},
{kind:'choice',prompt:'同學說今天想自己散步。可以怎麼做？',options:['每天問到他答應。','接受他的安排，自己選活動。','跟著他不離開。'],answer:1,feedback:'被拒絕不代表關係不好；雙方都能有自己的安排。'},
{kind:'compare',prompt:'對方不想談成績，哪句比較尊重？',options:['不說成績就不能聊天。','好，我們可以聊別的，也可以先休息。'],answer:1,feedback:'讓對方保有更換話題或停止的選擇。'},
{kind:'dialogue',prompt:'練習聽見「我想先安靜」。',scenarioId:'classroom-10',feedback:'給空間、接受暫停，就是適合的回應。'},
],task:'由老師示範三種收尾圖卡：「我要去做事」「我想休息」「下次再聊」。學生選擇適合自己的方式練習。'},
];
