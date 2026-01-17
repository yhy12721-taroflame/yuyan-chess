/**
 * 重连管理器单元测试
 */

import { ReconnectionManager } from '../src/managers/ReconnectionManager';

describe('ReconnectionManager', () => {
  let manager: ReconnectionManager;

  beforeEach(() => {
    manager = new ReconnectionManager(5000); // 5秒超时
  });

  describe('存储和检索连接信息', () => {
    test('应该存储玩家连接信息', () => {
      const playerId = 'player-1';
      const playerName = '玩家1';
      const roomId = 'room-1';

      manager.storeConnectionInfo(playerId, playerName, roomId);

      const info = manager.getReconnectionInfo(playerId);
      expect(info).toBeDefined();
      expect(info?.playerId).toBe(playerId);
      expect(info?.playerName).toBe(playerName);
      expect(info?.roomId).toBe(roomId);
      expect(info?.reconnectAttempts).toBe(0);
    });

    test('应该更新房间信息', () => {
      const playerId = 'player-1';
      const playerName = '玩家1';

      manager.storeConnectionInfo(playerId, playerName);
      manager.updateRoomInfo(playerId, 'room-1');

      const info = manager.getReconnectionInfo(playerId);
      expect(info?.roomId).toBe('room-1');
    });

    test('应该处理不存在的玩家ID', () => {
      const info = manager.getReconnectionInfo('non-existent');
      expect(info).toBeUndefined();
    });
  });

  describe('重连检测', () => {
    test('应该检测有效的重连请求', () => {
      const playerId = 'player-1';
      const playerName = '玩家1';

      manager.storeConnectionInfo(playerId, playerName, 'room-1');

      const reconnectionInfo = manager.detectReconnection(playerName);
      expect(reconnectionInfo).toBeDefined();
      expect(reconnectionInfo?.playerId).toBe(playerId);
      expect(reconnectionInfo?.reconnectAttempts).toBe(1);
    });

    test('应该返回 undefined 对于不存在的玩家', () => {
      const reconnectionInfo = manager.detectReconnection('non-existent');
      expect(reconnectionInfo).toBeUndefined();
    });

    test('应该增加重连尝试次数', () => {
      const playerId = 'player-1';
      const playerName = '玩家1';

      manager.storeConnectionInfo(playerId, playerName);

      manager.detectReconnection(playerName);
      let info = manager.getReconnectionInfo(playerId);
      expect(info?.reconnectAttempts).toBe(1);

      manager.detectReconnection(playerName);
      info = manager.getReconnectionInfo(playerId);
      expect(info?.reconnectAttempts).toBe(2);
    });

    test('应该检测超时的重连请求', (done) => {
      const playerId = 'player-1';
      const playerName = '玩家1';

      manager.storeConnectionInfo(playerId, playerName);

      // 等待超时
      setTimeout(() => {
        const reconnectionInfo = manager.detectReconnection(playerName);
        expect(reconnectionInfo).toBeUndefined();
        done();
      }, 6000);
    });
  });

  describe('移除重连信息', () => {
    test('应该移除重连信息', () => {
      const playerId = 'player-1';
      const playerName = '玩家1';

      manager.storeConnectionInfo(playerId, playerName);
      expect(manager.getReconnectionInfo(playerId)).toBeDefined();

      manager.removeReconnectionInfo(playerId);
      expect(manager.getReconnectionInfo(playerId)).toBeUndefined();
    });

    test('应该处理移除不存在的重连信息', () => {
      // 不应该抛出错误
      expect(() => {
        manager.removeReconnectionInfo('non-existent');
      }).not.toThrow();
    });
  });

  describe('清理超时的重连信息', () => {
    test('应该清理超时的重连信息', (done) => {
      const playerId1 = 'player-1';
      const playerName1 = '玩家1';
      const playerId2 = 'player-2';
      const playerName2 = '玩家2';

      manager.storeConnectionInfo(playerId1, playerName1);
      
      setTimeout(() => {
        manager.storeConnectionInfo(playerId2, playerName2);
        
        const cleanupCount = manager.cleanupTimeoutReconnections();
        expect(cleanupCount).toBe(1);
        expect(manager.getReconnectionInfo(playerId1)).toBeUndefined();
        expect(manager.getReconnectionInfo(playerId2)).toBeDefined();
        done();
      }, 6000);
    });
  });

  describe('获取所有重连信息', () => {
    test('应该返回所有重连信息', () => {
      manager.storeConnectionInfo('player-1', '玩家1');
      manager.storeConnectionInfo('player-2', '玩家2');
      manager.storeConnectionInfo('player-3', '玩家3');

      const infos = manager.getAllReconnectionInfos();
      expect(infos.length).toBe(3);
    });

    test('应该返回空数组当没有重连信息时', () => {
      const infos = manager.getAllReconnectionInfos();
      expect(infos.length).toBe(0);
    });
  });

  describe('获取重连信息数量', () => {
    test('应该返回正确的重连信息数量', () => {
      expect(manager.getReconnectionInfoCount()).toBe(0);

      manager.storeConnectionInfo('player-1', '玩家1');
      expect(manager.getReconnectionInfoCount()).toBe(1);

      manager.storeConnectionInfo('player-2', '玩家2');
      expect(manager.getReconnectionInfoCount()).toBe(2);

      manager.removeReconnectionInfo('player-1');
      expect(manager.getReconnectionInfoCount()).toBe(1);
    });
  });

  describe('清空所有重连信息', () => {
    test('应该清空所有重连信息', () => {
      manager.storeConnectionInfo('player-1', '玩家1');
      manager.storeConnectionInfo('player-2', '玩家2');

      expect(manager.getReconnectionInfoCount()).toBe(2);

      manager.clearAllReconnectionInfos();
      expect(manager.getReconnectionInfoCount()).toBe(0);
    });
  });

  describe('设置和获取重连超时时间', () => {
    test('应该设置和获取重连超时时间', () => {
      expect(manager.getReconnectionTimeout()).toBe(5000);

      manager.setReconnectionTimeout(10000);
      expect(manager.getReconnectionTimeout()).toBe(10000);
    });
  });
});
