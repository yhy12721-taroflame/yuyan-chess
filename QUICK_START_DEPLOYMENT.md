# 快速部署指南

## 3 分钟快速部署

### 1. 创建 GitHub 仓库
- 访问 https://github.com/new
- 创建名为 `xiangqi-game` 的公开仓库
- 复制仓库 URL

### 2. 上传代码
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <你的仓库URL>
git push -u origin main
```

### 3. 部署到 Vercel
- 访问 https://vercel.com
- 用 GitHub 账号登录
- 点击 "New Project"
- 选择 `xiangqi-game` 仓库
- 点击 "Deploy"

### 4. 完成！
- 等待部署完成（通常 1-2 分钟）
- 获得公网 URL
- 分享给朋友

## 你的朋友如何访问

1. 打开你分享的 URL
2. 点击 "本地对战" 开始游戏
3. 享受象棋！

## 后续更新

每次推送代码到 GitHub 时，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Your message"
git push
```

---

**就这么简单！** 🎮
