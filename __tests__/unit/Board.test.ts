import { Board, createEmptyBoard } from '../../src/core/Board';
import { createPosition } from '../../src/core/Position';
import { createPiece } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

describe('Board 单元测试', () => {
  describe('createEmptyBoard', () => {
    test('应该创建空棋盘', () => {
      const board = createEmptyBoard();
      expect(board.isEmpty()).toBe(true);
      expect(board.getPieceCount()).toBe(0);
    });
  });

  describe('setPiece 和 getPiece', () => {
    test('应该能够放置和获取棋子', () => {
      const board = createEmptyBoard();
      const pos = createPosition(4, 0);
      const piece = createPiece(PieceType.General, Color.Red);

      const newBoard = board.setPiece(pos, piece);
      const retrievedPiece = newBoard.getPiece(pos);

      expect(retrievedPiece).toBeDefined();
      expect(retrievedPiece?.type).toBe(PieceType.General);
      expect(retrievedPiece?.color).toBe(Color.Red);
    });

    test('空位置应该返回 undefined', () => {
      const board = createEmptyBoard();
      const pos = createPosition(4, 4);

      expect(board.getPiece(pos)).toBeUndefined();
    });

    test('setPiece 应该返回新棋盘（不可变）', () => {
      const board = createEmptyBoard();
      const pos = createPosition(4, 0);
      const piece = createPiece(PieceType.General, Color.Red);

      const newBoard = board.setPiece(pos, piece);

      expect(board).not.toBe(newBoard);
      expect(board.getPiece(pos)).toBeUndefined();
      expect(newBoard.getPiece(pos)).toBeDefined();
    });

    test('应该能够移除棋子', () => {
      const board = createEmptyBoard();
      const pos = createPosition(4, 0);
      const piece = createPiece(PieceType.General, Color.Red);

      const boardWithPiece = board.setPiece(pos, piece);
      const boardWithoutPiece = boardWithPiece.setPiece(pos, null);

      expect(boardWithPiece.getPiece(pos)).toBeDefined();
      expect(boardWithoutPiece.getPiece(pos)).toBeUndefined();
    });

    test('应该能够替换棋子', () => {
      const board = createEmptyBoard();
      const pos = createPosition(4, 0);
      const piece1 = createPiece(PieceType.General, Color.Red);
      const piece2 = createPiece(PieceType.Advisor, Color.Black);

      const board1 = board.setPiece(pos, piece1);
      const board2 = board1.setPiece(pos, piece2);

      expect(board1.getPiece(pos)?.type).toBe(PieceType.General);
      expect(board2.getPiece(pos)?.type).toBe(PieceType.Advisor);
    });
  });

  describe('findGeneral', () => {
    test('应该能够找到红方将/帅', () => {
      const board = createEmptyBoard();
      const pos = createPosition(4, 0);
      const piece = createPiece(PieceType.General, Color.Red);
      const newBoard = board.setPiece(pos, piece);

      const foundPos = newBoard.findGeneral(Color.Red);
      expect(foundPos).not.toBeNull();
      if (foundPos !== null) {
        expect(foundPos.equals(pos)).toBe(true);
      }
    });

    test('应该能够找到黑方将/帅', () => {
      const board = createEmptyBoard();
      const pos = createPosition(4, 9);
      const piece = createPiece(PieceType.General, Color.Black);
      const newBoard = board.setPiece(pos, piece);

      const foundPos = newBoard.findGeneral(Color.Black);
      expect(foundPos).not.toBeNull();
      if (foundPos !== null) {
        expect(foundPos.equals(pos)).toBe(true);
      }
    });

    test('找不到将/帅时应该返回 null', () => {
      const board = createEmptyBoard();
      expect(board.findGeneral(Color.Red)).toBeNull();
    });
  });

  describe('getAllPieces', () => {
    test('应该返回指定颜色的所有棋子', () => {
      let board = createEmptyBoard();

      // 添加红方棋子
      board = board.setPiece(createPosition(4, 0), createPiece(PieceType.General, Color.Red));
      board = board.setPiece(createPosition(3, 0), createPiece(PieceType.Advisor, Color.Red));

      // 添加黑方棋子
      board = board.setPiece(createPosition(4, 9), createPiece(PieceType.General, Color.Black));

      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      expect(redPieces.length).toBe(2);
      expect(blackPieces.length).toBe(1);
    });

    test('空棋盘应该返回空数组', () => {
      const board = createEmptyBoard();
      const pieces = board.getAllPieces(Color.Red);

      expect(pieces).toEqual([]);
    });
  });

  describe('getPieceCount', () => {
    test('应该返回正确的棋子总数', () => {
      let board = createEmptyBoard();
      expect(board.getPieceCount()).toBe(0);

      board = board.setPiece(createPosition(4, 0), createPiece(PieceType.General, Color.Red));
      expect(board.getPieceCount()).toBe(1);

      board = board.setPiece(createPosition(4, 9), createPiece(PieceType.General, Color.Black));
      expect(board.getPieceCount()).toBe(2);
    });

    test('移除棋子应该减少计数', () => {
      let board = createEmptyBoard();
      const pos = createPosition(4, 0);

      board = board.setPiece(pos, createPiece(PieceType.General, Color.Red));
      expect(board.getPieceCount()).toBe(1);

      board = board.setPiece(pos, null);
      expect(board.getPieceCount()).toBe(0);
    });
  });

  describe('getPieceCountByColor', () => {
    test('应该返回指定颜色的棋子数量', () => {
      let board = createEmptyBoard();

      board = board.setPiece(createPosition(4, 0), createPiece(PieceType.General, Color.Red));
      board = board.setPiece(createPosition(3, 0), createPiece(PieceType.Advisor, Color.Red));
      board = board.setPiece(createPosition(4, 9), createPiece(PieceType.General, Color.Black));

      expect(board.getPieceCountByColor(Color.Red)).toBe(2);
      expect(board.getPieceCountByColor(Color.Black)).toBe(1);
    });
  });

  describe('isEmpty', () => {
    test('空棋盘应该返回 true', () => {
      const board = createEmptyBoard();
      expect(board.isEmpty()).toBe(true);
    });

    test('有棋子的棋盘应该返回 false', () => {
      const board = createEmptyBoard();
      const newBoard = board.setPiece(
        createPosition(4, 0),
        createPiece(PieceType.General, Color.Red)
      );

      expect(newBoard.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    test('应该清空棋盘', () => {
      let board = createEmptyBoard();
      board = board.setPiece(createPosition(4, 0), createPiece(PieceType.General, Color.Red));
      board = board.setPiece(createPosition(4, 9), createPiece(PieceType.General, Color.Black));

      expect(board.getPieceCount()).toBe(2);

      const clearedBoard = board.clear();
      expect(clearedBoard.isEmpty()).toBe(true);
      expect(clearedBoard.getPieceCount()).toBe(0);
    });

    test('clear 应该返回新棋盘', () => {
      let board = createEmptyBoard();
      board = board.setPiece(createPosition(4, 0), createPiece(PieceType.General, Color.Red));

      const clearedBoard = board.clear();

      expect(board).not.toBe(clearedBoard);
      expect(board.getPieceCount()).toBe(1);
      expect(clearedBoard.getPieceCount()).toBe(0);
    });
  });

  describe('clone', () => {
    test('应该创建相同内容的新棋盘', () => {
      let board = createEmptyBoard();
      board = board.setPiece(createPosition(4, 0), createPiece(PieceType.General, Color.Red));

      const clonedBoard = board.clone();

      expect(board).not.toBe(clonedBoard);
      expect(clonedBoard.getPieceCount()).toBe(board.getPieceCount());
      expect(clonedBoard.getPiece(createPosition(4, 0))).toBeDefined();
    });
  });

  describe('render', () => {
    test('应该渲染棋盘为字符串', () => {
      let board = createEmptyBoard();
      board = board.setPiece(createPosition(4, 0), createPiece(PieceType.General, Color.Red));
      board = board.setPiece(createPosition(4, 9), createPiece(PieceType.General, Color.Black));

      const rendered = board.render();

      expect(rendered).toContain('G'); // 红方将
      expect(rendered).toContain('g'); // 黑方将
      expect(rendered).toContain('~'); // 河界
      expect(rendered).toContain('.'); // 空位
    });
  });
});
