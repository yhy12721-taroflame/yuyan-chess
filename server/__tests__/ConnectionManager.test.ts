/**
 * 连接管理器单元测试
 * 
 * 测试内容：
 * - 创建新连接
 * - 玩家ID唯一性
 * - 连接查询
 * - 连接状态管理
 * - 连接清理
 * - 超时检测
 */

import { ConnectionManager } from '../src/managers/ConnectionManager';

describe('ConnectionManager', () => {
  let connectionManager: ConnectionManager;

  beforeEach(() => {
    connectionManager = new ConnectionManager();
  });

  describe('创建连接', () => {
    it('应该创建新连接并返回玩家ID', () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      expect(playerId).toBeDefined();
      expect(typeof playerId).toBe('string');
      expect(playerId.length).toBeGreaterThan(0);
    });

    it('应该为不同的玩家分配不同的ID', () => {
      const playerId1 = connectionManager.createConnection('玩家1');
      const playerId2 = connectionManager.createConnection('玩家2');
      
      expect(playerId1).not.toBe(playerId2);
    });

    it('应该为相同名称的玩家分配不同的ID', () => {
      const playerId1 = connectionManager.createConnection('玩家1');
      const playerId2 = connectionManager.createConnection('玩家1');
      
      expect(playerId1).not.toBe(playerId2);
    });

    it('应该设置连接状态为已连接', () => {
      const playerId = connectionManager.createConnection('玩家1');
      const connectionInfo = connectionManager.getConnection(playerId);
      
      expect(connectionInfo).toBeDefined();
      expect(connectionInfo?.status).toBe('connected');
    });

    it('应该记录连接时间', () => {
      const beforeTime = Date.now();
      const playerId = connectionManager.createConnection('玩家1');
      const afterTime = Date.now();
      
      const connectionInfo = connectionManager.getConnection(playerId);
      
      expect(connectionInfo?.connectedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(connectionInfo?.connectedAt).toBeLessThanOrEqual(afterTime);
    });

    it('应该初始化最后心跳时间', () => {
      const beforeTime = Date.now();
      const playerId = connectionManager.createConnection('玩家1');
      const afterTime = Date.now();
      
      const connectionInfo = connectionManager.getConnection(playerId);
      
      expect(connectionInfo?.lastHeartbeat).toBeGreaterThanOrEqual(beforeTime);
      expect(connectionInfo?.lastHeartbeat).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('玩家ID唯一性', () => {
    it('应该为100个连接生成唯一的ID', () => {
      const playerIds = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        const playerId = connectionManager.createConnection(`玩家${i}`);
        playerIds.add(playerId);
      }
      
      expect(playerIds.size).toBe(100);
    });

    it('应该为1000个连接生成唯一的ID', () => {
      const playerIds = new Set<string>();
      
      for (let i = 0; i < 1000; i++) {
        const playerId = connectionManager.createConnection(`玩家${i}`);
        playerIds.add(playerId);
      }
      
      expect(playerIds.size).toBe(1000);
    });
  });

  describe('连接查询', () => {
    it('应该获取已存在的连接', () => {
      const playerId = connectionManager.createConnection('玩家1');
      const connectionInfo = connectionManager.getConnection(playerId);
      
      expect(connectionInfo).toBeDefined();
      expect(connectionInfo?.playerId).toBe(playerId);
      expect(connectionInfo?.playerName).toBe('玩家1');
    });

    it('应该返回 undefined 对于不存在的连接', () => {
      const connectionInfo = connectionManager.getConnection('non-existent-id');
      
      expect(connectionInfo).toBeUndefined();
    });

    it('应该检查连接是否存在', () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      expect(connectionManager.hasConnection(playerId)).toBe(true);
      expect(connectionManager.hasConnection('non-existent-id')).toBe(false);
    });

    it('应该通过玩家名称获取玩家ID', () => {
      const playerId = connectionManager.createConnection('玩家1');
      const retrievedId = connectionManager.getPlayerIdByName('玩家1');
      
      expect(retrievedId).toBe(playerId);
    });

    it('应该返回 undefined 对于不存在的玩家名称', () => {
      const retrievedId = connectionManager.getPlayerIdByName('不存在的玩家');
      
      expect(retrievedId).toBeUndefined();
    });

    it('应该获取玩家名称', () => {
      const playerId = connectionManager.createConnection('玩家1');
      const playerName = connectionManager.getPlayerName(playerId);
      
      expect(playerName).toBe('玩家1');
    });

    it('应该返回 undefined 对于不存在的玩家ID', () => {
      const playerName = connectionManager.getPlayerName('non-existent-id');
      
      expect(playerName).toBeUndefined();
    });
  });

  describe('连接状态管理', () => {
    it('应该更新连接状态', () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      connectionManager.updateConnectionStatus(playerId, 'disconnected');
      const connectionInfo = connectionManager.getConnection(playerId);
      
      expect(connectionInfo?.status).toBe('disconnected');
    });

    it('应该获取连接状态', () => {
      const playerId = connectionManager.createConnection('玩家1');
      const status = connectionManager.getConnectionStatus(playerId);
      
      expect(status).toBe('connected');
    });

    it('应该返回 undefined 对于不存在的连接状态', () => {
      const status = connectionManager.getConnectionStatus('non-existent-id');
      
      expect(status).toBeUndefined();
    });

    it('应该更新最后心跳时间', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      const connectionInfo1 = connectionManager.getConnection(playerId);
      const firstHeartbeat = connectionInfo1?.lastHeartbeat;
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 100));
      
      connectionManager.updateLastHeartbeat(playerId);
      const connectionInfo2 = connectionManager.getConnection(playerId);
      const secondHeartbeat = connectionInfo2?.lastHeartbeat;
      
      expect(secondHeartbeat).toBeGreaterThan(firstHeartbeat!);
    });
  });

  describe('连接清理', () => {
    it('应该删除连接', () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      expect(connectionManager.hasConnection(playerId)).toBe(true);
      
      connectionManager.removeConnection(playerId);
      
      expect(connectionManager.hasConnection(playerId)).toBe(false);
    });

    it('应该在删除连接时清理玩家名称映射', () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      connectionManager.removeConnection(playerId);
      
      const retrievedId = connectionManager.getPlayerIdByName('玩家1');
      expect(retrievedId).toBeUndefined();
    });

    it('应该清空所有连接', () => {
      connectionManager.createConnection('玩家1');
      connectionManager.createConnection('玩家2');
      connectionManager.createConnection('玩家3');
      
      expect(connectionManager.getConnectionCount()).toBe(3);
      
      connectionManager.clearAllConnections();
      
      expect(connectionManager.getConnectionCount()).toBe(0);
    });

    it('应该获取所有连接', () => {
      const playerId1 = connectionManager.createConnection('玩家1');
      const playerId2 = connectionManager.createConnection('玩家2');
      
      const allConnections = connectionManager.getAllConnections();
      
      expect(allConnections.length).toBe(2);
      expect(allConnections.some(c => c.playerId === playerId1)).toBe(true);
      expect(allConnections.some(c => c.playerId === playerId2)).toBe(true);
    });

    it('应该获取连接数', () => {
      expect(connectionManager.getConnectionCount()).toBe(0);
      
      connectionManager.createConnection('玩家1');
      expect(connectionManager.getConnectionCount()).toBe(1);
      
      connectionManager.createConnection('玩家2');
      expect(connectionManager.getConnectionCount()).toBe(2);
      
      connectionManager.createConnection('玩家3');
      expect(connectionManager.getConnectionCount()).toBe(3);
    });
  });

  describe('超时检测', () => {
    it('应该检测超时的连接', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 获取超时的连接（超时时间为50ms）
      const timeoutConnections = connectionManager.getTimeoutConnections(50);
      
      expect(timeoutConnections).toContain(playerId);
    });

    it('应该不检测未超时的连接', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      // 获取超时的连接（超时时间为1000ms）
      const timeoutConnections = connectionManager.getTimeoutConnections(1000);
      
      expect(timeoutConnections).not.toContain(playerId);
    });

    it('应该在更新心跳后不检测为超时', async () => {
      const playerId = connectionManager.createConnection('玩家1');
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 更新心跳
      connectionManager.updateLastHeartbeat(playerId);
      
      // 获取超时的连接（超时时间为50ms）
      const timeoutConnections = connectionManager.getTimeoutConnections(50);
      
      expect(timeoutConnections).not.toContain(playerId);
    });

    it('应该检测多个超时的连接', async () => {
      const playerId1 = connectionManager.createConnection('玩家1');
      const playerId2 = connectionManager.createConnection('玩家2');
      const playerId3 = connectionManager.createConnection('玩家3');
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 更新第二个玩家的心跳
      connectionManager.updateLastHeartbeat(playerId2);
      
      // 获取超时的连接（超时时间为50ms）
      const timeoutConnections = connectionManager.getTimeoutConnections(50);
      
      expect(timeoutConnections).toContain(playerId1);
      expect(timeoutConnections).not.toContain(playerId2);
      expect(timeoutConnections).toContain(playerId3);
    });
  });
});
