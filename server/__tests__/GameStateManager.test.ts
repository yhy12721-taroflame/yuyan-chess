/**
 * 游戏状态管理器单元测试
 */

import { GameStateManager } from '../src/managers/GameStateManager';
import { GameState, Move, Position } from '../src/types';

describe('GameStateManager', () => {
  let gameStateManager: GameStateManager;
  let gameState: GameState;

  beforeEach(() => {
    gameStateManager = new GameStateManager();
    gameState = gameStateManager.createGameState();
    gameState.redPlayer = { id: 'player1', name: 'Alice', isConnected: true };
    gameState.blackPlayer = { id: 'player2', name: 'Bob', isConnected: true };
  });

  describe('创建游戏状态', () => {
    it('应该创建初始游戏状态', () => {
      const state = gameStateManager.createGameState();
      
      expect(state).toBeDefined();
      expect(state.currentPlayer).toBe('red');
      expect(state.status).toBe('playing');
      expect(state.moveHistory).toEqual([]);
      expect(state.redPlayer).toBeDefined();
      expect(state.blackPlayer).toBeDefined();
    });
  });

  describe('移动验证', () => {
    it('应该验证有效的移动', () => {
      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.validateMove(gameState, move, 'player1');
      
      expect(result.valid).toBe(true);
    });

    it('应该拒绝不是当前玩家的移动', () => {
      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player2'
      };

      const result = gameStateManager.validateMove(gameState, move, 'player2');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('轮次');
    });

    it('应该拒绝无效的位置', () => {
      const move: Move = {
        from: { x: -1, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.validateMove(gameState, move, 'player1');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('位置');
    });

    it('应该拒绝起始位置和目标位置相同的移动', () => {
      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.validateMove(gameState, move, 'player1');
      
      expect(result.valid).toBe(false);
    });

    it('应该拒绝游戏已结束时的移动', () => {
      gameState.status = 'checkmate';

      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.validateMove(gameState, move, 'player1');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('已结束');
    });
  });

  describe('应用移动', () => {
    it('应该成功应用有效的移动', () => {
      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.applyMove(gameState, move, 'player1');
      
      expect(result.success).toBe(true);
      expect(result.newState).toBeDefined();
      expect(result.newState?.moveHistory.length).toBe(1);
    });

    it('应用移动后应该切换当前玩家', () => {
      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.applyMove(gameState, move, 'player1');
      
      expect(result.newState?.currentPlayer).toBe('black');
    });

    it('应该拒绝无效的移动', () => {
      const move: Move = {
        from: { x: -1, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.applyMove(gameState, move, 'player1');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应用移动后应该保持原始游戏状态不变', () => {
      const originalState = JSON.stringify(gameState);

      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      gameStateManager.applyMove(gameState, move, 'player1');
      
      expect(JSON.stringify(gameState)).toBe(originalState);
    });
  });

  describe('游戏状态快照', () => {
    it('应该生成游戏状态快照', () => {
      const snapshot = gameStateManager.getStateSnapshot(gameState);
      
      expect(snapshot).toBeDefined();
      expect(snapshot.currentPlayer).toBe('red');
      expect(snapshot.moveCount).toBe(0);
      expect(snapshot.status).toBe('playing');
    });

    it('快照应该包含正确的移动数', () => {
      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.applyMove(gameState, move, 'player1');
      const snapshot = gameStateManager.getStateSnapshot(result.newState!);
      
      expect(snapshot.moveCount).toBe(1);
    });
  });

  describe('移动历史', () => {
    it('应该返回移动历史', () => {
      const history = gameStateManager.getMoveHistory(gameState);
      
      expect(history).toEqual([]);
    });

    it('应该返回最后一步移动', () => {
      const lastMove = gameStateManager.getLastMove(gameState);
      
      expect(lastMove).toBeNull();
    });

    it('应该返回正确的移动数', () => {
      const count = gameStateManager.getMoveCount(gameState);
      
      expect(count).toBe(0);
    });
  });

  describe('游戏状态一致性验证', () => {
    it('应该验证有效的游戏状态', () => {
      const valid = gameStateManager.validateGameStateConsistency(gameState);
      
      expect(valid).toBe(true);
    });

    it('应该拒绝无效的当前玩家', () => {
      gameState.currentPlayer = 'invalid' as any;
      
      const valid = gameStateManager.validateGameStateConsistency(gameState);
      
      expect(valid).toBe(false);
    });

    it('应该拒绝无效的游戏状态', () => {
      gameState.status = 'invalid' as any;
      
      const valid = gameStateManager.validateGameStateConsistency(gameState);
      
      expect(valid).toBe(false);
    });

    it('应该拒绝缺少玩家信息的游戏状态', () => {
      gameState.redPlayer.id = '';
      
      const valid = gameStateManager.validateGameStateConsistency(gameState);
      
      expect(valid).toBe(false);
    });
  });

  describe('游戏状态重置', () => {
    it('应该重置游戏状态', () => {
      const move: Move = {
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
        timestamp: Date.now(),
        playerId: 'player1'
      };

      const result = gameStateManager.applyMove(gameState, move, 'player1');
      const resetState = gameStateManager.resetGameState(result.newState!);
      
      expect(resetState.moveHistory).toEqual([]);
      expect(resetState.currentPlayer).toBe('red');
      expect(resetState.status).toBe('playing');
    });

    it('重置后应该保留玩家信息', () => {
      const resetState = gameStateManager.resetGameState(gameState);
      
      expect(resetState.redPlayer.id).toBe('player1');
      expect(resetState.blackPlayer.id).toBe('player2');
    });
  });
});
