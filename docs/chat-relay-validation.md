# 聊天傳接球驗收紀錄

最新更新：2026-11-03。範圍包含使用者後續指定的直接開始、移除老師模式與匯入匯出、共用站台頁首、全螢幕與 2D 教學世界。

## 題庫

由 `validateScenarios` 及實際圖引擎遍歷產生：

| 場景 | 完整情境 | 正式決策節點 | Lv1 決策節點 |
|---|---:|---:|---:|
| 教室 | 10 | 50 | 20 |
| 走廊 | 10 | 50 | 20 |
| 午餐 | 10 | 50 | 20 |
| 操場 | 10 | 50 | 20 |
| 社團 | 10 | 50 | 20 |
| 校外生活 | 10 | 50 | 20 |
| 合計 | **60** | **300** | **120** |

900 個正式選項＋240 個 Lv1 選項。三難度共 6,720 條終點路徑；實際執行 9,900 次選項轉移。每個選項有文字、專屬反應、回饋及有效下一節點。Lv1 NPC 最長 14 字、正式台詞最長 29 字。

人工抽查 15 局 × 3 題，修正香蕉／藍莓前文假設、飯糰建議未完成、角色錯字及扇風敘述；拒絕後的行動改為旁白，不要求持續說話。這是程式與編寫內容檢查，尚未取代教師課堂試用。

## 自動化與瀏覽器

- `npm run typecheck`：通過。
- `npm run test:chat-relay`：**19 群組通過、0 失敗**。含完整圖、反應差異、固定 seed、60 題先跑完、最近 12 題、池不足、台灣午夜、每日題、重試／退回、評分、故障保存、損壞資料、路徑復原及本機語音 fallback。
- `npm run build`：**包含上述測試、vue-tsc、Vite 與 verify-build，全部通過**。
- 非根路徑 `/review/` 額外建置及 `node scripts/verify-build.mjs /tmp/chat-relay-subpath`：通過，包含 scoped worker 及 11 個實際產物指紋。
- 正式預覽 `http://127.0.0.1:4178/game/chat-relay/` 使用 shared default Chromium，未安裝額外測試套件。
- 三難度各從首頁直接開始三題並結算：Lv1 6 次決策／Lv2 9 次／Lv3 12 次。
- 四章所有示範與 **30 個練習**全部經 UI 完成，能走到生活小任務。
- 不同選項顯示不同反應；實測 Enter 作答、重試焦點、上一回合、休息續玩及重新整理後恢復反應與分支。
- 每日三題重開 ID 與順序一致；全螢幕進入與退出通過。
- 1440×900、1024×768、768×1024、390×844、320×640：首頁／地圖／練習無水平溢出。320px 同時測試 26px 文字；另調整小螢幕工具列，避免品牌被擠成多行。
- 首頁 axe-core 4.12.1：**0 violations、0 incomplete**。修正站台 shell 整合後的重複 banner／contentinfo。
- 瀏覽器主流程報告：0 JavaScript page errors。
- 實際關閉預覽頁的網路後，重新整理、直接隨機開始及選項專屬反應皆通過；完成後恢復連線。證據：`/tmp/chat-relay-offline-report.json`。

瀏覽器報告與截圖：`/tmp/chat-relay-browser-report.json`、`/tmp/chat-relay-a11y.json`、`/tmp/chat-relay-session-lv*.png`、`/tmp/chat-relay-map-*.png`、`/tmp/chat-relay-mobile-session-*.png`。

## 相容性與部署

verify-build 檢查 22 個既有 HTML URL、48 個既有資產 hash、7 篇原文與 776 個考題，全部保留。另以正式預覽實際載入首頁、遊戲百寶箱、認識新臺幣、同一座校園，掛載內容及操作按鈕均正常，百寶箱包含新遊戲連結。沒有修改舊遊戲玩法、考古題資料、文章或原始基準清單。新入口、canonical、sitemap、單一既有 GA loader、離線 manifest 與 fingerprint 都由既有 build 系統驗證。新增測試腳本與本報告已加入精確的 .gitignore 例外，避免本機可建置、CI 卻缺少測試腳本。

Service Worker 的 scope 是新遊戲目錄，沒有接管其他遊戲。所有題目與主要美術直接打包；沒有 API 金鑰、外部 LLM 或學生作答上傳。

## 剩餘事項

- **最新使用者範圍內沒有未完成的 P0 功能**。老師模式、固定課堂題組、匯入／匯出、貼紙與每日三題是依後續要求移除，不列為待補。
- Safari／實體 iPad 的本機語音與原生全螢幕尚未實機驗證；程式已有無聲音及視窗全螢幕 fallback。
- 額外換裝、進階貼紙、PDF、追加題庫屬原規格 P1，未納入此次實作。
- 未 push、merge 或部署。預期正式 URL 為 `https://cactusbeing.github.io/game/chat-relay/`。

## 桌面疊版修正與複驗

將標題移到遊戲框外、遊戲改為固定高度 Grid 後，原本 `#relay-main` 的 `margin: auto` 仍讓內容區以內在尺寸置中，未撐滿 Grid 區域；內部百分比高度因此失去可解析的基準，教學地圖實際高度變成 0，絕對定位的章節按鈕堆在同一列。

修正內容區為明確的 100% 寬高與伸展對齊，取消自動外距；首頁使用最小內容高度，地圖保留安全最小高度，在較矮的桌面視窗收起重複說明。人物依插圖高度縮放，地圖人物放到招牌旁邊。保留框外標題、返回遊戲百寶箱及單一遊戲框。

新瀏覽器回歸檢查包含：

- 內容區必須撐滿遊戲框，地圖不得壓成零高度。
- 首頁區塊、答案按鈕與四個章節招牌不得互相重疊；招牌不得遮住人物。
- 桌面 18px 模式下，地圖與四個站點須在遊戲可見範圍內。
- 1440×900、1366×768、1280×720、1024×768、768×1024、390×844、320×640。
- 桌面 22／26px 大字、展開練習偏好、全螢幕、未完成／已完成的章節狀態。

完整操作重跑三難度各三題、四章共30個練習、重試與重新整理恢復。題庫19群組及整條 typecheck／build／verify-build 通過。瀏覽器沒有 JavaScript page errors。

完整流程紀錄：`/tmp/chat-relay-layout-fix-browser-report.json`。最終版面紀錄：`/tmp/chat-relay-layout-verified-browser-report.json`；截圖為 `/tmp/chat-relay-layout-verified-home-*.png`、`/tmp/chat-relay-layout-verified-map-*.png`。

可單獨重跑版面檢查（仍會操作本機頁面，但不清除資料）：

```sh
node --experimental-strip-types scripts/playtest-chat-relay.mjs http://127.0.0.1:5176/game/chat-relay/ --layout-only
```


## 手遊介面、hover 與角色髮型修正

- 主選單與練習抬頭統一使用「實戰演練」，仍按下後直接開始三題。
- 移除開始、續玩、示範、下一回合及章節招牌的裝飾箭頭；保留返回導覽與排序所需的方向提示。
- 保留繪本配色與原創 SVG，增加校園草地背景、書本／對話／日曆／貼紙圖示、圓角按鈕與按壓陰影。框外標題、共用網站導覽、單一嵌入及全螢幕維持既有結構。
- 章節按鈕 hover 不再位移，固定地點標籤層級；按鈕互動只改顏色與陰影，不改字級、字重及文字位置。
- 阿晴、小莓、晨晨與米亞老師的髮型分別重畫為雙馬尾、短髮、側馬尾與髮髻；後髮在身體／脖子之前繪製。八位角色的脖子中心像素皆為膚色，另逐一檢視完整角色截圖。樂樂耳機改成獨立頭帶與耳罩。

初步版面回歸：七種尺寸與 22／26px 大字、偏好展開、全螢幕通過。新增實際 hover 測試確認首頁兩個入口、四個章節招牌與對話選項：按鈕及文字座標不變、文字互不重疊且不超出按鈕。報告：`/tmp/chat-relay-app-draft-browser-report.json`。角色檢查：`/tmp/chat-relay-character-review-result.json`；截圖：`/tmp/chat-relay-app-character-review.png`。

正式 build 完整操作複驗也通過：三難度各三題（6／9／12 次選擇）、四章30個練習、每日三題重開一致、重新整理與休息續玩、鍵盤 Enter、全螢幕及七種尺寸；7 個 hover 標的皆無位移／疊字／裁切，瀏覽器 0 JavaScript page errors。紀錄：`/tmp/chat-relay-app-verified-browser-report.json`；最終首頁：`/tmp/chat-relay-app-verified-final-home.png`。

`npm run typecheck` 通過。`npm run build` 通過，包含19組題庫／引擎測試（60組完整情境、6,720條可走完路徑、9,900次選項轉移）與 verify-build（22個既有HTML、48個既有資產hash、7篇文章、776題、離線manifest及11項資源fingerprint）。既有 CampusScene 大型 chunk 提示仍存在，沒有新增建置錯誤。最新要求無未完成P0；未部署。

最後追加傳球落點修正，將對話球停在兩人之間；1440、1024、390與320px、一般與減少動態兩種模式，圖示矩形均未與任一角色臉部重疊。追加後 typecheck 及完整 build／verify-build 再次通過（`/tmp/chat-relay-app-final-build.log`）。瀏覽器腳本也加入對話球不得遮臉的檢查。

本輪修改檔案：

- `src/features/chat-relay/ChatRelayApp.vue`
- `src/features/chat-relay/chat-relay.css`
- `src/features/chat-relay/components/CharacterArt.vue`
- `src/features/chat-relay/components/LearningWorld.vue`
- `src/features/chat-relay/components/SceneArt.vue`
- `src/features/chat-relay/components/StoryDemo.vue`
- `src/features/chat-relay/components/GameIcon.vue`（新增）
- `src/features/chat-relay/components/LobbyBackdrop.vue`（新增）
- `scripts/playtest-chat-relay.mjs`
- `README-chat-relay.md`
- `docs/chat-relay-validation.md`


## 2026-11-03：全螢幕名字、入口精簡與練習偏好

- 名字由場景外的固定底列移進每個角色容器，跟著角色縮放及旋轉；限制可見角色高度，避免全螢幕時容器比實際插圖高而拉開距離。
- 刪除「我的貼紙」入口與整頁、貼紙獎勵累計及「今日三題」入口／啟動流程。舊版儲存結構仍可讀，未清除既有作答紀錄。
- 練習偏好採與遊戲一致的圓角按鈕、原創滑桿圖示、難度／字級選項卡與圓角開關。保留原生 radio／checkbox 語意與可見焦點，可用方向鍵與空白鍵操作；桌面展開時將設定區捲到可見位置。
- 本輪檔案：`ChatRelayApp.vue`、`chat-relay.css`、`components/SceneArt.vue`、`components/GameIcon.vue`、`scripts/playtest-chat-relay.mjs`、`README-chat-relay.md` 與本紀錄。


最新複驗：`/tmp/chat-relay-settings-verified-browser-report.json` 通過七種尺寸（1440、1366、1280、1024、768、390、320px）、22／26px、大字與偏好展開、7個hover標的、偏好鍵盤操作與重新整理保存。另在1440、1024、390與320px實際進出全螢幕，以SVG腳部座標量測名牌距離並確認沒有超出場景。修正手機名牌底部預留空間；瀏覽器0個JavaScript錯誤。`npm run typecheck` 與完整 build／verify-build 通過（`/tmp/chat-relay-settings-final-build.log`）。

## 2026-11-03：遊戲百寶箱學習目標與名稱

遊戲百寶箱三張卡片各加入三項直接可讀的學習目標，不需展開或進入遊戲。名稱統一為「社會技巧：聊天傳接球」、「生活數學：認識新台幣」、「特教宣導：同一座校園」，同步更新遊戲頁主標題、HTML標題、站內搜尋與描述。移除卡片的「本機進度／接續原有進度」及頁尾儲存宣傳文字，既有遊戲路徑與儲存機制維持相容。

- 聊天：相關回應、輪流提問分享、尊重界線與自然收尾。
- 生活數學：辨認面額、湊錢找零、點餐與付款。
- 特教宣導：理解不同需要、尊重隱私自主、適當求助與如實回報。
- 1440、768、390、320px實際瀏覽器檢查：共9項目標均存在、沒有水平溢出；三個遊戲入口與頁面新名稱正確。
- `npm run typecheck` 與完整 `npm run build`（含19組聊天題庫測試及verify-build）通過，60組完整多回合情境保留。最新要求無未完成P0。
- 證據：`/tmp/game-center-learning-goals-desktop.png`、`/tmp/game-center-learning-goals-mobile.png`；建置：`/tmp/game-center-learning-goals-build.log`。
- 本輪檔案：`src/features/game-center/GameCenter.vue`、`src/features/chat-relay/ChatRelayApp.vue`、`src/features/money/MoneyApp.vue`、`src/features/campus/CampusApp.vue`、`src/shared/composables/useSiteSearch.ts`、`game/index.html`、`game/chat-relay/index.html`、`game/money/index.html`、`game/campus/index.html`、`README-chat-relay.md`及本紀錄。

## 提交前缺陷審查與修正（2026-11-03）

審查對象為本次未提交的遊戲實作、題庫與測試、百寶箱與遊戲命名、搜尋入口及部署整合。依使用者要求先審查，再修正與提交；未包含既有未追蹤的規格原稿及考古題匯入腳本。以下五項均已修正：

[P2] 換回合時重設對話閱讀位置 — src/features/chat-relay/ChatRelayApp.vue:67

在1280×720與26px文字下，捲至回饋底部後按下一句，原程式保留182px的捲動量；新台詞位於y=277而可見面板從y=400開始。現在重設對話區捲動，手機換回合會顯示新台詞，回首頁也會回到可見的操作區。

[P2] 保留示範下一句按鈕的鍵盤焦點 — src/features/chat-relay/components/StoryDemo.vue:18

原本整個示範對話容器使用每句變動的key，按Enter後按鈕被拆掉，焦點回到BODY。取消不必要的容器重建，下一句按鈕在示範中持續存在。

[P2] 將焦點移交新章節或練習題 — src/features/chat-relay/components/LessonStudy.vue:17

示範完成與下一題會移除當前按鈕，原本沒有焦點移交。現在章節、示範／練習／生活任務與題目切換後，焦點進入對應標題；保留自動朗讀區域，不重讀整頁。

[P2] 將收尾旁白維持為旁白 — src/features/chat-relay/ChatRelayApp.vue:126

多個尊重界線情境用全形括號描述退開、休息或上車，原程式卻一律加上NPC名字與引號；看示範也有相同問題。現在共用格式函式，旁白直接顯示，只有真正台詞加上說話者。瀏覽器固定走完「安靜一下」的旁白收尾作為回歸案例。

[P2] 按安裝scope隔離離線快取清理 — vite.config.ts:186

原本啟用worker時會刪掉所有同前綴舊快取，包含同網域其他部署路徑。以VM實際執行啟用事件，確認其他安裝的快取會被刪除。現在名稱含registration.scope，僅清理同scope的舊版本；verify-build實際執行install／activate，確認資源清單完整且其他安裝快取保留。

修正後整體評估：沒有剩餘已確認的可採取行動缺陷。題庫／引擎仍有60組完整情境、6,720條終點路徑與9,900次選項轉移。三難度各三題、四章30個練習、七種尺寸、偏好保存、鍵盤焦點與閱讀位置、旁白收尾、全螢幕與hover回歸通過，瀏覽器0個JavaScript錯誤。報告：`/tmp/chat-relay-review-browser-report.json`。`npm run typecheck`、完整`npm run build`及生活數學3,600題／288種訂單測試通過；快取安裝與清理測試已加入verify-build。Safari／實體iPad語音與原生全螢幕仍未實機驗證。
