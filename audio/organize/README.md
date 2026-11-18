# 預製台灣華語對話語音

151 段固定台詞，採 Microsoft 台灣華語女聲 `zh-TW-HsiaoChenNeural`，語速 `-8%`、原音高。台詞以陪玩家整理、提問與鼓勵撰寫，不逐字朗讀介面標籤。字幕和實際合成文字一致。每段提供 MP3 與 OGG，播放時先試 MP3，再試 OGG。

- 台詞與穩定 ID：`src/features/organize/audio/catalog.ts`。
- 完整清單：`docs/organize-voice-list.md`；機器可讀盤點：本目錄 `manifest.json`。
- 產生紀錄：`generation.json`，包含聲線、速度、台詞與音檔 SHA-256、長度及時間，不含任何金鑰。
- 更新清單：`npm run audio:organize:plan`。
- 重新產生：安裝 Python、[uv](https://docs.astral.sh/uv/) 與 ffmpeg，執行 `npm run audio:organize:generate -- --ogg`。腳本使用固定版本 `edge-tts==7.3.1`；需要網路連線，無需前端 API Key。
- 指定部分：`npm run audio:organize:generate -- --only intro.welcome,hint.bag --ogg`；台詞及設定未變會略過，加 `--force` 重做。
- 每段寫入前以 ffmpeg 完整解碼；合成失敗會重試並回報錯誤。可中斷後續跑，已成功的音檔不重做。
- 可另選 OpenAI：只在本機設定 `OPENAI_API_KEY`，執行 `npm run audio:organize:generate -- --provider openai --model <帳戶可用的語音模型> --voice coral --ogg`。此批音檔並非 OpenAI 產生。

遊戲只播放這些靜態資產，不使用 Edge 的瀏覽器朗讀功能，也不會在玩家端呼叫合成服務。沒有音檔時保留字幕並記錄警告，禁止改回 `speechSynthesis`。Audio Manager 支援停止前一段、重播、靜音與音量，並以 `import.meta.env.BASE_URL` 相容 GitHub Pages 子路徑。

聲線及速度設定可重現；自然度仍需要人耳判斷，不能以解碼成功取代試聽。服務與工具參考：[edge-tts 上游文件](https://github.com/rany2/edge-tts)、[Microsoft 語音語言與聲線清單](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)。

2.0 新增五故事開場、十五段事件、動態目標說明、自主檢查、日記、生活反思與丟棄後果，以及紙箱、衣服、掛鉤和原有藏書說明。全部使用同一靜態 Audio Manager；新對話仍有逐字字幕，播放完後收起字幕，讓出房間空間。
