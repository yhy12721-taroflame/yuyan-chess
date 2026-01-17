import fc from 'fast-check';
import { createEmptyBoard, createInitialBoard } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Piece } from '../../src/core/Piece';
import { Move } from '../../src/core/Move';
import { MoveValidator } from '../../src/core/MoveValidator';
import { Color, PieceType } from '../../src/core/types';

describe('将军检测属性测试', () => {
  describe('Property 22: 将军检测准确性', () => {
    it('**Validates: Requirements 12.1, 12.2** - 车可以将军当且仅当在同一行/列且路径畅通', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          (generalFile, generalRank, chariotFile, chariotRank) => {
            // 跳过无效的位置
            if (generalFile === chariotFile && generalRank === chariotRank) {
              return true;
            }

            const board = createEmptyBoard();
            // 放置红方将
            let newBoard = board.setPiece(
              new Position(generalFile, generalRank),
              new Piece(PieceType.General, Color.Red)
            );
            // 放置黑方将（放在不会干扰的位置）
            newBoard = newBoard.setPiece(
              new Position(4, 9),
              new Piece(PieceType.General, Color.Black)
            );
            // 放置黑方车
            newBoard = newBoard.setPiece(
              new Position(chariotFile, chariotRank),
              new Piece(PieceType.Chariot, Color.Black)
            );

            const isInCheck = MoveValidator.isInCheck(newBoard, Color.Red);
            
            // 车可以攻击将当且仅当：
            // 1. 在同一行或同一列
            // 2. 路径畅通
            const canChariotAttack =
              (chariotFile === generalFile || chariotRank === generalRank) &&
              newBoard.isPathClear(
                new Position(chariotFile, chariotRank),
                new Position(generalFile, generalRank)
              );

            // 被将军当且仅当车可以攻击
            expect(isInCheck).toBe(canChariotAttack);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: 从将军中解脱的移动', () => {
    it('**Validates: Requirements 3.4, 12.3** - 从将军状态的合法移动必须解除将军', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 8 }),
          (generalFile, chariotFile) => {
            // 确保位置不同
            if (generalFile === chariotFile) {
              return true;
            }

            const board = createEmptyBoard();
            // 放置红方将
            let newBoard = board.setPiece(
              new Position(generalFile, 0),
              new Piece(PieceType.General, Color.Red)
            );
            // 放置黑方将
            newBoard = newBoard.setPiece(
              new Position(4, 9),
              new Piece(PieceType.General, Color.Black)
            );
            // 放置黑方车将军
            newBoard = newBoard.setPiece(
              new Position(chariotFile, 5),
              new Piece(PieceType.Chariot, Color.Black)
            );

            // 验证红方被将军
            if (!MoveValidator.isInCheck(newBoard, Color.Red)) {
              return true; // 跳过不是将军状态的情况
            }

            // 获取所有合法移动
            const legalMoves = MoveValidator.getLegalMoves(newBoard, new Position(generalFile, 0), Color.Red);

            // 所有合法移动都应该解除将军
            for (const targetPos of legalMoves) {
              const piece = newBoard.getPiece(new Position(generalFile, 0));
              if (piece) {
                let tempBoard = newBoard.setPiece(new Position(generalFile, 0), null);
                tempBoard = tempBoard.setPiece(targetPos, piece);
                expect(MoveValidator.isInCheck(tempBoard, Color.Red)).toBe(false);
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 18: 非活跃玩家的移动被拒绝', () => {
    it('**Validates: Requirements 10.3, 11.1** - 只有活跃玩家的棋子可以移动', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          (file, rank) => {
            const board = createInitialBoard();
            const pos = new Position(file, rank);
            const piece = board.getPiece(pos);

            // 如果位置有棋子
            if (piece !== undefined) {
              // 如果是红方棋子，红方可以移动
              if (piece.color === Color.Red) {
                const legalMoves = MoveValidator.getLegalMoves(board, pos, Color.Red);
                // 红方可以有合法移动
                expect(Array.isArray(legalMoves)).toBe(true);
              }

              // 黑方不能移动红方的棋子
              if (piece.color === Color.Red) {
                const legalMoves = MoveValidator.getLegalMoves(board, pos, Color.Black);
                expect(legalMoves.length).toBe(0);
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
