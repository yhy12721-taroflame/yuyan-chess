/**
 * 游戏消息处理器
 * 
 * 负责处理游戏相关的消息
 */

import { Message, Move, ErrorCode, MoveAckMessage } from '../types';
import { RoomManager } from '../managers/RoomManager';
import { GameStateManager } from '../managers/GameStateManager';
import { WebSocketServer } from '../managers/WebSocketServer';
import { MessageValidator } from '../utils/MessageValidator';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * 游戏处理器类
 */
export class GameHandler {
  private roomManager: RoomManager;
  private gameStateManager: GameStateManager;
  private webSocketServer: WebSocketServer;
  private messageValidator: MessageValidator;

  /**
   * 构造函数
   * 
   * @param roomManager 房间管理器
   * @param gameStateManager 游戏状态管理器
   * @param webSocketServer WebSocket 服务器
   */
  constructor(
    roomManager: RoomManager,
    gameStateManager: GameStateManager,
    webSocketServer: WebSocketServer
  ) {
    this.roomManager = roomManager;
    this.gameStateManager = gameStateManager;
    this.webSocketServer = webSocketServer;
    this.messageValidator = new MessageValidator();
  }

  /**
   * 处理移动消息
   * 
   * @param message 消息
   * @param playerId 玩家ID
   */
  async handleMove(message: Message, playerId: string): Promise<void> {
    try {
      // 验证消息格式
      const validation = this.messageValidator.validateMoveMessage(message);
      if (!validation.valid) {
        const errorMsg = ErrorHandler.createErrorMessage(
          validation.errorCode || ErrorCode.INVALID_MESSAGE_FORMAT,
          validation.error
        );
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      const roomId = message.data.roomId;
      const from = message.data.from;
      const to = message.data.to;

      // 检查房间是否存在
      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.ROOM_NOT_FOUND);
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      // 检查玩家是否在房间中
      let playerColor: 'red' | 'black' | null = null;
      if (room.players.red?.id === playerId) {
        playerColor = 'red';
      } else if (room.players.black?.id === playerId) {
        playerColor = 'black';
      }

      if (!playerColor) {
        const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.PLAYER_NOT_FOUND);
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      // 创建移动对象
      const move: Move = {
        from,
        to,
        timestamp: Date.now(),
        playerId
      };

      // 验证并应用移动
      const result = this.gameStateManager.applyMove(room.gameState, move, playerId);

      if (!result.success) {
        // 移动验证失败
        const ackMsg: MoveAckMessage = {
          type: 'move_ack',
          data: {
            success: false,
            error: result.error
          }
        };

        this.webSocketServer.sendToPlayer(playerId, ackMsg);

        ErrorHandler.logWarning(
          ErrorCode.INVALID_MOVE,
          `玩家 ${playerId} 的移动验证失败: ${result.error}`
        );
        return;
      }

      // 更新房间的游戏状态
      room.gameState = result.newState!;
      room.updatedAt = Date.now();

      // 发送移动确认消息给发送者
      const ackMsg: MoveAckMessage = {
        type: 'move_ack',
        data: {
          success: true,
          gameState: this.gameStateManager.getStateSnapshot(room.gameState)
        }
      };

      this.webSocketServer.sendToPlayer(playerId, ackMsg);

      // 广播游戏状态更新给房间内的所有玩家
      const stateMsg: Message = {
        type: 'game_state',
        data: this.gameStateManager.getStateSnapshot(room.gameState)
      };

      this.webSocketServer.broadcastToRoom(roomId, stateMsg);

      ErrorHandler.logInfo(
        `玩家 ${playerId} 在房间 ${roomId} 执行了移动: (${from.x},${from.y}) -> (${to.x},${to.y})`
      );
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `处理移动消息时出错: ${playerId}`,
        error as Error
      );

      const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.INTERNAL_SERVER_ERROR);
      this.webSocketServer.sendToPlayer(playerId, errorMsg);
    }
  }

  /**
   * 发送游戏状态给玩家
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   */
  async sendGameState(roomId: string, playerId: string): Promise<void> {
    try {
      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.ROOM_NOT_FOUND);
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      // 发送游戏状态给玩家
      const stateMsg: Message = {
        type: 'game_state',
        data: this.gameStateManager.getStateSnapshot(room.gameState)
      };

      this.webSocketServer.sendToPlayer(playerId, stateMsg);

      ErrorHandler.logInfo(`游戏状态已发送给玩家 ${playerId}`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `发送游戏状态时出错: ${playerId}`,
        error as Error
      );
    }
  }

  /**
   * 广播游戏状态给房间内的所有玩家
   * 
   * @param roomId 房间ID
   */
  async broadcastGameState(roomId: string): Promise<void> {
    try {
      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        ErrorHandler.logWarning(ErrorCode.ROOM_NOT_FOUND, `房间不存在: ${roomId}`);
        return;
      }

      // 广播游戏状态给房间内的所有玩家
      const stateMsg: Message = {
        type: 'game_state',
        data: this.gameStateManager.getStateSnapshot(room.gameState)
      };

      this.webSocketServer.broadcastToRoom(roomId, stateMsg);

      ErrorHandler.logInfo(`游戏状态已广播给房间 ${roomId}`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `广播游戏状态时出错: ${roomId}`,
        error as Error
      );
    }
  }
}
