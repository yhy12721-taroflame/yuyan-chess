import * as fc from 'fast-check';
import { Board, createEmptyBoard } from '../../src/core/Board';
import { Position, createPosition } from '../../src/core/Position';
import { Piece, createPiece } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

/**
 * 生成有效的位置
 */
const validPosition = () =>
  fc
    .record({
      file: fc.integer({ min: 0, max: 8 }),
      rank: fc.integer({ min: 0, max: 9 }),
    })
    .map(({ file, rank }) => createPosition(file, rank));

/**
 * 生成棋子类型
 */
const pieceType = () =>
  fc.constantFrom(
    PieceType.General,
    PieceType.Advisor,
    PieceType.Elephant,
    PieceType.Horse,
    PieceType.Chariot,
    PieceType.Cannon,
    PieceType.Soldier
  );

/**
 * 生成颜色
 */
const color = () => fc.constantFrom(Color.Red, Color.Black);

/**
 * 生成棋子
 */
const piece = () =>
  fc
    .record({
      type: pieceType(),
      color: color(),
    })
    .map(({ type, color }) => createPiece(type, color));

describe('Board 属性测试', () => {
  /**
   * Property 1: Board Position Round-Trip
   * 对于任何有效的位置和棋子，放置棋子后查询应返回相同的棋子
   */
  describe('Property 1: 棋盘位置往返一致性', () => {
    test('放置棋子后查询应返回相同的棋子', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const newBoard = board.setPiece(pos, p);
          const retrievedPiece = newBoard.getPiece(pos);

          expect(retrievedPiece).toBeDefined();
          expect(retrievedPiece?.type).toBe(p.type);
          expect(retrievedPiece?.color).toBe(p.color);
        }),
        { numRuns: 100 }
      );
    });

    test('未放置棋子的位置应返回 undefined', () => {
      fc.assert(
        fc.property(validPosition(), (pos) => {
          const board = createEmptyBoard();
          expect(board.getPiece(pos)).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：不可变性
   * setPiece 应该返回新棋盘，不修改原棋盘
   */
  describe('棋盘不可变性', () => {
    test('setPiece 应该返回新棋盘', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const newBoard = board.setPiece(pos, p);

          expect(board).not.toBe(newBoard);
          expect(board.getPiece(pos)).toBeUndefined();
          expect(newBoard.getPiece(pos)).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    test('移除棋子应该返回新棋盘', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const boardWithPiece = board.setPiece(pos, p);
          const boardWithoutPiece = boardWithPiece.setPiece(pos, null);

          expect(boardWithPiece).not.toBe(boardWithoutPiece);
          expect(boardWithPiece.getPiece(pos)).toBeDefined();
          expect(boardWithoutPiece.getPiece(pos)).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：棋子计数的一致性
   */
  describe('棋子计数一致性', () => {
    test('添加棋子应该增加计数', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const newBoard = board.setPiece(pos, p);

          expect(newBoard.getPieceCount()).toBe(1);
        }),
        { numRuns: 100 }
      );
    });

    test('移除棋子应该减少计数', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const boardWithPiece = board.setPiece(pos, p);
          const boardWithoutPiece = boardWithPiece.setPiece(pos, null);

          expect(boardWithPiece.getPieceCount()).toBe(1);
          expect(boardWithoutPiece.getPieceCount()).toBe(0);
        }),
        { numRuns: 100 }
      );
    });

    test('替换棋子不应该改变计数', () => {
      fc.assert(
        fc.property(validPosition(), piece(), piece(), (pos, p1, p2) => {
          const board = createEmptyBoard();
          const board1 = board.setPiece(pos, p1);
          const board2 = board1.setPiece(pos, p2);

          expect(board1.getPieceCount()).toBe(1);
          expect(board2.getPieceCount()).toBe(1);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：颜色计数的一致性
   */
  describe('颜色计数一致性', () => {
    test('添加棋子应该增加对应颜色的计数', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const newBoard = board.setPiece(pos, p);

          expect(newBoard.getPieceCountByColor(p.color)).toBe(1);
        }),
        { numRuns: 100 }
      );
    });

    test('总计数应该等于各颜色计数之和', () => {
      fc.assert(
        fc.property(
          validPosition(),
          validPosition(),
          piece(),
          piece(),
          (pos1, pos2, p1, p2) => {
            // 确保位置不同
            if (pos1.equals(pos2)) return;

            let board = createEmptyBoard();
            board = board.setPiece(pos1, p1);
            board = board.setPiece(pos2, p2);

            const redCount = board.getPieceCountByColor(Color.Red);
            const blackCount = board.getPieceCountByColor(Color.Black);
            const totalCount = board.getPieceCount();

            expect(redCount + blackCount).toBe(totalCount);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：findGeneral 的正确性
   */
  describe('findGeneral 属性', () => {
    test('应该能找到放置的将/帅', () => {
      fc.assert(
        fc.property(validPosition(), color(), (pos, c) => {
          const board = createEmptyBoard();
          const general = createPiece(PieceType.General, c);
          const newBoard = board.setPiece(pos, general);

          const foundPos = newBoard.findGeneral(c);
          expect(foundPos).not.toBeNull();
          if (foundPos !== null) {
            expect(foundPos.equals(pos)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：getAllPieces 的完整性
   */
  describe('getAllPieces 属性', () => {
    test('返回的棋子数量应该与计数一致', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const newBoard = board.setPiece(pos, p);

          const pieces = newBoard.getAllPieces(p.color);
          const count = newBoard.getPieceCountByColor(p.color);

          expect(pieces.length).toBe(count);
        }),
        { numRuns: 100 }
      );
    });

    test('返回的所有棋子应该是指定颜色', () => {
      fc.assert(
        fc.property(
          validPosition(),
          validPosition(),
          piece(),
          piece(),
          (pos1, pos2, p1, p2) => {
            if (pos1.equals(pos2)) return;

            let board = createEmptyBoard();
            board = board.setPiece(pos1, p1);
            board = board.setPiece(pos2, p2);

            const redPieces = board.getAllPieces(Color.Red);
            const blackPieces = board.getAllPieces(Color.Black);

            redPieces.forEach(([_, piece]) => {
              expect(piece.color).toBe(Color.Red);
            });

            blackPieces.forEach(([_, piece]) => {
              expect(piece.color).toBe(Color.Black);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：isEmpty 的正确性
   */
  describe('isEmpty 属性', () => {
    test('空棋盘应该为空', () => {
      const board = createEmptyBoard();
      expect(board.isEmpty()).toBe(true);
    });

    test('有棋子的棋盘不应该为空', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const newBoard = board.setPiece(pos, p);

          expect(newBoard.isEmpty()).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    test('isEmpty 应该与 getPieceCount 一致', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const newBoard = board.setPiece(pos, p);

          expect(board.isEmpty()).toBe(board.getPieceCount() === 0);
          expect(newBoard.isEmpty()).toBe(newBoard.getPieceCount() === 0);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：clear 的正确性
   */
  describe('clear 属性', () => {
    test('clear 后应该为空', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const boardWithPiece = board.setPiece(pos, p);
          const clearedBoard = boardWithPiece.clear();

          expect(clearedBoard.isEmpty()).toBe(true);
          expect(clearedBoard.getPieceCount()).toBe(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：clone 的正确性
   */
  describe('clone 属性', () => {
    test('clone 应该创建相同内容的新棋盘', () => {
      fc.assert(
        fc.property(validPosition(), piece(), (pos, p) => {
          const board = createEmptyBoard();
          const boardWithPiece = board.setPiece(pos, p);
          const clonedBoard = boardWithPiece.clone();

          expect(boardWithPiece).not.toBe(clonedBoard);
          expect(clonedBoard.getPieceCount()).toBe(boardWithPiece.getPieceCount());
          expect(clonedBoard.getPiece(pos)).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });
  });
});
