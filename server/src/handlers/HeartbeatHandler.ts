/**
 * 心跳消息处理器
 * 
 * 负责处理心跳相关的消息
 */

import { Message, HeartbeatAckMessage, ErrorCode } from '../types';
import { ConnectionManager } from '../managers/ConnectionManager';
import { WebSocketServer } from '../managers/WebSocketServer';
import { MessageValidator } from '../utils/MessageValidator';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * 心跳处理器类
 */
export class HeartbeatHandler {
  private connectionManager: ConnectionManager;
  private webSocketServer: WebSocketServer;
  private messageValidator: MessageValidator;

  /**
   * 构造函数
   * 
   * @param connectionManager 连接管理器
   * @param webSocketServer WebSocket 服务器
   */
  constructor(connectionManager: ConnectionManager, webSocketServer: WebSocketServer) {
    this.connectionManager = connectionManager;
    this.webSocketServer = webSocketServer;
    this.messageValidator = new MessageValidator();
  }

  /**
   * 处理心跳消息
   * 
   * @param message 消息
   * @param playerId 玩家ID
   */
  async handleHeartbeat(message: Message, playerId: string): Promise<void> {
    try {
      // 验证消息格式
      const validation = this.messageValidator.validateHeartbeatMessage(message);
      if (!validation.valid) {
        const errorMsg = ErrorHandler.createErrorMessage(
          validation.errorCode || ErrorCode.INVALID_MESSAGE_FORMAT,
          validation.error
        );
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      const timestamp = message.data.timestamp;

      // 更新最后心跳时间
      this.connectionManager.updateLastHeartbeat(playerId);

      // 发送心跳确认消息
      const ackMsg: HeartbeatAckMessage = {
        type: 'heartbeat_ack',
        data: { timestamp }
      };

      this.webSocketServer.sendToPlayer(playerId, ackMsg);

      // 记录心跳（可选，避免日志过多）
      // ErrorHandler.logInfo(`收到玩家 ${playerId} 的心跳`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `处理心跳消息时出错: ${playerId}`,
        error as Error
      );

      const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.INTERNAL_SERVER_ERROR);
      this.webSocketServer.sendToPlayer(playerId, errorMsg);
    }
  }

  /**
   * 检测超时的连接
   * 
   * @param timeoutMs 超时时间（毫秒）
   */
  async detectTimeoutConnections(timeoutMs: number): Promise<void> {
    try {
      const timeoutConnections = this.connectionManager.getTimeoutConnections(timeoutMs);

      timeoutConnections.forEach(playerId => {
        ErrorHandler.logWarning(
          ErrorCode.CONNECTION_TIMEOUT,
          `玩家 ${playerId} 连接超时`
        );

        // 断开连接
        const ws = this.webSocketServer.getConnection(playerId);
        if (ws) {
          ws.close();
        }
      });

      if (timeoutConnections.length > 0) {
        ErrorHandler.logInfo(`检测到 ${timeoutConnections.length} 个超时连接`);
      }
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        '检测超时连接时出错',
        error as Error
      );
    }
  }

  /**
   * 发送心跳给所有连接
   */
  async sendHeartbeatToAll(): Promise<void> {
    try {
      const connections = this.connectionManager.getAllConnections();

      const heartbeatMsg: Message = {
        type: 'heartbeat',
        data: { timestamp: Date.now() }
      };

      connections.forEach(connection => {
        this.webSocketServer.sendToPlayer(connection.playerId, heartbeatMsg);
      });

      if (connections.length > 0) {
        ErrorHandler.logInfo(`心跳已发送给 ${connections.length} 个连接`);
      }
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        '发送心跳给所有连接时出错',
        error as Error
      );
    }
  }
}
