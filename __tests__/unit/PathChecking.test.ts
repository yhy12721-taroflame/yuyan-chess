import { Board, createEmptyBoard } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Piece } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

describe('路径检查函数', () => {
  describe('isPathClear', () => {
    it('应该在空棋盘上返回 true（横向）', () => {
      const board = createEmptyBoard();
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.isPathClear(from, to)).toBe(true);
    });

    it('应该在空棋盘上返回 true（纵向）', () => {
      const board = createEmptyBoard();
      const from = new Position(4, 0);
      const to = new Position(4, 9);
      
      expect(board.isPathClear(from, to)).toBe(true);
    });

    it('应该在空棋盘上返回 true（斜向）', () => {
      const board = createEmptyBoard();
      const from = new Position(0, 0);
      const to = new Position(4, 4);
      
      expect(board.isPathClear(from, to)).toBe(true);
    });

    it('应该在有阻挡时返回 false（横向）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Chariot, Color.Red));
      
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.isPathClear(from, to)).toBe(false);
    });

    it('应该在有阻挡时返回 false（纵向）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 5), new Piece(PieceType.Chariot, Color.Red));
      
      const from = new Position(4, 0);
      const to = new Position(4, 9);
      
      expect(board.isPathClear(from, to)).toBe(false);
    });

    it('应该在有阻挡时返回 false（斜向）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 2), new Piece(PieceType.Elephant, Color.Red));
      
      const from = new Position(0, 0);
      const to = new Position(4, 4);
      
      expect(board.isPathClear(from, to)).toBe(false);
    });

    it('应该不检查起点和终点的棋子', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 0), new Piece(PieceType.Chariot, Color.Red));
      board = board.setPiece(new Position(8, 0), new Piece(PieceType.Chariot, Color.Black));
      
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.isPathClear(from, to)).toBe(true);
    });

    it('应该在相邻位置返回 true', () => {
      const board = createEmptyBoard();
      const from = new Position(4, 4);
      const to = new Position(4, 5);
      
      expect(board.isPathClear(from, to)).toBe(true);
    });

    it('应该在多个阻挡时返回 false', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 0), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(6, 0), new Piece(PieceType.Soldier, Color.Red));
      
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.isPathClear(from, to)).toBe(false);
    });
  });

  describe('countPiecesBetween', () => {
    it('应该在空棋盘上返回 0', () => {
      const board = createEmptyBoard();
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(0);
    });

    it('应该正确计数单个棋子（横向）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Chariot, Color.Red));
      
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(1);
    });

    it('应该正确计数单个棋子（纵向）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 5), new Piece(PieceType.Chariot, Color.Red));
      
      const from = new Position(4, 0);
      const to = new Position(4, 9);
      
      expect(board.countPiecesBetween(from, to)).toBe(1);
    });

    it('应该正确计数多个棋子', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 0), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(6, 0), new Piece(PieceType.Soldier, Color.Red));
      
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(3);
    });

    it('应该不计数起点和终点的棋子', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 0), new Piece(PieceType.Chariot, Color.Red));
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(8, 0), new Piece(PieceType.Chariot, Color.Black));
      
      const from = new Position(0, 0);
      const to = new Position(8, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(1);
    });

    it('应该在相邻位置返回 0', () => {
      const board = createEmptyBoard();
      const from = new Position(4, 4);
      const to = new Position(4, 5);
      
      expect(board.countPiecesBetween(from, to)).toBe(0);
    });

    it('应该正确计数斜向路径', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 1), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(2, 2), new Piece(PieceType.Soldier, Color.Red));
      
      const from = new Position(0, 0);
      const to = new Position(4, 4);
      
      expect(board.countPiecesBetween(from, to)).toBe(2);
    });

    it('应该在反向路径上正确计数', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Chariot, Color.Red));
      
      const from = new Position(8, 0);
      const to = new Position(0, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(1);
    });
  });

  describe('炮的移动场景', () => {
    it('应该检测炮架（一个棋子）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 0), new Piece(PieceType.Cannon, Color.Red));
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(7, 0), new Piece(PieceType.Chariot, Color.Black));
      
      const from = new Position(1, 0);
      const to = new Position(7, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(1);
    });

    it('应该检测无炮架（零个棋子）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 0), new Piece(PieceType.Cannon, Color.Red));
      board = board.setPiece(new Position(7, 0), new Piece(PieceType.Chariot, Color.Black));
      
      const from = new Position(1, 0);
      const to = new Position(7, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(0);
    });

    it('应该检测多个炮架（两个棋子）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 0), new Piece(PieceType.Cannon, Color.Red));
      board = board.setPiece(new Position(3, 0), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(5, 0), new Piece(PieceType.Soldier, Color.Black));
      board = board.setPiece(new Position(7, 0), new Piece(PieceType.Chariot, Color.Black));
      
      const from = new Position(1, 0);
      const to = new Position(7, 0);
      
      expect(board.countPiecesBetween(from, to)).toBe(2);
    });
  });
});
