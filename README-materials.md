# 教材上架工具

也可請代理使用專案 skill：`$upload-materials`，並提供教材路徑與分類。

在專案根目錄執行（檔名有空白時加引號）：

```sh
./upload-materials ~/Downloads/新教材.pdf ~/Downloads/新教材_可編輯版.pptx ~/Downloads/新教材.docx
```

輸入分類編號後，工具會複製教材至 `files/`、更新
`src/content/resource-categories.json`、建立或更新該分類的 HTML，最後執行
`npm run build`。依賴尚未安裝時會先跑 `npm ci`。灰階分類會自動啟用，
不需要另外修改教材目錄、搜尋或首頁統計。原始下載檔案保留。

- PDF、PPTX、DOCX 都可單獨上架。PPTX／DOCX 下載會自動標示「可編輯」。
- 同名的不同格式合併成同一份教材，忽略 `_可編輯版`、`-editable` 等結尾。
  不同名稱則各自建立教材項目。PDF 優先作為主檔，可編輯版本保留在同一卡片。
- 也可以之後才補交同名的可編輯版，或替原本只有可編輯版的教材補上 PDF。
- 選單輸入 `q` 或按 Ctrl+C 可以取消。

## 寫入前的衝突檢查

工具會拒絕遺失或不支援的檔案、重複輸入、大小寫／Unicode 正規化後的
同名檔案、相同內容、同一教材同格式的多個版本、Git merge conflict、
已被占用的新 HTML 路徑，以及未提交的手動分類 HTML 修改。
不會自動覆蓋舊教材；需要更新版本時，請先明確處理舊版本。

同一 repository 同時只允許一個上架流程。若程序被強制終止留下鎖，
錯誤訊息會顯示鎖的路徑；確認沒有上架程序後才能移除該鎖。

一般建置失敗或中斷時，工具會還原本次教材清單、HTML、新增檔案與舊 `dist`。
建置 log、原始清單／頁面備份與上架計畫放在終端機顯示的系統暫存目錄。
如果另有程序同時修改來源，會保留現況與備份供排查，避免覆蓋他人的修改。

## 驗證及提交

```sh
./upload-materials --help
npm run test:materials
```

`test:materials` 已包含在 `npm run build`：在獨立 Git 測試專案實際執行選單、
多格式配對、複製、HTML 產生、建置、衝突與失敗還原；正式產物驗證另外檢查
所有分類頁、圖片及 PDF／可編輯檔案確實存在。

預設不會自動 stage 或 commit。檢閱變更後，只暫存本次需要的清單、分類 HTML
和教材檔案，再用 `npm run check:clean -- --staged` 驗證並提交。

要在上架成功後自動提交，可加上 `--commit`（分類選單照常顯示）：

```sh
./upload-materials --commit ~/Downloads/新教材.pdf ~/Downloads/新教材_可編輯版.pptx
```

自動提交前，暫存區必須為空，教材清單及目標分類 HTML 必須沒有未提交修改；
工具不會把之前尚未提交的上架內容合併進這次 commit。其他未暫存修改和未追蹤
檔案會保留，且不納入提交。

工具先跑完整 build，再暫存本次教材、清單與 HTML；專案有 `check:clean` 時會
自動跑 `npm run check:clean -- --staged`，驗證乾淨副本後才建立 commit。
提交前也會檢查 HEAD、暫存區與來源檔案是否被其他程序修改。
建置失敗仍會還原；乾淨副本檢查或 Git 提交失敗時，已成功上架的檔案會保留，
本次暫存會清除，方便修正問題後手動提交。Git 身分、簽章和 hooks 使用原有設定。
所有模式都不會 push 或部署。
