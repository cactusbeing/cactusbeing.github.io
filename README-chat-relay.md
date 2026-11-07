# 社會技巧：聊天傳接球

Vue 3 + TypeScript + Vite 原創 2D 社會技巧教材，入口為 `/game/chat-relay/`；遊戲百寶箱的開放狀態沿用站台設定。

首頁以「立即開始」直接進入隨機三題，首次使用預設一般難度與即時回饋；「先看示範」提供一段三句對話，再直接開始。保留校園插畫與傳球動畫，適用對象、建議時間及免登入資訊可直接閱讀。教師說明、章節教材、續玩與練習偏好放在預設收合的「教師工具與說明」。沒有老師模式、匯入／匯出、貼紙或每日任務。

學生畫面一次聚焦一個任務：看／聽 NPC 台詞，選回答，再看角色反應及簡短教學回饋。可用 1／2／3 選畫面上的選項、Enter 前進；選項至少 56px 高，主要台詞桌面至少 24px、手機至少 22px。提示及換個回答保留為次要操作，示範及回上一句收在「更多協助」。最後一次反應直接進下一題，結算先呈現完成情境數及具體鼓勵，主按鈕「再玩三題」；能力分析與本次紀錄收合。
## 開啟與驗證

```sh
npm install
npm run dev
# 開啟終端機列出的 localhost URL，接 /game/chat-relay/

npm run typecheck
npm run test:chat-relay
npm run build
npm run preview
```

`npm run build` 會依序執行題庫／引擎測試、vue-tsc、Vite 與 `scripts/verify-build.mjs`。既有 GitHub Pages workflow 仍執行同一條 build，因此新教材驗證也會在 CI 執行。沒有另外 push 或部署。

有安裝 Cogpit `agent-browser` 時，可由主代理在共用 default 瀏覽器執行完整 UI 測試：

```sh
node --experimental-strip-types scripts/playtest-chat-relay.mjs http://127.0.0.1:4178/game/chat-relay/
```

預覽 port 需換成實際啟動值。此腳本會操作本機測試頁、產生練習紀錄，並將截圖與報告寫至 `/tmp/chat-relay-*`；不清除本機資料。加上 `--layout-only` 可只跑七種尺寸、大字、展開偏好、全螢幕與元素重疊檢查。包含實際 hover 前後的按鈕／文字座標、裁切及文字互相重疊檢查，另檢查設定保存、鍵盤操作及全螢幕名牌與腳部距離。

## 內容與玩法

- 共 **61 組完整情境**：41 組當面互動、10 組情緒訊息與貼圖、10 組網路交友。五個教學目標為社交距離與身體界線、開啟談話、延續談話、依情緒選訊息／貼圖，以及網路交友。
- 角色說生活短句，教學說明放在回饋區。開場情境讓學生先觀察再選招呼；需要調整的選項包含急著插話、想再多問一句、沒注意距離或誤讀語氣，避免只用誇張的命令當錯誤答案。
- 訊息模式標示與認識的同學或線上帳號聊天，可選文字或原創貓咪貼圖。同一張大笑貼圖在趣事與挫折情境有不同效果，不把貼圖硬套成固定正誤。這是本機模擬，不連接社群、不要求輸入真實個資。
- 本次四組先顯示 NPC 反應，一般回答只顯示短提示，需要調整才顯示完整提醒，情境結束整理本次技巧。其餘題目的回饋明確分為綠色「接得很好！」、「這樣回也可以！」及暖黃色「這句可以再調整」。回應合適時指出具體行為；需要調整時解釋影響、給可試的做法，並顯示「沒關係，可以換個回答再試試」。不把拒絕或簡短回應當成失敗。
- 正式題庫有 **310 個決策節點、920 個選項**。其中四組使用自然分支與不同回合長度，其他 57 組保留原有難度圖。完整文案與分支驗證方式見 [四組修正版](docs/chat-relay/four-dialogues.md)。
- 其餘 57 組沿用原有難度：Lv1 每個決策 2 選項、路徑 2 回合；Lv2 每個決策 3 選項、路徑 3 回合；Lv3 每個決策 3 選項、路徑 4 回合。start 的 0／2 與 1 走不同分支，再匯流；每個來源都須保持語意相容。
- 接受拒絕後可改為旁白與自己的行動，不要求角色繼續陪聊。身體與輔具的碰觸都要先問；網路情境可以先不加、不回、不開鏡頭，或找可信任的大人一起處理。
- 四章為「距離與身體界線」、「自然開啟談話」、「把話題接下去」、「訊息與網路交友」，共 30 個互動練習（6／8／8／8）。示範、比較、分類、排序、分支對話與生活任務皆保留；生活任務不自動評分。
- 結果依實際練到的技能呈現，不評眼神、反應速度、音量或是否一定接受邀請。

## 抽題與進度

`selectScenarioPool(settings, history, count, rng, bank)` 是可注入 PRNG 的純函式。依序優先未玩過、不在最近 12 題、最久未玩的情境，並以場景／角色／話題多樣性打破同層候選的平手；同局不重複。池不足回傳可用數及說明，不補重複題。測試驗證連續 20 局三題在前 60 題不重複。

首頁主要入口只有「立即開始」，次要入口為「先看示範」。既有儲存格式保留相容性；不會新建每日題組或貼紙獎勵。再次立即開始會開新三題，不跳出設定或確認步驟。

`cactus:chat-relay:v1:data` 儲存偏好、匿名本機進度、近期題目、完成章節及目前題組。每次選擇與換回合自動保存，重開首頁可在教師工具選擇繼續；章節對話中重新整理，也會恢復到對應章節練習。沒有姓名／診斷等輸入欄位，沒有上傳作答事件。

題庫內容版本已更新為 v2。`data/previousAnswers.ts` 保留 v1 作答的確切文字、反應、分級及分數供驗證，已完成紀錄、抽題歷史與偏好保留原樣。若未完成題組包含已改寫的舊作答，會提示重新開始這一組，避免從不同故事中間續接；未知或偽造資料仍拒絕讀取。

保留最近最多 100 場、約 1.9 MB 內的紀錄。讀取時檢查型別、版本、選項與實際圖路徑；損壞資料不會阻塞遊戲。儲存停用／已滿時保留記憶體中的遊戲並顯示不會保存的訊息。

## 語音、無障礙、離線

- 預設不出聲。朗讀只在操作後開始，使用裝置本機中文聲音，優先 zh-TW；沒有可用聲音時以文字繼續，不使用遠端 TTS。
- 原生按鈕、單選群組／勾選開關與清楚焦點、NPC 更新的 polite live、作答後焦點移交、三種文字大小、至少 56px 回答操作目標。分類與排序都不依賴拖曳。
- 一次性傳球／對話動畫為 200–320ms；系統與頁面「減少動態」皆可關閉非必要動畫。
- 全螢幕沿用既有 `useGameFullscreen`，支援原生及填滿視窗 fallback，退出會恢復捲動。
- 正式 build 產生只控制 `/game/chat-relay/` 的 Service Worker；初次連線完成快取後，核心文字、圖、教學與題庫可離線重新整理及作答。網站其他頁面、外連與裝置語音可用性不在離線保證內。

## 增加情境

在 `src/features/chat-relay/data/scenarios/` 對應場景檔新增 `story(StorySeed)`，並保持 ID 唯一。`author.ts` 只負責連接圖與衍生技能分數，不生成對話文字。

每筆需明寫 `start/a/b/extra/close` 與獨立 `easy` 兩步內容。Line 為 `[玩家文字, 專屬反應, 具體回饋, 技能或技能陣列, 分級?, 結局?, 原創貼圖種類?]`。start 選項 0／2 到 a，1 到 b，a、b 之後再銜接；因此要逐條檢查 a 的兩個來源及匯流節點都相容。旁白使用全形括號，介面會標為情境觀察。

修改後執行測試，並人工檢閱跨分支的前後語意，不能只依筆數計算交付量。每筆另需標示 `learningGoal`；訊息情境加上 `channel: 'message'`，線上暱稱可用 `partnerName`。貼圖只允許專案內的原創種類，不引用外部角色。新增 NPC／場景需同步更新 `data/manifest.ts` 與原創 SVG 元件。

## 主要檔案

- `game/chat-relay/index.html`、`src/app/chat-relay.ts`：實體入口與站台共用 shell。
- `src/features/chat-relay/ChatRelayApp.vue`、`chat-relay.css`：狀態流程、結果、偏好與場景介面。
- `components/LearningWorld.vue`、`StoryDemo.vue`、`LessonStudy.vue`：校園教學地圖與互動教材。
- `components/SceneArt.vue`、`CharacterArt.vue`、`PictureCue.vue`、`StickerArt.vue`：全部原創向量美術。
- `feedback.ts`：三種回饋的明確鼓勵標示。
- `data/scenarios/*.ts`、`data/lessons.ts`、`data/author.ts`、`data/manifest.ts`、`types.ts`：內容與模型。
- `engine/`、`services/storage.ts`、`services/speech.ts`：圖引擎、驗證、抽題、評分、本機保存及朗讀。
- `src/features/game-center/GameCenter.vue`、`vite.config.ts`、`scripts/verify-build.mjs`、`package.json`、`tsconfig.json`、`.gitignore`：既有架構與 CI 整合。
- `scripts/test-chat-relay.mjs`、`scripts/playtest-chat-relay.mjs`：單元／圖與瀏覽器測試。

驗收紀錄見 [docs/chat-relay-validation.md](docs/chat-relay-validation.md)。
