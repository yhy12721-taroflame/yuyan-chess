/**
 * 连接消息处理器
 * 
 * 负责处理连接相关的消息
 */

import { Message, ConnectAckMessage, ErrorCode } from '../types';
import { ConnectionManager } from '../managers/ConnectionManager';
import { WebSocketServer } from '../managers/WebSocketServer';
import { MessageValidator } from '../utils/MessageValidator';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * 连接处理器类
 */
export class ConnectionHandler {
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
   * 处理连接消息
   * 
   * @param message 消息
   * @param ws WebSocket 连接
   */
  async handleConnect(message: Message, ws: any): Promise<void> {
    try {
      // 验证消息格式
      const validation = this.messageValidator.validateConnectMessage(message);
      if (!validation.valid) {
        const errorMsg = ErrorHandler.createErrorMessage(
          validation.errorCode || ErrorCode.INVALID_MESSAGE_FORMAT,
          validation.error
        );
        ws.send(JSON.stringify(errorMsg));
        ErrorHandler.logWarning(
          validation.errorCode || ErrorCode.INVALID_MESSAGE_FORMAT,
          `连接消息验证失败: ${validation.error}`
        );
        return;
      }

      const playerName = message.data.playerName;

      // 创建新连接
      const playerId = this.connectionManager.createConnection(playerName);

      // 注册 WebSocket 连接
      this.webSocketServer.registerConnection(playerId, ws);

      // 发送连接确认消息
      const ackMessage: ConnectAckMessage = {
        type: 'connect_ack',
        data: { playerId }
      };

      ws.send(JSON.stringify(ackMessage));

      ErrorHandler.logInfo(`玩家 ${playerName} (${playerId}) 已连接`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        '处理连接消息时出错',
        error as Error
      );

      const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.INTERNAL_SERVER_ERROR);
      ws.send(JSON.stringify(errorMsg));
    }
  }

  /**
   * 处理断开连接
   * 
   * @param playerId 玩家ID
   */
  async handleDisconnect(playerId: string): Promise<void> {
    try {
      const connection = this.connectionManager.getConnection(playerId);
      if (!connection) {
        ErrorHandler.logWarning(ErrorCode.PLAYER_NOT_FOUND, `玩家不存在: ${playerId}`);
        return;
      }

      // 更新连接状态
      this.connectionManager.updateConnectionStatus(playerId, 'disconnected');

      // 移除 WebSocket 连接
      this.webSocketServer.getConnection(playerId);

      ErrorHandler.logInfo(`玩家 ${playerId} 已断开连接`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `处理断开连接时出错: ${playerId}`,
        error as Error
      );
    }
  }

  /**
   * 验证玩家名称
   * 
   * @param playerName 玩家名称
   * @returns 验证结果
   */
  validatePlayerName(playerName: string): { valid: boolean; error?: string } {
    if (!playerName || typeof playerName !== 'string') {
      return { valid: false, error: '玩家名称必须是字符串' };
    }

    if (playerName.length < 1 || playerName.length > 20) {
      return { valid: false, error: '玩家名称长度必须在 1-20 字符之间' };
    }

    return { valid: true };
  }
}
