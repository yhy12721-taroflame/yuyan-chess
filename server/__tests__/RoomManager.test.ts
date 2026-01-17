/**
 * 房间管理器单元测试
 */

import { RoomManager } from '../src/managers/RoomManager';

describe('RoomManager', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  describe('创建房间', () => {
    it('应该成功创建房间', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      
      expect(room).toBeDefined();
      expect(room.id).toBeDefined();
      expect(room.creatorId).toBe('player1');
      expect(room.creatorName).toBe('Alice');
      expect(room.status).toBe('waiting');
      expect(Object.keys(room.players).length).toBe(0);
    });

    it('应该为每个房间分配唯一的ID', () => {
      const room1 = roomManager.createRoom('player1', 'Alice');
      const room2 = roomManager.createRoom('player2', 'Bob');
      
      expect(room1.id).not.toBe(room2.id);
    });

    it('应该能够查询已创建的房间', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      const retrieved = roomManager.getRoom(room.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(room.id);
      expect(retrieved?.creatorName).toBe('Alice');
    });
  });

  describe('玩家加入房间', () => {
    it('应该允许玩家加入空房间', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      const result = roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      expect(result).toBe(true);
      expect(roomManager.getRoomPlayerCount(room.id)).toBe(1);
    });

    it('应该为第一个玩家分配红色', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      const updated = roomManager.getRoom(room.id);
      expect(updated?.players.red).toBeDefined();
      expect(updated?.players.red?.name).toBe('Alice');
    });

    it('应该为第二个玩家分配黑色', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      roomManager.joinRoom(room.id, 'player2', 'Bob');
      
      const updated = roomManager.getRoom(room.id);
      expect(updated?.players.black).toBeDefined();
      expect(updated?.players.black?.name).toBe('Bob');
    });

    it('房间满员后应该拒绝新玩家加入', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      roomManager.joinRoom(room.id, 'player2', 'Bob');
      
      const result = roomManager.joinRoom(room.id, 'player3', 'Charlie');
      
      expect(result).toBe(false);
      expect(roomManager.getRoomPlayerCount(room.id)).toBe(2);
    });

    it('房间满员后应该自动开始游戏', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      expect(roomManager.getRoom(room.id)?.status).toBe('waiting');
      
      roomManager.joinRoom(room.id, 'player2', 'Bob');
      
      expect(roomManager.getRoom(room.id)?.status).toBe('playing');
    });

    it('应该拒绝不存在的房间', () => {
      const result = roomManager.joinRoom('nonexistent', 'player1', 'Alice');
      
      expect(result).toBe(false);
    });

    it('应该跟踪玩家所在的房间', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      const playerRoom = roomManager.getPlayerRoom('player1');
      
      expect(playerRoom).toBeDefined();
      expect(playerRoom?.id).toBe(room.id);
    });
  });

  describe('玩家离开房间', () => {
    it('应该允许玩家离开房间', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      roomManager.leaveRoom(room.id, 'player1');
      
      expect(roomManager.getRoomPlayerCount(room.id)).toBe(0);
    });

    it('玩家离开后房间应该变为空', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      roomManager.joinRoom(room.id, 'player2', 'Bob');
      
      roomManager.leaveRoom(room.id, 'player1');
      
      expect(roomManager.getRoomPlayerCount(room.id)).toBe(1);
    });

    it('所有玩家离开后房间应该被销毁', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      roomManager.leaveRoom(room.id, 'player1');
      
      expect(roomManager.getRoom(room.id)).toBeNull();
    });

    it('应该清除玩家到房间的映射', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      roomManager.leaveRoom(room.id, 'player1');
      
      expect(roomManager.getPlayerRoom('player1')).toBeNull();
    });
  });

  describe('房间列表', () => {
    it('应该返回所有未满员的房间', () => {
      const room1 = roomManager.createRoom('player1', 'Alice');
      const room2 = roomManager.createRoom('player2', 'Bob');
      
      roomManager.joinRoom(room1.id, 'player1', 'Alice');
      roomManager.joinRoom(room1.id, 'player2', 'Bob');
      
      const available = roomManager.getAvailableRooms();
      
      expect(available.length).toBe(1);
      expect(available[0].id).toBe(room2.id);
    });

    it('应该不返回已满员的房间', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      roomManager.joinRoom(room.id, 'player2', 'Bob');
      
      const available = roomManager.getAvailableRooms();
      
      expect(available.length).toBe(0);
    });

    it('应该返回所有房间', () => {
      roomManager.createRoom('player1', 'Alice');
      roomManager.createRoom('player2', 'Bob');
      roomManager.createRoom('player3', 'Charlie');
      
      const all = roomManager.getAllRooms();
      
      expect(all.length).toBe(3);
    });
  });

  describe('房间搜索', () => {
    it('应该按房间ID搜索', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      
      const results = roomManager.searchRooms(room.id.substring(0, 8));
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.id === room.id)).toBe(true);
    });

    it('应该按创建者名称搜索', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      
      const results = roomManager.searchRooms('Alice');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.id === room.id)).toBe(true);
    });

    it('搜索应该不区分大小写', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      
      const results = roomManager.searchRooms('alice');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.id === room.id)).toBe(true);
    });

    it('应该返回空数组如果没有匹配', () => {
      roomManager.createRoom('player1', 'Alice');
      
      const results = roomManager.searchRooms('NonExistent');
      
      expect(results.length).toBe(0);
    });
  });

  describe('房间状态', () => {
    it('应该检查房间是否存在', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      
      expect(roomManager.hasRoom(room.id)).toBe(true);
      expect(roomManager.hasRoom('nonexistent')).toBe(false);
    });

    it('应该检查房间是否已满', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      
      expect(roomManager.isRoomFull(room.id)).toBe(false);
      
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      expect(roomManager.isRoomFull(room.id)).toBe(false);
      
      roomManager.joinRoom(room.id, 'player2', 'Bob');
      expect(roomManager.isRoomFull(room.id)).toBe(true);
    });

    it('应该返回房间中的玩家数', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      
      expect(roomManager.getRoomPlayerCount(room.id)).toBe(0);
      
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      expect(roomManager.getRoomPlayerCount(room.id)).toBe(1);
      
      roomManager.joinRoom(room.id, 'player2', 'Bob');
      expect(roomManager.getRoomPlayerCount(room.id)).toBe(2);
    });
  });

  describe('房间计数', () => {
    it('应该返回正确的房间数', () => {
      expect(roomManager.getRoomCount()).toBe(0);
      
      roomManager.createRoom('player1', 'Alice');
      expect(roomManager.getRoomCount()).toBe(1);
      
      roomManager.createRoom('player2', 'Bob');
      expect(roomManager.getRoomCount()).toBe(2);
    });

    it('销毁房间后应该减少房间数', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      expect(roomManager.getRoomCount()).toBe(1);
      
      roomManager.leaveRoom(room.id, 'player1');
      
      expect(roomManager.getRoomCount()).toBe(0);
    });
  });

  describe('清空房间', () => {
    it('应该清空所有房间', () => {
      roomManager.createRoom('player1', 'Alice');
      roomManager.createRoom('player2', 'Bob');
      
      expect(roomManager.getRoomCount()).toBe(2);
      
      roomManager.clearAllRooms();
      
      expect(roomManager.getRoomCount()).toBe(0);
    });
  });

  describe('玩家连接状态', () => {
    it('应该更新玩家连接状态', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      roomManager.updatePlayerConnectionStatus(room.id, 'player1', false);
      
      const updated = roomManager.getRoom(room.id);
      expect(updated?.players.red?.isConnected).toBe(false);
    });

    it('应该更新玩家最后心跳时间', () => {
      const room = roomManager.createRoom('player1', 'Alice');
      roomManager.joinRoom(room.id, 'player1', 'Alice');
      
      const before = roomManager.getRoom(room.id)?.players.red?.lastHeartbeat;
      
      // 等待一小段时间
      const start = Date.now();
      while (Date.now() - start < 10) {
        // 等待
      }
      
      roomManager.updatePlayerHeartbeat(room.id, 'player1');
      
      const after = roomManager.getRoom(room.id)?.players.red?.lastHeartbeat;
      
      expect(after).toBeGreaterThan(before!);
    });
  });
});
