# 主畫面圖示

來源為既有的 `assets/icon.png`，保留原仙人掌 Logo。

| 檔案 | 尺寸 | 用途 |
| --- | --- | --- |
| `apple-touch-icon.png` | 180×180 | iOS 主畫面 |
| `icon-192.png` | 192×192 | Android 安裝圖示 |
| `icon-512.png` | 512×512 | Android 安裝與啟動畫面 |

圖示採不透明 `#f6f8f2` 底色，Logo 等比例置中，寬高各占畫布 75%；Android 圖示使用 `any`，由系統套用外框。

原始 Logo 目前只有 30×30；這些圖示是相同圖樣的放大版本。日後取得高解析原圖，可按上述尺寸與留白重新輸出，沿用檔名即可。

安裝名稱、啟動範圍與 Android 圖示路徑集中在根目錄 `manifest.webmanifest`；各 HTML 頁面的 iOS 與 manifest 標籤由 `vite.config.ts` 的 `site-home-screen` 統一加入。
