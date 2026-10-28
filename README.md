# 特教百寶袋

Vue 3、TypeScript、Vite 與 Phaser 的純前端網站。保留既有文章、教材與工具；遊戲中心位於 `/game/`，校園遊戲位於 `/game/campus/`。舊 `/campus/` 入口已移除，不設轉址。

## 本機開發與建置

使用 Node.js 24 LTS：

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

建置會檢查 TypeScript、原有 22 個 HTML 網址、48 個靜態資產雜湊、7 篇文章及頁面連結。輸出目錄為 `dist/`。

首頁、文章列表及教材列表使用 `assets/optimized/` 的 WebP 與回應式圖片；原始圖片網址保留。共用橫幅在 HTML 預載對應尺寸圖片，避免等待 Vue 與 CSS 載入後才開始下載。更新原圖後，安裝 WebP 的 `cwebp` 工具並執行 `npm run optimize:images`，一併提交產生的圖片與 `src/content/image-variants.json`；一般開發與 CI 建置不需要安裝編碼器。

## 校園 RPG

從進校門到放學，探索校園、教室、操場與教師辦公室。八個情境各有現場回應、成人回報、返回現場三次決定；任一錯誤終止本輪，全數通過並回南門後顯示總結。

- 地面虛線導航、角色步行、NPC 巡走、碰撞及門口轉場。
- 每輪隨機微事件與選項順序；重新整理保留本輪安排與進度。
- 事件預告兩幕播放完成後才能繼續、關閉或重播；減少動態時呈現完整靜態內容。
- 電腦：方向鍵／WASD 移動，E／Enter 互動，Esc 暫停。手機使用畫面下方方向鍵與互動鍵。
- 遊戲進度只存於本機瀏覽器；重玩不會清除其他工具或舊版資料。

原始碼位於 `src/features/campus/`；共用導航與樣式位於 `src/shared/`。角色呈現個別情境，不能用單一行為推論診斷；內容來源列於遊戲頁底部。

## GitHub Pages

使用者網站預設根路徑 `/`。專案網站請指定子路徑：

```sh
VITE_BASE_PATH=/repository-name/ npm run build
```

Pages 的來源需設為 **GitHub Actions**。推送到 `main` 後，工作流程會自動建置並部署到 GitHub Pages；也可手動執行並勾選 `deploy`。子路徑可在手動執行時設定 `base_path`。本機提交不會推送或觸發部署。

技能包、本機測試工具、畫面證據及工作紀錄已加入 `.gitignore`，不包含在網站提交或部署輸出中。

## Google 搜尋索引

每次建置會自動產生 `dist/sitemap.xml` 與 `dist/robots.txt`，納入公開 HTML 頁面與 `files/` 下的 PDF 教材。首頁與子目錄入口使用目錄網址；`post-old.html` 指向 `post.html` 的 canonical 網址。404、Coming Soon、標記 `noindex` 的作答歷史及重複列表不列入 sitemap。新增根目錄 HTML 或 PDF 後，重新建置即可更新；新的巢狀 HTML 入口仍需加入 Vite 的 `inputs`。

`cactusbeing.github.io` 的 DNS 由 GitHub 管理，請在 [Google Search Console](https://search.google.com/search-console) 新增「網址前置字串」資源 `https://cactusbeing.github.io/`，選擇「HTML 標記」驗證，將該頁提供的完整 `<meta name="google-site-verification" ...>` 加入根目錄 `index.html` 的 `<head>`。DNS TXT 驗證碼不能直接當作 HTML 驗證標記使用。

部署後，先確認首頁原始碼含有該標記，再回 Search Console 按「驗證」。驗證成功後，在「Sitemap」提交 `https://cactusbeing.github.io/sitemap.xml`。驗證標記需持續保留。Sitemap 有助於 Google 發現網址，但不保證每個頁面都會收錄；可用「網頁索引」與「網址審查」查看實際結果。
