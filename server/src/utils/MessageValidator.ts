/**
 * 消息验证器
 * 
 * 负责：
 * - 验证 JSON 格式
 * - 验证必需字段
 * - 验证字段类型
 */

import { Message, ErrorCode } from '../types';

/**
 * 消息验证结果
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: ErrorCode;
}

/**
 * 消息验证器类
 */
export class MessageValidator {
  /**
   * 验证消息格式
   * 
   * @param data 原始数据
   * @returns 验证结果
   */
  validateMessageFormat(data: any): ValidationResult {
    // 检查是否是有效的 JSON 对象
    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        error: '消息必须是 JSON 对象',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    // 检查是否包含 type 字段
    if (!data.type || typeof data.type !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 type 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    // 检查是否包含 data 字段
    if (data.data === undefined || typeof data.data !== 'object') {
      return {
        valid: false,
        error: '消息必须包含 data 字段（对象类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    return { valid: true };
  }

  /**
   * 验证连接消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateConnectMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    if (message.type !== 'connect') {
      return {
        valid: false,
        error: '消息类型应该是 connect',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.playerName || typeof message.data.playerName !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 playerName 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    // 验证昵称长度
    if (message.data.playerName.length < 1 || message.data.playerName.length > 20) {
      return {
        valid: false,
        error: '昵称长度必须在 1-20 字符之间',
        errorCode: ErrorCode.INVALID_PLAYER_NAME
      };
    }

    return { valid: true };
  }

  /**
   * 验证创建房间消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateCreateRoomMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    if (message.type !== 'create_room') {
      return {
        valid: false,
        error: '消息类型应该是 create_room',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.playerName || typeof message.data.playerName !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 playerName 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    return { valid: true };
  }

  /**
   * 验证加入房间消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateJoinRoomMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    if (message.type !== 'join_room') {
      return {
        valid: false,
        error: '消息类型应该是 join_room',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.roomId || typeof message.data.roomId !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 roomId 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.playerName || typeof message.data.playerName !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 playerName 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    return { valid: true };
  }

  /**
   * 验证移动消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateMoveMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    if (message.type !== 'move') {
      return {
        valid: false,
        error: '消息类型应该是 move',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.roomId || typeof message.data.roomId !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 roomId 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.from || typeof message.data.from !== 'object') {
      return {
        valid: false,
        error: '消息必须包含 from 字段（对象类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (typeof message.data.from.x !== 'number' || typeof message.data.from.y !== 'number') {
      return {
        valid: false,
        error: 'from 字段必须包含 x 和 y（数字类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.to || typeof message.data.to !== 'object') {
      return {
        valid: false,
        error: '消息必须包含 to 字段（对象类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (typeof message.data.to.x !== 'number' || typeof message.data.to.y !== 'number') {
      return {
        valid: false,
        error: 'to 字段必须包含 x 和 y（数字类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    return { valid: true };
  }

  /**
   * 验证心跳消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateHeartbeatMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    if (message.type !== 'heartbeat') {
      return {
        valid: false,
        error: '消息类型应该是 heartbeat',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (typeof message.data.timestamp !== 'number') {
      return {
        valid: false,
        error: '消息必须包含 timestamp 字段（数字类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    return { valid: true };
  }

  /**
   * 验证游戏状态消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateGameStateMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    if (message.type !== 'game_state') {
      return {
        valid: false,
        error: '消息类型应该是 game_state',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.board || typeof message.data.board !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 board 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.currentPlayer || typeof message.data.currentPlayer !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 currentPlayer 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (typeof message.data.moveCount !== 'number') {
      return {
        valid: false,
        error: '消息必须包含 moveCount 字段（数字类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.status || typeof message.data.status !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 status 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    return { valid: true };
  }

  /**
   * 验证错误消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateErrorMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    if (message.type !== 'error') {
      return {
        valid: false,
        error: '消息类型应该是 error',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.code || typeof message.data.code !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 code 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    if (!message.data.message || typeof message.data.message !== 'string') {
      return {
        valid: false,
        error: '消息必须包含 message 字段（字符串类型）',
        errorCode: ErrorCode.INVALID_MESSAGE_FORMAT
      };
    }

    return { valid: true };
  }

  /**
   * 根据消息类型验证消息
   * 
   * @param message 消息
   * @returns 验证结果
   */
  validateMessage(message: Message): ValidationResult {
    const formatResult = this.validateMessageFormat(message);
    if (!formatResult.valid) {
      return formatResult;
    }

    switch (message.type) {
      case 'connect':
        return this.validateConnectMessage(message);
      case 'create_room':
        return this.validateCreateRoomMessage(message);
      case 'join_room':
        return this.validateJoinRoomMessage(message);
      case 'move':
        return this.validateMoveMessage(message);
      case 'heartbeat':
        return this.validateHeartbeatMessage(message);
      case 'game_state':
        return this.validateGameStateMessage(message);
      case 'error':
        return this.validateErrorMessage(message);
      default:
        return {
          valid: false,
          error: `未知的消息类型: ${message.type}`,
          errorCode: ErrorCode.UNKNOWN_MESSAGE_TYPE
        };
    }
  }
}
