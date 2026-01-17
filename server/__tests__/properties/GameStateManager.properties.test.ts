/**
 * 游戏状态管理器属性测试
 * 
 * 使用 fast-check 进行属性测试
 */

import fc from 'fast-check';
import { GameStateManager } from '../../src/managers/GameStateManager';
import { Move, Position } from '../../src/types';

describe('GameStateManager 属性测试', () => {
  describe('属性 5: 移动验证一致性', () => {
    it('**Feature: xiangqi-online, Property 5: 移动验证一致性** - 如果移动在服务器上验证失败，则游戏状态应该保持不变', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1, max: 9 }),
          fc.integer({ min: -1, max: 10 }),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          (fromX, fromY, toX, toY) => {
            const gameStateManager = new GameStateManager();
            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: 'player1', name: 'Alice', isConnected: true };
            gameState.blackPlayer = { id: 'player2', name: 'Bob', isConnected: true };

            // 创建可能无效的移动
            const move: Move = {
              from: { x: fromX, y: fromY },
              to: { x: toX, y: toY },
              timestamp: Date.now(),
              playerId: 'player1'
            };

            // 保存原始状态
            const originalState = JSON.stringify(gameState);

            // 尝试应用移动
            const result = gameStateManager.applyMove(gameState, move, 'player1');

            // 如果移动失败，游戏状态应该保持不变
            if (!result.success) {
              expect(JSON.stringify(gameState)).toBe(originalState);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('移动应用的一致性', () => {
    it('应用有效移动后应该切换玩家', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 7 }),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 1, max: 8 }),
          fc.integer({ min: 1, max: 9 }),
          (fromX, fromY, toX, toY) => {
            const gameStateManager = new GameStateManager();
            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: 'player1', name: 'Alice', isConnected: true };
            gameState.blackPlayer = { id: 'player2', name: 'Bob', isConnected: true };

            const move: Move = {
              from: { x: fromX, y: fromY },
              to: { x: toX, y: toY },
              timestamp: Date.now(),
              playerId: 'player1'
            };

            const result = gameStateManager.applyMove(gameState, move, 'player1');

            if (result.success && result.newState) {
              // 如果移动成功，玩家应该被切换
              expect(result.newState.currentPlayer).toBe('black');
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('游戏状态快照的一致性', () => {
    it('快照应该准确反映游戏状态', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          (moveCount) => {
            const gameStateManager = new GameStateManager();
            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: 'player1', name: 'Alice', isConnected: true };
            gameState.blackPlayer = { id: 'player2', name: 'Bob', isConnected: true };

            // 添加指定数量的移动
            for (let i = 0; i < moveCount; i++) {
              const move: Move = {
                from: { x: i % 9, y: i % 10 },
                to: { x: (i + 1) % 9, y: (i + 1) % 10 },
                timestamp: Date.now(),
                playerId: i % 2 === 0 ? 'player1' : 'player2'
              };

              const result = gameStateManager.applyMove(gameState, move, move.playerId);
              if (result.success && result.newState) {
                Object.assign(gameState, result.newState);
              }
            }

            const snapshot = gameStateManager.getStateSnapshot(gameState);

            // 验证快照的一致性
            expect(snapshot.moveCount).toBe(gameState.moveHistory.length);
            expect(snapshot.currentPlayer).toBe(gameState.currentPlayer);
            expect(snapshot.status).toBe(gameState.status);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('游戏状态一致性验证', () => {
    it('有效的游戏状态应该通过一致性验证', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (player1Id, player2Id) => {
            const gameStateManager = new GameStateManager();
            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: player1Id, name: 'Alice', isConnected: true };
            gameState.blackPlayer = { id: player2Id, name: 'Bob', isConnected: true };

            const valid = gameStateManager.validateGameStateConsistency(gameState);

            expect(valid).toBe(true);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('移动历史的一致性', () => {
    it('移动历史应该准确记录所有移动', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.integer({ min: 0, max: 8 }),
              fc.integer({ min: 0, max: 9 }),
              fc.integer({ min: 0, max: 8 }),
              fc.integer({ min: 0, max: 9 })
            ),
            { maxLength: 20 }
          ),
          (moves) => {
            const gameStateManager = new GameStateManager();
            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: 'player1', name: 'Alice', isConnected: true };
            gameState.blackPlayer = { id: 'player2', name: 'Bob', isConnected: true };

            let currentState = gameState;
            let successfulMoves = 0;

            moves.forEach((move, index) => {
              const [fromX, fromY, toX, toY] = move;

              // 跳过相同的起始和目标位置
              if (fromX === toX && fromY === toY) {
                return;
              }

              const moveObj: Move = {
                from: { x: fromX, y: fromY },
                to: { x: toX, y: toY },
                timestamp: Date.now(),
                playerId: index % 2 === 0 ? 'player1' : 'player2'
              };

              const result = gameStateManager.applyMove(currentState, moveObj, moveObj.playerId);
              if (result.success && result.newState) {
                currentState = result.newState;
                successfulMoves++;
              }
            });

            const history = gameStateManager.getMoveHistory(currentState);
            expect(history.length).toBe(successfulMoves);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('游戏状态重置的一致性', () => {
    it('重置后的游戏状态应该与初始状态一致', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (player1Id, player2Id) => {
            const gameStateManager = new GameStateManager();
            const gameState = gameStateManager.createGameState();
            gameState.redPlayer = { id: player1Id, name: 'Alice', isConnected: true };
            gameState.blackPlayer = { id: player2Id, name: 'Bob', isConnected: true };

            // 添加一些移动
            const move: Move = {
              from: { x: 0, y: 0 },
              to: { x: 1, y: 1 },
              timestamp: Date.now(),
              playerId: player1Id
            };

            const result = gameStateManager.applyMove(gameState, move, player1Id);
            const modifiedState = result.newState || gameState;

            // 重置游戏状态
            const resetState = gameStateManager.resetGameState(modifiedState);

            // 验证重置后的状态
            expect(resetState.moveHistory).toEqual([]);
            expect(resetState.currentPlayer).toBe('red');
            expect(resetState.status).toBe('playing');
            expect(resetState.redPlayer.id).toBe(player1Id);
            expect(resetState.blackPlayer.id).toBe(player2Id);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
