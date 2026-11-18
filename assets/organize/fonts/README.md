# RoomNote 字型

由 [芫荽 Iansui](https://github.com/ButTaiwan/iansui) Regular 製作的繁體中文遊戲文字子集，採 SIL Open Font License 1.1，完整授權見 OFL.txt。子集重新命名為 RoomNote，保留繁體中文字與同套拉丁字母／數字。文字來源含遊戲 Vue／TypeScript 及語音字幕。

更新台詞或 UI 後，以 fontTools `pyftsubset` 加入新字，輸出 WOFF，再將 name table 的 family/full/PostScript 名稱改為 RoomNote。避免沿用原字型的保留名稱。字型自託管，不依賴第三方字型服務。
