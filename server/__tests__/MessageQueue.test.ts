/**
 * 消息队列单元测试
 */

import { MessageQueue } from '../src/managers/MessageQueue';
import { Message } from '../src/types';

describe('MessageQueue', () => {
  let queue: MessageQueue;

  beforeEach(() => {
    queue = new MessageQueue(3, 60000); // 最大重试3次，过期时间60秒
  });

  describe('消息入队和出队', () => {
    test('应该将消息添加到队列', () => {
      const playerId = 'player-1';
      const message: Message = { type: 'test', data: { value: 1 } };

      queue.enqueue(playerId, message);

      expect(queue.getQueueSize(playerId)).toBe(1);
    });

    test('应该从队列中获取所有消息', () => {
      const playerId = 'player-1';
      const message1: Message = { type: 'test1', data: { value: 1 } };
      const message2: Message = { type: 'test2', data: { value: 2 } };

      queue.enqueue(playerId, message1);
      queue.enqueue(playerId, message2);

      const messages = queue.dequeueAll(playerId);
      expect(messages.length).toBe(2);
      expect(messages[0]).toEqual(message1);
      expect(messages[1]).toEqual(message2);
      expect(queue.isEmpty(playerId)).toBe(true);
    });

    test('应该从队列中获取单个消息', () => {
      const playerId = 'player-1';
      const message1: Message = { type: 'test1', data: { value: 1 } };
      const message2: Message = { type: 'test2', data: { value: 2 } };

      queue.enqueue(playerId, message1);
      queue.enqueue(playerId, message2);

      const message = queue.dequeue(playerId);
      expect(message).toEqual(message1);
      expect(queue.getQueueSize(playerId)).toBe(1);

      const nextMessage = queue.dequeue(playerId);
      expect(nextMessage).toEqual(message2);
      expect(queue.isEmpty(playerId)).toBe(true);
    });

    test('应该返回 undefined 当队列为空时', () => {
      const playerId = 'player-1';
      const message = queue.dequeue(playerId);
      expect(message).toBeUndefined();
    });
  });

  describe('队列状态检查', () => {
    test('应该检查队列是否为空', () => {
      const playerId = 'player-1';
      expect(queue.isEmpty(playerId)).toBe(true);

      queue.enqueue(playerId, { type: 'test', data: {} });
      expect(queue.isEmpty(playerId)).toBe(false);
    });

    test('应该返回正确的队列大小', () => {
      const playerId = 'player-1';
      expect(queue.getQueueSize(playerId)).toBe(0);

      queue.enqueue(playerId, { type: 'test1', data: {} });
      expect(queue.getQueueSize(playerId)).toBe(1);

      queue.enqueue(playerId, { type: 'test2', data: {} });
      expect(queue.getQueueSize(playerId)).toBe(2);

      queue.dequeue(playerId);
      expect(queue.getQueueSize(playerId)).toBe(1);
    });
  });

  describe('清空队列', () => {
    test('应该清空特定玩家的队列', () => {
      const playerId = 'player-1';
      queue.enqueue(playerId, { type: 'test1', data: {} });
      queue.enqueue(playerId, { type: 'test2', data: {} });

      expect(queue.getQueueSize(playerId)).toBe(2);

      queue.clearQueue(playerId);
      expect(queue.isEmpty(playerId)).toBe(true);
    });

    test('应该清空所有队列', () => {
      queue.enqueue('player-1', { type: 'test1', data: {} });
      queue.enqueue('player-2', { type: 'test2', data: {} });

      queue.clearAllQueues();

      expect(queue.isEmpty('player-1')).toBe(true);
      expect(queue.isEmpty('player-2')).toBe(true);
    });
  });

  describe('重试计数', () => {
    test('应该增加重试次数', () => {
      const playerId = 'player-1';
      queue.enqueue(playerId, { type: 'test', data: {} });

      const canRetry1 = queue.incrementRetryCount(playerId, 0);
      expect(canRetry1).toBe(true);

      const canRetry2 = queue.incrementRetryCount(playerId, 0);
      expect(canRetry2).toBe(true);

      const canRetry3 = queue.incrementRetryCount(playerId, 0);
      expect(canRetry3).toBe(false); // 已达到最大重试次数
    });

    test('应该处理无效的消息索引', () => {
      const playerId = 'player-1';
      queue.enqueue(playerId, { type: 'test', data: {} });

      const canRetry = queue.incrementRetryCount(playerId, 10);
      expect(canRetry).toBe(false);
    });
  });

  describe('清理过期消息', () => {
    test('应该清理过期的消息', (done) => {
      const playerId = 'player-1';
      queue.setMessageExpireTime(1000); // 1秒过期

      queue.enqueue(playerId, { type: 'test', data: {} });
      expect(queue.getQueueSize(playerId)).toBe(1);

      setTimeout(() => {
        const cleanupCount = queue.cleanupExpiredMessages();
        expect(cleanupCount).toBe(1);
        expect(queue.isEmpty(playerId)).toBe(true);
        done();
      }, 1500);
    });

    test('应该不清理未过期的消息', () => {
      const playerId = 'player-1';
      queue.setMessageExpireTime(60000); // 60秒过期

      queue.enqueue(playerId, { type: 'test', data: {} });
      const cleanupCount = queue.cleanupExpiredMessages();
      expect(cleanupCount).toBe(0);
      expect(queue.getQueueSize(playerId)).toBe(1);
    });
  });

  describe('获取统计信息', () => {
    test('应该返回正确的统计信息', () => {
      queue.enqueue('player-1', { type: 'test1', data: {} });
      queue.enqueue('player-1', { type: 'test2', data: {} });
      queue.enqueue('player-2', { type: 'test3', data: {} });

      const stats = queue.getStatistics();
      expect(stats.totalQueues).toBe(2);
      expect(stats.totalMessages).toBe(3);
      expect(stats.queueDetails.length).toBe(2);
    });

    test('应该返回空统计信息当没有队列时', () => {
      const stats = queue.getStatistics();
      expect(stats.totalQueues).toBe(0);
      expect(stats.totalMessages).toBe(0);
      expect(stats.queueDetails.length).toBe(0);
    });
  });

  describe('设置和获取配置', () => {
    test('应该设置和获取最大重试次数', () => {
      expect(queue.getMaxRetries()).toBe(3);

      queue.setMaxRetries(5);
      expect(queue.getMaxRetries()).toBe(5);
    });

    test('应该设置和获取消息过期时间', () => {
      expect(queue.getMessageExpireTime()).toBe(60000);

      queue.setMessageExpireTime(120000);
      expect(queue.getMessageExpireTime()).toBe(120000);
    });
  });

  describe('多玩家队列管理', () => {
    test('应该为不同玩家维护独立的队列', () => {
      const message1: Message = { type: 'test1', data: { value: 1 } };
      const message2: Message = { type: 'test2', data: { value: 2 } };

      queue.enqueue('player-1', message1);
      queue.enqueue('player-2', message2);

      expect(queue.getQueueSize('player-1')).toBe(1);
      expect(queue.getQueueSize('player-2')).toBe(1);

      const msg1 = queue.dequeue('player-1');
      expect(msg1).toEqual(message1);
      expect(queue.getQueueSize('player-1')).toBe(0);
      expect(queue.getQueueSize('player-2')).toBe(1);
    });

    test('应该清空特定玩家的队列而不影响其他玩家', () => {
      queue.enqueue('player-1', { type: 'test1', data: {} });
      queue.enqueue('player-2', { type: 'test2', data: {} });

      queue.clearQueue('player-1');

      expect(queue.isEmpty('player-1')).toBe(true);
      expect(queue.isEmpty('player-2')).toBe(false);
    });
  });
});
