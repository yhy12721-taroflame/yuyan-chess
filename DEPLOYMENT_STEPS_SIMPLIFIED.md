# 部署步驟 - 簡化版

## 第一步：安裝 Git for Windows

1. **下載 Git**
   - 訪問：https://git-scm.com/download/win
   - 點擊 **64-bit Git for Windows Setup**
   - 等待下載完成

2. **運行安裝程序**
   - 雙擊下載的 `.exe` 文件
   - 按照默認選項安裝
   - **重要**：確保勾選 "Add Git to PATH"
   - 點擊 **Install**
   - 等待安裝完成

3. **重啟 PowerShell**
   - 關閉所有 PowerShell 窗口
   - 重新打開 PowerShell
   - 運行以下命令驗證：
     ```powershell
     git --version
     ```
   - 應該看到類似輸出：`git version 2.x.x.windows.x`

---

## 第二步：推送代碼到 GitHub

在 PowerShell 中運行以下命令（逐行複製粘貼）：

```powershell
# 進入項目目錄
cd C:\Users\yhy12\.kiro

# 初始化 Git 倉庫
git init

# 配置 Git 用戶信息
git config --global user.name "yhy12721-taroflame"
git config --global user.email "yhy12721@gmail.com"

# 添加所有文件
git add .

# 提交代碼
git commit -m "Initial commit: xiangqi game"

# 添加遠程倉庫
git remote add origin https://github.com/yhy12721-taroflame/yuyan-chess.git

# 重命名分支為 main
git branch -M main

# 推送代碼到 GitHub
git push -u origin main
```

**系統會要求輸入 GitHub 密碼或 Personal Access Token**

### 如果要求輸入密碼

1. 訪問：https://github.com/settings/tokens
2. 點擊 **Generate new token**
3. 選擇 **Generate new token (classic)**
4. 勾選 `repo` 權限
5. 點擊 **Generate token**
6. 複製 token
7. 在 PowerShell 中粘貼 token 作為密碼

---

## 第三步：驗證推送成功

訪問你的 GitHub 倉庫：
```
https://github.com/yhy12721-taroflame/yuyan-chess
```

應該能看到所有的代碼文件。

---

## 第四步：部署到 Vercel

### 4.1 訪問 Vercel

1. 打開瀏覽器，訪問：https://vercel.com
2. 點擊 **Sign Up**
3. 選擇 **Continue with GitHub**
4. 授權 Vercel 訪問你的 GitHub

### 4.2 導入項目

1. 點擊 **Add New** → **Project**
2. 在 "Import Git Repository" 中搜索 `yuyan-chess`
3. 點擊 **Import**

### 4.3 配置部署

在 "Configure Project" 頁面中：

**Build Command**：
```
npm run build:ui && npm run server:build
```

**Output Directory**：
```
public
```

### 4.4 部署

1. 點擊 **Deploy**
2. 等待部署完成（通常 2-5 分鐘）
3. 看到 "Congratulations!" 表示部署成功

### 4.5 獲取部署 URL

部署完成後，你會看到一個 URL，類似：
```
https://yuyan-chess.vercel.app
```

---

## 第五步：測試線上對戰

### 在不同設備上測試

**設備 A（紅方）**：
1. 打開瀏覽器，訪問：`https://yuyan-chess.vercel.app`
2. 點擊 **線上對決**
3. 輸入房間號（例如：`1`）
4. 選擇 **紅方**
5. 等待對手加入

**設備 B（黑方）**：
1. 打開瀏覽器，訪問：`https://yuyan-chess.vercel.app`
2. 點擊 **線上對決**
3. 輸入相同房間號（`1`）
4. 選擇 **黑方**
5. 點擊 **開始遊戲**

### 驗證同步

- 在設備 A 上移動一個棋子
- 檢查設備 B 上是否立即顯示相同的移動
- 如果同步成功，說明線上對戰功能正常工作

---

## 🎉 完成！

你的應用現在已在全球可用！

**部署 URL**：`https://yuyan-chess.vercel.app`

---

## 常見問題

### Q：Git 安裝後還是找不到命令？

**A**：
1. 重啟電腦（不只是 PowerShell）
2. 或者在安裝時確保勾選了 "Add Git to PATH"
3. 重新安裝 Git

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

**準備好了嗎？開始安裝 Git 吧！** 🚀

