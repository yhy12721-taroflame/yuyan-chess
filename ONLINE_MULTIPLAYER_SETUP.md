# 線上對戰設置指南

## 當前狀況

應用目前支持兩種遊戲模式：

### 1. 本地對戰 ✅
- **工作方式**：兩個玩家在同一設備上輪流操作
- **無需伺服器**：完全離線運行
- **狀態**：已完全實現

### 2. 線上對決 ⚠️
- **當前實現**：使用 localStorage 模擬房間系統
- **限制**：只能在同一設備上進行
- **問題**：不同裝置之間無法同步

---

## 為什麼不同裝置無法同步

線上對戰需要一個中央伺服器來：
1. 管理遊戲房間
2. 同步玩家的棋子移動
3. 驗證遊戲規則
4. 處理玩家連接/斷開

目前應用使用 localStorage（本地存儲），只能在同一瀏覽器中訪問。

---

## 解決方案

### 方案 A：使用現有伺服器（推薦）

項目已包含完整的 WebSocket 伺服器實現。

**步驟 1：啟動伺服器**

```bash
npm run server:build
npm run server:start
```

伺服器將在 `ws://localhost:8080` 啟動

**步驟 2：配置應用連接到伺服器**

編輯 `public/index.html`，在 `<script>` 標籤中添加：

```javascript
// 在 startOnlineGame() 函數中添加
const serverUrl = 'ws://localhost:8080'; // 或你的伺服器地址
const client = new WebSocketClient(serverUrl);
await client.connect();
```

**步驟 3：在不同設備上訪問應用**

- 設備 A：`http://your-computer-ip:3000`
- 設備 B：`http://your-computer-ip:3000`

---

### 方案 B：部署到雲端

如果要在互聯網上進行線上對戰：

1. **部署伺服器**
   - 使用 Heroku、AWS、或其他雲平台
   - 配置 WebSocket 支持

2. **更新應用配置**
   - 將伺服器地址改為雲端地址
   - 例如：`wss://your-server.herokuapp.com`

3. **在任何地方訪問**
   - 任何人都可以訪問應用並進行線上對戰

---

## 伺服器文件位置

```
server/
├── src/
│   ├── server.ts              # 主伺服器文件
│   ├── managers/              # 遊戲管理器
│   │   ├── GameStateManager.ts
│   │   ├── RoomManager.ts
│   │   ├── ConnectionManager.ts
│   │   └── WebSocketServer.ts
│   ├── handlers/              # 消息處理器
│   │   ├── GameHandler.ts
│   │   ├── RoomHandler.ts
│   │   └── MessageRouter.ts
│   └── utils/                 # 工具函數
│       ├── MessageValidator.ts
│       └── ErrorHandler.ts
├── jest.config.js
└── tsconfig.json
```

---

## 測試線上對戰

### 本地測試（同一網絡）

1. **啟動伺服器**
   ```bash
   npm run server:start
   ```

2. **在設備 A 上**
   - 打開瀏覽器：`http://192.168.1.100:3000`
   - 點擊 `線上對決`
   - 輸入房間號（例如：1）
   - 選擇 `紅方`

3. **在設備 B 上**
   - 打開瀏覽器：`http://192.168.1.100:3000`
   - 點擊 `線上對決`
   - 輸入相同房間號（1）
   - 選擇 `黑方`

4. **開始遊戲**
   - 房間滿後，點擊 `開始遊戲`
   - 兩個設備應該同步顯示棋盤

---

## 常見問題

**Q：為什麼線上對決在同一設備上工作，但不同設備上不工作？**

A：因為應用使用 localStorage，它只在同一瀏覽器中可用。不同設備有不同的 localStorage。

**Q：我需要修改代碼嗎？**

A：是的，需要修改 `public/index.html` 中的 `startOnlineGame()` 函數來連接到伺服器。

**Q：伺服器需要什麼配置？**

A：伺服器已經完全實現，只需要運行 `npm run server:start` 即可。

**Q：如何在互聯網上進行線上對戰？**

A：需要將伺服器部署到雲平台（如 Heroku、AWS 等），然後更新應用配置指向雲端伺服器。

---

## 下一步

1. **啟動伺服器**
   ```bash
   npm run server:build
   npm run server:start
   ```

2. **修改應用配置**
   - 編輯 `public/index.html`
   - 在 `startOnlineGame()` 函數中添加伺服器連接代碼

3. **測試線上對戰**
   - 在不同設備上訪問應用
   - 進行線上對戰測試

4. **部署到生產環境**
   - 選擇雲平台
   - 部署伺服器和應用

---

**狀態**：線上對戰功能已實現，需要配置伺服器連接
