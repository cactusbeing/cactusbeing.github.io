import type { Scenario } from '../../types.ts';
import { story } from '../author.ts';

export const clubScenarios: Scenario[] = [
  story({
    id: "club-01", title: "朋友傳來新畫", sceneId: "club", npcId: "xiaomei", topic: "回應開心的分享", setting: "小莓傳來一張自己畫的狐狸，想跟你分享。", skillTags: ["ask_question","respond","empathy","share_related","respect_boundary","close_conversation"], learningGoal: "message_emotion", channel: "message",
    start: ["畫好了！這隻狐狸有翅膀，你看！", [
      ["好可愛！翅膀能做什麼？","牠會幫小刺蝟搧風！","你接著畫裡的細節問，讓小莓有話可以回。","ask_question"],
      ["貼圖：你好棒！","嘿嘿，我昨天畫好久。","這張開心的貼圖接住了小莓想分享的心情。","respond",undefined,undefined,"cheer"],
      ["貼圖：笑到打滾","你在笑我的畫嗎？","單獨傳大笑貼圖可能像在嘲笑，可以補一句你喜歡哪裡。","empathy","try_another",undefined,"laugh"],
    ]],
    a: ["我想畫牠們坐樹下，刺蝟最怕熱。", [
      ["刺蝟會拿冰吃嗎？","哈哈，這個可以畫！","小問題接著原來的故事，讓聊天繼續。","ask_question"],
      ["我以前畫過拿葉子當傘的兔子。","那跟我的狐狸可以住一起耶。","你分享相關作品，也留了空間讓小莓接話。","share_related"],
      ["把翅膀擦掉吧，狐狸又不會飛。","可是我就想畫有翅膀的。","創作可以是想像的，先問設定比直接要求改掉更好。","respect_boundary","try_another"],
    ]],
    b: ["還沒上色，現在只畫好線。", [
      ["我上次光畫線也弄很久。","對啊，擦來擦去超久。","你分享相近的經驗，接到她花時間畫圖的心情。","share_related"],
      ["你想用什麼顏色？","米白或淺橘，還在想。","你問的是她正在做的事，容易接著聊。","ask_question"],
      ["先別講，我傳十張我的圖給你。","等一下，我還在講狐狸耶。","先回應朋友的分享，再問要不要看你的作品。","respect_boundary","try_another"],
    ]],
    extra: ["顏色還沒決定，有點選不出來。", [
      ["想先試哪兩個？","米白跟淺橘，先塗一小塊看看。","你讓小莓說自己的想法，沒有替她決定。","ask_question"],
      ["我有個配色想法，你想聽嗎？","好啊，說來聽聽。","給建議之前先問，讓對方能選擇。","respect_boundary"],
      ["我幫你決定，就整張黑色。","可是我不想塗黑啊。","可以提供想法，最後仍由畫圖的人決定。","respect_boundary","try_another"],
    ]],
    close: ["我先去吃飯，顏色明天再想。", [
      ["好，明天想給我看再傳。","好啊，吃完再看看。","你有興趣，也讓小莓自己選何時分享。","close_conversation","effective","extended"],
      ["貼圖：掰掰","掰，明天見。","簡短道別也能好好結束聊天。","close_conversation","acceptable","brief","wave"],
      ["別下線啦，現在畫完給我看。","我餓了，要先吃飯。","朋友有自己的行程，先讓她離開，不催作品。","respect_boundary","try_another","repair"],
    ]],
    easy: [["我的狐狸畫好了！", [
      ["貼圖：你好棒！","謝謝！我畫了好久。","開心的貼圖能回應朋友的好消息。","respond",undefined,undefined,"cheer"],
      ["貼圖：笑到打滾","你在笑我的畫嗎？","大笑可能被看成嘲笑，可以換成鼓勵或補上文字。","empathy","try_another",undefined,"laugh"],
    ]], ["我要先去吃飯了。", [
      ["貼圖：掰掰","掰，明天見。","讓朋友先去吃飯，簡短道別就很好。","close_conversation",undefined,undefined,"wave"],
      ["現在畫完再走啦。","我想先吃飯。","對方要離開時，可以留到下次再聊。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-02", title: "練歌不順的訊息", sceneId: "club", npcId: "lele", topic: "用文字與貼圖安慰", setting: "樂樂傳訊息說練歌一直唱錯，你想回覆他。", skillTags: ["ask_question","empathy","respect_boundary","share_related","close_conversation","respond"], learningGoal: "message_emotion", channel: "message",
    start: ["今天那兩句一直唱錯，有點煩。", [
      ["是哪兩句？你想講嗎？","副歌太長，一直來不及換氣。","你先問他想不想說，沒有急著叫他重練。","ask_question"],
      ["貼圖：拍拍，陪著你","謝啦，我先坐一下。","安慰的貼圖符合他現在有點挫折的心情。","empathy",undefined,undefined,"comfort"],
      ["貼圖：笑到打滾","我現在沒在開玩笑耶。","他正在煩惱，大笑容易讓他覺得被取笑，可以改傳安慰。","empathy","try_another",undefined,"laugh"],
    ]],
    a: ["我想先分兩段練，不然越唱越亂。", [
      ["要我聽你唱一小段嗎？","好，晚點傳你，不用現在。","你先詢問，也接受他晚點再分享。","respect_boundary"],
      ["我練直笛也會拆成半句。","喔，我也試試這樣。","相關經驗能讓樂樂知道不只他會卡住。","share_related"],
      ["你現在錄十次，我幫你挑。","我不想一直錄耶。","提供幫忙也要看對方的意願，不增加他的壓力。","respect_boundary","try_another"],
    ]],
    b: ["喉嚨也有點乾，我先喝水。", [
      ["好，先不唱了，休息一下。","嗯，謝啦。","你接住了他想休息的需要。","respect_boundary"],
      ["我也去裝水，晚點再看訊息。","好，等等聊。","你說明自己的安排，沒有催他立刻回。","share_related"],
      ["我幫你計時，五分鐘後就要唱。","我想休息多久自己決定。","休息不用被計時，讓他照自己的感覺安排。","respect_boundary","try_another"],
    ]],
    extra: ["明天老師會教換氣，我先等明天。", [
      ["先聽老師示範再試？","對，我想看他在哪裡換氣。","你接著明天的安排問，讓他能說自己的打算。","ask_question"],
      ["我也想知道哪裡能換氣。","明天一起聽看看。","分享相關的好奇，不要求他現在表現。","share_related"],
      ["明天一定要一次唱好喔。","我還不知道會不會耶。","練習可以慢慢來，鼓勵不需要加上必須成功的條件。","respect_boundary","try_another"],
    ]],
    close: ["我先不看手機了，想休息。", [
      ["好，休息吧，晚點再聊。","嗯，謝謝。","你讓樂樂能放心暫停訊息。",["close_conversation","respect_boundary"],"effective","respectful_close"],
      ["貼圖：收到，慢慢來","謝啦，晚點見。","短貼圖表示收到，也不用他再解釋。","respond","acceptable","brief","wait"],
      ["我再傳一個影片，你看完才休息。","我現在不想看了耶。","他已說想停，影片可以等他有空再問。","respect_boundary","try_another","repair"],
    ]],
    easy: [["一直唱錯，有點煩。", [
      ["貼圖：拍拍，陪著你","謝謝，我先休息。","安慰貼圖回應了他的挫折。","empathy",undefined,undefined,"comfort"],
      ["貼圖：笑到打滾","我現在笑不出來耶。","朋友正在煩惱，可以換成安慰的貼圖。","empathy","try_another",undefined,"laugh"],
    ]], ["我先不看手機，休息一下。", [
      ["好，晚點聊。","嗯，謝謝。","你有讓朋友暫停的空間。","close_conversation"],
      ["先看完我傳的影片。","我現在不想看了。","對方要休息時，先停止傳新內容。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-03", title: "模型又倒了", sceneId: "club", npcId: "zien", topic: "先聽感受再提供幫忙", setting: "阿哲傳來倒掉的紙模型照片，說他弄了很久。", skillTags: ["ask_question","empathy","respect_boundary","share_related","close_conversation"], learningGoal: "message_emotion", channel: "message",
    start: ["模型又倒了，白做一下午。", [
      ["哪邊倒了？想給我看嗎？","屋頂那邊，一放上去就歪。","你先了解發生什麼事，沒有直接說他做不好。","ask_question"],
      ["弄那麼久又倒，真的會煩。","對，我現在不太想碰它。","你回應他的失望，讓他知道有人在聽。","empathy"],
      ["貼圖：笑到打滾","這不好笑啦，我做很久耶。","大笑和他現在的心情不合，可以換成安慰。","empathy","try_another",undefined,"laugh"],
    ]],
    a: ["屋頂一直歪，我還沒想好怎麼弄。", [
      ["你想聽我的想法，還是先休息？","晚點再聽，我先停一下。","先問需不需要建議，也接受他現在不想聽。","respect_boundary"],
      ["是紙太軟，還是底下沒黏住？","可能是底下，剛剛有翹起來。","你問具體情況，讓他能接著說。","ask_question"],
      ["我叫你現在重做，照我的弄。","我現在不想重做。","可以分享方法，但不能替對方決定何時重做。","respect_boundary","try_another"],
    ]],
    b: ["一下午都在黏，結果還是站不住。", [
      ["最麻煩的是哪個地方？","屋頂，剛黏好又滑下來。","相關的小問題幫他把事情說清楚。","ask_question"],
      ["我上次做紙橋也一直塌。","真的喔，原來不只我。","你分享相近的經驗，陪他說說不順利的地方。","share_related"],
      ["算了，你就是不適合做這個。","我只是這次還沒弄好。","一次失敗不代表沒有能力，可以回應這次的困難。","empathy","try_another"],
    ]],
    extra: ["我想先把它放旁邊，等膠乾了再看。", [
      ["好，先讓它放著。","嗯，我也休息一下。","你配合他現在的打算，沒有催他繼續。","respect_boundary"],
      ["晚點還想聊再叫我？","好啊，到時再說。","你保留陪伴的選項，也讓他自己決定。","ask_question"],
      ["我每五分鐘問一次倒了沒。","先不要一直問啦。","關心不用一直追問，讓對方有自己的時間。","respect_boundary","try_another"],
    ]],
    close: ["我要去洗手了，手機先放著。", [
      ["好，晚點見。","嗯，謝啦。","你接住他要離開的訊息，自然收尾。","close_conversation","effective","respectful_close"],
      ["明天你想說再聊。","好，明天再看看。","你留了下次的機會，也沒有要求一定要報告結果。","close_conversation","effective","extended"],
      ["先把你做的全部拍給我。","現在不拍了，我先去洗手。","對方要停時，先不追加照片或說明的要求。","respect_boundary","try_another","repair"],
    ]],
    easy: [["模型倒了，好失望。", [
      ["貼圖：拍拍，陪著你","謝謝，我做很久耶。","你回應了朋友難過的心情。","empathy",undefined,undefined,"comfort"],
      ["倒了很好笑耶。","我現在不覺得好笑。","可以改成安慰，讓朋友知道你在聽。","empathy","try_another"],
    ]], ["我想先休息。", [
      ["好，晚點再聊。","嗯，謝謝。","你讓朋友能先休息。","close_conversation"],
      ["現在重做給我看。","我現在不想做。","對方想停時，就把建議留到之後。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-04", title: "看完故事有點悶", sceneId: "club", npcId: "xiaoyu", topic: "回應難過，不急著玩笑", setting: "子恩看完原創動畫《雲島郵差》，傳來一段感想。", skillTags: ["ask_question","respect_boundary","empathy","share_related","close_conversation","respond"], learningGoal: "message_emotion", channel: "message",
    start: ["看完最後一集了，心裡有點悶。", [
      ["想說哪一段？怕爆雷也可以先不說。","我想講最後告別那段，可以嗎？","你邀請他分享，也讓他自己決定範圍。",["ask_question","respect_boundary"]],
      ["你說有點悶，是看完還在想嗎？","對，兩個角色最後沒一起走。","你確認他的感受，沒有急著猜他為什麼難過。","empathy"],
      ["貼圖：笑到打滾","我是有點難過，不是好笑啦。","這時的大笑可能像嘲笑，先用文字或安慰貼圖接住心情。","empathy","try_another",undefined,"laugh"],
    ]],
    a: ["他們都想留下，可是最後還是分開了。", [
      ["哪個地方讓你最難過？","把信交出去那一幕。","你接著故事問，讓他能把感受說完。","ask_question"],
      ["我上次看告別的故事也悶很久。","原來你也會喔。","分享相關感受，讓對方知道不只自己會這樣。","share_related"],
      ["只是動畫，別想那麼多。","可是我還是會在意啊。","即使自己沒有同感，也能接受朋友真的會難過。","empathy","try_another"],
    ]],
    b: ["明明是動畫，我看完還一直想那兩個人。", [
      ["我也會把故事想很久。","對，停不下來。","說自己的解讀，讓對方能比較感受。","share_related"],
      ["你最記得誰？","送信的那個，他最後自己走了。","問他記得的角色，就能接著原本的話題。","ask_question"],
      ["你想太多了，快點開心。","我現在沒辦法馬上開心。","情緒不一定能立刻切換，可以先陪他說說。","empathy","try_another"],
    ]],
    extra: ["先不要傳結局梗圖，我還在消化。", [
      ["好，那先不傳。你想講我再聽。","嗯，謝謝你。","你有聽見不想看梗圖的需要。","respect_boundary"],
      ["我也有看完想安靜一下的時候。","對，我先緩一下。","你分享相關經驗，沒有催他改變心情。","share_related"],
      ["很好笑啦，你看完就沒事了。","我現在真的不想看。","即使自己覺得有趣，也先接受對方不想看的選擇。","respect_boundary","try_another"],
    ]],
    close: ["我先關掉螢幕，出去走一走。", [
      ["好，之後想聊角色再找我。","嗯，下次聊。","你讓對方先離開，也保留之後分享的空間。","close_conversation","effective","extended"],
      ["貼圖：慢慢來","謝啦。","溫和的貼圖能表示收到，不用他再回長訊息。","respond","acceptable","brief","wait"],
      ["先把結局講清楚才能走。","我想先休息，晚點再說。","想多知道故事，也不能要求對方一直解釋。","respect_boundary","try_another","repair"],
    ]],
    easy: [["看完故事，有點難過。", [
      ["貼圖：拍拍，陪著你","謝謝，我還在想結局。","安慰貼圖接住了難過的心情。","empathy",undefined,undefined,"comfort"],
      ["貼圖：笑到打滾","我沒有覺得好笑耶。","可以換成安慰，避免像在取笑對方。","empathy","try_another",undefined,"laugh"],
    ]], ["我想先關掉螢幕。", [
      ["好，晚點聊。","嗯，謝謝。","你接受朋友想暫停的需要。","close_conversation"],
      ["我再傳幾張梗圖。","我現在不想看。","朋友已說不想看，先不再傳新內容。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-05", title: "破關的好消息", sceneId: "club", npcId: "azhe", topic: "祝賀朋友，不比較高下", setting: "阿哲在遊戲群組告訴你，他終於過了一直卡住的關卡。", skillTags: ["respond","ask_question","share_related","listen","respect_boundary","close_conversation"], learningGoal: "message_emotion", channel: "message",
    start: ["過了過了！昨天卡住那關終於過了！", [
      ["太好了！後來怎麼過的？","我發現地上有箭頭，照著走就過了。","你先祝賀，再接著問過關方法。",["respond","ask_question"]],
      ["貼圖：你做到了！","嘿嘿，重來好多次耶。","慶祝貼圖符合朋友興奮的心情。","respond",undefined,undefined,"cheer"],
      ["這關我早就過了。","我知道，可是我剛剛才過啊。","朋友在分享自己的進步，先祝賀比比較誰快更容易聊。","respond","try_another"],
    ]],
    a: ["箭頭很淡，我之前一直沒注意。", [
      ["你怎麼發現的？","停下來看地板才看到。","沿著解法問細節，接住對方的資訊。","ask_question"],
      ["我也常常漏看地上的提示。","對啊，我一直看上面。","分享功能相近的經驗。","share_related"],
      ["所以你靠外掛過的喔。","不是啦，是遊戲裡本來的箭頭。","先聽清楚方法，不把提示誤認成作弊。","listen","try_another"],
    ]],
    b: ["每次快到終點又掉下去，超氣。", [
      ["我也卡過，最後過了很爽。","對，真的鬆一口氣。","回答問題並保持在休息策略上。","share_related"],
      ["最後一次有做哪裡不一樣？","我先停下來看箭頭，沒一直亂跑。","你問具體差別，讓朋友能說過程。","ask_question"],
      ["先別講，我要開始講我的紀錄。","可以等我講完這次嗎？","先回應朋友這段分享，再輪到自己的故事。","respect_boundary","try_another"],
    ]],
    extra: ["我想先記一下，不然下次又忘。", [
      ["想記哪個地方？","第二個轉角的箭頭最容易漏。","問記錄方法，延伸解謎經驗。","ask_question"],
      ["我也會截自己的重點。","對，這樣下次比較好找。","學習相關策略，不要求照抄對方。","share_related"],
      ["別記了，現在陪我再打一場。","我想先寫完耶。","朋友想先記錄，可以讓他完成再邀請。","respect_boundary","try_another"],
    ]],
    close: ["我先記攻略，訊息晚點回。", [
      ["好，寫完再聊。","嗯，謝啦。","你接受他晚點回訊息，沒有要求一直在線上。",["close_conversation","respect_boundary"],"effective","respectful_close"],
      ["貼圖：收到","好喔。","短貼圖就能表示知道了。","respond","acceptable","brief","wait"],
      ["現在回我，不要先寫。","我想先記，不然會忘。","聊天不需要即時回覆，可以把對方要做的事放前面。","respect_boundary","try_another","repair"],
    ]],
    easy: [["我終於過關了！", [
      ["貼圖：你做到了！","謝謝！重來好幾次。","慶祝貼圖回應了朋友的開心。","respond",undefined,undefined,"cheer"],
      ["我早就過了，有什麼。","可是我現在很開心耶。","先回應他的好消息，不用比誰比較快。","respond","try_another"],
    ]], ["我要先記過關方法。", [
      ["好，寫完再聊。","嗯，等等見。","你讓朋友先完成自己的事。","respect_boundary"],
      ["先回我的訊息啦。","我想先寫，不然忘了。","訊息可以稍後再回，不需要催著立刻聊天。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-06", title: "小豆芽倒下了", sceneId: "club", npcId: "chenchen", topic: "分辨想被聽見和想要建議", setting: "晨晨照顧的豆芽倒了，她傳訊息給你。", skillTags: ["ask_question","share_related","empathy","listen","respect_boundary","close_conversation"], learningGoal: "message_emotion", channel: "message",
    start: ["我的豆芽倒了，葉子都軟軟的。", [
      ["你今天才看到的嗎？","對，昨天還好好的。","你接著她的觀察問，沒有先怪她不會照顧。","ask_question"],
      ["我之前的地瓜葉也突然垂下來。","真的喔？我有點擔心它。","相關經驗讓她知道你聽懂了擔心。","share_related"],
      ["貼圖：笑到打滾","我怕它死掉，不好笑耶。","她正在擔心植物，可以換成安慰而不是大笑。","empathy","try_another",undefined,"laugh"],
    ]],
    a: ["昨天還站著，今天就歪一邊了。", [
      ["葉子有變顏色嗎？","還是綠的，可是沒什麼精神。","你問具體看到的事，讓她能繼續說。","ask_question"],
      ["我的地瓜葉也有過突然倒下的時候。","原來也會這樣喔。","你分享相近經驗，沒有保證一定能恢復。","share_related"],
      ["你說已經長得很高了對吧？","不是，是整株垂下來了。","先確認她說的是倒下，不是長高；沒聽清楚可以再問。","listen","try_another"],
    ]],
    b: ["我本來每天都要看一下，今天好失望。", [
      ["我之前種的沒成功，也會失望。","對，因為我每天都在等它長。","你接住她花心思照顧的感受。","share_related"],
      ["我沒種成功過，還在學。","我也是，還不知道哪裡沒弄好。","說自己的經驗就好，不需要裝成什麼都懂。","share_related"],
      ["這有什麼，別再講了。","可是我照顧好多天耶。","對方在意的事可以和你不同，先讓她說完。","empathy","try_another"],
    ]],
    extra: ["我知道可以問老師，現在只是想講一下。", [
      ["好，我先聽你說。","謝啦，我剛剛真的很悶。","你聽懂她目前想被聽見，而不是立刻要方法。","empathy"],
      ["那晚點想問方法時再問？","嗯，明天帶去問老師。","你確認她的安排，也沒有替她決定。","ask_question"],
      ["我先傳十種救法，你全部試。","我現在看不下那麼多耶。","建議可以先問需不需要，不一次塞很多方法。","respect_boundary","try_another"],
    ]],
    close: ["我先把它放好，明天再問老師。", [
      ["好，明天想講結果再告訴我。","嗯，謝謝你聽我說。","你留下分享的機會，沒有要求必須報告。","close_conversation","effective","extended"],
      ["貼圖：慢慢來","謝啦，我先收手機。","溫和的貼圖表示支持，也讓對方能結束聊天。","close_conversation","effective","respectful_close","wait"],
      ["你現在一定要把它救活。","我不知道怎麼弄，想等老師看。","不用把結果當成對方必須完成的任務。","respect_boundary","try_another","repair"],
    ]],
    easy: [["豆芽倒了，我有點難過。", [
      ["貼圖：拍拍，陪著你","謝謝，我種了好幾天。","安慰貼圖符合朋友現在的心情。","empathy",undefined,undefined,"comfort"],
      ["貼圖：笑到打滾","我現在不覺得好笑。","可以換成安慰，讓朋友感覺被聽見。","empathy","try_another",undefined,"laugh"],
    ]], ["我先收手機，明天再問老師。", [
      ["好，明天再聊。","嗯，謝謝。","你讓朋友能先做自己的事。","close_conversation"],
      ["現在一直拍給我看。","我先不拍了。","對方要停時，就先不追加照片要求。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-07", title: "狗狗藏玩具", sceneId: "club", npcId: "aqing", topic: "回應幽默，也尊重照片界線", setting: "阿晴傳來家裡狗狗找不到玩具的趣事。", skillTags: ["ask_question","share_related","listen","empathy","respond","respect_boundary","close_conversation"], learningGoal: "message_emotion", channel: "message",
    start: ["我家狗把玩具推進沙發底下，自己還傻住。", [
      ["哈哈，後來拿到了嗎？","沒有，牠趴在旁邊一直看我。","你笑的是她分享的趣事，也接著問後來怎麼了。","ask_question"],
      ["我看過狗用鼻子一直推球。","對，牠越推越裡面！","相關的小經驗能接上她的故事。","share_related"],
      ["你把狗塞進沙發底下喔？","不是啦，是玩具在下面。","聽清楚是什麼東西進去，沒懂可以問一次。","listen","try_another"],
    ]],
    a: ["後來我拿長尺，把玩具撥出來。", [
      ["牠拿到之後呢？","咬著就跑，這次跑很遠。","你接著事情發展問，讓她能說完故事。","ask_question"],
      ["我撿橡皮擦也用過長尺。","對，手伸不進去的時候超好用。","相關經驗也能成為聊天的下一句。","share_related"],
      ["你就把狗罵一頓啊。","牠只是拿不到玩具，不用罵吧。","先了解情況，不急著用責怪接話。","empathy","try_another"],
    ]],
    b: ["越推越遠以後，牠就趴著看玩具。", [
      ["牠是不是在等你幫忙？","可能吧，反正一直看我。","用問的留下不確定，不把猜測當成事實。","ask_question"],
      ["貼圖：笑到打滾","哈哈，我看到也笑出來。","這裡是她主動分享的趣事，大笑貼圖有接到心情。","empathy",undefined,undefined,"laugh"],
      ["狗這樣就是生氣了。","我也不知道耶，只看到牠趴著。","一個動作不一定代表固定情緒，可以多聽一點。","listen","try_another"],
    ]],
    extra: ["沒拍照，我只畫了玩具躲在哪裡。", [
      ["玩具在你畫的哪個角落？","沙發腳後面，最難拿那邊。","你配合她願意分享的方式。","ask_question"],
      ["用畫的也看得懂耶。","對，我還畫了牠推的箭頭。","你回應了她提供的圖，不要求一定要照片。","respond"],
      ["沒照片我不信，現在拍你家。","我不想拍家裡啦。","聊天不需要用家裡照片證明，先尊重她不想拍。","respect_boundary","try_another"],
    ]],
    close: ["狗又叼球過來，我先去陪牠玩。", [
      ["好，去吧，剛剛真的滿好笑。","哈哈，晚點聊。","你回應故事，也讓她去做自己的事。","close_conversation","effective","respectful_close"],
      ["貼圖：掰掰","掰掰。","一張道別貼圖就能清楚收尾。","close_conversation","acceptable","brief","wave"],
      ["先把家裡都拍完再去。","不要啦，我先去玩。","對方沒有同意拍照，就不反覆要求。","respect_boundary","try_another","repair"],
    ]],
    easy: [["狗把球推進沙發下，愣住了。", [
      ["貼圖：笑到打滾","我看到也笑了，牠好呆。","朋友在分享趣事，這張貼圖接住了開心。","empathy",undefined,undefined,"laugh"],
      ["你把狗塞進去了？","不是，是球滾進去。","聽不清楚時，可以確認誰做了什麼。","listen","try_another"],
    ]], ["我去陪狗玩，晚點聊。", [
      ["貼圖：掰掰","掰掰。","道別後讓朋友離開就很好。","close_conversation",undefined,undefined,"wave"],
      ["先拍你家每個地方。","我不想拍家裡。","接受對方不想分享照片的選擇。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-08", title: "已讀但還沒回", sceneId: "club", npcId: "zien", topic: "訊息等待與彼此的時間", setting: "你傳了訊息，子恩已讀。過了一會兒，他回覆你。", skillTags: ["respect_boundary","close_conversation","listen","respond"], learningGoal: "message_emotion", channel: "message",
    start: ["剛剛在看書，晚點回你喔。", [
      ["貼圖：收到，慢慢來","謝啦，我看完這章再說。","你用貼圖表示收到，也接受對方晚點回。",["respect_boundary","close_conversation"],undefined,undefined,"wait"],
      ["我也先做自己的事。","好，晚點聊。","你安排自己的時間，沒有守著訊息等待。","respect_boundary"],
      ["都已讀了，為什麼不馬上回？","我剛只看了一下，還想看書。","已讀不等於有空聊天，可以先等對方方便。","respect_boundary","try_another"],
    ]],
    a: ["（子恩繼續看書，對話暫時沒有新訊息。）", [
      ["把手機放下，先做作業。","（你寫了一題，沒有再催訊息。）","你讓彼此都有自己的時間。","respect_boundary"],
      ["先去選一本自己想看的書。","（你開始看書，不再盯著已讀。）","把注意力放回自己的活動，也能照顧等待時的不安。","close_conversation"],
      ["連傳「在嗎」「在嗎」「回我」。","我還在看書，先不要一直傳。","反覆傳送會增加壓力，一則說明就夠了。","respect_boundary","try_another"],
    ]],
    b: ["（你放下手機，過一會兒又想到剛剛的訊息。）", [
      ["提醒自己，他剛說在看書。","（你繼續做原本的事。）","你有把對方說過的安排記在心裡。","listen"],
      ["有事先記著，等他有空再說。","（你把想問的事記下來。）","問題可以先留著，不一定要現在傳。","respect_boundary"],
      ["傳「不回就是不想當朋友」。","不是啦，我真的在看書。","沒有即時回覆，不代表不喜歡你；可以先等。","respect_boundary","try_another"],
    ]],
    extra: ["（手機跳出通知，是系統提醒，不是子恩。）", [
      ["繼續手邊的事，不用一直查看。","（你做完了一小段作業。）","你不用為了等訊息一直停下自己的活動。","respond"],
      ["把通知暫時關小聲。","（手機安靜下來，你比較能專心。）","你可以用適合自己的方式安排查看訊息的時間。","respect_boundary"],
      ["傳一張生氣貼圖，催他快回。","我看到會有點壓力，晚點再說。","生氣貼圖可能讓等待變成催促，可以先不傳。","respect_boundary","try_another"],
    ]],
    close: ["（到了你準備收手機的時間，子恩還沒回。）", [
      ["先收手機，有空再看。","（你照自己的時間休息，訊息留到之後。）","你也能自己決定下線時間，不必一直等。",["close_conversation","respect_boundary"],"effective","respectful_close"],
      ["留一句「我先下線，明天聊」。","（你送出簡短道別，收好手機。）","說明自己的安排就足夠，不要求對方立刻回應。","close_conversation","acceptable","brief"],
      ["一直傳到他回為止。","我今天先不聊了，明天再說。","對方沒有空就先停，聊天不用靠反覆訊息留住人。","respect_boundary","try_another","repair"],
    ]],
    easy: [["我在看書，晚點回。", [
      ["貼圖：收到，慢慢來","謝啦，晚點聊。","這張貼圖表示收到，也接受對方晚點回。","respect_boundary",undefined,undefined,"wait"],
      ["現在就回我。","我還想先看書。","已讀不代表有空，先讓對方忙。","respect_boundary","try_another"],
    ]], ["（過了一會兒，子恩還沒有回覆。）", [
      ["先做自己的事。","（你放下手機，去做別的事。）","你留了等待的空間，也照顧自己的時間。","respect_boundary"],
      ["連傳好幾個生氣貼圖。","我看到會有點壓力。","先停下催促，等對方有空再聊。","respect_boundary","try_another","repair"],
    ]]],
  }),
  story({
    id: "club-09", title: "「隨便」是什麼意思", sceneId: "club", npcId: "lele", topic: "文字語氣不清楚時先確認", setting: "你和樂樂用訊息討論社團要播的歌。", skillTags: ["share_related","respect_boundary","ask_question","listen","close_conversation"], learningGoal: "message_emotion", channel: "message",
    start: ["隨便，你選。", [
      ["我想選鼓聲多一點的，你可以嗎？","可以啊，我都能聽。","你說自己的想法，也確認對方的意思。",["share_related","respect_boundary"]],
      ["你是都可以，還是今天不想選？","我今天選不出來，你挑就好。","你直接問清楚，沒有只靠兩個字猜情緒。","ask_question"],
      ["你在生氣喔？不想聊就算了。","沒有啊，我是真的都可以。","文字看不到表情，先問比直接判定生氣更清楚。","listen","try_another"],
    ]],
    a: ["鼓聲的也行，我自己比較常聽慢歌。", [
      ["好，那今天選這首，下次換你。","好啊，下次我找鋼琴的。","你尊重不同喜好，也給彼此分享的機會。","respect_boundary"],
      ["慢歌是聽起來比較放鬆嗎？","對，寫作業時會放。","你接著喜好問，沒有爭哪一種比較好。","ask_question"],
      ["慢歌很無聊，你別再聽了。","可是我聽了滿舒服的。","可以不喜歡同一種音樂，也不要求對方改喜好。","respect_boundary","try_another"],
    ]],
    b: ["我剛剛只是在找歌，沒有不開心。", [
      ["喔，我有時也只回很短。","對啊，打字有時候就懶。","分享自己使用音樂的情境。","share_related"],
      ["那你想聽有歌詞還是沒歌詞的？","沒歌詞的也好，比較不會跟唱。","你確認之後回到原本的選歌話題。","ask_question"],
      ["你一定是在裝沒事。","我真的沒有生氣啦。","對方已說明意思，可以先接受，不繼續替他判定情緒。","listen","try_another"],
    ]],
    extra: ["如果只回「好」，你也會以為我不高興嗎？", [
      ["有時候會，不確定我再問你。","好啊，問一下就知道了。","不確定時先確認，比用猜的更容易理解。","ask_question"],
      ["我也會只打「好」，沒有別的意思。","喔，那我們可能都會這樣。","你分享自己的用法，也知道別人可能不同。","share_related"],
      ["有句號一定就是生氣。","可是我平常就會打句號耶。","標點或貼圖沒有每個人通用的固定意思，要看情境或詢問。","listen","try_another"],
    ]],
    close: ["歌選好了，我先去洗澡。", [
      ["貼圖：掰掰","嗯，晚點見。","道別貼圖能表示收到，讓對方先去忙。","close_conversation","effective","respectful_close","wave"],
      ["下次換你挑慢歌。","好啊，我來找找。","留下下次可聊的主題，不要求現在繼續。","close_conversation","effective","extended"],
      ["你先保證沒有生氣才能走。","我真的沒生氣，要先去洗澡了。","確認過就先接受，不用反覆要求保證。","respect_boundary","try_another","repair"],
    ]],
    easy: [["都可以，你選。", [
      ["你是真的都可以嗎？","對，你挑就好。","不確定語氣時，直接問清楚。","ask_question"],
      ["你一定在生氣。","沒有，我只是選不出來。","短訊息不一定是生氣，先確認比較準確。","listen","try_another"],
    ]], ["我先去洗澡。", [
      ["貼圖：掰掰","掰掰。","簡短道別就能讓對方去忙。","close_conversation",undefined,undefined,"wave"],
      ["說清楚是不是生氣再走。","我沒生氣，先去洗澡啦。","對方說明過了，可以先接受。","respect_boundary","try_another"],
    ]]],
  }),
  story({
    id: "club-10", title: "貼圖傳錯時機", sceneId: "club", npcId: "xiaoyu", topic: "理解影響並修復誤會", setting: "在社團練習群組，小宇說作品壞了。你剛傳出一張大笑貼圖，小宇私訊你。", skillTags: ["ask_question","empathy","respect_boundary","close_conversation","respond"], learningGoal: "message_emotion", channel: "message",
    start: ["我作品壞了，你剛那張是在笑我嗎？", [
      ["你是看到那張大笑貼圖不舒服嗎？","對，我以為你在笑我弄壞。","你先確認讓對方不舒服的是什麼。","ask_question"],
      ["抱歉，我選錯了，不是在笑你。","喔，我看到真的有點難過。","你說明本意，也承認那張貼圖造成的感受。","empathy"],
      ["想太多了吧，一張貼圖而已。","可是我看了真的不舒服。","不是故意也可能讓人難過，可以先聽見對方的感受。","empathy","try_another"],
    ]],
    a: ["我做很久，看到大笑就更悶了。", [
      ["懂了，那張真的不太適合。","嗯，謝謝你有聽。","你有看見貼圖在這個情境下帶來的影響。","empathy"],
      ["你想講壞掉哪裡，還是先不講？","我想先放著，晚點再說。","你讓對方選擇要不要繼續聊。","respect_boundary"],
      ["我再傳一次，你就知道我在開玩笑。","先不要，我不想再看那張。","對方已說不舒服，就不再用同一張貼圖試他反應。","respect_boundary","try_another"],
    ]],
    b: ["我知道你不是故意，可是剛剛真的會誤會。", [
      ["對不起，下次我先看清楚訊息。","好，那這次就算了。","你提出自己能調整的做法，不要求對方立刻開心。","empathy"],
      ["你現在想我陪你聊一下嗎？","先不用，我想休息。","你詢問需要，也接受不想聊。","ask_question"],
      ["都說不是故意了，你還要怎樣？","我只是想講我看了怎麼想。","說明本意後，也留空間聽對方的感受。","respect_boundary","try_another"],
    ]],
    extra: ["今天先不要拿作品開玩笑，好嗎？", [
      ["好，我改用文字說。","嗯，這樣我比較知道你的意思。","你有依照對方的需要調整說法。","respect_boundary"],
      ["我知道了，今天不開這個玩笑。","謝啦。","你有聽見這次的界線，沒有繼續測試。","respect_boundary"],
      ["我覺得好笑，想傳就傳啊。","那我今天先不看訊息了。","自己的本意不能取代對方的感受，尊重他不想看的選擇。","respect_boundary","try_another"],
    ]],
    close: ["我先收手機，作品明天再弄。", [
      ["好，明天見。","明天見。","你讓誤會有個收尾，也留給對方休息。","close_conversation","effective","respectful_close"],
      ["貼圖：慢慢來","謝啦。","溫和的貼圖沒有再拿作品開玩笑。","respond","acceptable","brief","wait"],
      ["你先說不生氣了才能下線。","我現在想休息，明天再說。","道歉不需要交換對方立刻原諒或安撫，先讓他離開。","respect_boundary","try_another","repair"],
    ]],
    easy: [["你剛剛的大笑貼圖讓我難過。", [
      ["抱歉，我選錯了，不是在笑你。","喔，下次先不要傳那張。","你有說明，也聽見對方的不舒服。","empathy"],
      ["你想太多了。","可是我真的會難過耶。","可以先聽見感受，不急著說對方不該在意。","empathy","try_another"],
    ]], ["今天先別拿作品開玩笑。", [
      ["好，我不再傳那張。","謝謝，我先休息。","你用停止傳送來尊重他的界線。","respect_boundary"],
      ["再傳一次大笑貼圖。","我真的不想再看了。","對方已說不舒服，就停止，而不是再試一次。","respect_boundary","try_another","repair"],
    ]]],
  }),
];
