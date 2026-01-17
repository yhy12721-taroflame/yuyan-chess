/**
 * 连接处理器单元测试
 */

import { ConnectionHandler } from '../../src/handlers/ConnectionHandler';
import { ConnectionManager } from '../../src/managers/ConnectionManager';
import { WebSocketServer } from '../../src/managers/WebSocketServer';
import { Message } from '../../src/types';

describe('ConnectionHandler', () => {
  let connectionHandler: ConnectionHandler;
  let connectionManager: ConnectionManager;
  let webSocketServer: WebSocketServer;
  let mockWs: any;

  beforeEach(() => {
    connectionManager = new ConnectionManager();
    webSocketServer = new WebSocketServer();
    connectionHandler = new ConnectionHandler(connectionManager, webSocketServer);

    mockWs = {
      send: jest.fn(),
      close: jest.fn()
    };
  });

  describe('处理连接消息', () => {
    it('应该成功处理有效的连接消息', async () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: 'Alice' }
      };

      await connectionHandler.handleConnect(message, mockWs);

      expect(mockWs.send).toHaveBeenCalled();
      const response = JSON.parse(mockWs.send.mock.calls[0][0]);
      expect(response.type).toBe('connect_ack');
      expect(response.data.playerId).toBeDefined();
    });

    it('应该拒绝无效的玩家名称', async () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: '' }
      };

      await connectionHandler.handleConnect(message, mockWs);

      expect(mockWs.send).toHaveBeenCalled();
      const response = JSON.parse(mockWs.send.mock.calls[0][0]);
      expect(response.type).toBe('error');
    });

    it('应该拒绝过长的玩家名称', async () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: 'a'.repeat(21) }
      };

      await connectionHandler.handleConnect(message, mockWs);

      expect(mockWs.send).toHaveBeenCalled();
      const response = JSON.parse(mockWs.send.mock.calls[0][0]);
      expect(response.type).toBe('error');
    });

    it('应该为每个连接分配唯一的玩家ID', async () => {
      const message1: Message = {
        type: 'connect',
        data: { playerName: 'Alice' }
      };

      const message2: Message = {
        type: 'connect',
        data: { playerName: 'Bob' }
      };

      const mockWs2 = { send: jest.fn(), close: jest.fn() };

      await connectionHandler.handleConnect(message1, mockWs);
      await connectionHandler.handleConnect(message2, mockWs2);

      const response1 = JSON.parse(mockWs.send.mock.calls[0][0]);
      const response2 = JSON.parse(mockWs2.send.mock.calls[0][0]);

      expect(response1.data.playerId).not.toBe(response2.data.playerId);
    });
  });

  describe('验证玩家名称', () => {
    it('应该验证有效的玩家名称', () => {
      const result = connectionHandler.validatePlayerName('Alice');

      expect(result.valid).toBe(true);
    });

    it('应该拒绝空的玩家名称', () => {
      const result = connectionHandler.validatePlayerName('');

      expect(result.valid).toBe(false);
    });

    it('应该拒绝过长的玩家名称', () => {
      const result = connectionHandler.validatePlayerName('a'.repeat(21));

      expect(result.valid).toBe(false);
    });

    it('应该拒绝非字符串的玩家名称', () => {
      const result = connectionHandler.validatePlayerName(null as any);

      expect(result.valid).toBe(false);
    });
  });

  describe('处理断开连接', () => {
    it('应该处理玩家断开连接', async () => {
      // 首先创建一个连接
      const message: Message = {
        type: 'connect',
        data: { playerName: 'Alice' }
      };

      await connectionHandler.handleConnect(message, mockWs);
      const response = JSON.parse(mockWs.send.mock.calls[0][0]);
      const playerId = response.data.playerId;

      // 然后处理断开连接
      await connectionHandler.handleDisconnect(playerId);

      // 验证连接状态已更新
      const status = connectionManager.getConnectionStatus(playerId);
      expect(status).toBe('disconnected');
    });

    it('应该处理不存在的玩家断开连接', async () => {
      // 不应该抛出错误
      await expect(connectionHandler.handleDisconnect('nonexistent')).resolves.not.toThrow();
    });
  });
});
