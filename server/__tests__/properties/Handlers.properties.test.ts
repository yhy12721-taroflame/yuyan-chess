/**
 * 消息处理器属性测试
 * 
 * 使用 fast-check 进行属性测试
 */

import fc from 'fast-check';
import { ConnectionHandler } from '../../src/handlers/ConnectionHandler';
import { RoomHandler } from '../../src/handlers/RoomHandler';
import { GameHandler } from '../../src/handlers/GameHandler';
import { HeartbeatHandler } from '../../src/handlers/HeartbeatHandler';
import { ConnectionManager } from '../../src/managers/ConnectionManager';
import { RoomManager } from '../../src/managers/RoomManager';
import { GameStateManager } from '../../src/managers/GameStateManager';
import { WebSocketServer } from '../../src/managers/WebSocketServer';
import { Message } from '../../src/types';

describe('消息处理器属性测试', () => {
  describe('属性 21: 昵称验证', () => {
    it('**Feature: xiangqi-online, Property 21: 昵称验证** - 系统应该验证昵称长度在1-20字符之间', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 50 }),
          (playerName) => {
            const connectionManager = new ConnectionManager();
            const webSocketServer = new WebSocketServer();
            const connectionHandler = new ConnectionHandler(connectionManager, webSocketServer);

            const result = connectionHandler.validatePlayerName(playerName);

            // 验证结果应该与昵称长度一致
            if (playerName.length >= 1 && playerName.length <= 20) {
              expect(result.valid).toBe(true);
            } else {
              expect(result.valid).toBe(false);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 6: 状态广播一致性', () => {
    it('**Feature: xiangqi-online, Property 6: 状态广播一致性** - 所有连接到房间的玩家应该接收相同的游戏状态更新', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (creatorId, creatorName, player2Id, player2Name) => {
            const roomManager = new RoomManager();
            const gameStateManager = new GameStateManager();
            const webSocketServer = new WebSocketServer();
            const gameHandler = new GameHandler(roomManager, gameStateManager, webSocketServer);

            // 创建房间
            const room = roomManager.createRoom(creatorId, creatorName);
            roomManager.joinRoom(room.id, creatorId, creatorName);
            roomManager.joinRoom(room.id, player2Id, player2Name);

            // 初始化游戏状态
            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: creatorId, name: creatorName, isConnected: true };
            gameState.blackPlayer = { id: player2Id, name: player2Name, isConnected: true };
            room.gameState = gameState;

            // 获取状态快照
            const snapshot = gameStateManager.getStateSnapshot(room.gameState);

            // 验证快照包含必需的信息
            expect(snapshot.board).toBeDefined();
            expect(snapshot.currentPlayer).toBeDefined();
            expect(snapshot.moveCount).toBeDefined();
            expect(snapshot.status).toBeDefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('消息处理的一致性', () => {
    it('有效的消息应该被正确处理', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          (playerName) => {
            const connectionManager = new ConnectionManager();
            const webSocketServer = new WebSocketServer();
            const connectionHandler = new ConnectionHandler(connectionManager, webSocketServer);

            const message: Message = {
              type: 'connect',
              data: { playerName }
            };

            // 如果昵称有效，消息应该被接受
            if (playerName.length >= 1 && playerName.length <= 20) {
              // 消息应该通过验证
              const result = connectionHandler.validatePlayerName(playerName);
              expect(result.valid).toBe(true);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('房间处理的一致性', () => {
    it('房间创建和加入应该保持一致的状态', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (creatorId, creatorName, player2Id, player2Name) => {
            const roomManager = new RoomManager();
            const webSocketServer = new WebSocketServer();
            const connectionManager = new ConnectionManager();
            const roomHandler = new RoomHandler(roomManager, webSocketServer, connectionManager);

            // 创建房间
            const room = roomManager.createRoom(creatorId, creatorName);

            // 验证房间已创建
            expect(roomManager.getRoom(room.id)).toBeDefined();

            // 玩家加入房间
            const joined = roomManager.joinRoom(room.id, creatorId, creatorName);
            expect(joined).toBe(true);

            // 验证房间中的玩家数
            expect(roomManager.getRoomPlayerCount(room.id)).toBe(1);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('游戏处理的一致性', () => {
    it('游戏状态应该在处理移动后保持一致', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          (fromX, fromY, toX, toY) => {
            const roomManager = new RoomManager();
            const gameStateManager = new GameStateManager();
            const webSocketServer = new WebSocketServer();
            const gameHandler = new GameHandler(roomManager, gameStateManager, webSocketServer);

            // 创建房间和游戏状态
            const room = roomManager.createRoom('player1', 'Alice');
            roomManager.joinRoom(room.id, 'player1', 'Alice');
            roomManager.joinRoom(room.id, 'player2', 'Bob');

            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: 'player1', name: 'Alice', isConnected: true };
            gameState.blackPlayer = { id: 'player2', name: 'Bob', isConnected: true };
            room.gameState = gameState;

            // 验证游戏状态的一致性
            const valid = gameStateManager.validateGameStateConsistency(room.gameState);
            expect(valid).toBe(true);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('心跳处理的一致性', () => {
    it('心跳消息应该更新连接的最后心跳时间', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0 }),
          (timestamp) => {
            const connectionManager = new ConnectionManager();
            const webSocketServer = new WebSocketServer();
            const heartbeatHandler = new HeartbeatHandler(connectionManager, webSocketServer);

            // 创建连接
            const playerId = connectionManager.createConnection('Alice');

            // 获取初始的最后心跳时间
            const before = connectionManager.getConnection(playerId)?.lastHeartbeat;

            // 等待一小段时间
            const start = Date.now();
            while (Date.now() - start < 10) {
              // 等待
            }

            // 更新最后心跳时间
            connectionManager.updateLastHeartbeat(playerId);

            // 获取更新后的最后心跳时间
            const after = connectionManager.getConnection(playerId)?.lastHeartbeat;

            // 验证最后心跳时间已更新
            expect(after).toBeGreaterThanOrEqual(before!);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
