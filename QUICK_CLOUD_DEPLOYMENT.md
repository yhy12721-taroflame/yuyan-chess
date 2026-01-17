# 快速雲端部署 - 5 分鐘指南

## 🚀 快速開始

### 1️⃣ 構建應用（1 分鐘）

```bash
npm run build:ui
npm run server:build
```

### 2️⃣ 上傳到 GitHub（2 分鐘）

```bash
git add .
git commit -m "Deploy to cloud"
git push origin main
```

**如果還沒有 GitHub 倉庫**：
1. 訪問 https://github.com/new
2. 創建倉庫 `xiangqi-game`
3. 按照提示推送代碼

### 3️⃣ 部署到 Vercel（2 分鐘）

1. 訪問 https://vercel.com
2. 點擊 **Add New** → **Project**
3. 選擇 `xiangqi-game` 倉庫
4. 點擊 **Deploy**

**完成！** 🎉

---

## 📱 測試線上對戰

部署完成後，你會獲得一個 URL（例如 `https://xiangqi-game.vercel.app`）

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

## ⚙️ 配置（可選）

### 自定義域名

1. 在 Vercel 儀表板中選擇項目
2. 進入 **Settings** → **Domains**
3. 添加你的域名

### 環境變量

Vercel 已預配置所有必要的環境變量。如需修改：

1. 進入 **Settings** → **Environment Variables**
2. 修改相應的值

---

## 🔧 故障排除

### 部署失敗？

1. 檢查構建日誌：**Deployments** → 選擇失敗的部署 → **Logs**
2. 確保 `npm run build:ui` 和 `npm run server:build` 都成功
3. 檢查 `package.json` 中的依賴是否正確

### WebSocket 連接失敗？

1. 確保使用 `wss://`（安全 WebSocket）
2. 檢查瀏覽器控制台的錯誤信息
3. 查看伺服器日誌

### 線上對戰無法同步？

1. 確保兩個設備都連接到同一伺服器
2. 檢查房間號是否相同
3. 刷新頁面重試

---

## 📊 監控應用

### 查看實時流量

1. 在 Vercel 儀表板中選擇項目
2. 點擊 **Analytics** 標籤
3. 查看實時用戶數和性能指標

### 查看伺服器日誌

1. 進入 **Deployments**
2. 選擇最新部署
3. 點擊 **Logs** 標籤

---

## 🔄 更新應用

每次修改代碼後：

```bash
git add .
git commit -m "Update: description"
git push origin main
```

Vercel 會自動重新部署！

---

## 📚 詳細指南

需要更多詳細信息？查看 `CLOUD_DEPLOYMENT_GUIDE.md`

---

## 🎯 下一步

1. ✅ 構建應用
2. ✅ 推送到 GitHub
3. ✅ 部署到 Vercel
4. ✅ 測試線上對戰
5. ✅ 分享 URL 給朋友

**你的應用現在已在全球可用！** 🌍

---

**部署 URL 示例**：
```
https://xiangqi-game.vercel.app
```

分享此 URL，任何人都可以在任何地方進行線上象棋對戰！
