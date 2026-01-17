import * as fc from 'fast-check';
import { Board, createEmptyBoard } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Piece } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

describe('将帅对面规则 - 基于属性的测试', () => {
  describe('基本属性', () => {
    it('属性：空棋盘上不应该对面', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const board = createEmptyBoard();
          return board.areGeneralsFacing() === false;
        }),
        { numRuns: 100 }
      );
    });

    it('属性：只有一个将时不应该对面', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(Color.Red, Color.Black),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          (color, file, rank) => {
            let board = createEmptyBoard();
            board = board.setPiece(new Position(file, rank), new Piece(PieceType.General, color));
            return board.areGeneralsFacing() === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：两个将在不同列时不应该对面', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 4 }),
          fc.integer({ min: 5, max: 9 }),
          (file1, file2, rank1, rank2) => {
            // 确保两个将在不同列
            if (file1 === file2) {
              return true;
            }
            
            let board = createEmptyBoard();
            board = board.setPiece(new Position(file1, rank1), new Piece(PieceType.General, Color.Red));
            board = board.setPiece(new Position(file2, rank2), new Piece(PieceType.General, Color.Black));
            
            return board.areGeneralsFacing() === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('同列对面的属性', () => {
    it('属性：两个将在同列且无阻挡时应该对面', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          (file) => {
            let board = createEmptyBoard();
            board = board.setPiece(new Position(file, 0), new Piece(PieceType.General, Color.Red));
            board = board.setPiece(new Position(file, 9), new Piece(PieceType.General, Color.Black));
            
            return board.areGeneralsFacing() === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：在同列路径中放置棋子后不应该对面', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 1, max: 8 }),
          (file, blockingRank) => {
            let board = createEmptyBoard();
            board = board.setPiece(new Position(file, 0), new Piece(PieceType.General, Color.Red));
            board = board.setPiece(new Position(file, blockingRank), new Piece(PieceType.Soldier, Color.Red));
            board = board.setPiece(new Position(file, 9), new Piece(PieceType.General, Color.Black));
            
            return board.areGeneralsFacing() === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：移除阻挡棋子后应该对面', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 1, max: 8 }),
          (file, blockingRank) => {
            let board = createEmptyBoard();
            board = board.setPiece(new Position(file, 0), new Piece(PieceType.General, Color.Red));
            board = board.setPiece(new Position(file, blockingRank), new Piece(PieceType.Soldier, Color.Red));
            board = board.setPiece(new Position(file, 9), new Piece(PieceType.General, Color.Black));
            
            // 验证有阻挡时不对面
            if (board.areGeneralsFacing() !== false) {
              return false;
            }
            
            // 移除阻挡
            board = board.setPiece(new Position(file, blockingRank), null);
            
            // 现在应该对面
            return board.areGeneralsFacing() === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：多个阻挡棋子中移除一个后仍不对面', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 1, max: 7 }),
          fc.integer({ min: 2, max: 8 }),
          (file, rank1, rank2) => {
            // 确保两个阻挡位置不同
            if (rank1 === rank2) {
              return true;
            }
            
            let board = createEmptyBoard();
            board = board.setPiece(new Position(file, 0), new Piece(PieceType.General, Color.Red));
            board = board.setPiece(new Position(file, rank1), new Piece(PieceType.Soldier, Color.Red));
            board = board.setPiece(new Position(file, rank2), new Piece(PieceType.Soldier, Color.Black));
            board = board.setPiece(new Position(file, 9), new Piece(PieceType.General, Color.Black));
            
            // 验证有多个阻挡时不对面
            if (board.areGeneralsFacing() !== false) {
              return false;
            }
            
            // 移除第一个阻挡
            board = board.setPiece(new Position(file, rank1), null);
            
            // 仍然有一个阻挡，所以不应该对面
            return board.areGeneralsFacing() === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：移除所有阻挡后应该对面', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 1, max: 7 }),
          fc.integer({ min: 2, max: 8 }),
          (file, rank1, rank2) => {
            // 确保两个阻挡位置不同
            if (rank1 === rank2) {
              return true;
            }
            
            let board = createEmptyBoard();
            board = board.setPiece(new Position(file, 0), new Piece(PieceType.General, Color.Red));
            board = board.setPiece(new Position(file, rank1), new Piece(PieceType.Soldier, Color.Red));
            board = board.setPiece(new Position(file, rank2), new Piece(PieceType.Soldier, Color.Black));
            board = board.setPiece(new Position(file, 9), new Piece(PieceType.General, Color.Black));
            
            // 移除所有阻挡
            board = board.setPiece(new Position(file, rank1), null);
            board = board.setPiece(new Position(file, rank2), null);
            
            // 现在应该对面
            return board.areGeneralsFacing() === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('对称性属性', () => {
    it('属性：对面状态与将帅颜色顺序无关', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          fc.integer({ min: 0, max: 9 }),
          (file, rank1, rank2) => {
            // 确保两个rank不同
            if (rank1 === rank2) {
              return true;
            }
            
            let board1 = createEmptyBoard();
            board1 = board1.setPiece(new Position(file, rank1), new Piece(PieceType.General, Color.Red));
            board1 = board1.setPiece(new Position(file, rank2), new Piece(PieceType.General, Color.Black));
            
            let board2 = createEmptyBoard();
            board2 = board2.setPiece(new Position(file, rank2), new Piece(PieceType.General, Color.Black));
            board2 = board2.setPiece(new Position(file, rank1), new Piece(PieceType.General, Color.Red));
            
            // 两个棋盘的对面状态应该相同
            return board1.areGeneralsFacing() === board2.areGeneralsFacing();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：对面状态与棋子类型无关（只要是将）', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 8 }),
          (file) => {
            let board1 = createEmptyBoard();
            board1 = board1.setPiece(new Position(file, 0), new Piece(PieceType.General, Color.Red));
            board1 = board1.setPiece(new Position(file, 9), new Piece(PieceType.General, Color.Black));
            
            // 在中间放置不同类型的棋子
            const pieceTypes = [
              PieceType.Advisor,
              PieceType.Elephant,
              PieceType.Horse,
              PieceType.Chariot,
              PieceType.Cannon,
              PieceType.Soldier,
            ];
            
            for (const pieceType of pieceTypes) {
              let board2 = createEmptyBoard();
              board2 = board2.setPiece(new Position(file, 0), new Piece(PieceType.General, Color.Red));
              board2 = board2.setPiece(new Position(file, 5), new Piece(pieceType, Color.Red));
              board2 = board2.setPiece(new Position(file, 9), new Piece(PieceType.General, Color.Black));
              
              // 有阻挡时都应该不对面
              if (board2.areGeneralsFacing() !== false) {
                return false;
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
