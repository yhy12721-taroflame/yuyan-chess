/**
 * 象棋线上对战服务器主文件 - 简化版（单一房间）
 * 
 * 该文件是服务器的入口点，负责：
 * - 初始化 WebSocket 服务器
 * - 启动服务器监听
 * - 管理单一共享房间的连接和消息路由
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

// 存储所有连接的客户端
const clients = new Set<WebSocket>();

// 单一房间的游戏状态
let gameState = {
  players: [] as Array<{ id: string; name: string; color: 'red' | 'black' }>,
  board: null as any,
  currentPlayer: 'red' as 'red' | 'black',
  moveHistory: [] as any[]
};

/**
 * 广播消息给所有连接的客户端
 */
function broadcastMessage(message: any) {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

/**
 * 处理新的 WebSocket 连接
 */
wss.on('connection', (ws: WebSocket) => {
  connectionCount++;
  const clientId = `client_${Date.now()}_${Math.random()}`;
  clients.add(ws);
  
  console.log(`[连接] 新客户端连接 (${clientId})，当前连接数: ${connectionCount}`);

  // 发送连接确认
  ws.send(JSON.stringify({
    type: 'connect_ack',
    data: { 
      playerId: clientId,
      message: '已连接到服务器'
    }
  }));

  /**
   * 处理接收到的消息
   */
  ws.on('message', (data: WebSocket.Data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`[消息] 收到消息类型: ${message.type}`);
      
      switch (message.type) {
        case 'heartbeat':
          // 心跳消息 - 直接回复
          ws.send(JSON.stringify({
            type: 'heartbeat_ack',
            data: { timestamp: Date.now() }
          }));
          break;

        case 'join_game':
          // 玩家加入游戏
          const playerName = message.data?.playerName || '玩家';
          const playerColor = gameState.players.length === 0 ? 'red' : 'black';
          
          gameState.players.push({
            id: clientId,
            name: playerName,
            color: playerColor
          });

          console.log(`[游戏] ${playerName} 加入游戏 (${playerColor}方)`);

          // 广播玩家加入消息
          broadcastMessage({
            type: 'player_joined',
            data: {
              playerId: clientId,
              playerName: playerName,
              playerColor: playerColor,
              totalPlayers: gameState.players.length
            }
          });

          // 如果两个玩家都已加入，开始游戏
          if (gameState.players.length === 2) {
            broadcastMessage({
              type: 'game_started',
              data: {
                redPlayer: gameState.players[0],
                blackPlayer: gameState.players[1],
                currentPlayer: 'red'
              }
            });
          }
          break;

        case 'move':
          // 处理移动消息
          const move = message.data;
          console.log(`[移动] 玩家 ${clientId} 移动: ${move.from} -> ${move.to}`);

          // 广播移动给所有客户端
          broadcastMessage({
            type: 'move_made',
            data: {
              playerId: clientId,
              from: move.from,
              to: move.to,
              timestamp: Date.now()
            }
          });

          // 切换当前玩家
          gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';
          break;

        default:
          console.log(`[消息] 未知消息类型: ${message.type}`);
          ws.send(JSON.stringify({
            type: 'error',
            data: { 
              code: 'UNKNOWN_MESSAGE_TYPE',
              message: `未知消息类型: ${message.type}`
            }
          }));
      }
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
    clients.delete(ws);
    
    // 从游戏中移除玩家
    gameState.players = gameState.players.filter(p => p.id !== clientId);
    
    console.log(`[断开] 客户端断开连接 (${clientId})，当前连接数: ${connectionCount}`);

    // 广播玩家离开消息
    broadcastMessage({
      type: 'player_left',
      data: {
        playerId: clientId,
        totalPlayers: gameState.players.length
      }
    });

    // 如果没有玩家了，重置游戏状态
    if (gameState.players.length === 0) {
      gameState = {
        players: [],
        board: null,
        currentPlayer: 'red',
        moveHistory: []
      };
    }
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
  console.log(`[模式] 单一房间模式 - 所有玩家共享一个游戏房间`);
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
