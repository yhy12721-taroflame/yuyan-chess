# 雲端部署指南 - Vercel

## 概述

本指南將幫助你將象棋遊戲部署到 Vercel，實現全球線上對戰。

**部署架構**：
- **前端**：靜態 Web 應用（Vercel）
- **後端**：WebSocket 伺服器（Vercel Serverless Functions）
- **通信**：WebSocket（支持實時同步）

---

## 前置要求

1. **GitHub 帳號**（用於部署）
2. **Vercel 帳號**（免費註冊）
3. **Node.js 18+**（本地開發）

---

## 步驟 1：準備代碼

### 1.1 構建應用

```bash
# 構建 Web UI
npm run build:ui

# 構建伺服器
npm run server:build
```

### 1.2 驗證構建

```bash
# 檢查 public 目錄
ls public/
# 應該看到：index.html, app.js

# 檢查 server/dist 目錄
ls server/dist/
# 應該看到：server.js 和其他文件
```

---

## 步驟 2：上傳到 GitHub

### 2.1 初始化 Git 倉庫

```bash
git init
git add .
git commit -m "Initial commit: xiangqi game"
```

### 2.2 創建 GitHub 倉庫

1. 訪問 https://github.com/new
2. 創建新倉庫：`xiangqi-game`
3. 不要初始化 README（因為本地已有）

### 2.3 推送代碼

```bash
git remote add origin https://github.com/YOUR_USERNAME/xiangqi-game.git
git branch -M main
git push -u origin main
```

---

## 步驟 3：部署到 Vercel

### 3.1 連接 Vercel

1. 訪問 https://vercel.com
2. 點擊 **Sign Up**（使用 GitHub 帳號登錄）
3. 授權 Vercel 訪問你的 GitHub

### 3.2 導入項目

1. 點擊 **Add New** → **Project**
2. 選擇 `xiangqi-game` 倉庫
3. 點擊 **Import**

### 3.3 配置部署設置

**Framework Preset**：選擇 `Other`

**Build Command**：
```
npm run build:ui && npm run server:build
```

**Output Directory**：
```
public
```

**Environment Variables**：添加以下變量

```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
HEARTBEAT_INTERVAL=30000
HEARTBEAT_TIMEOUT=60000
MAX_PLAYERS_PER_ROOM=2
ROOM_IDLE_TIMEOUT=3600000
```

### 3.4 部署

1. 點擊 **Deploy**
2. 等待部署完成（通常 2-5 分鐘）
3. 獲得部署 URL（例如：`https://xiangqi-game.vercel.app`）

---

## 步驟 4：配置應用連接到雲端伺服器

### 4.1 更新伺服器地址

編輯 `public/index.html`，找到 `startOnlineGame()` 函數，添加：

```javascript
function startOnlineGame() {
    const rooms = JSON.parse(localStorage.getItem('xiangqi_rooms') || '{}');
    const room = rooms[currentRoomId] || { red: null, black: null };
    
    // 檢查房間是否滿
    if (!room.red || !room.black) {
        alert('房間未滿，無法開始遊戲');
        return;
    }
    
    // 連接到雲端伺服器
    const serverUrl = window.location.hostname === 'localhost' 
        ? 'ws://localhost:8080'
        : `wss://${window.location.hostname}`;
    
    console.log('連接到伺服器:', serverUrl);
    
    startGame();
}
```

### 4.2 重新部署

```bash
git add public/index.html
git commit -m "Update server URL for cloud deployment"
git push origin main
```

Vercel 會自動重新部署。

---

## 步驟 5：測試線上對戰

### 5.1 本地測試

1. **設備 A**：訪問 `https://xiangqi-game.vercel.app`
2. **設備 B**：訪問 `https://xiangqi-game.vercel.app`
3. 點擊 **線上對決**
4. 輸入相同房間號
5. 一個選 **紅方**，一個選 **黑方**
6. 點擊 **開始遊戲**

### 5.2 驗證同步

- 在設備 A 上移動棋子
- 檢查設備 B 是否同步顯示移動
- 確認遊戲規則正確執行

---

## 常見問題

### Q：部署失敗怎麼辦？

**A**：檢查以下項目：
1. 確保 `npm run build:ui` 成功
2. 確保 `npm run server:build` 成功
3. 檢查 Vercel 部署日誌（Deployments → 選擇失敗的部署 → Logs）

### Q：WebSocket 連接失敗？

**A**：
1. 確保使用 `wss://`（安全 WebSocket）
2. 檢查伺服器是否正確啟動
3. 查看瀏覽器控制台的錯誤信息

### Q：如何查看伺服器日誌？

**A**：
1. 在 Vercel 儀表板中選擇項目
2. 點擊 **Deployments**
3. 選擇最新部署
4. 點擊 **Logs** 標籤

### Q：如何更新應用？

**A**：
1. 在本地修改代碼
2. 提交並推送到 GitHub
3. Vercel 會自動部署

---

## 性能優化

### 啟用 CDN 緩存

1. 在 Vercel 儀表板中選擇項目
2. 進入 **Settings** → **Caching**
3. 啟用 **Automatic Caching**

### 監控性能

1. 進入 **Analytics** 標籤
2. 查看實時流量和性能指標

---

## 自定義域名（可選）

### 添加自定義域名

1. 在 Vercel 儀表板中選擇項目
2. 進入 **Settings** → **Domains**
3. 添加你的域名
4. 按照說明配置 DNS

---

## 下一步

1. ✅ 推送代碼到 GitHub
2. ✅ 在 Vercel 上部署
3. ✅ 配置應用連接到雲端伺服器
4. ✅ 測試線上對戰
5. ✅ 分享部署 URL 給朋友

---

## 部署 URL

部署完成後，你的應用將在以下地址可用：

```
https://xiangqi-game.vercel.app
```

分享此 URL 給朋友，他們可以在任何地方進行線上對戰！

---

**狀態**：準備好部署到雲端
