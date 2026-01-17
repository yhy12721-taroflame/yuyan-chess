import { GameEngine } from '../../src/core/GameEngine';
import { GameStatus } from '../../src/core/GameState';
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { Color } from '../../src/core/types';

describe('GameEngine - 游戏引擎', () => {
  describe('创建游戏', () => {
    it('应该创建新游戏', () => {
      const engine = GameEngine.createGame();

      expect(engine.getActivePlayer()).toBe(Color.Red);
      expect(engine.getTurnNumber()).toBe(1);
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getWinner()).toBeNull();
    });

    it('初始游戏应该有合法移动', () => {
      const engine = GameEngine.createGame();
      const legalMoves = engine.getLegalMoves();

      expect(legalMoves.length).toBeGreaterThan(0);
    });
  });

  describe('执行移动', () => {
    it('应该能执行合法移动', () => {
      const engine = GameEngine.createGame();
      const legalMoves = engine.getLegalMoves();

      expect(legalMoves.length).toBeGreaterThan(0);

      const move = legalMoves[0];
      const result = engine.makeMove(move);

      expect(result).toBe(true);
      expect(engine.getActivePlayer()).toBe(Color.Black);
      expect(engine.getTurnNumber()).toBe(2);
    });

    it('应该拒绝非法移动', () => {
      const engine = GameEngine.createGame();

      // 尝试移动到无效位置
      const invalidMove = new Move(new Position(0, 3), new Position(0, 5));
      const result = engine.makeMove(invalidMove);

      expect(result).toBe(false);
      expect(engine.getActivePlayer()).toBe(Color.Red);
      expect(engine.getTurnNumber()).toBe(1);
    });

    it('游戏结束后不能继续移动', () => {
      const engine = GameEngine.createGame();

      // 模拟游戏结束（这里我们只是测试逻辑）
      // 实际的将死情况需要特殊的棋盘设置
      const state = engine.getCurrentState();
      const checkmateState = state.withUpdates(
        state.board,
        Color.Black,
        10,
        GameStatus.Checkmate,
        Color.Red
      );

      // 创建新引擎使用将死状态
      const endedEngine = new GameEngine(checkmateState);

      const legalMoves = endedEngine.getLegalMoves();
      const move = legalMoves.length > 0 ? legalMoves[0] : new Move(new Position(0, 0), new Position(0, 1));

      const result = endedEngine.makeMove(move);
      expect(result).toBe(false);
    });
  });

  describe('游戏查询', () => {
    it('应该能获取当前活跃玩家', () => {
      const engine = GameEngine.createGame();
      expect(engine.getActivePlayer()).toBe(Color.Red);

      const legalMoves = engine.getLegalMoves();
      engine.makeMove(legalMoves[0]);

      expect(engine.getActivePlayer()).toBe(Color.Black);
    });

    it('应该能获取回合数', () => {
      const engine = GameEngine.createGame();
      expect(engine.getTurnNumber()).toBe(1);

      const legalMoves = engine.getLegalMoves();
      engine.makeMove(legalMoves[0]);

      expect(engine.getTurnNumber()).toBe(2);
    });

    it('应该能检查游戏是否结束', () => {
      const engine = GameEngine.createGame();
      expect(engine.isGameOver()).toBe(false);
    });

    it('应该能获取赢家', () => {
      const engine = GameEngine.createGame();
      expect(engine.getWinner()).toBeNull();
    });

    it('应该能获取游戏状态', () => {
      const engine = GameEngine.createGame();
      expect(engine.getGameStatus()).toBe(GameStatus.InProgress);
    });

    it('应该能获取棋盘', () => {
      const engine = GameEngine.createGame();
      const board = engine.getBoard();

      expect(board.getPieceCount()).toBe(32);
    });
  });

  describe('将军检测', () => {
    it('初始棋盘中任何一方都不被将军', () => {
      const engine = GameEngine.createGame();

      expect(engine.isPlayerInCheck(Color.Red)).toBe(false);
      expect(engine.isPlayerInCheck(Color.Black)).toBe(false);
    });
  });

  describe('合法移动生成', () => {
    it('应该能获取所有合法移动', () => {
      const engine = GameEngine.createGame();
      const legalMoves = engine.getLegalMoves();

      expect(Array.isArray(legalMoves)).toBe(true);
      expect(legalMoves.length).toBeGreaterThan(0);
    });

    it('执行移动后应该能获取新的合法移动', () => {
      const engine = GameEngine.createGame();
      const initialMoves = engine.getLegalMoves();

      engine.makeMove(initialMoves[0]);

      const nextMoves = engine.getLegalMoves();
      expect(Array.isArray(nextMoves)).toBe(true);
      expect(nextMoves.length).toBeGreaterThan(0);
    });
  });
});
