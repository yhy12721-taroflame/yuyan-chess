# Git 安裝和部署完整指南

## 第一步：安裝 Git

### 方式 1：使用 GitHub Desktop（推薦 - 最簡單）

1. **下載 GitHub Desktop**
   - 訪問：https://desktop.github.com
   - 點擊 **Download for Windows**
   - 等待下載完成

2. **安裝 GitHub Desktop**
   - 運行下載的安裝程序
   - 按照提示完成安裝
   - 安裝完成後會自動打開

3. **登錄 GitHub**
   - 點擊 **File** → **Options**
   - 點擊 **Accounts**
   - 點擊 **Sign in**
   - 使用你的 GitHub 賬號登錄
     - 用戶名：`yhy12721-taroflame`
     - 郵箱：`yhy12721@gmail.com`

4. **克隆或創建倉庫**
   - 點擊 **File** → **New Repository**
   - 或者 **Clone a Repository**

---

### 方式 2：使用 Git for Windows（傳統方式）

1. **下載 Git**
   - 訪問：https://git-scm.com/download/win
   - 點擊 **64-bit Git for Windows Setup**
   - 等待下載完成

2. **安裝 Git**
   - 運行安裝程序
   - 按照默認選項安裝
   - **重要**：確保勾選 "Add Git to PATH"
   - 完成安裝

3. **重啟 PowerShell**
   - 關閉所有 PowerShell 窗口
   - 重新打開 PowerShell
   - 運行命令驗證：
     ```powershell
     git --version
     ```
   - 應該看到類似輸出：`git version 2.x.x.windows.x`

---

## 第二步：準備代碼推送

### 使用 GitHub Desktop（推薦）

1. **打開 GitHub Desktop**

2. **添加本地倉庫**
   - 點擊 **File** → **Add Local Repository**
   - 選擇你的項目文件夾：`C:\Users\yhy12\.kiro`
   - 點擊 **Add Repository**

3. **提交代碼**
   - 在左側面板中，你會看到所有修改的文件
   - 在 **Summary** 欄輸入提交信息：`Initial commit: xiangqi game`
   - 點擊 **Commit to main**

4. **發佈到 GitHub**
   - 點擊 **Publish repository**
   - 確保倉庫名稱是 `yuyan-chess`
   - 選擇 **Public**（公開）
   - 點擊 **Publish Repository**

5. **完成！**
   - 你的代碼現在已經在 GitHub 上了
   - 複製倉庫 URL：`https://github.com/yhy12721-taroflame/yuyan-chess`

---

### 使用 Git 命令行（如果已安裝 Git）

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

---

## 第三步：部署到 Vercel

### 步驟 1：訪問 Vercel

1. 打開瀏覽器，訪問：https://vercel.com
2. 點擊 **Sign Up**
3. 選擇 **Continue with GitHub**
4. 授權 Vercel 訪問你的 GitHub 賬號

### 步驟 2：導入項目

1. 點擊 **Add New** → **Project**
2. 在 "Import Git Repository" 中搜索 `yuyan-chess`
3. 點擊 **Import**

### 步驟 3：配置部署

在 "Configure Project" 頁面中：

**Build Command**：
```
npm run build:ui && npm run server:build
```

**Output Directory**：
```
public
```

**Environment Variables**（可選）：
| 名稱 | 值 |
|------|-----|
| NODE_ENV | production |
| PORT | 3000 |

### 步驟 4：部署

1. 點擊 **Deploy**
2. 等待部署完成（通常 2-5 分鐘）
3. 看到 "Congratulations!" 表示部署成功

### 步驟 5：獲取部署 URL

部署完成後，你會看到一個 URL，類似：
```
https://yuyan-chess.vercel.app
```

---

## 第四步：測試線上對戰

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

## 常見問題

### Q：GitHub Desktop 安裝後找不到？

**A**：
1. 檢查開始菜單中是否有 GitHub Desktop
2. 或者訪問 `C:\Users\[你的用戶名]\AppData\Local\GitHubDesktop\app-x.x.x\GitHubDesktop.exe`

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
4. 檢查是否有語法錯誤

### Q：WebSocket 連接失敗？

**A**：
1. 確保使用 `wss://`（安全 WebSocket）
2. 檢查瀏覽器控制台的錯誤信息
3. 查看 Vercel 伺服器日誌

---

## 下一步

部署完成後，你可以：

1. **分享 URL**：`https://yuyan-chess.vercel.app`
2. **邀請朋友**：讓他們訪問 URL 進行線上對戰
3. **更新代碼**：每次推送到 GitHub 時，Vercel 會自動重新部署

---

**準備好了嗎？選擇一種安裝方式開始吧！** 🚀

