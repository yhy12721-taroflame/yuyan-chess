/**
 * 心跳管理器
 * 
 * 负责：
 * - 定期发送心跳消息
 * - 检测心跳响应
 * - 超时断开连接（30秒）
 * - 实现心跳启动和停止
 */

import { ConnectionManager } from './ConnectionManager';
import { WebSocketServer } from './WebSocketServer';
import { HeartbeatMessage } from '../types';

/**
 * 心跳管理器类
 */
export class HeartbeatManager {
  // 心跳间隔（毫秒）
  private heartbeatInterval: number = 10000; // 10秒
  
  // 心跳超时时间（毫秒）
  private heartbeatTimeout: number = 30000; // 30秒
  
  // 心跳定时器
  private heartbeatTimer: NodeJS.Timeout | null = null;
  
  // 超时检测定时器
  private timeoutCheckTimer: NodeJS.Timeout | null = null;
  
  // 连接管理器
  private connectionManager: ConnectionManager;
  
  // WebSocket 服务器
  private wsServer: WebSocketServer;
  
  // 待确认的心跳集合：playerId -> timestamp
  private pendingHeartbeats: Map<string, number> = new Map();

  /**
   * 构造函数
   * 
   * @param connectionManager 连接管理器
   * @param wsServer WebSocket 服务器
   * @param heartbeatInterval 心跳间隔（毫秒），默认10秒
   * @param heartbeatTimeout 心跳超时时间（毫秒），默认30秒
   */
  constructor(
    connectionManager: ConnectionManager,
    wsServer: WebSocketServer,
    heartbeatInterval: number = 10000,
    heartbeatTimeout: number = 30000
  ) {
    this.connectionManager = connectionManager;
    this.wsServer = wsServer;
    this.heartbeatInterval = heartbeatInterval;
    this.heartbeatTimeout = heartbeatTimeout;
  }

  /**
   * 启动心跳机制
   */
  start(): void {
    if (this.heartbeatTimer !== null) {
      console.warn('[心跳管理] 心跳机制已启动，无需重复启动');
      return;
    }

    console.log('[心跳管理] 启动心跳机制');

    // 启动定期发送心跳
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeats();
    }, this.heartbeatInterval);

    // 启动超时检测
    this.timeoutCheckTimer = setInterval(() => {
      this.checkTimeouts();
    }, this.heartbeatTimeout / 2); // 每隔超时时间的一半检查一次
  }

  /**
   * 停止心跳机制
   */
  stop(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.timeoutCheckTimer !== null) {
      clearInterval(this.timeoutCheckTimer);
      this.timeoutCheckTimer = null;
    }

    this.pendingHeartbeats.clear();
    console.log('[心跳管理] 已停止心跳机制');
  }

  /**
   * 发送心跳消息给所有连接
   */
  private sendHeartbeats(): void {
    const connections = this.connectionManager.getAllConnections();
    
    if (connections.length === 0) {
      return;
    }

    const timestamp = Date.now();

    connections.forEach((connectionInfo) => {
      const playerId = connectionInfo.playerId;
      
      // 只给已连接的玩家发送心跳
      if (connectionInfo.status === 'connected') {
        const heartbeatMessage: HeartbeatMessage = {
          type: 'heartbeat',
          data: {
            timestamp
          }
        };

        // 记录待确认的心跳
        this.pendingHeartbeats.set(playerId, timestamp);

        // 发送心跳消息
        this.wsServer.sendToPlayer(playerId, heartbeatMessage);
      }
    });

    console.log(`[心跳管理] 已发送心跳给 ${connections.length} 个连接`);
  }

  /**
   * 处理心跳确认
   * 
   * @param playerId 玩家ID
   * @param timestamp 心跳时间戳
   */
  handleHeartbeatAck(playerId: string, timestamp: number): void {
    // 检查是否有待确认的心跳
    const pendingTimestamp = this.pendingHeartbeats.get(playerId);
    
    if (pendingTimestamp === undefined) {
      console.warn(`[心跳管理] 收到未预期的心跳确认: ${playerId}`);
      return;
    }

    // 移除待确认的心跳
    this.pendingHeartbeats.delete(playerId);

    // 更新最后心跳时间
    this.connectionManager.updateLastHeartbeat(playerId);

    console.log(`[心跳管理] 收到心跳确认: ${playerId}`);
  }

  /**
   * 检查超时的连接
   */
  private checkTimeouts(): void {
    const timeoutConnections = this.connectionManager.getTimeoutConnections(
      this.heartbeatTimeout
    );

    if (timeoutConnections.length === 0) {
      return;
    }

    console.log(`[心跳管理] 检测到 ${timeoutConnections.length} 个超时连接`);

    timeoutConnections.forEach((playerId) => {
      console.log(`[心跳管理] 连接超时，断开连接: ${playerId}`);
      
      // 更新连接状态为断开
      this.connectionManager.updateConnectionStatus(playerId, 'disconnected');
      
      // 移除待确认的心跳
      this.pendingHeartbeats.delete(playerId);
    });
  }

  /**
   * 获取心跳间隔
   * 
   * @returns 心跳间隔（毫秒）
   */
  getHeartbeatInterval(): number {
    return this.heartbeatInterval;
  }

  /**
   * 获取心跳超时时间
   * 
   * @returns 心跳超时时间（毫秒）
   */
  getHeartbeatTimeout(): number {
    return this.heartbeatTimeout;
  }

  /**
   * 检查心跳机制是否运行中
   * 
   * @returns 是否运行中
   */
  isRunning(): boolean {
    return this.heartbeatTimer !== null;
  }

  /**
   * 获取待确认的心跳数
   * 
   * @returns 待确认的心跳数
   */
  getPendingHeartbeatCount(): number {
    return this.pendingHeartbeats.size;
  }
}
