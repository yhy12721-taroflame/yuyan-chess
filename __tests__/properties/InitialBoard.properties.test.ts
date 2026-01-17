import * as fc from 'fast-check';
import { createInitialBoard } from '../../src/core/Board';
import { Color, PieceType } from '../../src/core/types';

describe('初始棋盘属性测试', () => {
  /**
   * Property 4: Initial Board Setup
   * 对于任何新创建的游戏，棋盘应该包含恰好 32 个棋子（16 红，16 黑）在标准起始位置
   */
  describe('Property 4: 初始棋盘设置', () => {
    test('应该总是有 32 个棋子', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();
          expect(board.getPieceCount()).toBe(32);
        }),
        { numRuns: 100 }
      );
    });

    test('红方应该总是有 16 个棋子', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();
          expect(board.getPieceCountByColor(Color.Red)).toBe(16);
        }),
        { numRuns: 100 }
      );
    });

    test('黑方应该总是有 16 个棋子', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();
          expect(board.getPieceCountByColor(Color.Black)).toBe(16);
        }),
        { numRuns: 100 }
      );
    });

    test('每方应该有正确数量的各类棋子', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();

          // 检查红方
          const redPieces = board.getAllPieces(Color.Red);
          expect(redPieces.filter(([_, p]) => p.type === PieceType.General).length).toBe(1);
          expect(redPieces.filter(([_, p]) => p.type === PieceType.Advisor).length).toBe(2);
          expect(redPieces.filter(([_, p]) => p.type === PieceType.Elephant).length).toBe(2);
          expect(redPieces.filter(([_, p]) => p.type === PieceType.Horse).length).toBe(2);
          expect(redPieces.filter(([_, p]) => p.type === PieceType.Chariot).length).toBe(2);
          expect(redPieces.filter(([_, p]) => p.type === PieceType.Cannon).length).toBe(2);
          expect(redPieces.filter(([_, p]) => p.type === PieceType.Soldier).length).toBe(5);

          // 检查黑方
          const blackPieces = board.getAllPieces(Color.Black);
          expect(blackPieces.filter(([_, p]) => p.type === PieceType.General).length).toBe(1);
          expect(blackPieces.filter(([_, p]) => p.type === PieceType.Advisor).length).toBe(2);
          expect(blackPieces.filter(([_, p]) => p.type === PieceType.Elephant).length).toBe(2);
          expect(blackPieces.filter(([_, p]) => p.type === PieceType.Horse).length).toBe(2);
          expect(blackPieces.filter(([_, p]) => p.type === PieceType.Chariot).length).toBe(2);
          expect(blackPieces.filter(([_, p]) => p.type === PieceType.Cannon).length).toBe(2);
          expect(blackPieces.filter(([_, p]) => p.type === PieceType.Soldier).length).toBe(5);
        }),
        { numRuns: 100 }
      );
    });

    test('红方棋子应该在 rank 0-4', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();
          const redPieces = board.getAllPieces(Color.Red);

          redPieces.forEach(([pos, _]) => {
            expect(pos.rank).toBeGreaterThanOrEqual(0);
            expect(pos.rank).toBeLessThanOrEqual(4);
          });
        }),
        { numRuns: 100 }
      );
    });

    test('黑方棋子应该在 rank 5-9', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();
          const blackPieces = board.getAllPieces(Color.Black);

          blackPieces.forEach(([pos, _]) => {
            expect(pos.rank).toBeGreaterThanOrEqual(5);
            expect(pos.rank).toBeLessThanOrEqual(9);
          });
        }),
        { numRuns: 100 }
      );
    });

    test('应该能找到两个将', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();

          const redGeneralPos = board.findGeneral(Color.Red);
          const blackGeneralPos = board.findGeneral(Color.Black);

          expect(redGeneralPos).not.toBeNull();
          expect(blackGeneralPos).not.toBeNull();
          if (redGeneralPos !== null && blackGeneralPos !== null) {
            expect(redGeneralPos.file).toBe(4);
            expect(redGeneralPos.rank).toBe(0);
            expect(blackGeneralPos.file).toBe(4);
            expect(blackGeneralPos.rank).toBe(9);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('河界区域应该是空的', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();

          // 检查 rank 4 和 5（河界）
          for (let file = 0; file <= 8; file++) {
            expect(board.getPiece({ file, rank: 4 } as any)).toBeUndefined();
            expect(board.getPiece({ file, rank: 5 } as any)).toBeUndefined();
          }
        }),
        { numRuns: 100 }
      );
    });

    test('初始棋盘应该是确定性的（多次创建结果相同）', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board1 = createInitialBoard();
          const board2 = createInitialBoard();

          // 检查棋子数量相同
          expect(board1.getPieceCount()).toBe(board2.getPieceCount());
          expect(board1.getPieceCountByColor(Color.Red)).toBe(
            board2.getPieceCountByColor(Color.Red)
          );
          expect(board1.getPieceCountByColor(Color.Black)).toBe(
            board2.getPieceCountByColor(Color.Black)
          );

          // 检查将的位置相同
          const red1 = board1.findGeneral(Color.Red);
          const red2 = board2.findGeneral(Color.Red);
          const black1 = board1.findGeneral(Color.Black);
          const black2 = board2.findGeneral(Color.Black);

          if (red1 !== null && red2 !== null && black1 !== null && black2 !== null) {
            expect(red1.equals(red2)).toBe(true);
            expect(black1.equals(black2)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 额外属性：棋盘对称性
   */
  describe('棋盘对称性', () => {
    test('红方和黑方的棋子布局应该是对称的', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createInitialBoard();
          const redPieces = board.getAllPieces(Color.Red);
          const blackPieces = board.getAllPieces(Color.Black);

          // 按类型分组
          const redByType = new Map<PieceType, number>();
          const blackByType = new Map<PieceType, number>();

          redPieces.forEach(([_, piece]) => {
            redByType.set(piece.type, (redByType.get(piece.type) || 0) + 1);
          });

          blackPieces.forEach(([_, piece]) => {
            blackByType.set(piece.type, (blackByType.get(piece.type) || 0) + 1);
          });

          // 每种类型的棋子数量应该相同
          expect(redByType.size).toBe(blackByType.size);
          redByType.forEach((count, type) => {
            expect(blackByType.get(type)).toBe(count);
          });
        }),
        { numRuns: 100 }
      );
    });
  });
});
