/**
 * 象棋线上对战服务器主文件
 * 
 * 该文件是服务器的入口点，负责：
 * - 初始化 WebSocket 服务器
 * - 启动服务器监听
 * - 管理连接和消息路由
 */

import WebSocket from 'ws';
import http from 'http';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// 创建 HTTP 服务器
const server = http.createServer();

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

// 连接计数器
let connectionCount = 0;

/**
 * 处理新的 WebSocket 连接
 */
wss.on('connection', (ws: WebSocket) => {
  connectionCount++;
  console.log(`[连接] 新客户端连接，当前连接数: ${connectionCount}`);

  /**
   * 处理接收到的消息
   */
  ws.on('message', (data: WebSocket.Data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`[消息] 收到消息类型: ${message.type}`);
      
      // 这里将添加消息处理逻辑
      // 目前只是简单地回显消息
      ws.send(JSON.stringify({
        type: 'ack',
        data: { message: '消息已接收' }
      }));
    } catch (error) {
      console.error('[错误] 消息解析失败:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { 
          code: 'INVALID_MESSAGE_FORMAT',
          message: '消息格式无效'
        }
      }));
    }
  });

  /**
   * 处理连接关闭
   */
  ws.on('close', () => {
    connectionCount--;
    console.log(`[断开] 客户端断开连接，当前连接数: ${connectionCount}`);
  });

  /**
   * 处理错误
   */
  ws.on('error', (error: Error) => {
    console.error('[错误] WebSocket 错误:', error);
  });
});

/**
 * 启动服务器
 */
server.listen(PORT, () => {
  console.log(`[启动] 象棋线上对战服务器已启动，监听端口: ${PORT}`);
  console.log(`[信息] WebSocket 服务器地址: ws://localhost:${PORT}`);
});

/**
 * 处理服务器错误
 */
server.on('error', (error: Error) => {
  console.error('[错误] 服务器错误:', error);
  process.exit(1);
});

/**
 * 处理进程信号
 */
process.on('SIGINT', () => {
  console.log('\n[关闭] 收到 SIGINT 信号，正在关闭服务器...');
  server.close(() => {
    console.log('[关闭] 服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n[关闭] 收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    console.log('[关闭] 服务器已关闭');
    process.exit(0);
  });
});
