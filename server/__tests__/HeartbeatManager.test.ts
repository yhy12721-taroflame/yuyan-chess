/**
 * 心跳管理器单元测试
 * 
 * 测试内容：
 * - 心跳启动和停止
 * - 心跳发送
 * - 心跳确认处理
 * - 超时检测
 */

import { HeartbeatManager } from '../src/managers/HeartbeatManager';
import { ConnectionManager } from '../src/managers/ConnectionManager';
import { WebSocketServer } from '../src/managers/WebSocketServer';
import WebSocket from 'ws';

describe('HeartbeatManager', () => {
  let heartbeatManager: HeartbeatManager;
  let connectionManager: ConnectionManager;
  let wsServer: WebSocketServer;
  const TEST_PORT = 8766;

  beforeEach(async () => {
    connectionManager = new ConnectionManager();
    wsServer = new WebSocketServer();
    await wsServer.start(TEST_PORT);
    
    heartbeatManager = new HeartbeatManager(
      connectionManager,
      wsServer,
      100, // 心跳间隔100ms
      200  // 心跳超时200ms
    );
  });

  afterEach(async () => {
    heartbeatManager.stop();
    await wsServer.stop();
  });

  describe('心跳启动和停止', () => {
    it('应该启动心跳机制', () => {
      expect(heartbeatManager.isRunning()).toBe(false);
      
      heartbeatManager.start();
      
      expect(heartbeatManager.isRunning()).toBe(true);
    });

    it('应该停止心跳机制', () => {
      heartbeatManager.start();
      expect(heartbeatManager.isRunning()).toBe(true);
      
      heartbeatManager.stop();
      
      expect(heartbeatManager.isRunning()).toBe(false);
    });

    it('应该防止重复启动', () => {
      heartbeatManager.start();
      
      // 再次启动应该不会出错
      expect(() => {
        heartbeatManager.start();
      }).not.toThrow();
      
      expect(heartbeatManager.isRunning()).toBe(true);
    });

    it('应该获取心跳间隔', () => {
      expect(heartbeatManager.getHeartbeatInterval()).toBe(100);
    });

    it('应该获取心跳超时时间', () => {
      expect(heartbeatManager.getHeartbeatTimeout()).toBe(200);
    });
  });

  describe('心跳发送', () => {
    it('应该发送心跳给已连接的玩家', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          wsServer.registerConnection(playerId, client);
          
          heartbeatManager.start();
          
          // 等待心跳发送
          setTimeout(() => {
            heartbeatManager.stop();
            client.close();
            resolve();
          }, 150);
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该不发送心跳给已断开的玩家', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      connectionManager.updateConnectionStatus(playerId, 'disconnected');
      
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          wsServer.registerConnection(playerId, client);
          
          heartbeatManager.start();
          
          // 等待心跳发送
          setTimeout(() => {
            heartbeatManager.stop();
            client.close();
            resolve();
          }, 150);
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该在没有连接时不发送心跳', () => {
      // 不应该抛出错误
      expect(() => {
        heartbeatManager.start();
        
        setTimeout(() => {
          heartbeatManager.stop();
        }, 150);
      }).not.toThrow();
    });
  });

  describe('心跳确认处理', () => {
    it('应该处理心跳确认', () => {
      const playerId = connectionManager.createConnection('玩家1');
      const timestamp = Date.now();
      
      // 模拟发送心跳
      heartbeatManager.start();
      
      // 等待心跳发送
      setTimeout(() => {
        // 处理心跳确认
        expect(() => {
          heartbeatManager.handleHeartbeatAck(playerId, timestamp);
        }).not.toThrow();
        
        heartbeatManager.stop();
      }, 150);
    });

    it('应该更新最后心跳时间', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      const connectionInfo1 = connectionManager.getConnection(playerId);
      const firstHeartbeat = connectionInfo1?.lastHeartbeat;
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 处理心跳确认
      heartbeatManager.handleHeartbeatAck(playerId, Date.now());
      
      const connectionInfo2 = connectionManager.getConnection(playerId);
      const secondHeartbeat = connectionInfo2?.lastHeartbeat;
      
      expect(secondHeartbeat).toBeGreaterThan(firstHeartbeat!);
    });

    it('应该处理未预期的心跳确认', () => {
      // 不应该抛出错误
      expect(() => {
        heartbeatManager.handleHeartbeatAck('non-existent-player', Date.now());
      }).not.toThrow();
    });

    it('应该获取待确认的心跳数', () => {
      const playerId = connectionManager.createConnection('玩家1');
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      return new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          wsServer.registerConnection(playerId, client);
          
          heartbeatManager.start();
          
          // 等待心跳发送
          setTimeout(() => {
            const pendingCount = heartbeatManager.getPendingHeartbeatCount();
            expect(pendingCount).toBeGreaterThan(0);
            
            heartbeatManager.stop();
            client.close();
            resolve();
          }, 150);
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });
  });

  describe('超时检测', () => {
    it('应该检测超时的连接', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      heartbeatManager.start();
      
      // 等待超时检测
      await new Promise(resolve => setTimeout(resolve, 300));
      
      heartbeatManager.stop();
      
      // 连接应该被标记为断开
      const connectionStatus = connectionManager.getConnectionStatus(playerId);
      expect(connectionStatus).toBe('disconnected');
    });

    it('应该不检测已确认的连接为超时', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          wsServer.registerConnection(playerId, client);
          
          heartbeatManager.start();
          
          // 定期更新心跳
          const heartbeatInterval = setInterval(() => {
            connectionManager.updateLastHeartbeat(playerId);
          }, 50);
          
          // 等待一段时间
          setTimeout(() => {
            clearInterval(heartbeatInterval);
            heartbeatManager.stop();
            client.close();
            
            // 连接应该仍然是已连接
            const connectionStatus = connectionManager.getConnectionStatus(playerId);
            expect(connectionStatus).toBe('connected');
            
            resolve();
          }, 300);
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该检测多个超时的连接', async () => {
      const playerId1 = connectionManager.createConnection('玩家1');
      const playerId2 = connectionManager.createConnection('玩家2');
      
      heartbeatManager.start();
      
      // 等待超时检测
      await new Promise(resolve => setTimeout(resolve, 300));
      
      heartbeatManager.stop();
      
      // 两个连接都应该被标记为断开
      expect(connectionManager.getConnectionStatus(playerId1)).toBe('disconnected');
      expect(connectionManager.getConnectionStatus(playerId2)).toBe('disconnected');
    });
  });

  describe('清理资源', () => {
    it('应该在停止时清理待确认的心跳', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          wsServer.registerConnection(playerId, client);
          
          heartbeatManager.start();
          
          // 等待心跳发送
          setTimeout(() => {
            expect(heartbeatManager.getPendingHeartbeatCount()).toBeGreaterThan(0);
            
            heartbeatManager.stop();
            
            expect(heartbeatManager.getPendingHeartbeatCount()).toBe(0);
            
            client.close();
            resolve();
          }, 150);
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });
  });
});
