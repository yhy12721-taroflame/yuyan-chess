# 🎮 象棋線上對戰 - 從這裡開始

## 👋 歡迎

你已經擁有一個完整的象棋線上對戰網頁版測試環境！

## ⚡ 30 秒快速開始

### Windows 用戶
```bash
start-test.bat
```

### macOS/Linux 用戶
```bash
npm run server:build && npm run server
# 然後打開 http://localhost:8080/test.html
```

## 📍 測試頁面

```
http://localhost:8080/test.html
```

## 📚 文檔導航

### 🚀 快速開始（推薦首先閱讀）
- **[QUICK_START.md](QUICK_START.md)** - 30 秒快速開始指南

### 📖 詳細指南
- **[TEST_GUIDE.md](TEST_GUIDE.md)** - 完整的測試指南和場景
- **[WEB_TEST_README.md](WEB_TEST_README.md)** - 功能說明和故障排除

### 📋 參考文檔
- **[TESTING_SETUP_SUMMARY.md](TESTING_SETUP_SUMMARY.md)** - 設置總結
- **[WEB_TEST_SETUP_COMPLETE.md](WEB_TEST_SETUP_COMPLETE.md)** - 完整設置說明

## 🎯 3 步開始測試

### 第 1 步：啟動服務器
```bash
start-test.bat  # Windows
# 或
npm run server:build && npm run server
```

### 第 2 步：打開測試頁面
```
http://localhost:8080/test.html
```

### 第 3 步：開始測試
1. 輸入玩家名稱
2. 點擊「連接」
3. 點擊「創建房間」或「加入房間」
4. 發送測試消息

## 🎮 測試頁面功能

### 左側面板
- 連接狀態監控
- 服務器配置
- 房間管理
- 玩家列表

### 右側面板
- 統計信息
- 最後接收的消息
- 實時日誌

### 測試按鈕
- 發送心跳
- 發送測試消息
- 發送移動
- 請求遊戲狀態
- 請求房間列表

## 🧪 基本測試場景

### 場景 1：連接（1 分鐘）
```
1. 輸入玩家名稱
2. 點擊「連接」
3. 驗證連接狀態為綠色
```

### 場景 2：房間（2 分鐘）
```
1. 點擊「創建房間」
2. 打開第二個測試頁面
3. 連接並加入房間
4. 驗證兩個玩家在同一房間
```

### 場景 3：消息（1 分鐘）
```
1. 點擊「發送測試消息」
2. 查看日誌確認發送
3. 查看「最後接收的消息」確認接收
```

## 🔴 常見問題

### Q: 無法連接？
**A**: 確保服務器已啟動：`npm run server`

### Q: 無法創建房間？
**A**: 確保已連接到服務器（連接狀態為綠色）

### Q: 兩個玩家無法在同一房間？
**A**: 確保使用相同的房間 ID

### Q: 消息無法發送？
**A**: 確保已連接到服務器

## 📊 監控指標

| 指標 | 說明 |
|------|------|
| 🟢 已連接 | WebSocket 連接正常 |
| 已發送消息 | 發送的消息總數 |
| 已接收消息 | 接收的消息總數 |
| 連接時長 | 連接持續的時間 |

## 📋 測試清單

- [ ] 連接到服務器
- [ ] 創建房間
- [ ] 加入房間
- [ ] 發送消息
- [ ] 接收消息
- [ ] 多房間並發
- [ ] 斷開重連

## 💡 提示

1. **使用多個瀏覽器標籤**：模擬多個玩家
2. **監控日誌**：所有操作都會記錄
3. **查看統計信息**：實時監控消息流
4. **檢查最後接收的消息**：驗證數據格式
5. **使用開發者工具**：按 F12 查看詳細信息

## 🚀 下一步

### 今天（30 分鐘）
1. ✅ 運行測試頁面
2. ✅ 完成 3 個基本測試場景
3. ✅ 驗證所有功能正常

### 本週（2-3 小時）
1. ✅ 按照 TEST_GUIDE.md 進行詳細測試
2. ✅ 實現更多消息類型
3. ✅ 添加遊戲邏輯

### 本月（1-2 天）
1. ✅ 實現完整的遊戲功能
2. ✅ 優化性能
3. ✅ 部署到生產環境

## 📚 相關文檔

- [象棋線上對戰需求文檔](.kiro/specs/xiangqi-online/requirements.md)
- [象棋線上對戰設計文檔](.kiro/specs/xiangqi-online/design.md)
- [象棋線上對戰任務列表](.kiro/specs/xiangqi-online/tasks.md)

## 🎓 學習資源

- **WebSocket 基礎**：通過測試頁面學習 WebSocket 通信
- **實時通信**：觀察實時的消息流
- **房間管理**：測試房間的創建和加入
- **錯誤處理**：觀察不同的錯誤情況

## 🤝 需要幫助？

1. 查看 [QUICK_START.md](QUICK_START.md) - 快速解決方案
2. 查看 [TEST_GUIDE.md](TEST_GUIDE.md) - 詳細指南
3. 查看 [WEB_TEST_README.md](WEB_TEST_README.md) - 故障排除
4. 查看瀏覽器控制台（F12）- 錯誤信息
5. 查看服務器日誌 - 服務器端信息

## 📞 快速聯繫

| 問題 | 解決方案 |
|------|---------|
| 無法連接 | `npm run server` |
| 無法創建房間 | 確保已連接 |
| 無法加入房間 | 確保房間 ID 正確 |
| 消息無法發送 | 確保已連接 |
| 其他問題 | 查看日誌 |

## 🎉 準備好了嗎？

### 立即開始
```bash
start-test.bat  # Windows
# 或
npm run server:build && npm run server
```

然後打開：
```
http://localhost:8080/test.html
```

---

## 📄 文件清單

```
✅ public/test.html                    - 測試頁面
✅ QUICK_START.md                      - 快速開始
✅ TEST_GUIDE.md                       - 詳細指南
✅ WEB_TEST_README.md                  - README
✅ TESTING_SETUP_SUMMARY.md            - 設置總結
✅ WEB_TEST_SETUP_COMPLETE.md          - 完整說明
✅ start-test.bat                      - Windows 啟動腳本
✅ start-test.ps1                      - PowerShell 啟動腳本
✅ START_HERE.md                       - 本文件
```

---

**祝你測試順利！** 🚀

**有任何問題，請查看相關文檔或聯繫開發團隊。**

---

**版本**：1.0.0

**狀態**：✅ 準備就緒

**最後更新**：現在
