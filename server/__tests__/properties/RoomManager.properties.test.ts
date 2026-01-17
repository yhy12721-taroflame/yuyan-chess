/**
 * 房间管理器属性测试
 * 
 * 使用 fast-check 进行属性测试
 */

import fc from 'fast-check';
import { RoomManager } from '../../src/managers/RoomManager';

describe('RoomManager 属性测试', () => {
  describe('属性 2: 房间创建往返', () => {
    it('**Feature: xiangqi-online, Property 2: 房间创建往返** - 创建房间然后立即查询该房间应该返回相同的房间信息', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (creatorId, creatorName) => {
            const roomManager = new RoomManager();
            
            // 创建房间
            const created = roomManager.createRoom(creatorId, creatorName);
            
            // 立即查询房间
            const retrieved = roomManager.getRoom(created.id);
            
            // 验证房间信息相同
            expect(retrieved).not.toBeNull();
            expect(retrieved?.id).toBe(created.id);
            expect(retrieved?.creatorId).toBe(creatorId);
            expect(retrieved?.creatorName).toBe(creatorName);
            expect(retrieved?.status).toBe('waiting');
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 3: 房间满员拒绝', () => {
    it('**Feature: xiangqi-online, Property 3: 房间满员拒绝** - 已满员的房间应该拒绝第三个玩家加入', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (creatorId, creatorName, player2Id, player2Name, player3Id) => {
            const roomManager = new RoomManager();
            
            // 创建房间
            const room = roomManager.createRoom(creatorId, creatorName);
            
            // 第一个玩家加入
            const join1 = roomManager.joinRoom(room.id, creatorId, creatorName);
            expect(join1).toBe(true);
            
            // 第二个玩家加入
            const join2 = roomManager.joinRoom(room.id, player2Id, player2Name);
            expect(join2).toBe(true);
            
            // 验证房间已满
            expect(roomManager.isRoomFull(room.id)).toBe(true);
            
            // 第三个玩家尝试加入应该被拒绝
            const join3 = roomManager.joinRoom(room.id, player3Id, 'Charlie');
            expect(join3).toBe(false);
            
            // 验证房间仍然只有两个玩家
            expect(roomManager.getRoomPlayerCount(room.id)).toBe(2);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 4: 游戏初始化', () => {
    it('**Feature: xiangqi-online, Property 4: 游戏初始化** - 第二个玩家加入时应该初始化游戏状态', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (creatorId, creatorName, player2Id, player2Name) => {
            const roomManager = new RoomManager();
            
            // 创建房间
            const room = roomManager.createRoom(creatorId, creatorName);
            
            // 第一个玩家加入
            roomManager.joinRoom(room.id, creatorId, creatorName);
            
            // 验证房间状态为 waiting
            let updated = roomManager.getRoom(room.id);
            expect(updated?.status).toBe('waiting');
            
            // 第二个玩家加入
            roomManager.joinRoom(room.id, player2Id, player2Name);
            
            // 验证房间状态变为 playing
            updated = roomManager.getRoom(room.id);
            expect(updated?.status).toBe('playing');
            
            // 验证游戏状态已初始化
            expect(updated?.gameState).toBeDefined();
            expect(updated?.gameState.currentPlayer).toBe('red');
            expect(updated?.gameState.status).toBe('playing');
            expect(updated?.gameState.redPlayer.id).toBe(creatorId);
            expect(updated?.gameState.blackPlayer.id).toBe(player2Id);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 19: 房间列表过滤', () => {
    it('**Feature: xiangqi-online, Property 19: 房间列表过滤** - 房间列表应该只返回未满员的房间', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.string({ minLength: 1, maxLength: 20 }),
              fc.string({ minLength: 1, maxLength: 20 })
            ),
            { minLength: 1, maxLength: 10 }
          ),
          (creators) => {
            const roomManager = new RoomManager();
            
            // 创建多个房间
            const rooms = creators.map(([id, name]) => 
              roomManager.createRoom(id, name)
            );
            
            // 让一些房间满员
            for (let i = 0; i < Math.min(2, rooms.length); i++) {
              roomManager.joinRoom(rooms[i].id, `player1_${i}`, `Player1_${i}`);
              roomManager.joinRoom(rooms[i].id, `player2_${i}`, `Player2_${i}`);
            }
            
            // 获取可用房间
            const available = roomManager.getAvailableRooms();
            
            // 验证所有可用房间都未满员
            available.forEach(room => {
              expect(roomManager.getRoomPlayerCount(room.id)).toBeLessThan(2);
            });
            
            // 验证没有满员的房间在列表中
            const fullRooms = roomManager.getAllRooms().filter(r => 
              roomManager.isRoomFull(r.id)
            );
            fullRooms.forEach(fullRoom => {
              expect(available.some(r => r.id === fullRoom.id)).toBe(false);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 20: 房间信息完整性', () => {
    it('**Feature: xiangqi-online, Property 20: 房间信息完整性** - 房间列表中的每个房间应该包含必需的信息', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.string({ minLength: 1, maxLength: 20 }),
              fc.string({ minLength: 1, maxLength: 20 })
            ),
            { minLength: 1, maxLength: 10 }
          ),
          (creators) => {
            const roomManager = new RoomManager();
            
            // 创建多个房间
            creators.forEach(([id, name]) => {
              roomManager.createRoom(id, name);
            });
            
            // 获取所有房间
            const rooms = roomManager.getAllRooms();
            
            // 验证每个房间都有必需的信息
            rooms.forEach(room => {
              expect(room.id).toBeDefined();
              expect(typeof room.id).toBe('string');
              expect(room.id.length).toBeGreaterThan(0);
              
              expect(room.creatorId).toBeDefined();
              expect(typeof room.creatorId).toBe('string');
              
              expect(room.creatorName).toBeDefined();
              expect(typeof room.creatorName).toBe('string');
              
              expect(room.status).toBeDefined();
              expect(['waiting', 'playing', 'finished']).toContain(room.status);
              
              expect(room.players).toBeDefined();
              expect(typeof room.players).toBe('object');
              
              expect(room.createdAt).toBeDefined();
              expect(typeof room.createdAt).toBe('number');
              expect(room.createdAt).toBeGreaterThan(0);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('房间创建和销毁的一致性', () => {
    it('创建和销毁房间应该保持一致的状态', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.string({ minLength: 1, maxLength: 20 }),
              fc.string({ minLength: 1, maxLength: 20 })
            ),
            { minLength: 1, maxLength: 10 }
          ),
          (creators) => {
            const roomManager = new RoomManager();
            
            // 创建房间
            const roomIds = creators.map(([id, name]) => 
              roomManager.createRoom(id, name).id
            );
            
            expect(roomManager.getRoomCount()).toBe(roomIds.length);
            
            // 销毁所有房间
            roomIds.forEach(roomId => {
              const room = roomManager.getRoom(roomId);
              if (room) {
                // 移除所有玩家
                Object.keys(room.players).forEach(color => {
                  const player = room.players[color as 'red' | 'black'];
                  if (player) {
                    roomManager.leaveRoom(roomId, player.id);
                  }
                });
              }
            });
            
            // 验证所有房间都被销毁
            expect(roomManager.getRoomCount()).toBe(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('玩家加入和离开的一致性', () => {
    it('玩家加入和离开应该保持房间状态一致', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (creatorId, creatorName, player2Id, player2Name) => {
            const roomManager = new RoomManager();
            
            // 创建房间
            const room = roomManager.createRoom(creatorId, creatorName);
            
            // 玩家加入
            roomManager.joinRoom(room.id, creatorId, creatorName);
            expect(roomManager.getRoomPlayerCount(room.id)).toBe(1);
            
            roomManager.joinRoom(room.id, player2Id, player2Name);
            expect(roomManager.getRoomPlayerCount(room.id)).toBe(2);
            
            // 玩家离开
            roomManager.leaveRoom(room.id, creatorId);
            expect(roomManager.getRoomPlayerCount(room.id)).toBe(1);
            
            roomManager.leaveRoom(room.id, player2Id);
            expect(roomManager.getRoomPlayerCount(room.id)).toBe(0);
            
            // 房间应该被销毁
            expect(roomManager.getRoom(room.id)).toBeNull();
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
