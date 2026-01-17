/**
 * WebSocket 客户端
 * 
 * 负责：
 * - 连接到服务器
 * - 处理连接事件
 * - 处理消息事件
 * - 实现自动重连
 * - 实现消息队列
 * - 实现乐观更新
 */

import { Message, GameState, Move, Position } from '../server/src/types';

/**
 * 连接状态
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

/**
 * 消息处理器类型
 */
export type MessageHandler = (data: any) => void;

/**
 * WebSocket 客户端类
 */
export class WebSocketClient {
  // WebSocket 连接
  private ws: WebSocket | null = null;
  
  // 服务器 URL
  private serverUrl: string;
  
  // 玩家 ID
  private playerId: string = '';
  
  // 连接状态
  private connectionStatus: ConnectionStatus = 'disconnected';
  
  // 消息处理器映射
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  
  // 消息队列（用于离线消息缓存）
  private messageQueue: Message[] = [];
  
  // 心跳定时器
  private heartbeatTimer: NodeJS.Timeout | null = null;
  
  // 心跳间隔（毫秒）
  private heartbeatInterval: number = 30000;
  
  // 重连定时器
  private reconnectTimer: NodeJS.Timeout | null = null;
  
  // 重连延迟（毫秒）
  private reconnectDelay: number = 1000;
  
  // 最大重连延迟（毫秒）
  private maxReconnectDelay: number = 30000;
  
  // 重连尝试次数
  private reconnectAttempts: number = 0;
  
  // 最大重连尝试次数
  private maxReconnectAttempts: number = 10;
  
  // 本地游戏状态（用于乐观更新）
  private localGameState: GameState | null = null;
  
  // 上一个有效的游戏状态（用于回滚）
  private previousGameState: GameState | null = null;

  /**
   * 构造函数
   * 
   * @param serverUrl 服务器 URL
   */
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  /**
   * 连接到服务器
   * 
   * @returns Promise
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 创建 WebSocket 连接
        this.ws = new WebSocket(this.serverUrl);

        // 处理连接打开事件
        this.ws.onopen = () => {
          console.log('[WebSocket 客户端] 已连接到服务器');
          this.connectionStatus = 'connected';
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          
          // 启动心跳
          this.startHeartbeat();
          
          // 重新发送队列中的消息
          this.resendQueuedMessages();
          
          resolve();
        };

        // 处理消息事件
        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as Message;
            this.handleMessage(message);
          } catch (error) {
            console.error('[WebSocket 客户端] 处理消息时出错:', error);
          }
        };

        // 处理错误事件
        this.ws.onerror = (error) => {
          console.error('[WebSocket 客户端] WebSocket 错误:', error);
          this.connectionStatus = 'disconnected';
          reject(error);
        };

        // 处理关闭事件
        this.ws.onclose = () => {
          console.log('[WebSocket 客户端] 连接已关闭');
          this.connectionStatus = 'disconnected';
          this.stopHeartbeat();
          
          // 尝试重新连接
          this.attemptReconnect();
        };
      } catch (error) {
        console.error('[WebSocket 客户端] 连接失败:', error);
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.stopHeartbeat();
    this.clearReconnectTimer();
    this.connectionStatus = 'disconnected';
    
    console.log('[WebSocket 客户端] 已断开连接');
  }

  /**
   * 发送消息
   * 
   * @param message 消息
   */
  send(message: Message): void {
    if (this.connectionStatus === 'connected' && this.ws) {
      try {
        this.ws.send(JSON.stringify(message));
        console.log('[WebSocket 客户端] 消息已发送:', message.type);
      } catch (error) {
        console.error('[WebSocket 客户端] 发送消息失败:', error);
        // 将消息添加到队列
        this.messageQueue.push(message);
      }
    } else {
      // 连接未建立，将消息添加到队列
      this.messageQueue.push(message);
      console.log('[WebSocket 客户端] 消息已加入队列:', message.type);
    }
  }

  /**
   * 注册消息处理器
   * 
   * @param messageType 消息类型
   * @param handler 处理器函数
   */
  on(messageType: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    
    this.messageHandlers.get(messageType)!.push(handler);
  }

  /**
   * 移除消息处理器
   * 
   * @param messageType 消息类型
   * @param handler 处理器函数
   */
  off(messageType: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 获取连接状态
   * 
   * @returns 连接状态
   */
  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * 获取玩家 ID
   * 
   * @returns 玩家 ID
   */
  getPlayerId(): string {
    return this.playerId;
  }

  /**
   * 设置玩家 ID
   * 
   * @param playerId 玩家 ID
   */
  setPlayerId(playerId: string): void {
    this.playerId = playerId;
  }

  /**
   * 获取本地游戏状态
   * 
   * @returns 本地游戏状态
   */
  getLocalGameState(): GameState | null {
    return this.localGameState;
  }

  /**
   * 设置本地游戏状态
   * 
   * @param gameState 游戏状态
   */
  setLocalGameState(gameState: GameState): void {
    // 保存上一个有效的游戏状态
    this.previousGameState = this.localGameState ? JSON.parse(JSON.stringify(this.localGameState)) : null;
    
    // 设置新的游戏状态
    this.localGameState = gameState;
  }

  /**
   * 回滚游戏状态
   */
  rollbackGameState(): void {
    if (this.previousGameState) {
      this.localGameState = this.previousGameState;
      console.log('[WebSocket 客户端] 游戏状态已回滚');
    }
  }

  /**
   * 处理消息
   * 
   * @param message 消息
   */
  private handleMessage(message: Message): void {
    console.log('[WebSocket 客户端] 收到消息:', message.type);
    
    // 调用注册的处理器
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.data);
        } catch (error) {
          console.error('[WebSocket 客户端] 处理器执行出错:', error);
        }
      });
    }
    
    // 处理特定的消息类型
    switch (message.type) {
      case 'connect_ack':
        this.playerId = message.data.playerId;
        console.log('[WebSocket 客户端] 已获得玩家 ID:', this.playerId);
        break;
      
      case 'game_state':
        // 更新本地游戏状态
        this.setLocalGameState(message.data);
        break;
      
      case 'move_ack':
        if (!message.data.success) {
          // 移动验证失败，回滚游戏状态
          this.rollbackGameState();
          console.log('[WebSocket 客户端] 移动验证失败，已回滚游戏状态');
        }
        break;
    }
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.connectionStatus === 'connected') {
        const heartbeatMessage: Message = {
          type: 'heartbeat',
          data: {
            timestamp: Date.now()
          }
        };
        
        this.send(heartbeatMessage);
      }
    }, this.heartbeatInterval);
    
    console.log('[WebSocket 客户端] 心跳已启动');
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    console.log('[WebSocket 客户端] 心跳已停止');
  }

  /**
   * 尝试重新连接
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket 客户端] 已达到最大重连尝试次数');
      return;
    }
    
    this.reconnectAttempts++;
    this.connectionStatus = 'reconnecting';
    
    // 计算重连延迟（指数退避）
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );
    
    console.log(`[WebSocket 客户端] 将在 ${delay}ms 后进行第 ${this.reconnectAttempts} 次重连尝试`);
    
    this.reconnectTimer = setTimeout(() => {
      console.log(`[WebSocket 客户端] 正在进行第 ${this.reconnectAttempts} 次重连尝试...`);
      this.connect().catch(error => {
        console.error('[WebSocket 客户端] 重连失败:', error);
      });
    }, delay);
  }

  /**
   * 清除重连定时器
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 重新发送队列中的消息
   */
  private resendQueuedMessages(): void {
    if (this.messageQueue.length === 0) {
      return;
    }
    
    console.log(`[WebSocket 客户端] 正在重新发送 ${this.messageQueue.length} 条队列中的消息`);
    
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    
    messages.forEach(message => {
      this.send(message);
    });
  }

  /**
   * 获取消息队列大小
   * 
   * @returns 队列大小
   */
  getQueueSize(): number {
    return this.messageQueue.length;
  }

  /**
   * 清空消息队列
   */
  clearQueue(): void {
    this.messageQueue = [];
    console.log('[WebSocket 客户端] 消息队列已清空');
  }

  /**
   * 设置心跳间隔
   * 
   * @param interval 间隔（毫秒）
   */
  setHeartbeatInterval(interval: number): void {
    this.heartbeatInterval = interval;
  }

  /**
   * 设置重连延迟
   * 
   * @param delay 延迟（毫秒）
   */
  setReconnectDelay(delay: number): void {
    this.reconnectDelay = delay;
  }

  /**
   * 设置最大重连延迟
   * 
   * @param maxDelay 最大延迟（毫秒）
   */
  setMaxReconnectDelay(maxDelay: number): void {
    this.maxReconnectDelay = maxDelay;
  }

  /**
   * 设置最大重连尝试次数
   * 
   * @param maxAttempts 最大尝试次数
   */
  setMaxReconnectAttempts(maxAttempts: number): void {
    this.maxReconnectAttempts = maxAttempts;
  }
}

