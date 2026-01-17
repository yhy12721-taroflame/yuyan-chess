# 象棋线上对战服务器 - 生产环境配置

## 目录

1. [环境变量](#环境变量)
2. [性能调优](#性能调优)
3. [安全配置](#安全配置)
4. [监控告警](#监控告警)
5. [备份恢复](#备份恢复)
6. [扩展性](#扩展性)

## 环境变量

### 基础配置

```bash
# 环境
NODE_ENV=production

# 服务器
PORT=3000
HOST=0.0.0.0

# 日志
LOG_LEVEL=info
LOG_FORMAT=json
```

### 心跳配置

```bash
# 心跳间隔（毫秒）
# 建议值：30000（30秒）
HEARTBEAT_INTERVAL=30000

# 心跳超时（毫秒）
# 建议值：60000（60秒）
HEARTBEAT_TIMEOUT=60000

# 心跳检查间隔（毫秒）
# 建议值：10000（10秒）
HEARTBEAT_CHECK_INTERVAL=10000
```

### 重连配置

```bash
# 初始重连延迟（毫秒）
# 建议值：1000（1秒）
RECONNECT_INITIAL_DELAY=1000

# 最大重连延迟（毫秒）
# 建议值：30000（30秒）
RECONNECT_MAX_DELAY=30000

# 重连延迟倍数（指数退避）
# 建议值：2
RECONNECT_BACKOFF_MULTIPLIER=2

# 最大重连尝试次数
# 建议值：10
MAX_RECONNECT_ATTEMPTS=10
```

### 房间配置

```bash
# 房间最大玩家数
# 建议值：2（象棋是两人游戏）
MAX_PLAYERS_PER_ROOM=2

# 房间空闲超时（毫秒）
# 建议值：3600000（1小时）
ROOM_IDLE_TIMEOUT=3600000

# 房间清理间隔（毫秒）
# 建议值：300000（5分钟）
ROOM_CLEANUP_INTERVAL=300000

# 最大房间数
# 建议值：1000
MAX_ROOMS=1000
```

### 游戏配置

```bash
# 移动超时（毫秒）
# 建议值：30000（30秒）
MOVE_TIMEOUT=30000

# 游戏状态同步间隔（毫秒）
# 建议值：100（100毫秒）
GAME_STATE_SYNC_INTERVAL=100

# 最大移动历史记录数
# 建议值：1000
MAX_MOVE_HISTORY=1000
```

### 消息队列配置

```bash
# 消息队列最大重试次数
# 建议值：3
MESSAGE_QUEUE_MAX_RETRIES=3

# 消息过期时间（毫秒）
# 建议值：3600000（1小时）
MESSAGE_QUEUE_EXPIRE_TIME=3600000

# 消息队列清理间隔（毫秒）
# 建议值：300000（5分钟）
MESSAGE_QUEUE_CLEANUP_INTERVAL=300000
```

### CORS 配置

```bash
# 允许的来源（逗号分隔）
# 示例：https://example.com,https://app.example.com
ALLOWED_ORIGINS=https://example.com

# 允许的方法
ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS

# 允许的头
ALLOWED_HEADERS=Content-Type,Authorization

# 允许凭证
ALLOW_CREDENTIALS=true

# 预检请求缓存时间（秒）
CORS_MAX_AGE=86400
```

### 数据库配置（可选）

```bash
# 数据库类型
DB_TYPE=mongodb

# 数据库连接字符串
DB_URL=mongodb://localhost:27017/xiangqi

# 数据库连接池大小
DB_POOL_SIZE=10

# 数据库连接超时（毫秒）
DB_CONNECT_TIMEOUT=5000
```

### Redis 配置（可选）

```bash
# Redis 主机
REDIS_HOST=localhost

# Redis 端口
REDIS_PORT=6379

# Redis 密码
REDIS_PASSWORD=

# Redis 数据库
REDIS_DB=0

# Redis 连接池大小
REDIS_POOL_SIZE=10
```

### 监控配置

```bash
# Prometheus 指标端口
METRICS_PORT=9090

# 指标收集间隔（毫秒）
METRICS_INTERVAL=60000

# 启用性能分析
ENABLE_PROFILING=false

# 启用内存分析
ENABLE_MEMORY_PROFILING=false
```

## 性能调优

### 1. Node.js 优化

```bash
# 增加最大连接数
ulimit -n 65536

# 启用集群模式
NODE_CLUSTER_WORKERS=4

# 启用 V8 代码缓存
NODE_V8_COVERAGE=

# 设置堆大小
NODE_OPTIONS="--max-old-space-size=4096"
```

### 2. 操作系统优化

```bash
# 增加文件描述符限制
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf

# 增加网络连接数
echo "net.core.somaxconn = 65536" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65536" >> /etc/sysctl.conf

# 应用配置
sysctl -p
```

### 3. 数据库优化

```bash
# 创建索引
db.rooms.createIndex({ "createdAt": 1 })
db.rooms.createIndex({ "status": 1 })
db.players.createIndex({ "playerId": 1 })

# 启用压缩
db.rooms.createIndex({ "gameState": 1 }, { "compression": "snappy" })
```

### 4. 缓存优化

```bash
# 使用 Redis 缓存房间列表
# 使用 Redis 缓存玩家信息
# 使用 Redis 缓存游戏状态

# 缓存过期时间
CACHE_EXPIRE_TIME=300000  # 5分钟
```

## 安全配置

### 1. 认证和授权

```bash
# JWT 密钥
JWT_SECRET=your-secret-key-here

# JWT 过期时间
JWT_EXPIRE_TIME=86400  # 24小时

# 启用 API 密钥认证
ENABLE_API_KEY_AUTH=true

# API 密钥
API_KEYS=key1,key2,key3
```

### 2. 速率限制

```bash
# 启用速率限制
ENABLE_RATE_LIMITING=true

# 请求速率限制（每秒）
RATE_LIMIT_REQUESTS_PER_SECOND=100

# 连接速率限制（每秒）
RATE_LIMIT_CONNECTIONS_PER_SECOND=10

# 消息速率限制（每秒）
RATE_LIMIT_MESSAGES_PER_SECOND=50
```

### 3. 输入验证

```bash
# 最大消息大小（字节）
MAX_MESSAGE_SIZE=65536

# 最大昵称长度
MAX_PLAYER_NAME_LENGTH=20

# 最小昵称长度
MIN_PLAYER_NAME_LENGTH=1

# 允许的昵称字符
ALLOWED_NAME_CHARS=a-zA-Z0-9_-中文
```

### 4. HTTPS/TLS

```bash
# 启用 HTTPS
ENABLE_HTTPS=true

# SSL 证书路径
SSL_CERT_PATH=/etc/ssl/certs/server.crt

# SSL 密钥路径
SSL_KEY_PATH=/etc/ssl/private/server.key

# 启用 HSTS
ENABLE_HSTS=true

# HSTS 最大年龄（秒）
HSTS_MAX_AGE=31536000
```

### 5. 安全头

```bash
# 启用安全头
ENABLE_SECURITY_HEADERS=true

# X-Frame-Options
X_FRAME_OPTIONS=DENY

# X-Content-Type-Options
X_CONTENT_TYPE_OPTIONS=nosniff

# X-XSS-Protection
X_XSS_PROTECTION=1; mode=block

# Content-Security-Policy
CONTENT_SECURITY_POLICY=default-src 'self'
```

## 监控告警

### 1. 关键指标

```bash
# 连接数
ALERT_CONNECTIONS_THRESHOLD=10000

# 内存使用率
ALERT_MEMORY_THRESHOLD=80

# CPU 使用率
ALERT_CPU_THRESHOLD=80

# 错误率
ALERT_ERROR_RATE_THRESHOLD=1

# 响应时间
ALERT_RESPONSE_TIME_THRESHOLD=1000  # 毫秒
```

### 2. 日志配置

```bash
# 日志级别
LOG_LEVEL=info

# 日志格式
LOG_FORMAT=json

# 日志输出
LOG_OUTPUT=stdout,file

# 日志文件路径
LOG_FILE_PATH=/var/log/xiangqi-server.log

# 日志文件大小限制
LOG_FILE_MAX_SIZE=104857600  # 100MB

# 日志文件保留数
LOG_FILE_RETENTION=10
```

### 3. 告警规则

```bash
# 启用告警
ENABLE_ALERTS=true

# 告警通知方式
ALERT_CHANNELS=email,slack,webhook

# 邮件告警
ALERT_EMAIL_TO=admin@example.com
ALERT_EMAIL_FROM=alerts@example.com

# Slack 告警
ALERT_SLACK_WEBHOOK=https://hooks.slack.com/services/...

# Webhook 告警
ALERT_WEBHOOK_URL=https://example.com/alerts
```

## 备份恢复

### 1. 数据备份

```bash
# 每日备份
0 2 * * * /usr/local/bin/backup-xiangqi.sh

# 备份脚本
#!/bin/bash
BACKUP_DIR=/backups/xiangqi
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/xiangqi" --out=$BACKUP_DIR/$DATE
```

### 2. 备份保留策略

```bash
# 保留最近 30 天的每日备份
# 保留最近 12 个月的每周备份
# 保留最近 5 年的每月备份
```

### 3. 恢复流程

```bash
# 恢复数据库
mongorestore --uri="mongodb://localhost:27017/xiangqi" /backups/xiangqi/20240101_000000

# 验证恢复
db.rooms.count()
db.players.count()
```

## 扩展性

### 1. 水平扩展

```bash
# 使用负载均衡器
# 配置多个服务器实例
# 使用 Redis 共享状态

# Nginx 负载均衡配置
upstream xiangqi_backend {
    server server1:3000;
    server server2:3000;
    server server3:3000;
}
```

### 2. 垂直扩展

```bash
# 增加服务器资源
# 增加 CPU 核心数
# 增加内存大小
# 增加磁盘空间
```

### 3. 微服务架构

```bash
# 分离认证服务
# 分离游戏服务
# 分离房间服务
# 分离消息服务

# 使用消息队列（RabbitMQ、Kafka）
# 使用服务网格（Istio）
```

### 4. 缓存策略

```bash
# 使用 Redis 缓存
# 缓存房间列表
# 缓存玩家信息
# 缓存游戏状态

# 缓存失效策略
# TTL 过期
# 主动失效
# 被动失效
```

## 检查清单

部署前请确保：

- [ ] 所有环境变量已正确配置
- [ ] SSL/TLS 证书已安装
- [ ] 数据库已初始化
- [ ] Redis 已启动（如果使用）
- [ ] 防火墙规则已配置
- [ ] 日志目录已创建
- [ ] 备份策略已实施
- [ ] 监控告警已配置
- [ ] 性能测试已完成
- [ ] 安全审计已通过

## 支持和反馈

如有问题或建议，请提交 Issue 或 Pull Request。

