# 手動部署到 Vercel - 詳細步驟

## ✅ 已完成的步驟

- ✅ Web UI 構建成功（`public/app.js` - 38.8kb）
- ✅ 伺服器構建成功（`server/dist/server.js`）
- ✅ 所有構建文件已準備好

## 📋 接下來的步驟

### 步驟 1：安裝 Git（如果還沒有）

**Windows**：
1. 訪問 https://git-scm.com/download/win
2. 下載並安裝 Git
3. 重啟 PowerShell

**驗證安裝**：
```powershell
git --version
```

### 步驟 2：初始化 Git 倉庫

```powershell
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 步驟 3：添加所有文件

```powershell
git add .
```

### 步驟 4：提交代碼

```powershell
git commit -m "Initial commit: xiangqi game with cloud deployment"
```

### 步驟 5：創建 GitHub 倉庫

1. 訪問 https://github.com/new
2. 創建新倉庫：
   - **Repository name**: `xiangqi-game`
   - **Description**: `象棋線上對戰遊戲`
   - **Public** 或 **Private**（選擇你喜歡的）
   - **不要** 初始化 README（因為本地已有）
3. 點擊 **Create repository**

### 步驟 6：連接遠程倉庫

複製 GitHub 提供的命令（類似於下面的格式），替換 `YOUR_USERNAME`：

```powershell
git remote add origin https://github.com/YOUR_USERNAME/xiangqi-game.git
git branch -M main
git push -u origin main
```

**例如**：
```powershell
git remote add origin https://github.com/john-doe/xiangqi-game.git
git branch -M main
git push -u origin main
```

### 步驟 7：部署到 Vercel

1. 訪問 https://vercel.com
2. 點擊 **Sign Up**（使用 GitHub 帳號登錄）
3. 授權 Vercel 訪問你的 GitHub
4. 點擊 **Add New** → **Project**
5. 選擇 `xiangqi-game` 倉庫
6. 點擊 **Import**

### 步驟 8：配置部署設置

在 Vercel 導入頁面中：

**Build Command**：
```
npm run build:ui && npm run server:build
```

**Output Directory**：
```
public
```

**Environment Variables**：添加以下變量

| 名稱 | 值 |
|------|-----|
| NODE_ENV | production |
| PORT | 3000 |
| LOG_LEVEL | info |
| HEARTBEAT_INTERVAL | 30000 |
| HEARTBEAT_TIMEOUT | 60000 |
| MAX_PLAYERS_PER_ROOM | 2 |
| ROOM_IDLE_TIMEOUT | 3600000 |

### 步驟 9：部署

1. 點擊 **Deploy**
2. 等待部署完成（通常 2-5 分鐘）
3. 獲得部署 URL（例如：`https://xiangqi-game.vercel.app`）

---

## 🎉 部署完成！

你的應用現在已在全球可用！

**部署 URL**：`https://xiangqi-game.vercel.app`

---

## 📱 測試線上對戰

### 在不同設備上測試

**設備 A**：
1. 打開 `https://xiangqi-game.vercel.app`
2. 點擊 **線上對決**
3. 輸入房間號（例如：1）
4. 選擇 **紅方**

**設備 B**：
1. 打開 `https://xiangqi-game.vercel.app`
2. 點擊 **線上對決**
3. 輸入相同房間號（1）
4. 選擇 **黑方**

**開始遊戲**：
- 房間滿後，點擊 **開始遊戲**
- 兩個設備應該同步顯示棋盤

---

## 🔄 更新應用

每次修改代碼後：

```powershell
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel 會自動重新部署！

---

## 📊 監控應用

### 查看部署日誌

1. 在 Vercel 儀表板中選擇項目
2. 點擊 **Deployments**
3. 選擇最新部署
4. 點擊 **Logs** 標籤

### 查看實時流量

1. 點擊 **Analytics** 標籤
2. 查看實時用戶數和性能指標

---

## ❓ 常見問題

### Q：部署失敗怎麼辦？

**A**：
1. 檢查 Vercel 部署日誌
2. 確保 `npm run build:ui` 和 `npm run server:build` 都成功
3. 檢查 `package.json` 中的依賴

### Q：WebSocket 連接失敗？

**A**：
1. 確保使用 `wss://`（安全 WebSocket）
2. 檢查瀏覽器控制台的錯誤信息
3. 查看 Vercel 伺服器日誌

### Q：如何自定義域名？

**A**：
1. 在 Vercel 儀表板中選擇項目
2. 進入 **Settings** → **Domains**
3. 添加你的域名
4. 按照說明配置 DNS

---

## 📚 相關文檔

- `QUICK_CLOUD_DEPLOYMENT.md` - 快速部署指南
- `CLOUD_DEPLOYMENT_GUIDE.md` - 詳細部署指南
- `ONLINE_MULTIPLAYER_SETUP.md` - 線上對戰設置

---

**狀態**：應用已構建，準備部署到 Vercel
