# 特教百寶袋

Vue 3、TypeScript、Vite 與 Phaser 的純前端網站。保留既有文章、教材、工具與網址；校園 RPG 位於 `/campus/`，首頁與導航皆有入口。

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
