import { GameState, GameStatus } from '../../src/core/GameState';
import { createInitialBoard } from '../../src/core/Board';
import { Color } from '../../src/core/types';

describe('GameState - 游戏状态', () => {
  describe('创建初始游戏状态', () => {
    it('应该创建初始游戏状态', () => {
      const state = GameState.createInitial();

      expect(state.activePlayer).toBe(Color.Red);
      expect(state.turnNumber).toBe(1);
      expect(state.status).toBe(GameStatus.InProgress);
      expect(state.winner).toBeNull();
      expect(state.board.getPieceCount()).toBe(32);
    });

    it('初始状态应该有红方先手', () => {
      const state = GameState.createInitial();
      expect(state.activePlayer).toBe(Color.Red);
    });

    it('初始状态游戏应该进行中', () => {
      const state = GameState.createInitial();
      expect(state.isGameOver()).toBe(false);
    });
  });

  describe('游戏状态更新', () => {
    it('应该能更新游戏状态', () => {
      const initialState = GameState.createInitial();
      const newBoard = initialState.board;

      const newState = initialState.withUpdates(
        newBoard,
        Color.Black,
        2,
        GameStatus.InProgress,
        null
      );

      expect(newState.activePlayer).toBe(Color.Black);
      expect(newState.turnNumber).toBe(2);
      expect(newState.status).toBe(GameStatus.InProgress);
    });

    it('应该能设置游戏为将死状态', () => {
      const initialState = GameState.createInitial();

      const checkmateState = initialState.withUpdates(
        initialState.board,
        Color.Black,
        10,
        GameStatus.Checkmate,
        Color.Red
      );

      expect(checkmateState.status).toBe(GameStatus.Checkmate);
      expect(checkmateState.winner).toBe(Color.Red);
      expect(checkmateState.isGameOver()).toBe(true);
    });

    it('应该能设置游戏为困毙状态', () => {
      const initialState = GameState.createInitial();

      const stalemateState = initialState.withUpdates(
        initialState.board,
        Color.Black,
        10,
        GameStatus.Stalemate,
        null
      );

      expect(stalemateState.status).toBe(GameStatus.Stalemate);
      expect(stalemateState.winner).toBeNull();
      expect(stalemateState.isGameOver()).toBe(true);
    });
  });

  describe('游戏状态查询', () => {
    it('进行中的游戏不应该结束', () => {
      const state = GameState.createInitial();
      expect(state.isGameOver()).toBe(false);
    });

    it('将死的游戏应该结束', () => {
      const state = GameState.createInitial().withUpdates(
        undefined,
        undefined,
        undefined,
        GameStatus.Checkmate,
        Color.Red
      );
      expect(state.isGameOver()).toBe(true);
    });

    it('困毙的游戏应该结束', () => {
      const state = GameState.createInitial().withUpdates(
        undefined,
        undefined,
        undefined,
        GameStatus.Stalemate,
        null
      );
      expect(state.isGameOver()).toBe(true);
    });

    it('应该能获取赢家', () => {
      const state = GameState.createInitial().withUpdates(
        undefined,
        undefined,
        undefined,
        GameStatus.Checkmate,
        Color.Red
      );
      expect(state.getWinner()).toBe(Color.Red);
    });

    it('困毙时没有赢家', () => {
      const state = GameState.createInitial().withUpdates(
        undefined,
        undefined,
        undefined,
        GameStatus.Stalemate,
        null
      );
      expect(state.getWinner()).toBeNull();
    });
  });

  describe('游戏状态字符串表示', () => {
    it('进行中的游戏应该显示回合信息', () => {
      const state = GameState.createInitial();
      const str = state.toString();
      expect(str).toContain('进行中');
      expect(str).toContain('第 1 回合');
      expect(str).toContain('红');
    });

    it('将死的游戏应该显示赢家', () => {
      const state = GameState.createInitial().withUpdates(
        undefined,
        undefined,
        undefined,
        GameStatus.Checkmate,
        Color.Red
      );
      const str = state.toString();
      expect(str).toContain('将死');
      expect(str).toContain('红');
    });

    it('困毙的游戏应该显示和棋', () => {
      const state = GameState.createInitial().withUpdates(
        undefined,
        undefined,
        undefined,
        GameStatus.Stalemate,
        null
      );
      const str = state.toString();
      expect(str).toContain('困毙');
      expect(str).toContain('和棋');
    });
  });
});
