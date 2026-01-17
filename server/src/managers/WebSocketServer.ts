/**
 * WebSocket 服务器类
 * 
 * 负责：
 * - 管理 WebSocket 连接
 * - 处理客户端连接和断开事件
 * - 实现消息广播和单点发送
 * - 维护连接映射
 */

import WebSocket from 'ws';
import http from 'http';
import { Message } from '../types';

/**
 * WebSocket 服务器类
 */
export class WebSocketServer {
  private wss: WebSocket.Server;
  private server: http.Server;
  private connections: Map<string, WebSocket> = new Map();
  private roomConnections: Map<string, Set<string>> = new Map();

  /**
   * 构造函数
   */
  constructor() {
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });
    this.setupConnectionHandlers();
  }

  /**
   * 设置连接处理器
   */
  private setupConnectionHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      this.onConnection(ws);
    });
  }

  /**
   * 处理新连接
   * 
   * @param ws WebSocket 连接
   */
  private onConnection(ws: WebSocket): void {
    // 这里会在消息处理中分配玩家ID
    // 暂时不做任何处理，等待客户端发送连接消息

    ws.on('message', (data: WebSocket.Data) => {
      // 消息处理会在消息路由中进行
      // 这里只是接收消息，不做处理
    });

    ws.on('close', () => {
      this.onDisconnection(ws);
    });

    ws.on('error', (error: Error) => {
      console.error('[WebSocket 错误]', error);
    });
  }

  /**
   * 处理断开连接
   * 
   * @param ws WebSocket 连接
   */
  private onDisconnection(ws: WebSocket): void {
    // 查找并移除该连接对应的玩家ID
    for (const [playerId, connection] of this.connections.entries()) {
      if (connection === ws) {
        this.connections.delete(playerId);
        console.log(`[断开连接] 玩家 ${playerId} 已断开连接`);
        break;
      }
    }

    // 从房间连接映射中移除
    for (const [roomId, playerIds] of this.roomConnections.entries()) {
      for (const playerId of playerIds) {
        if (this.connections.get(playerId) === ws) {
          playerIds.delete(playerId);
          if (playerIds.size === 0) {
            this.roomConnections.delete(roomId);
          }
        }
      }
    }
  }

  /**
   * 启动服务器
   * 
   * @param port 监听端口
   */
  async start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(port, () => {
        console.log(`[WebSocket 服务器] 已启动，监听端口 ${port}`);
        resolve();
      });

      this.server.on('error', (error: Error) => {
        console.error('[WebSocket 服务器错误]', error);
        reject(error);
      });
    });
  }

  /**
   * 停止服务器
   */
  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 关闭所有连接
      this.wss.clients.forEach((ws: WebSocket) => {
        ws.close();
      });

      this.server.close((error?: Error) => {
        if (error) {
          console.error('[WebSocket 服务器关闭错误]', error);
          reject(error);
        } else {
          console.log('[WebSocket 服务器] 已关闭');
          resolve();
        }
      });
    });
  }

  /**
   * 注册玩家连接
   * 
   * @param playerId 玩家ID
   * @param ws WebSocket 连接
   */
  registerConnection(playerId: string, ws: WebSocket): void {
    this.connections.set(playerId, ws);
    console.log(`[连接注册] 玩家 ${playerId} 已注册`);
  }

  /**
   * 获取玩家连接
   * 
   * @param playerId 玩家ID
   * @returns WebSocket 连接，如果不存在则返回 undefined
   */
  getConnection(playerId: string): WebSocket | undefined {
    return this.connections.get(playerId);
  }

  /**
   * 注册房间连接
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   */
  registerRoomConnection(roomId: string, playerId: string): void {
    if (!this.roomConnections.has(roomId)) {
      this.roomConnections.set(roomId, new Set());
    }
    this.roomConnections.get(roomId)!.add(playerId);
  }

  /**
   * 移除房间连接
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   */
  removeRoomConnection(roomId: string, playerId: string): void {
    const playerIds = this.roomConnections.get(roomId);
    if (playerIds) {
      playerIds.delete(playerId);
      if (playerIds.size === 0) {
        this.roomConnections.delete(roomId);
      }
    }
  }

  /**
   * 获取房间内的所有玩家ID
   * 
   * @param roomId 房间ID
   * @returns 玩家ID 集合
   */
  getRoomPlayers(roomId: string): Set<string> {
    return this.roomConnections.get(roomId) || new Set();
  }

  /**
   * 广播消息给房间内所有玩家
   * 
   * @param roomId 房间ID
   * @param message 消息
   */
  broadcastToRoom(roomId: string, message: Message): void {
    const playerIds = this.roomConnections.get(roomId);
    if (!playerIds) {
      console.warn(`[广播] 房间 ${roomId} 不存在或没有玩家`);
      return;
    }

    const messageStr = JSON.stringify(message);
    let successCount = 0;

    playerIds.forEach((playerId: string) => {
      const ws = this.connections.get(playerId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
        successCount++;
      }
    });

    console.log(`[广播] 房间 ${roomId} 消息已发送给 ${successCount}/${playerIds.size} 个玩家`);
  }

  /**
   * 发送消息给特定玩家
   * 
   * @param playerId 玩家ID
   * @param message 消息
   */
  sendToPlayer(playerId: string, message: Message): void {
    const ws = this.connections.get(playerId);
    if (!ws) {
      console.warn(`[发送] 玩家 ${playerId} 连接不存在`);
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      console.warn(`[发送] 玩家 ${playerId} 连接未打开`);
      return;
    }

    ws.send(JSON.stringify(message));
    console.log(`[发送] 消息已发送给玩家 ${playerId}`);
  }

  /**
   * 获取 WebSocket 服务器实例
   * 
   * @returns WebSocket.Server 实例
   */
  getWss(): WebSocket.Server {
    return this.wss;
  }

  /**
   * 获取连接数
   * 
   * @returns 当前连接数
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * 获取房间数
   * 
   * @returns 当前房间数
   */
  getRoomCount(): number {
    return this.roomConnections.size;
  }
}
