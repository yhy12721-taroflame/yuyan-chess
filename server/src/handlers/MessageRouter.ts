/**
 * 消息路由器
 * 
 * 负责：
 * - 注册消息处理器
 * - 根据消息类型分发消息
 * - 处理未知消息类型
 * - 错误处理
 */

import { Message, ErrorCode } from '../types';

/**
 * 消息处理器类型
 */
export type MessageHandler = (message: Message, context: any) => Promise<void>;

/**
 * 消息路由器类
 */
export class MessageRouter {
  private handlers: Map<string, MessageHandler> = new Map();

  /**
   * 注册消息处理器
   * 
   * @param type 消息类型
   * @param handler 处理器函数
   */
  register(type: string, handler: MessageHandler): void {
    if (this.handlers.has(type)) {
      console.warn(`[消息路由] 消息类型 ${type} 的处理器已存在，将被覆盖`);
    }
    this.handlers.set(type, handler);
    console.log(`[消息路由] 已注册消息类型: ${type}`);
  }

  /**
   * 注销消息处理器
   * 
   * @param type 消息类型
   */
  unregister(type: string): void {
    this.handlers.delete(type);
    console.log(`[消息路由] 已注销消息类型: ${type}`);
  }

  /**
   * 路由消息到相应的处理器
   * 
   * @param message 消息
   * @param context 上下文信息
   * @throws 如果消息类型未知或处理器执行失败
   */
  async route(message: Message, context: any): Promise<void> {
    // 验证消息格式
    if (!message || typeof message !== 'object') {
      throw new Error('消息格式无效：消息必须是对象');
    }

    if (!message.type || typeof message.type !== 'string') {
      throw new Error('消息格式无效：消息必须包含 type 字段');
    }

    if (!message.data || typeof message.data !== 'object') {
      throw new Error('消息格式无效：消息必须包含 data 字段');
    }

    // 查找处理器
    const handler = this.handlers.get(message.type);
    if (!handler) {
      throw new Error(`未知的消息类型: ${message.type}`);
    }

    // 执行处理器
    try {
      await handler(message, context);
    } catch (error) {
      console.error(`[消息路由] 处理消息类型 ${message.type} 时出错:`, error);
      throw error;
    }
  }

  /**
   * 检查是否已注册某个消息类型的处理器
   * 
   * @param type 消息类型
   * @returns 是否已注册
   */
  hasHandler(type: string): boolean {
    return this.handlers.has(type);
  }

  /**
   * 获取所有已注册的消息类型
   * 
   * @returns 消息类型数组
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * 清空所有处理器
   */
  clear(): void {
    this.handlers.clear();
    console.log('[消息路由] 已清空所有处理器');
  }
}
