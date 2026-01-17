# GitHub 和 Vercel 部署步骤

## 第一步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `xiangqi-game`
   - Description: `象棋游戏 - 中国传统棋类游戏`
   - Public（公开）
3. 点击 "Create repository"

## 第二步：上传代码到 GitHub

在你的项目目录中运行：

```bash
git init
git add .
git commit -m "Initial commit: Xiangqi game with full rules implementation"
git branch -M main
git remote add origin https://github.com/你的用户名/xiangqi-game.git
git push -u origin main
```

## 第三步：部署到 Vercel

### 方法 A：使用 Vercel 网站（最简单）

1. 访问 https://vercel.com
2. 点击 "Sign Up" 并用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 "Import Git Repository"
5. 搜索并选择 `xiangqi-game` 仓库
6. 点击 "Import"
7. 在 "Configure Project" 页面：
   - Framework Preset: 选择 "Other"
   - Build Command: `npm run build:ui`
   - Output Directory: `public`
8. 点击 "Deploy"

### 方法 B：使用 Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## 第四步：获得公网 URL

部署完成后，你会看到一个 URL，例如：
```
https://xiangqi-game.vercel.app
```

## 分享给朋友

复制这个 URL 并分享给朋友，他们就可以在线玩象棋了！

## 后续更新

每次你推送代码到 GitHub 的 main 分支时，Vercel 会自动重新部署。

```bash
git add .
git commit -m "Update: Add new features"
git push
```

## 常见问题

### Q: 如何自定义域名？
A: 在 Vercel 项目设置中，点击 "Domains" 并添加你的自定义域名。

### Q: 如何查看部署日志？
A: 在 Vercel 仪表板中点击项目，然后查看 "Deployments" 标签。

### Q: 如何回滚到之前的版本？
A: 在 Vercel 的 "Deployments" 标签中，点击之前的部署并选择 "Redeploy"。

## 需要帮助？

- Vercel 文档：https://vercel.com/docs
- GitHub 文档：https://docs.github.com
