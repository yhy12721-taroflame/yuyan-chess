# 象棋游戏 - 部署指南

## 快速部署到 Vercel（推荐）

### 步骤 1：上传到 GitHub

1. 在 GitHub 上创建新仓库（例如：xiangqi-game）
2. 在本地运行以下命令：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/xiangqi-game.git
git push -u origin main
```

### 步骤 2：连接到 Vercel

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择你的 GitHub 仓库
5. 点击 "Deploy"

### 步骤 3：获得公网 URL

部署完成后，Vercel 会给你一个公网 URL，例如：
```
https://xiangqi-game.vercel.app
```

分享这个 URL 给朋友，他们就可以在线玩象棋了！

## 本地开发

```bash
# 安装依赖
npm install

# 构建 UI
npm run build:ui

# 运行测试
npm test

# 本地预览（需要启动 HTTP 服务器）
# 可以使用 VS Code 的 Live Server 扩展
# 或者使用 Python: python -m http.server 8000
# 然后访问 http://localhost:8000/public/index.html
```

## 项目结构

- `src/` - TypeScript 源代码
- `public/` - 静态文件（HTML、CSS、JS）
- `__tests__/` - 测试文件
- `public/app.js` - 编译后的 JavaScript（由 esbuild 生成）

## 环境要求

- Node.js 18+
- npm 或 yarn

## 功能特性

- ✅ 完整的象棋规则实现
- ✅ 本地对战
- ✅ 将军检测
- ✅ 棋子移动验证
- ✅ 响应式设计
- ✅ 离线可用

## 线上对决功能

目前"线上对决"功能还在开发中。要实现真正的在线对战，需要：

1. 后端服务器（Node.js + Express）
2. WebSocket 实时通信
3. 游戏房间管理
4. 玩家匹配系统

这些功能将在后续版本中添加。
