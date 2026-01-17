/**
 * 错误处理器
 * 
 * 负责：
 * - 定义错误代码
 * - 实现错误消息生成
 * - 实现错误日志记录
 */

import { ErrorCode, ErrorMessage, Message } from '../types';

/**
 * 错误消息映射
 */
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // 连接错误
  [ErrorCode.CONNECTION_FAILED]: '连接失败',
  [ErrorCode.CONNECTION_TIMEOUT]: '连接超时',
  [ErrorCode.RECONNECTION_FAILED]: '重连失败',
  
  // 房间错误
  [ErrorCode.ROOM_NOT_FOUND]: '房间不存在',
  [ErrorCode.ROOM_FULL]: '房间已满',
  [ErrorCode.ROOM_NOT_AVAILABLE]: '房间不可用',
  
  // 游戏错误
  [ErrorCode.INVALID_MOVE]: '无效的移动',
  [ErrorCode.NOT_YOUR_TURN]: '不是你的轮次',
  [ErrorCode.GAME_NOT_STARTED]: '游戏未开始',
  [ErrorCode.GAME_ALREADY_FINISHED]: '游戏已结束',
  
  // 玩家错误
  [ErrorCode.PLAYER_NOT_FOUND]: '玩家不存在',
  [ErrorCode.INVALID_PLAYER_NAME]: '无效的玩家名称',
  
  // 消息错误
  [ErrorCode.INVALID_MESSAGE_FORMAT]: '无效的消息格式',
  [ErrorCode.UNKNOWN_MESSAGE_TYPE]: '未知的消息类型',
  
  // 服务器错误
  [ErrorCode.INTERNAL_SERVER_ERROR]: '服务器内部错误'
};

/**
 * 错误处理器类
 */
export class ErrorHandler {
  /**
   * 创建错误消息
   * 
   * @param code 错误代码
   * @param customMessage 自定义错误消息（可选）
   * @returns 错误消息对象
   */
  static createErrorMessage(code: ErrorCode, customMessage?: string): ErrorMessage {
    const message = customMessage || ERROR_MESSAGES[code] || '未知错误';
    
    return {
      type: 'error',
      data: {
        code,
        message
      }
    };
  }

  /**
   * 获取错误消息
   * 
   * @param code 错误代码
   * @returns 错误消息文本
   */
  static getErrorMessage(code: ErrorCode): string {
    return ERROR_MESSAGES[code] || '未知错误';
  }

  /**
   * 记录错误
   * 
   * @param code 错误代码
   * @param context 错误上下文信息
   * @param error 原始错误对象（可选）
   */
  static logError(code: ErrorCode, context: string, error?: Error): void {
    const message = ERROR_MESSAGES[code] || '未知错误';
    const timestamp = new Date().toISOString();
    
    if (error) {
      console.error(`[${timestamp}] [错误] ${code}: ${message} - ${context}`, error);
    } else {
      console.error(`[${timestamp}] [错误] ${code}: ${message} - ${context}`);
    }
  }

  /**
   * 记录警告
   * 
   * @param code 错误代码
   * @param context 警告上下文信息
   */
  static logWarning(code: ErrorCode, context: string): void {
    const message = ERROR_MESSAGES[code] || '未知错误';
    const timestamp = new Date().toISOString();
    
    console.warn(`[${timestamp}] [警告] ${code}: ${message} - ${context}`);
  }

  /**
   * 记录信息
   * 
   * @param message 信息文本
   */
  static logInfo(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [信息] ${message}`);
  }

  /**
   * 检查错误代码是否有效
   * 
   * @param code 错误代码
   * @returns 错误代码是否有效
   */
  static isValidErrorCode(code: string): boolean {
    return Object.values(ErrorCode).includes(code as ErrorCode);
  }

  /**
   * 获取所有错误代码
   * 
   * @returns 所有错误代码数组
   */
  static getAllErrorCodes(): ErrorCode[] {
    return Object.values(ErrorCode);
  }

  /**
   * 处理连接错误
   * 
   * @param context 错误上下文
   * @returns 错误消息
   */
  static handleConnectionError(context: string): ErrorMessage {
    this.logError(ErrorCode.CONNECTION_FAILED, context);
    return this.createErrorMessage(ErrorCode.CONNECTION_FAILED);
  }

  /**
   * 处理房间错误
   * 
   * @param code 房间相关的错误代码
   * @param context 错误上下文
   * @returns 错误消息
   */
  static handleRoomError(code: ErrorCode, context: string): ErrorMessage {
    this.logError(code, context);
    return this.createErrorMessage(code);
  }

  /**
   * 处理游戏错误
   * 
   * @param code 游戏相关的错误代码
   * @param context 错误上下文
   * @returns 错误消息
   */
  static handleGameError(code: ErrorCode, context: string): ErrorMessage {
    this.logError(code, context);
    return this.createErrorMessage(code);
  }

  /**
   * 处理消息错误
   * 
   * @param code 消息相关的错误代码
   * @param context 错误上下文
   * @returns 错误消息
   */
  static handleMessageError(code: ErrorCode, context: string): ErrorMessage {
    this.logError(code, context);
    return this.createErrorMessage(code);
  }

  /**
   * 处理玩家错误
   * 
   * @param code 玩家相关的错误代码
   * @param context 错误上下文
   * @returns 错误消息
   */
  static handlePlayerError(code: ErrorCode, context: string): ErrorMessage {
    this.logError(code, context);
    return this.createErrorMessage(code);
  }

  /**
   * 处理服务器错误
   * 
   * @param context 错误上下文
   * @param error 原始错误对象（可选）
   * @returns 错误消息
   */
  static handleServerError(context: string, error?: Error): ErrorMessage {
    this.logError(ErrorCode.INTERNAL_SERVER_ERROR, context, error);
    return this.createErrorMessage(ErrorCode.INTERNAL_SERVER_ERROR);
  }

  /**
   * 验证错误响应
   * 
   * @param response 响应对象
   * @returns 是否是有效的错误响应
   */
  static isErrorResponse(response: any): boolean {
    return (
      response &&
      response.type === 'error' &&
      response.data &&
      this.isValidErrorCode(response.data.code) &&
      typeof response.data.message === 'string'
    );
  }
}
