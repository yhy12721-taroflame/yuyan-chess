# 象棋线上对战服务器

这是象棋线上对战功能的 WebSocket 服务器实现。

## 项目结构

```
server/
├── src/
│   ├── server.ts           # 服务器主文件
│   ├── types/              # 类型定义
│   │   └── index.ts
│   ├── managers/           # 管理器类
│   │   └── index.ts
│   ├── handlers/           # 消息处理器
│   │   └── index.ts
│   └── utils/              # 工具函数
│       └── index.ts
├── __tests__/              # 测试文件
│   └── placeholder.test.ts
├── tsconfig.json           # TypeScript 配置
├── jest.config.js          # Jest 测试配置
└── README.md               # 本文件
```

## 安装依赖

```bash
npm install
```

## 开发

### 启动开发服务器

```bash
npm run server:dev
```

服务器将在 `ws://localhost:8080` 启动。

### 编译 TypeScript

```bash
npm run server:build
```

编译后的文件将输出到 `server/dist/` 目录。

### 运行生产服务器

```bash
npm run server:start
```

## 测试

### 运行测试

```bash
npm run server:test
```

### 监视模式运行测试

```bash
npm run server:test -- --watch
```

## 环境配置

复制 `.env.example` 为 `.env` 并根据需要修改配置：

```bash
cp .env.example .env
```

主要配置项：
- `PORT`: 服务器监听端口（默认 8080）
- `LOG_LEVEL`: 日志级别（默认 info）
- `NODE_ENV`: 环境（development 或 production）
- `HEARTBEAT_INTERVAL`: 心跳间隔（毫秒）
- `HEARTBEAT_TIMEOUT`: 心跳超时时间（毫秒）

## 依赖说明

### 生产依赖

- **ws**: WebSocket 库，用于实现 WebSocket 服务器
- **express**: Web 框架（可选，用于 HTTP 服务）
- **dotenv**: 环境变量管理
- **uuid**: 生成唯一 ID

### 开发依赖

- **@types/ws**: ws 库的 TypeScript 类型定义
- **@types/node**: Node.js 的 TypeScript 类型定义
- **ts-node**: 直接运行 TypeScript 文件
- **typescript**: TypeScript 编译器
- **jest**: 测试框架
- **ts-jest**: Jest 的 TypeScript 支持

## 架构

服务器采用以下架构：

1. **WebSocket 服务器**: 处理客户端连接和消息
2. **连接管理器**: 管理玩家连接和状态
3. **房间管理器**: 管理游戏房间和玩家配对
4. **游戏状态管理器**: 管理游戏状态和移动验证
5. **消息处理器**: 处理各种类型的消息
6. **工具函数**: 提供通用的工具函数

## 消息协议

所有消息采用 JSON 格式，包含以下基本结构：

```json
{
  "type": "message_type",
  "data": {
    // 具体数据
  }
}
```

详见 `src/types/index.ts` 中的消息类型定义。

## 开发指南

### 添加新的消息处理器

1. 在 `src/handlers/` 中创建新的处理器文件
2. 实现处理器类，继承自基础处理器
3. 在 `src/handlers/index.ts` 中导出处理器
4. 在服务器中注册处理器

### 添加新的管理器

1. 在 `src/managers/` 中创建新的管理器文件
2. 实现管理器类
3. 在 `src/managers/index.ts` 中导出管理器
4. 在服务器中使用管理器

### 添加新的工具函数

1. 在 `src/utils/` 中创建新的工具文件
2. 实现工具函数
3. 在 `src/utils/index.ts` 中导出函数

## 测试

### 单元测试

单元测试验证特定的例子和边界情况。

### 属性测试

属性测试验证通用属性在所有输入上都成立。

## 部署

### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY server/dist ./dist

EXPOSE 8080

CMD ["node", "dist/server.js"]
```

构建和运行：

```bash
docker build -t xiangqi-server .
docker run -p 8080:8080 xiangqi-server
```

### 云部署

支持部署到各种云平台，如 Heroku、AWS、Google Cloud 等。

## 许可证

MIT
