# 社會技巧：聊天傳接球

Vue 3 + TypeScript + Vite 原創 2D 社會技巧教材，入口為 `/game/chat-relay/`，並已加入 `/game/`。

本次依使用者後續指示調整原規格：**實戰演練直接開始三題；移除老師設定、固定課堂題組、匯入／匯出、我的貼紙與今日三題；嵌在特教百寶袋共用頁首下方；提供全螢幕；刪除「免登入／不限時」那行文案。** 主選單採校園背景、原創圖示與具有按壓層次的圓角按鈕，標示「實戰演練」；角色長髮在身體後方繪製，保留脖子與衣領。三難度、文字大小、朗讀與提示是首頁可展開的練習偏好，以選項卡與開關操作；支援鍵盤方向鍵及空白鍵。角色名字跟著角色定位，包含全螢幕。

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

- 六個場景各 10 組，共 **60 組完整情境**。原創生活對話、八位角色、六個 SVG 場景及技能圖卡均在 repo 內。
- 每組正式圖含 start、a、b、extra、close 五個不同決策節點，start 的提問／分享會到不同分支；共 **300 個正式決策節點、900 個正式選項**。
- Lv1 是獨立校對的兩回合圖（120 個節點、240 個選項），不是截斷高難度。合計 **420 個決策節點、1,140 個人工撰寫選項**。
- Lv1 每個決策 2 選項、正常路徑 2 回合；Lv2 每個決策 3 選項、路徑 3 回合；Lv3 每個決策 3 選項、路徑 4 回合。
- 選擇後先呈現專屬 NPC 反應或情境行動，再看回饋、繼續。可看提示、示範、換選項與回上一回合。嘗試保留，計算摘要時排除已換掉的作答；預設顯示提示亦會記錄為輔助。
- 拒絕／休息情境在接受界線後改為旁白與自己的行動，不要求 NPC 繼續說話。保持簡短、適時道別及尊重不同喜好都能獲得合適回饋。
- 四章共 30 個互動練習（6／8／8／8），含比較、分類、上下按鈕排序、分支對話。地圖站點可自由進入；逐句示範後練習，最後是老師可帶領的生活任務，不自動評分生活行為。
- 結果按實際遇到的技能呈現「正在練習／漸漸熟悉／能在此題運用」；沒遇到的是「本次未練習」。不評眼神、反應速度或音量。

## 抽題與進度

`selectScenarioPool(settings, history, count, rng, bank)` 是可注入 PRNG 的純函式。依序優先未玩過、不在最近 12 題、最久未玩的情境，並以場景／角色／話題多樣性打破同層候選的平手；同局不重複。池不足回傳可用數及說明，不補重複題。測試驗證連續 20 局三題在前 60 題不重複。

首頁只保留「跟著學」、「實戰演練」、續玩與練習偏好，不提供貼紙或每日任務。既有儲存格式保留相容性，舊的每日題組仍可續玩，畫面統一標為實戰演練；不會新建每日題組或貼紙獎勵。

`cactus:chat-relay:v1:data` 儲存偏好、匿名本機進度、近期題目、完成章節及目前題組。每次選擇與換回合自動保存，重開首頁可選擇繼續；章節對話中重新整理，也會恢復到對應章節練習。沒有姓名／診斷等輸入欄位，沒有上傳作答事件。

保留最近最多 100 場、約 1.9 MB 內的紀錄。讀取時檢查型別、版本、選項與實際圖路徑；損壞資料不會阻塞遊戲。儲存停用／已滿時保留記憶體中的遊戲並顯示不會保存的訊息。

## 語音、無障礙、離線

- 預設不出聲。朗讀只在操作後開始，使用裝置本機中文聲音，優先 zh-TW；沒有可用聲音時以文字繼續，不使用遠端 TTS。
- 原生按鈕、單選群組／勾選開關與清楚焦點、NPC 更新的 polite live、作答後焦點移交、18／22／26px、至少 48px 操作目標。分類與排序都不依賴拖曳。
- 一次性傳球／對話動畫為 200–320ms；系統與頁面「減少動態」皆可關閉非必要動畫。
- 全螢幕沿用既有 `useGameFullscreen`，支援原生及填滿視窗 fallback，退出會恢復捲動。
- 正式 build 產生只控制 `/game/chat-relay/` 的 Service Worker；初次連線完成快取後，核心文字、圖、教學與題庫可離線重新整理及作答。網站其他頁面、外連與裝置語音可用性不在離線保證內。

## 增加情境

在 `src/features/chat-relay/data/scenarios/` 對應場景檔新增 `story(StorySeed)`，並保持 ID 唯一。`author.ts` 只負責連接圖與衍生技能分數，不生成對話文字。

每筆需明寫 `start/a/b/extra/close` 與獨立 `easy` 兩步內容。Line 為 `[玩家文字, 專屬反應, 具體回饋, 技能或技能陣列, 分級?, 結局?]`。start 選項 0／2 到 a，1 到 b，a、b 之後再銜接；因此要逐條檢查 a 的兩個來源及匯流節點都相容。旁白使用全形括號，介面會標為情境觀察。

修改後執行測試，並人工檢閱跨分支的前後語意，不能只依筆數計算交付量。新增 NPC／場景需同步更新 `data/manifest.ts` 與原創 SVG 元件。

## 主要檔案

- `game/chat-relay/index.html`、`src/app/chat-relay.ts`：實體入口與站台共用 shell。
- `src/features/chat-relay/ChatRelayApp.vue`、`chat-relay.css`：狀態流程、結果、偏好與場景介面。
- `components/LearningWorld.vue`、`StoryDemo.vue`、`LessonStudy.vue`：校園教學地圖與互動教材。
- `components/SceneArt.vue`、`CharacterArt.vue`、`PictureCue.vue`：全部原創向量美術。
- `data/scenarios/*.ts`、`data/lessons.ts`、`data/author.ts`、`data/manifest.ts`、`types.ts`：內容與模型。
- `engine/`、`services/storage.ts`、`services/speech.ts`：圖引擎、驗證、抽題、評分、本機保存及朗讀。
- `src/features/game-center/GameCenter.vue`、`vite.config.ts`、`scripts/verify-build.mjs`、`package.json`、`tsconfig.json`、`.gitignore`：既有架構與 CI 整合。
- `scripts/test-chat-relay.mjs`、`scripts/playtest-chat-relay.mjs`：單元／圖與瀏覽器測試。

驗收紀錄見 [docs/chat-relay-validation.md](docs/chat-relay-validation.md)。
