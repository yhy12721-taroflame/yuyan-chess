# 象棋线上对战服务器 Docker 配置
# 
# 用于构建和运行象棋线上对战服务器的 Docker 镜像

# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 编译 TypeScript
RUN npm run server:build

# 运行阶段
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装 dumb-init（用于正确处理信号）
RUN apk add --no-cache dumb-init

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 从构建阶段复制编译后的代码
COPY --from=builder /app/server/dist ./server/dist

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 使用 dumb-init 作为 PID 1 进程
ENTRYPOINT ["dumb-init", "--"]

# 启动服务器
CMD ["node", "server/dist/server.js"]

