import { Board, createEmptyBoard, createInitialBoard } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Piece } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

describe('将帅对面规则检查', () => {
  describe('areGeneralsFacing', () => {
    it('应该在初始棋盘上返回 false（将帅不对面）', () => {
      const board = createInitialBoard();
      expect(board.areGeneralsFacing()).toBe(false);
    });

    it('应该在将帅同列且无阻挡时返回 true', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (4, 0)
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      
      // 放置黑方将在 (4, 9)
      board = board.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(true);
    });

    it('应该在将帅不同列时返回 false', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (3, 0)
      board = board.setPiece(new Position(3, 0), new Piece(PieceType.General, Color.Red));
      
      // 放置黑方将在 (5, 9)
      board = board.setPiece(new Position(5, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(false);
    });

    it('应该在将帅同列但有阻挡时返回 false', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (4, 0)
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      
      // 在中间放置一个棋子
      board = board.setPiece(new Position(4, 5), new Piece(PieceType.Soldier, Color.Red));
      
      // 放置黑方将在 (4, 9)
      board = board.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(false);
    });

    it('应该在将帅同列但有多个阻挡时返回 false', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (4, 0)
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      
      // 在中间放置多个棋子
      board = board.setPiece(new Position(4, 3), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(4, 5), new Piece(PieceType.Soldier, Color.Black));
      board = board.setPiece(new Position(4, 7), new Piece(PieceType.Chariot, Color.Red));
      
      // 放置黑方将在 (4, 9)
      board = board.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(false);
    });

    it('应该在只有一个将时返回 false', () => {
      let board = createEmptyBoard();
      
      // 只放置红方将
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      
      expect(board.areGeneralsFacing()).toBe(false);
    });

    it('应该在没有将时返回 false', () => {
      const board = createEmptyBoard();
      expect(board.areGeneralsFacing()).toBe(false);
    });

    it('应该在将帅相邻且同列时返回 true', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (4, 4)
      board = board.setPiece(new Position(4, 4), new Piece(PieceType.General, Color.Red));
      
      // 放置黑方将在 (4, 5)
      board = board.setPiece(new Position(4, 5), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(true);
    });

    it('应该在将帅在棋盘边缘且同列时返回 true', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (0, 0)
      board = board.setPiece(new Position(0, 0), new Piece(PieceType.General, Color.Red));
      
      // 放置黑方将在 (0, 9)
      board = board.setPiece(new Position(0, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(true);
    });

    it('应该在将帅在棋盘另一边缘且同列时返回 true', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (8, 0)
      board = board.setPiece(new Position(8, 0), new Piece(PieceType.General, Color.Red));
      
      // 放置黑方将在 (8, 9)
      board = board.setPiece(new Position(8, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(true);
    });

    it('应该在移除中间棋子后返回 true', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (4, 0)
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      
      // 在中间放置一个棋子
      board = board.setPiece(new Position(4, 5), new Piece(PieceType.Soldier, Color.Red));
      
      // 放置黑方将在 (4, 9)
      board = board.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      
      // 验证对面
      expect(board.areGeneralsFacing()).toBe(false);
      
      // 移除中间的棋子
      board = board.setPiece(new Position(4, 5), null);
      
      // 现在应该对面
      expect(board.areGeneralsFacing()).toBe(true);
    });

    it('应该在不同行的同列位置返回 false', () => {
      let board = createEmptyBoard();
      
      // 放置红方将在 (4, 2)
      board = board.setPiece(new Position(4, 2), new Piece(PieceType.General, Color.Red));
      
      // 放置黑方将在 (4, 7)
      board = board.setPiece(new Position(4, 7), new Piece(PieceType.General, Color.Black));
      
      // 虽然同列，但不是完全对面（中间有河界）
      expect(board.areGeneralsFacing()).toBe(true);
    });
  });

  describe('将帅对面的实际场景', () => {
    it('应该检测红方移动后导致对面的情况', () => {
      let board = createEmptyBoard();
      
      // 初始状态：红方将在 (4, 0)，黑方将在 (4, 9)，中间有棋子
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      board = board.setPiece(new Position(4, 5), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(false);
      
      // 模拟红方移动士兵，导致对面
      board = board.setPiece(new Position(4, 5), null);
      
      expect(board.areGeneralsFacing()).toBe(true);
    });

    it('应该检测黑方移动后导致对面的情况', () => {
      let board = createEmptyBoard();
      
      // 初始状态：红方将在 (4, 0)，黑方将在 (4, 9)，中间有棋子
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      board = board.setPiece(new Position(4, 4), new Piece(PieceType.Chariot, Color.Black));
      board = board.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      
      expect(board.areGeneralsFacing()).toBe(false);
      
      // 模拟黑方移动车，导致对面
      board = board.setPiece(new Position(4, 4), null);
      
      expect(board.areGeneralsFacing()).toBe(true);
    });
  });
});
