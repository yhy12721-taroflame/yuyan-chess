/**
 * 消息队列
 * 
 * 负责：
 * - 缓存发送失败的消息
 * - 在连接恢复后重新发送消息
 * - 管理消息队列的生命周期
 */

import { Message } from '../types';

/**
 * 队列中的消息项
 */
interface QueuedMessage {
  playerId: string;
  message: Message;
  timestamp: number;
  retryCount: number;
}

/**
 * 消息队列类
 */
export class MessageQueue {
  // 消息队列：playerId -> 消息数组
  private queues: Map<string, QueuedMessage[]> = new Map();
  
  // 最大重试次数
  private maxRetries: number = 3;
  
  // 消息过期时间（毫秒），默认 1 小时
  private messageExpireTime: number = 60 * 60 * 1000;

  /**
   * 构造函数
   * 
   * @param maxRetries 最大重试次数
   * @param messageExpireTime 消息过期时间（毫秒）
   */
  constructor(maxRetries?: number, messageExpireTime?: number) {
    if (maxRetries) {
      this.maxRetries = maxRetries;
    }
    if (messageExpireTime) {
      this.messageExpireTime = messageExpireTime;
    }
  }

  /**
   * 添加消息到队列
   * 
   * @param playerId 玩家ID
   * @param message 消息
   */
  enqueue(playerId: string, message: Message): void {
    if (!this.queues.has(playerId)) {
      this.queues.set(playerId, []);
    }

    const queuedMessage: QueuedMessage = {
      playerId,
      message,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.queues.get(playerId)!.push(queuedMessage);

    console.log(`[消息队列] 消息已入队: ${playerId} (队列长度: ${this.queues.get(playerId)!.length})`);
  }

  /**
   * 从队列中获取所有消息
   * 
   * @param playerId 玩家ID
   * @returns 消息数组
   */
  dequeueAll(playerId: string): Message[] {
    const queue = this.queues.get(playerId);
    if (!queue) {
      return [];
    }

    const messages = queue.map((queuedMessage) => queuedMessage.message);
    this.queues.delete(playerId);

    console.log(`[消息队列] 消息已出队: ${playerId} (消息数: ${messages.length})`);

    return messages;
  }

  /**
   * 从队列中获取单个消息
   * 
   * @param playerId 玩家ID
   * @returns 消息，如果队列为空则返回 undefined
   */
  dequeue(playerId: string): Message | undefined {
    const queue = this.queues.get(playerId);
    if (!queue || queue.length === 0) {
      return undefined;
    }

    const queuedMessage = queue.shift()!;
    
    if (queue.length === 0) {
      this.queues.delete(playerId);
    }

    console.log(`[消息队列] 消息已出队: ${playerId} (剩余消息数: ${queue?.length || 0})`);

    return queuedMessage.message;
  }

  /**
   * 获取队列中的消息数
   * 
   * @param playerId 玩家ID
   * @returns 消息数
   */
  getQueueSize(playerId: string): number {
    const queue = this.queues.get(playerId);
    return queue ? queue.length : 0;
  }

  /**
   * 检查队列是否为空
   * 
   * @param playerId 玩家ID
   * @returns 队列是否为空
   */
  isEmpty(playerId: string): boolean {
    const queue = this.queues.get(playerId);
    return !queue || queue.length === 0;
  }

  /**
   * 清空特定玩家的队列
   * 
   * @param playerId 玩家ID
   */
  clearQueue(playerId: string): void {
    const queue = this.queues.get(playerId);
    if (queue) {
      const size = queue.length;
      this.queues.delete(playerId);
      console.log(`[消息队列] 已清空队列: ${playerId} (清空消息数: ${size})`);
    }
  }

  /**
   * 清空所有队列
   */
  clearAllQueues(): void {
    this.queues.clear();
    console.log('[消息队列] 已清空所有队列');
  }

  /**
   * 增加消息的重试次数
   * 
   * @param playerId 玩家ID
   * @param messageIndex 消息索引
   * @returns 是否可以继续重试
   */
  incrementRetryCount(playerId: string, messageIndex: number = 0): boolean {
    const queue = this.queues.get(playerId);
    if (!queue || messageIndex >= queue.length) {
      return false;
    }

    const queuedMessage = queue[messageIndex];
    queuedMessage.retryCount++;

    if (queuedMessage.retryCount >= this.maxRetries) {
      console.log(`[消息队列] 消息已达到最大重试次数: ${playerId} (重试次数: ${queuedMessage.retryCount})`);
      return false;
    }

    return true;
  }

  /**
   * 清理过期的消息
   * 
   * @returns 清理的消息数量
   */
  cleanupExpiredMessages(): number {
    const now = Date.now();
    let cleanupCount = 0;

    const playerIdsToDelete: string[] = [];

    this.queues.forEach((queue, playerId) => {
      const validMessages = queue.filter((queuedMessage) => {
        if (now - queuedMessage.timestamp > this.messageExpireTime) {
          cleanupCount++;
          return false;
        }
        return true;
      });

      if (validMessages.length === 0) {
        playerIdsToDelete.push(playerId);
      } else {
        this.queues.set(playerId, validMessages);
      }
    });

    playerIdsToDelete.forEach((playerId) => {
      this.queues.delete(playerId);
    });

    if (cleanupCount > 0) {
      console.log(`[消息队列] 清理了 ${cleanupCount} 个过期消息`);
    }

    return cleanupCount;
  }

  /**
   * 获取所有队列的统计信息
   * 
   * @returns 统计信息
   */
  getStatistics(): {
    totalQueues: number;
    totalMessages: number;
    queueDetails: Array<{ playerId: string; messageCount: number }>;
  } {
    let totalMessages = 0;
    const queueDetails: Array<{ playerId: string; messageCount: number }> = [];

    this.queues.forEach((queue, playerId) => {
      const messageCount = queue.length;
      totalMessages += messageCount;
      queueDetails.push({ playerId, messageCount });
    });

    return {
      totalQueues: this.queues.size,
      totalMessages,
      queueDetails
    };
  }

  /**
   * 设置最大重试次数
   * 
   * @param maxRetries 最大重试次数
   */
  setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
    console.log(`[消息队列] 设置最大重试次数: ${maxRetries}`);
  }

  /**
   * 获取最大重试次数
   * 
   * @returns 最大重试次数
   */
  getMaxRetries(): number {
    return this.maxRetries;
  }

  /**
   * 设置消息过期时间
   * 
   * @param expireTimeMs 过期时间（毫秒）
   */
  setMessageExpireTime(expireTimeMs: number): void {
    this.messageExpireTime = expireTimeMs;
    console.log(`[消息队列] 设置消息过期时间: ${expireTimeMs}ms`);
  }

  /**
   * 获取消息过期时间
   * 
   * @returns 过期时间（毫秒）
   */
  getMessageExpireTime(): number {
    return this.messageExpireTime;
  }
}
