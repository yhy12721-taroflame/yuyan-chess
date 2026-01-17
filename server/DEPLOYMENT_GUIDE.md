# 象棋线上对战服务器 - 部署指南

## 目录

1. [快速开始](#快速开始)
2. [Docker 部署](#docker-部署)
3. [云服务部署](#云服务部署)
4. [Heroku 部署](#heroku-部署)
5. [Vercel 部署](#vercel-部署)
6. [自建服务器部署](#自建服务器部署)
7. [监控和维护](#监控和维护)
8. [故障排查](#故障排查)

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run server:dev

# 运行测试
npm run server:test

# 构建生产版本
npm run server:build

# 启动生产服务器
npm run server:start
```

### 使用 Docker Compose

```bash
# 启动服务器
docker-compose up -d

# 查看日志
docker-compose logs -f xiangqi-server

# 停止服务器
docker-compose down
```

## Docker 部署

### 构建 Docker 镜像

```bash
# 构建镜像
docker build -t xiangqi-server:latest .

# 标记镜像
docker tag xiangqi-server:latest your-registry/xiangqi-server:latest

# 推送到镜像仓库
docker push your-registry/xiangqi-server:latest
```

### 运行 Docker 容器

```bash
# 运行容器
docker run -d \
  --name xiangqi-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  xiangqi-server:latest

# 查看容器日志
docker logs -f xiangqi-server

# 停止容器
docker stop xiangqi-server

# 删除容器
docker rm xiangqi-server
```

### Docker 环境变量

```bash
# 服务器配置
NODE_ENV=production          # 环境（development/production）
PORT=3000                    # 监听端口
LOG_LEVEL=info              # 日志级别（debug/info/warn/error）

# 心跳配置
HEARTBEAT_INTERVAL=30000    # 心跳间隔（毫秒）
HEARTBEAT_TIMEOUT=60000     # 心跳超时（毫秒）

# 重连配置
RECONNECT_INITIAL_DELAY=1000    # 初始重连延迟（毫秒）
RECONNECT_MAX_DELAY=30000       # 最大重连延迟（毫秒）

# 房间配置
MAX_PLAYERS_PER_ROOM=2      # 房间最大玩家数
ROOM_IDLE_TIMEOUT=3600000   # 房间空闲超时（毫秒）

# 游戏配置
MOVE_TIMEOUT=30000          # 移动超时（毫秒）

# CORS 配置
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

## 云服务部署

### AWS EC2

#### 1. 创建 EC2 实例

```bash
# 使用 Amazon Linux 2 或 Ubuntu 20.04 LTS
# 选择 t3.micro 或更高配置
# 配置安全组允许 3000 端口入站
```

#### 2. 连接到实例并部署

```bash
# SSH 连接到实例
ssh -i your-key.pem ec2-user@your-instance-ip

# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 克隆仓库
git clone https://github.com/your-username/xiangqi-game.git
cd xiangqi-game

# 安装依赖
npm install

# 构建服务器
npm run server:build

# 使用 PM2 启动服务器
npm install -g pm2
pm2 start server/dist/server.js --name xiangqi-server
pm2 save
pm2 startup
```

#### 3. 配置 Nginx 反向代理

```bash
# 安装 Nginx
sudo yum install -y nginx

# 编辑 Nginx 配置
sudo nano /etc/nginx/conf.d/xiangqi.conf
```

```nginx
upstream xiangqi_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # WebSocket 支持
    location / {
        proxy_pass http://xiangqi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

```bash
# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Google Cloud Platform (GCP)

#### 1. 创建 Cloud Run 服务

```bash
# 构建并推送镜像到 Google Container Registry
gcloud builds submit --tag gcr.io/your-project/xiangqi-server

# 部署到 Cloud Run
gcloud run deploy xiangqi-server \
  --image gcr.io/your-project/xiangqi-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=3000
```

### Microsoft Azure

#### 1. 使用 Azure Container Instances

```bash
# 登录 Azure
az login

# 创建资源组
az group create --name xiangqi-rg --location eastus

# 创建容器实例
az container create \
  --resource-group xiangqi-rg \
  --name xiangqi-server \
  --image your-registry.azurecr.io/xiangqi-server:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production PORT=3000 \
  --registry-login-server your-registry.azurecr.io \
  --registry-username your-username \
  --registry-password your-password
```

## Heroku 部署

### 1. 创建 Procfile

```bash
# Procfile 已创建，内容如下：
# web: node server/dist/server.js
```

### 2. 部署到 Heroku

```bash
# 安装 Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 登录 Heroku
heroku login

# 创建应用
heroku create xiangqi-game

# 设置环境变量
heroku config:set NODE_ENV=production
heroku config:set PORT=3000

# 部署
git push heroku main

# 查看日志
heroku logs --tail

# 打开应用
heroku open
```

## Vercel 部署

### 1. 创建 vercel-server.json

```bash
# vercel-server.json 已创建
```

### 2. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

## 自建服务器部署

### 1. 使用 PM2 进程管理

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server/dist/server.js --name xiangqi-server

# 配置开机自启
pm2 startup
pm2 save

# 查看进程
pm2 list

# 查看日志
pm2 logs xiangqi-server

# 重启应用
pm2 restart xiangqi-server

# 停止应用
pm2 stop xiangqi-server

# 删除应用
pm2 delete xiangqi-server
```

### 2. 使用 Systemd 服务

```bash
# 创建服务文件
sudo nano /etc/systemd/system/xiangqi-server.service
```

```ini
[Unit]
Description=象棋线上对战服务器
After=network.target

[Service]
Type=simple
User=xiangqi
WorkingDirectory=/home/xiangqi/xiangqi-game
ExecStart=/usr/bin/node /home/xiangqi/xiangqi-game/server/dist/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# 启用服务
sudo systemctl enable xiangqi-server

# 启动服务
sudo systemctl start xiangqi-server

# 查看状态
sudo systemctl status xiangqi-server

# 查看日志
sudo journalctl -u xiangqi-server -f
```

### 3. 配置 SSL/TLS

```bash
# 使用 Let's Encrypt 获取免费证书
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot certonly --standalone -d your-domain.com

# 配置 Nginx 使用证书
# 参考上面的 Nginx 配置示例
```

## 监控和维护

### 日志监控

```bash
# 查看实时日志
docker logs -f xiangqi-server

# 查看历史日志
docker logs xiangqi-server | tail -100

# 导出日志
docker logs xiangqi-server > server.log 2>&1
```

### 性能监控

```bash
# 使用 PM2 监控
pm2 monit

# 使用 Docker stats 监控
docker stats xiangqi-server

# 使用 top 命令
top -p $(pgrep -f "node server/dist/server.js")
```

### 定期备份

```bash
# 备份数据库（如果使用）
# 备份配置文件
# 备份日志文件
```

## 故障排查

### 常见问题

#### 1. 连接超时

**症状**: 客户端无法连接到服务器

**解决方案**:
- 检查服务器是否运行：`docker ps` 或 `pm2 list`
- 检查防火墙设置：`sudo ufw status`
- 检查端口是否开放：`netstat -tlnp | grep 3000`
- 检查 CORS 配置

#### 2. 内存泄漏

**症状**: 服务器内存占用不断增加

**解决方案**:
- 检查日志中的错误
- 使用 `node --inspect` 进行内存分析
- 检查消息队列是否正确清理
- 检查连接是否正确关闭

#### 3. 高 CPU 占用

**症状**: 服务器 CPU 占用率很高

**解决方案**:
- 检查是否有无限循环
- 检查是否有大量并发连接
- 使用 `node --prof` 进行性能分析
- 考虑增加服务器资源

#### 4. WebSocket 连接断开

**症状**: 客户端频繁断开连接

**解决方案**:
- 检查心跳配置
- 检查网络稳定性
- 检查代理/负载均衡器配置
- 增加心跳超时时间

### 调试技巧

```bash
# 启用详细日志
export LOG_LEVEL=debug

# 启用 Node.js 调试
node --inspect server/dist/server.js

# 使用 Chrome DevTools 调试
# 访问 chrome://inspect
```

## 性能优化

### 1. 启用 Gzip 压缩

```nginx
gzip on;
gzip_types text/plain application/json;
gzip_min_length 1000;
```

### 2. 启用缓存

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 使用 CDN

- 使用 CloudFlare 或其他 CDN 服务
- 缓存静态资源
- 加速全球访问

### 4. 数据库优化

- 使用连接池
- 添加索引
- 定期清理过期数据

## 安全建议

### 1. 启用 HTTPS

- 使用 Let's Encrypt 获取免费证书
- 配置 HSTS 头
- 定期更新证书

### 2. 限制请求速率

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### 3. 验证输入

- 验证所有客户端输入
- 使用消息验证器
- 防止 SQL 注入和 XSS 攻击

### 4. 定期更新依赖

```bash
npm audit
npm update
```

## 支持和反馈

如有问题或建议，请提交 Issue 或 Pull Request。

