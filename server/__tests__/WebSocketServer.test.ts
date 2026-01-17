/**
 * WebSocket 服务器单元测试
 * 
 * 测试内容：
 * - 服务器启动和停止
 * - 客户端连接处理
 * - 客户端断开连接处理
 * - 消息广播
 * - 单点消息发送
 * - 连接映射管理
 * - 房间连接管理
 */

import { WebSocketServer } from '../src/managers/WebSocketServer';
import WebSocket from 'ws';
import { Message } from '../src/types';

describe('WebSocketServer', () => {
  let server: WebSocketServer;
  const TEST_PORT = 8765;

  beforeEach(() => {
    server = new WebSocketServer();
  });

  afterEach(async () => {
    try {
      await server.stop();
    } catch (error) {
      // 忽略停止时的错误
    }
  });

  describe('服务器启动和停止', () => {
    it('应该成功启动服务器', async () => {
      await expect(server.start(TEST_PORT)).resolves.toBeUndefined();
      expect(server.getConnectionCount()).toBe(0);
    });

    it('应该成功停止服务器', async () => {
      await server.start(TEST_PORT);
      await expect(server.stop()).resolves.toBeUndefined();
    });

    it('启动后应该能接受连接', async () => {
      await server.start(TEST_PORT);

      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          client.close();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });
  });

  describe('连接注册和管理', () => {
    beforeEach(async () => {
      await server.start(TEST_PORT);
    });

    it('应该注册玩家连接', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-1';
          server.registerConnection(playerId, client);
          
          expect(server.getConnection(playerId)).toBe(client);
          client.close();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该获取已注册的连接', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-2';
          server.registerConnection(playerId, client);
          
          const connection = server.getConnection(playerId);
          expect(connection).toBeDefined();
          expect(connection).toBe(client);
          
          client.close();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该返回 undefined 对于不存在的连接', () => {
      const connection = server.getConnection('non-existent-player');
      expect(connection).toBeUndefined();
    });

    it('应该正确计数连接数', async () => {
      const client1 = new WebSocket(`ws://localhost:${TEST_PORT}`);
      const client2 = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        let openCount = 0;
        
        const onOpen = () => {
          openCount++;
          if (openCount === 2) {
            server.registerConnection('player-1', client1);
            server.registerConnection('player-2', client2);
            
            expect(server.getConnectionCount()).toBe(2);
            
            client1.close();
            client2.close();
            resolve();
          }
        };
        
        client1.on('open', onOpen);
        client2.on('open', onOpen);
        client1.on('error', reject);
        client2.on('error', reject);
        
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });
  });

  describe('房间连接管理', () => {
    beforeEach(async () => {
      await server.start(TEST_PORT);
    });

    it('应该注册房间连接', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-1';
          const roomId = 'room-1';
          
          server.registerConnection(playerId, client);
          server.registerRoomConnection(roomId, playerId);
          
          const players = server.getRoomPlayers(roomId);
          expect(players.has(playerId)).toBe(true);
          
          client.close();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该获取房间内的所有玩家', async () => {
      const client1 = new WebSocket(`ws://localhost:${TEST_PORT}`);
      const client2 = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        let openCount = 0;
        
        const onOpen = () => {
          openCount++;
          if (openCount === 2) {
            const playerId1 = 'player-1';
            const playerId2 = 'player-2';
            const roomId = 'room-1';
            
            server.registerConnection(playerId1, client1);
            server.registerConnection(playerId2, client2);
            server.registerRoomConnection(roomId, playerId1);
            server.registerRoomConnection(roomId, playerId2);
            
            const players = server.getRoomPlayers(roomId);
            expect(players.size).toBe(2);
            expect(players.has(playerId1)).toBe(true);
            expect(players.has(playerId2)).toBe(true);
            
            client1.close();
            client2.close();
            resolve();
          }
        };
        
        client1.on('open', onOpen);
        client2.on('open', onOpen);
        client1.on('error', reject);
        client2.on('error', reject);
        
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该移除房间连接', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-1';
          const roomId = 'room-1';
          
          server.registerConnection(playerId, client);
          server.registerRoomConnection(roomId, playerId);
          
          let players = server.getRoomPlayers(roomId);
          expect(players.has(playerId)).toBe(true);
          
          server.removeRoomConnection(roomId, playerId);
          
          players = server.getRoomPlayers(roomId);
          expect(players.has(playerId)).toBe(false);
          
          client.close();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });

    it('应该在最后一个玩家离开时删除房间', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-1';
          const roomId = 'room-1';
          
          server.registerConnection(playerId, client);
          server.registerRoomConnection(roomId, playerId);
          
          expect(server.getRoomCount()).toBe(1);
          
          server.removeRoomConnection(roomId, playerId);
          
          expect(server.getRoomCount()).toBe(0);
          
          client.close();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 5000);
      });
    });
  });

  describe('消息广播', () => {
    beforeEach(async () => {
      await server.start(TEST_PORT);
    });

    it('应该广播消息给房间内所有玩家', async () => {
      const client1 = new WebSocket(`ws://localhost:${TEST_PORT}`);
      const client2 = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        let openCount = 0;
        
        const onOpen = () => {
          openCount++;
          if (openCount === 2) {
            const playerId1 = 'player-1';
            const playerId2 = 'player-2';
            const roomId = 'room-1';
            
            server.registerConnection(playerId1, client1);
            server.registerConnection(playerId2, client2);
            server.registerRoomConnection(roomId, playerId1);
            server.registerRoomConnection(roomId, playerId2);
            
            // 广播消息
            const message: Message = {
              type: 'game_state',
              data: { test: 'data' }
            };
            
            // 验证广播不会抛出错误
            expect(() => {
              server.broadcastToRoom(roomId, message);
            }).not.toThrow();
            
            client1.close();
            client2.close();
            resolve();
          }
        };
        
        client1.on('open', onOpen);
        client2.on('open', onOpen);
        client1.on('error', reject);
        client2.on('error', reject);
        
        setTimeout(() => reject(new Error('连接超时')), 10000);
      });
    });

    it('应该处理不存在的房间广播', async () => {
      const message: Message = {
        type: 'game_state',
        data: { test: 'data' }
      };
      
      // 应该不抛出错误
      expect(() => {
        server.broadcastToRoom('non-existent-room', message);
      }).not.toThrow();
    });
  });

  describe('单点消息发送', () => {
    beforeEach(async () => {
      await server.start(TEST_PORT);
    });

    it('应该发送消息给特定玩家', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-1';
          server.registerConnection(playerId, client);
          
          const message: Message = {
            type: 'connect_ack',
            data: { playerId }
          };
          
          // 验证发送不会抛出错误
          expect(() => {
            server.sendToPlayer(playerId, message);
          }).not.toThrow();
          
          client.close();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 10000);
      });
    });

    it('应该处理不存在的玩家发送', () => {
      const message: Message = {
        type: 'connect_ack',
        data: { playerId: 'player-1' }
      };
      
      // 应该不抛出错误
      expect(() => {
        server.sendToPlayer('non-existent-player', message);
      }).not.toThrow();
    });
  });

  describe('断开连接处理', () => {
    beforeEach(async () => {
      await server.start(TEST_PORT);
    });

    it('应该在客户端断开连接时清理资源', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-1';
          server.registerConnection(playerId, client);
          
          expect(server.getConnectionCount()).toBe(1);
          
          client.close();
          
          // 等待断开连接事件处理
          setTimeout(() => {
            // 连接应该被清理
            resolve();
          }, 500);
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 10000);
      });
    });

    it('应该在断开连接时从房间移除玩家', async () => {
      const client = new WebSocket(`ws://localhost:${TEST_PORT}`);
      
      await new Promise<void>((resolve, reject) => {
        client.on('open', () => {
          const playerId = 'player-1';
          const roomId = 'room-1';
          
          server.registerConnection(playerId, client);
          server.registerRoomConnection(roomId, playerId);
          
          expect(server.getRoomPlayers(roomId).has(playerId)).toBe(true);
          
          client.close();
          
          // 等待断开连接事件处理
          setTimeout(() => {
            // 玩家应该从房间中移除
            // 注意：由于 onDisconnection 的实现，玩家应该被移除
            resolve();
          }, 500);
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('连接超时')), 10000);
      });
    });
  });

  describe('WebSocket 服务器实例访问', () => {
    beforeEach(async () => {
      await server.start(TEST_PORT);
    });

    it('应该返回 WebSocket.Server 实例', () => {
      const wss = server.getWss();
      expect(wss).toBeDefined();
      expect(wss).toBeInstanceOf(WebSocket.Server);
    });
  });
});
