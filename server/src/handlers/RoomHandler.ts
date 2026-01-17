/**
 * 房间消息处理器
 * 
 * 负责处理房间相关的消息
 */

import { Message, ErrorCode, Room } from '../types';
import { RoomManager } from '../managers/RoomManager';
import { WebSocketServer } from '../managers/WebSocketServer';
import { ConnectionManager } from '../managers/ConnectionManager';
import { MessageValidator } from '../utils/MessageValidator';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * 房间处理器类
 */
export class RoomHandler {
  private roomManager: RoomManager;
  private webSocketServer: WebSocketServer;
  private connectionManager: ConnectionManager;
  private messageValidator: MessageValidator;

  /**
   * 构造函数
   * 
   * @param roomManager 房间管理器
   * @param webSocketServer WebSocket 服务器
   * @param connectionManager 连接管理器
   */
  constructor(
    roomManager: RoomManager,
    webSocketServer: WebSocketServer,
    connectionManager: ConnectionManager
  ) {
    this.roomManager = roomManager;
    this.webSocketServer = webSocketServer;
    this.connectionManager = connectionManager;
    this.messageValidator = new MessageValidator();
  }

  /**
   * 处理创建房间消息
   * 
   * @param message 消息
   * @param playerId 玩家ID
   */
  async handleCreateRoom(message: Message, playerId: string): Promise<void> {
    try {
      // 验证消息格式
      const validation = this.messageValidator.validateCreateRoomMessage(message);
      if (!validation.valid) {
        const errorMsg = ErrorHandler.createErrorMessage(
          validation.errorCode || ErrorCode.INVALID_MESSAGE_FORMAT,
          validation.error
        );
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      const playerName = message.data.playerName;

      // 创建房间
      const room = this.roomManager.createRoom(playerId, playerName);

      // 玩家加入房间
      const joined = this.roomManager.joinRoom(room.id, playerId, playerName);
      if (!joined) {
        const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.ROOM_NOT_AVAILABLE);
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      // 注册房间连接
      this.webSocketServer.registerRoomConnection(room.id, playerId);

      // 发送房间信息给玩家
      const roomMsg: Message = {
        type: 'room_created',
        data: {
          roomId: room.id,
          room: this.serializeRoom(room)
        }
      };

      this.webSocketServer.sendToPlayer(playerId, roomMsg);

      ErrorHandler.logInfo(`房间 ${room.id} 已创建，创建者: ${playerName}`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `处理创建房间消息时出错: ${playerId}`,
        error as Error
      );

      const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.INTERNAL_SERVER_ERROR);
      this.webSocketServer.sendToPlayer(playerId, errorMsg);
    }
  }

  /**
   * 处理加入房间消息
   * 
   * @param message 消息
   * @param playerId 玩家ID
   */
  async handleJoinRoom(message: Message, playerId: string): Promise<void> {
    try {
      // 验证消息格式
      const validation = this.messageValidator.validateJoinRoomMessage(message);
      if (!validation.valid) {
        const errorMsg = ErrorHandler.createErrorMessage(
          validation.errorCode || ErrorCode.INVALID_MESSAGE_FORMAT,
          validation.error
        );
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      const roomId = message.data.roomId;
      const playerName = message.data.playerName;

      // 检查房间是否存在
      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.ROOM_NOT_FOUND);
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      // 检查房间是否已满
      if (this.roomManager.isRoomFull(roomId)) {
        const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.ROOM_FULL);
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      // 玩家加入房间
      const joined = this.roomManager.joinRoom(roomId, playerId, playerName);
      if (!joined) {
        const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.ROOM_NOT_AVAILABLE);
        this.webSocketServer.sendToPlayer(playerId, errorMsg);
        return;
      }

      // 注册房间连接
      this.webSocketServer.registerRoomConnection(roomId, playerId);

      // 获取更新后的房间信息
      const updatedRoom = this.roomManager.getRoom(roomId);

      // 发送房间信息给加入的玩家
      const joinMsg: Message = {
        type: 'room_joined',
        data: {
          roomId,
          room: this.serializeRoom(updatedRoom!)
        }
      };

      this.webSocketServer.sendToPlayer(playerId, joinMsg);

      // 广播房间更新给房间内的所有玩家
      const updateMsg: Message = {
        type: 'room_updated',
        data: {
          roomId,
          room: this.serializeRoom(updatedRoom!)
        }
      };

      this.webSocketServer.broadcastToRoom(roomId, updateMsg);

      ErrorHandler.logInfo(`玩家 ${playerName} (${playerId}) 加入房间 ${roomId}`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `处理加入房间消息时出错: ${playerId}`,
        error as Error
      );

      const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.INTERNAL_SERVER_ERROR);
      this.webSocketServer.sendToPlayer(playerId, errorMsg);
    }
  }

  /**
   * 处理房间列表消息
   * 
   * @param playerId 玩家ID
   */
  async handleRoomList(playerId: string): Promise<void> {
    try {
      // 获取所有可用房间
      const availableRooms = this.roomManager.getAvailableRooms();

      // 发送房间列表给玩家
      const listMsg: Message = {
        type: 'room_list',
        data: {
          rooms: availableRooms.map(room => this.serializeRoom(room))
        }
      };

      this.webSocketServer.sendToPlayer(playerId, listMsg);

      ErrorHandler.logInfo(`房间列表已发送给玩家 ${playerId}，共 ${availableRooms.length} 个房间`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `处理房间列表消息时出错: ${playerId}`,
        error as Error
      );

      const errorMsg = ErrorHandler.createErrorMessage(ErrorCode.INTERNAL_SERVER_ERROR);
      this.webSocketServer.sendToPlayer(playerId, errorMsg);
    }
  }

  /**
   * 处理玩家离开房间
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   */
  async handleLeaveRoom(roomId: string, playerId: string): Promise<void> {
    try {
      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        ErrorHandler.logWarning(ErrorCode.ROOM_NOT_FOUND, `房间不存在: ${roomId}`);
        return;
      }

      // 玩家离开房间
      this.roomManager.leaveRoom(roomId, playerId);

      // 移除房间连接
      this.webSocketServer.removeRoomConnection(roomId, playerId);

      // 如果房间仍然存在，广播房间更新
      const updatedRoom = this.roomManager.getRoom(roomId);
      if (updatedRoom) {
        const updateMsg: Message = {
          type: 'room_updated',
          data: {
            roomId,
            room: this.serializeRoom(updatedRoom)
          }
        };

        this.webSocketServer.broadcastToRoom(roomId, updateMsg);
      }

      ErrorHandler.logInfo(`玩家 ${playerId} 离开房间 ${roomId}`);
    } catch (error) {
      ErrorHandler.logError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        `处理玩家离开房间时出错: ${roomId}, ${playerId}`,
        error as Error
      );
    }
  }

  /**
   * 序列化房间对象
   * 
   * @param room 房间对象
   * @returns 序列化后的房间对象
   */
  private serializeRoom(room: Room): any {
    return {
      id: room.id,
      creatorId: room.creatorId,
      creatorName: room.creatorName,
      playerCount: Object.keys(room.players).length,
      status: room.status,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      players: Object.entries(room.players).map(([color, player]) => ({
        color,
        id: player?.id,
        name: player?.name,
        isConnected: player?.isConnected
      }))
    };
  }
}
