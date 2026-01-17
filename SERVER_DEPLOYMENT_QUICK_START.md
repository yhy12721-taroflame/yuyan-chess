# 象棋线上对战服务器 - 快速部署指南

## 🚀 5分钟快速部署

### 选项 1: Docker 本地测试（最快）

```bash
# 1. 启动服务器
docker-compose up -d

# 2. 查看日志
docker-compose logs -f xiangqi-server

# 3. 测试连接
# 访问 ws://localhost:3000

# 4. 停止服务器
docker-compose down
```

### 选项 2: Heroku 部署（免费）

```bash
# 1. 安装 Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. 登录
heroku login

# 3. 创建应用
heroku create xiangqi-game

# 4. 部署
git push heroku main

# 5. 查看日志
heroku logs --tail

# 6. 获取 URL
heroku open
```

### 选项 3: Vercel 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod

# 4. 获取 URL
# 部署完成后会显示 URL
```

### 选项 4: AWS EC2 部署

```bash
# 1. 创建 EC2 实例（t3.micro）
# 2. SSH 连接
ssh -i your-key.pem ec2-user@your-instance-ip

# 3. 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 4. 克隆并部署
git clone https://github.com/your-username/xiangqi-game.git
cd xiangqi-game
npm install
npm run server:build

# 5. 使用 PM2 启动
npm install -g pm2
pm2 start server/dist/server.js --name xiangqi-server
pm2 save
pm2 startup
```

## 📋 部署前检查清单

- [ ] Node.js 18+ 已安装
- [ ] npm 依赖已安装：`npm install`
- [ ] 服务器已编译：`npm run server:build`
- [ ] 环境变量已配置（参考 `.env.example`）
- [ ] 防火墙已开放 3000 端口
- [ ] SSL/TLS 证书已准备（生产环境）

## 🔧 环境变量配置

创建 `.env` 文件：

```bash
# 基础配置
NODE_ENV=production
PORT=3000

# 心跳配置
HEARTBEAT_INTERVAL=30000
HEARTBEAT_TIMEOUT=60000

# 重连配置
RECONNECT_INITIAL_DELAY=1000
RECONNECT_MAX_DELAY=30000

# 房间配置
MAX_PLAYERS_PER_ROOM=2
ROOM_IDLE_TIMEOUT=3600000

# CORS 配置
ALLOWED_ORIGINS=https://your-domain.com,https://app.your-domain.com
```

## 📊 部署方案对比

| 方案 | 成本 | 难度 | 优点 | 缺点 |
|------|------|------|------|------|
| **Docker** | 免费 | 简单 | 本地测试快速 | 需要 Docker |
| **Heroku** | 免费/付费 | 简单 | 自动部署 | 免费版本有限制 |
| **Vercel** | 免费/付费 | 简单 | 快速部署 | WebSocket 支持有限 |
| **AWS EC2** | 按量计费 | 中等 | 完全控制 | 需要配置 |
| **GCP** | 按量计费 | 中等 | 自动扩展 | 需要配置 |
| **Azure** | 按量计费 | 中等 | 企业级 | 需要配置 |

## 🌐 推荐部署方案

### 开发环境
```bash
docker-compose up -d
```

### 测试环境
```bash
heroku create xiangqi-game-test
git push heroku main
```

### 生产环境
```bash
# AWS EC2 + Nginx + PM2
# 或
# Docker + Kubernetes
# 或
# 自建服务器 + Systemd
```

## 📱 客户端连接

### Web 客户端

```typescript
import { WebSocketClient } from './client/WebSocketClient';

const client = new WebSocketClient('ws://your-server.com:3000');

// 连接
await client.connect();

// 注册消息处理器
client.on('connect_ack', (data) => {
  console.log('已连接，玩家ID:', data.playerId);
});

// 发送消息
client.send({
  type: 'connect',
  data: { playerName: '玩家名称' }
});
```

### 移动应用（Capacitor）

```typescript
// 使用相同的 WebSocketClient
// 代码完全相同，只需编译为 iOS/Android
```

## 🔍 监控和维护

### 查看日志

```bash
# Docker
docker logs -f xiangqi-server

# PM2
pm2 logs xiangqi-server

# Heroku
heroku logs --tail

# Systemd
sudo journalctl -u xiangqi-server -f
```

### 性能监控

```bash
# Docker
docker stats xiangqi-server

# PM2
pm2 monit

# 系统
top -p $(pgrep -f "node server/dist/server.js")
```

### 重启服务

```bash
# Docker
docker restart xiangqi-server

# PM2
pm2 restart xiangqi-server

# Heroku
heroku restart

# Systemd
sudo systemctl restart xiangqi-server
```

## 🐛 常见问题

### Q: 如何更新服务器代码？

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新编译
npm run server:build

# 3. 重启服务
docker restart xiangqi-server
# 或
pm2 restart xiangqi-server
# 或
git push heroku main
```

### Q: 如何查看实时连接数？

```bash
# 在服务器日志中查看
# 或使用监控工具（Prometheus、Grafana）
```

### Q: 如何处理连接超时？

```bash
# 检查防火墙
sudo ufw status

# 检查端口
netstat -tlnp | grep 3000

# 检查 CORS 配置
# 参考 PRODUCTION_CONFIG.md
```

### Q: 如何扩展到多个服务器？

```bash
# 1. 使用负载均衡器（Nginx、HAProxy）
# 2. 使用 Redis 共享状态
# 3. 使用消息队列（RabbitMQ、Kafka）
# 参考 PRODUCTION_CONFIG.md 中的扩展性部分
```

## 📚 详细文档

- **部署指南**: `server/DEPLOYMENT_GUIDE.md`
- **生产配置**: `server/PRODUCTION_CONFIG.md`
- **快速开始**: `server/QUICK_START.md`
- **项目 README**: `server/README.md`

## 🎯 下一步

1. **选择部署方案** - 根据需求选择合适的部署方式
2. **配置环境变量** - 根据 `.env.example` 配置
3. **部署服务器** - 按照上面的步骤部署
4. **测试连接** - 使用客户端测试连接
5. **监控维护** - 定期检查日志和性能

## 💬 支持

如有问题，请查看详细文档或提交 Issue。

---

**部署完成后，你可以：**
- ✅ 在 Web 上玩象棋
- ✅ 用 Capacitor 打包成 iOS/Android APP
- ✅ 与朋友在线对战
- ✅ 随时随地下载 APP 连线

祝你部署顺利！🎉
