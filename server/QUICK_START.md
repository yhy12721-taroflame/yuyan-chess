# 象棋线上对战服务器 - 快速启动指南

## 前置要求

- Node.js 18+ 
- npm 或 yarn

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

根据需要修改 `.env` 中的配置。

### 3. 启动开发服务器

```bash
npm run server:dev
```

服务器将在 `ws://localhost:8080` 启动。

## 常用命令

### 开发

```bash
# 启动开发服务器（自动重启）
npm run server:dev

# 编译 TypeScript
npm run server:build

# 运行生产服务器
npm run server:start
```

### 测试

```bash
# 运行所有测试
npm run server:test

# 监视模式运行测试
npm run server:test -- --watch

# 生成覆盖率报告
npm run server:test -- --coverage
```

## 项目结构

```
server/
├── src/
│   ├── server.ts           # 服务器主文件
│   ├── types/              # 类型定义
│   ├── managers/           # 管理器类
│   ├── handlers/           # 消息处理器
│   └── utils/              # 工具函数
├── __tests__/              # 测试文件
├── tsconfig.json           # TypeScript 配置
├── jest.config.js          # Jest 配置
└── README.md               # 详细文档
```

## 下一步

1. 查看 `server/README.md` 了解详细的架构和开发指南
2. 查看 `src/types/index.ts` 了解消息类型定义
3. 开始实现管理器和处理器

## 故障排除

### 端口已被占用

如果 8080 端口已被占用，可以通过修改 `.env` 文件中的 `PORT` 变量来改变端口：

```
PORT=3000
```

### 模块未找到错误

确保已运行 `npm install` 安装所有依赖。

### TypeScript 编译错误

确保 TypeScript 版本正确：

```bash
npm install typescript@^5.3.0
```

## 获取帮助

查看 `server/README.md` 获取更多信息。
