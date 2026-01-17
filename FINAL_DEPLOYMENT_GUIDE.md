# 最終部署指南 - 完整步驟

## ⚠️ 重要提示

Git 還沒有安裝在你的系統上。需要先安裝 Git。

---

## 步驟 1：安裝 Git

### Windows 安裝

1. 訪問 https://git-scm.com/download/win
2. 下載 Git 安裝程序
3. 運行安裝程序，按照默認選項安裝
4. **重啟 PowerShell**（重要！）

### 驗證安裝

重啟 PowerShell 後，運行：
```powershell
git --version
```

應該看到類似的輸出：
```
git version 2.x.x.windows.x
```

---

## 步驟 2：配置 Git

```powershell
git config --global user.name "yhy12721-taroflame"
git config --global user.email "yhy12721@gmail.com"
```

---

## 步驟 3：初始化本地 Git 倉庫

```powershell
cd C:\Users\yhy12\.kiro
git init
git add .
git commit -m "Initial commit: xiangqi game"
```

---

## 步驟 4：連接到 GitHub

根據你在 GitHub 上創建的倉庫，執行以下命令（替換 `YOUR_USERNAME`）：

```powershell
git remote add origin https://github.com/yhy12721-taroflame/yuyan-chess.git
git branch -M main
git push -u origin main
```

**系統會要求輸入 GitHub 密碼或 Personal Access Token**

### 如果要求輸入密碼

1. 訪問 https://github.com/settings/tokens
2. 點擊 **Generate new token**
3. 選擇 **Generate new token (classic)**
4. 勾選 `repo` 權限
5. 點擊 **Generate token**
6. 複製 token
7. 在 PowerShell 中粘貼 token 作為密碼

---

## 步驟 5：驗證推送成功

訪問你的 GitHub 倉庫：
```
https://github.com/yhy12721-taroflame/yuyan-chess
```

應該能看到所有的代碼文件。

---

## 步驟 6：部署到 Vercel

### 6.1 訪問 Vercel

1. 訪問 https://vercel.com
2. 點擊 **Sign Up**
3. 選擇 **Continue with GitHub**
4. 授權 Vercel 訪問你的 GitHub

### 6.2 導入項目

1. 點擊 **Add New** → **Project**
2. 在 "Import Git Repository" 中搜索 `yuyan-chess`
3. 點擊 **Import**

### 6.3 配置部署

**Build Command**：
```
npm run build:ui && npm run server:build
```

**Output Directory**：
```
public
```

**Environment Variables**：
| 名稱 | 值 |
|------|-----|
| NODE_ENV | production |
| PORT | 3000 |
| LOG_LEVEL | info |
| HEARTBEAT_INTERVAL | 30000 |
| HEARTBEAT_TIMEOUT | 60000 |
| MAX_PLAYERS_PER_ROOM | 2 |
| ROOM_IDLE_TIMEOUT | 3600000 |

### 6.4 部署

1. 點擊 **Deploy**
2. 等待部署完成（2-5 分鐘）
3. 獲得部署 URL

---

## 🎉 完成！

你的應用現在已在全球可用！

**部署 URL**：`https://yuyan-chess.vercel.app`

---

## 📱 測試線上對戰

### 在不同設備上測試

**設備 A**：
1. 打開 `https://yuyan-chess.vercel.app`
2. 點擊 **線上對決**
3. 輸入房間號（例如：1）
4. 選擇 **紅方**

**設備 B**：
1. 打開 `https://yuyan-chess.vercel.app`
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
git commit -m "Update: description"
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

### Q：Git 安裝後還是找不到？

**A**：
1. 重啟 PowerShell
2. 或重啟電腦
3. 確保安裝時選擇了 "Add Git to PATH"

### Q：部署失敗怎麼辦？

**A**：
1. 檢查 Vercel 部署日誌
2. 確保 `npm run build:ui` 成功
3. 確保 `npm run server:build` 成功

### Q：WebSocket 連接失敗？

**A**：
1. 確保使用 `wss://`（安全 WebSocket）
2. 檢查瀏覽器控制台的錯誤信息
3. 查看 Vercel 伺服器日誌

---

## 📚 相關文檔

- `QUICK_CLOUD_DEPLOYMENT.md` - 快速部署指南
- `CLOUD_DEPLOYMENT_GUIDE.md` - 詳細部署指南
- `DEPLOYMENT_STEPS.md` - 部署步驟

---

**準備好了嗎？開始安裝 Git 吧！** 🚀
