/**
 * 消息路由器单元测试
 * 
 * 测试内容：
 * - 消息处理器注册
 * - 消息处理器注销
 * - 消息路由和分发
 * - 消息格式验证
 * - 错误处理
 * - 未知消息类型处理
 */

import { MessageRouter, MessageHandler } from '../src/handlers/MessageRouter';
import { Message } from '../src/types';

describe('MessageRouter', () => {
  let router: MessageRouter;

  beforeEach(() => {
    router = new MessageRouter();
  });

  describe('消息处理器注册', () => {
    it('应该注册消息处理器', () => {
      const handler: MessageHandler = jest.fn();
      
      router.register('test_message', handler);
      
      expect(router.hasHandler('test_message')).toBe(true);
    });

    it('应该注册多个不同类型的处理器', () => {
      const handler1: MessageHandler = jest.fn();
      const handler2: MessageHandler = jest.fn();
      const handler3: MessageHandler = jest.fn();
      
      router.register('message_type_1', handler1);
      router.register('message_type_2', handler2);
      router.register('message_type_3', handler3);
      
      expect(router.hasHandler('message_type_1')).toBe(true);
      expect(router.hasHandler('message_type_2')).toBe(true);
      expect(router.hasHandler('message_type_3')).toBe(true);
    });

    it('应该覆盖已存在的处理器', () => {
      const handler1: MessageHandler = jest.fn();
      const handler2: MessageHandler = jest.fn();
      
      router.register('test_message', handler1);
      router.register('test_message', handler2);
      
      expect(router.hasHandler('test_message')).toBe(true);
    });

    it('应该返回所有已注册的消息类型', () => {
      router.register('message_1', jest.fn());
      router.register('message_2', jest.fn());
      router.register('message_3', jest.fn());
      
      const types = router.getRegisteredTypes();
      
      expect(types.length).toBe(3);
      expect(types).toContain('message_1');
      expect(types).toContain('message_2');
      expect(types).toContain('message_3');
    });
  });

  describe('消息处理器注销', () => {
    it('应该注销消息处理器', () => {
      const handler: MessageHandler = jest.fn();
      
      router.register('test_message', handler);
      expect(router.hasHandler('test_message')).toBe(true);
      
      router.unregister('test_message');
      expect(router.hasHandler('test_message')).toBe(false);
    });

    it('应该安全地注销不存在的处理器', () => {
      expect(() => {
        router.unregister('non_existent_message');
      }).not.toThrow();
    });

    it('应该清空所有处理器', () => {
      router.register('message_1', jest.fn());
      router.register('message_2', jest.fn());
      router.register('message_3', jest.fn());
      
      expect(router.getRegisteredTypes().length).toBe(3);
      
      router.clear();
      
      expect(router.getRegisteredTypes().length).toBe(0);
    });
  });

  describe('消息路由和分发', () => {
    it('应该将消息路由到正确的处理器', async () => {
      const handler: MessageHandler = jest.fn();
      
      router.register('test_message', handler);
      
      const message: Message = {
        type: 'test_message',
        data: { test: 'data' }
      };
      const context = { playerId: 'player-1' };
      
      await router.route(message, context);
      
      expect(handler).toHaveBeenCalledWith(message, context);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('应该将消息传递给处理器的正确数据', async () => {
      const handler: MessageHandler = jest.fn();
      
      router.register('move', handler);
      
      const message: Message = {
        type: 'move',
        data: {
          roomId: 'room-1',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 }
        }
      };
      const context = { playerId: 'player-1' };
      
      await router.route(message, context);
      
      expect(handler).toHaveBeenCalledWith(message, context);
    });

    it('应该支持异步处理器', async () => {
      const handler: MessageHandler = jest.fn(async () => {
        return new Promise(resolve => setTimeout(resolve, 10));
      });
      
      router.register('async_message', handler);
      
      const message: Message = {
        type: 'async_message',
        data: {}
      };
      
      await expect(router.route(message, {})).resolves.toBeUndefined();
      expect(handler).toHaveBeenCalled();
    });

    it('应该按顺序处理多个消息', async () => {
      const callOrder: string[] = [];
      
      const handler1: MessageHandler = jest.fn(async () => {
        callOrder.push('handler1');
      });
      const handler2: MessageHandler = jest.fn(async () => {
        callOrder.push('handler2');
      });
      
      router.register('message_1', handler1);
      router.register('message_2', handler2);
      
      const message1: Message = { type: 'message_1', data: {} };
      const message2: Message = { type: 'message_2', data: {} };
      
      await router.route(message1, {});
      await router.route(message2, {});
      
      expect(callOrder).toEqual(['handler1', 'handler2']);
    });
  });

  describe('消息格式验证', () => {
    it('应该拒绝非对象消息', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      await expect(router.route(null as any, {})).rejects.toThrow('消息格式无效');
      expect(handler).not.toHaveBeenCalled();
    });

    it('应该拒绝缺少 type 字段的消息', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message = { data: {} } as any;
      
      await expect(router.route(message, {})).rejects.toThrow('消息格式无效');
      expect(handler).not.toHaveBeenCalled();
    });

    it('应该拒绝 type 字段不是字符串的消息', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message: any = {
        type: 123,
        data: {}
      };
      
      await expect(router.route(message, {})).rejects.toThrow('消息格式无效');
      expect(handler).not.toHaveBeenCalled();
    });

    it('应该拒绝缺少 data 字段的消息', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message = { type: 'test' } as any;
      
      await expect(router.route(message, {})).rejects.toThrow('消息格式无效');
      expect(handler).not.toHaveBeenCalled();
    });

    it('应该拒绝 data 字段不是对象的消息', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message: any = {
        type: 'test',
        data: 'not an object'
      };
      
      await expect(router.route(message, {})).rejects.toThrow('消息格式无效');
      expect(handler).not.toHaveBeenCalled();
    });

    it('应该接受有效的消息格式', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message: Message = {
        type: 'test',
        data: { key: 'value' }
      };
      
      await expect(router.route(message, {})).resolves.toBeUndefined();
      expect(handler).toHaveBeenCalled();
    });

    it('应该接受空的 data 对象', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message: Message = {
        type: 'test',
        data: {}
      };
      
      await expect(router.route(message, {})).resolves.toBeUndefined();
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('错误处理', () => {
    it('应该拒绝未知的消息类型', async () => {
      const message: Message = {
        type: 'unknown_message_type',
        data: {}
      };
      
      await expect(router.route(message, {})).rejects.toThrow('未知的消息类型');
    });

    it('应该处理处理器抛出的错误', async () => {
      const error = new Error('处理器错误');
      const handler: MessageHandler = jest.fn(async () => {
        throw error;
      });
      
      router.register('error_message', handler);
      
      const message: Message = {
        type: 'error_message',
        data: {}
      };
      
      await expect(router.route(message, {})).rejects.toThrow('处理器错误');
    });

    it('应该处理处理器返回的 Promise 拒绝', async () => {
      const error = new Error('异步处理器错误');
      const handler: MessageHandler = jest.fn(async () => {
        return Promise.reject(error);
      });
      
      router.register('async_error_message', handler);
      
      const message: Message = {
        type: 'async_error_message',
        data: {}
      };
      
      await expect(router.route(message, {})).rejects.toThrow('异步处理器错误');
    });

    it('应该在处理器错误时仍然记录错误', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = new Error('处理器错误');
      const handler: MessageHandler = jest.fn(async () => {
        throw error;
      });
      
      router.register('error_message', handler);
      
      const message: Message = {
        type: 'error_message',
        data: {}
      };
      
      try {
        await router.route(message, {});
      } catch (e) {
        // 忽略错误
      }
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('处理器检查', () => {
    it('应该检查处理器是否存在', () => {
      router.register('existing', jest.fn());
      
      expect(router.hasHandler('existing')).toBe(true);
      expect(router.hasHandler('non_existing')).toBe(false);
    });

    it('应该在注销后检查处理器不存在', () => {
      router.register('test', jest.fn());
      expect(router.hasHandler('test')).toBe(true);
      
      router.unregister('test');
      expect(router.hasHandler('test')).toBe(false);
    });
  });

  describe('上下文传递', () => {
    it('应该将上下文正确传递给处理器', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message: Message = { type: 'test', data: {} };
      const context = {
        playerId: 'player-1',
        roomId: 'room-1',
        timestamp: Date.now()
      };
      
      await router.route(message, context);
      
      expect(handler).toHaveBeenCalledWith(message, context);
    });

    it('应该支持空上下文', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message: Message = { type: 'test', data: {} };
      
      await expect(router.route(message, {})).resolves.toBeUndefined();
      expect(handler).toHaveBeenCalledWith(message, {});
    });

    it('应该支持复杂的上下文对象', async () => {
      const handler: MessageHandler = jest.fn();
      router.register('test', handler);
      
      const message: Message = { type: 'test', data: {} };
      const context = {
        playerId: 'player-1',
        roomId: 'room-1',
        gameState: {
          board: [],
          currentPlayer: 'red'
        },
        metadata: {
          timestamp: Date.now(),
          version: '1.0'
        }
      };
      
      await router.route(message, context);
      
      expect(handler).toHaveBeenCalledWith(message, context);
    });
  });

  describe('消息类型大小写敏感性', () => {
    it('应该区分不同大小写的消息类型', async () => {
      const handler1: MessageHandler = jest.fn();
      const handler2: MessageHandler = jest.fn();
      
      router.register('TestMessage', handler1);
      router.register('testmessage', handler2);
      
      const message1: Message = { type: 'TestMessage', data: {} };
      const message2: Message = { type: 'testmessage', data: {} };
      
      await router.route(message1, {});
      await router.route(message2, {});
      
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  describe('并发消息处理', () => {
    it('应该并发处理多个消息', async () => {
      const handler: MessageHandler = jest.fn(async () => {
        return new Promise(resolve => setTimeout(resolve, 10));
      });
      
      router.register('concurrent_message', handler);
      
      const messages: Message[] = [
        { type: 'concurrent_message', data: { id: 1 } },
        { type: 'concurrent_message', data: { id: 2 } },
        { type: 'concurrent_message', data: { id: 3 } }
      ];
      
      const promises = messages.map(msg => router.route(msg, {}));
      
      await Promise.all(promises);
      
      expect(handler).toHaveBeenCalledTimes(3);
    });
  });
});
