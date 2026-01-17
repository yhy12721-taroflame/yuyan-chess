import * as fc from 'fast-check';
import { Board, createEmptyBoard } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Piece } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

/**
 * 生成有效的位置
 */
const positionArb = fc.record({
  file: fc.integer({ min: 0, max: 8 }),
  rank: fc.integer({ min: 0, max: 9 }),
}).map(({ file, rank }) => new Position(file, rank));

/**
 * 生成棋子类型
 */
const pieceTypeArb = fc.constantFrom(
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
const colorArb = fc.constantFrom(Color.Red, Color.Black);

/**
 * 生成棋子
 */
const pieceArb = fc.record({
  type: pieceTypeArb,
  color: colorArb,
}).map(({ type, color }) => new Piece(type, color));

/**
 * 生成横向移动（同一行）
 */
const horizontalMoveArb = fc.record({
  rank: fc.integer({ min: 0, max: 9 }),
  file1: fc.integer({ min: 0, max: 8 }),
  file2: fc.integer({ min: 0, max: 8 }),
}).filter(({ file1, file2 }) => file1 !== file2)
  .map(({ rank, file1, file2 }) => ({
    from: new Position(file1, rank),
    to: new Position(file2, rank),
  }));

/**
 * 生成纵向移动（同一列）
 */
const verticalMoveArb = fc.record({
  file: fc.integer({ min: 0, max: 8 }),
  rank1: fc.integer({ min: 0, max: 9 }),
  rank2: fc.integer({ min: 0, max: 9 }),
}).filter(({ rank1, rank2 }) => rank1 !== rank2)
  .map(({ file, rank1, rank2 }) => ({
    from: new Position(file, rank1),
    to: new Position(file, rank2),
  }));

describe('路径检查函数 - 基于属性的测试', () => {
  describe('isPathClear 属性', () => {
    it('属性：空棋盘上任意直线路径都应该畅通', () => {
      fc.assert(
        fc.property(
          fc.oneof(horizontalMoveArb, verticalMoveArb),
          (move) => {
            const board = createEmptyBoard();
            return board.isPathClear(move.from, move.to) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：如果路径畅通，反向路径也应该畅通', () => {
      fc.assert(
        fc.property(
          fc.oneof(horizontalMoveArb, verticalMoveArb),
          (move) => {
            const board = createEmptyBoard();
            const forward = board.isPathClear(move.from, move.to);
            const backward = board.isPathClear(move.to, move.from);
            return forward === backward;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：在路径中间放置棋子后，路径应该不畅通', () => {
      fc.assert(
        fc.property(
          horizontalMoveArb,
          pieceArb,
          (move, piece) => {
            // 计算中间位置
            const minFile = Math.min(move.from.file, move.to.file);
            const maxFile = Math.max(move.from.file, move.to.file);
            
            // 如果没有中间位置，跳过
            if (maxFile - minFile <= 1) {
              return true;
            }
            
            // 在中间放置一个棋子
            const midFile = Math.floor((minFile + maxFile) / 2);
            const midPos = new Position(midFile, move.from.rank);
            
            let board = createEmptyBoard();
            board = board.setPiece(midPos, piece);
            
            return board.isPathClear(move.from, move.to) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：相邻位置之间的路径总是畅通的', () => {
      fc.assert(
        fc.property(
          positionArb,
          fc.constantFrom('horizontal', 'vertical'),
          (pos, direction) => {
            // 生成相邻位置
            let adjacentPos: Position;
            if (direction === 'horizontal' && pos.file < 8) {
              adjacentPos = new Position(pos.file + 1, pos.rank);
            } else if (direction === 'vertical' && pos.rank < 9) {
              adjacentPos = new Position(pos.file, pos.rank + 1);
            } else {
              return true; // 跳过边界情况
            }
            
            const board = createEmptyBoard();
            return board.isPathClear(pos, adjacentPos) === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('countPiecesBetween 属性', () => {
    it('属性：空棋盘上任意路径的棋子数都应该是 0', () => {
      fc.assert(
        fc.property(
          fc.oneof(horizontalMoveArb, verticalMoveArb),
          (move) => {
            const board = createEmptyBoard();
            return board.countPiecesBetween(move.from, move.to) === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：计数应该与方向无关（正向和反向相同）', () => {
      fc.assert(
        fc.property(
          horizontalMoveArb,
          fc.array(pieceArb, { minLength: 0, maxLength: 5 }),
          (move, pieces) => {
            let board = createEmptyBoard();
            
            // 在路径中间随机放置棋子
            const minFile = Math.min(move.from.file, move.to.file);
            const maxFile = Math.max(move.from.file, move.to.file);
            
            for (let i = 0; i < pieces.length && i < maxFile - minFile - 1; i++) {
              const file = minFile + 1 + i;
              board = board.setPiece(new Position(file, move.from.rank), pieces[i]);
            }
            
            const forward = board.countPiecesBetween(move.from, move.to);
            const backward = board.countPiecesBetween(move.to, move.from);
            
            return forward === backward;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：相邻位置之间的棋子数总是 0', () => {
      fc.assert(
        fc.property(
          positionArb,
          fc.constantFrom('horizontal', 'vertical'),
          (pos, direction) => {
            // 生成相邻位置
            let adjacentPos: Position;
            if (direction === 'horizontal' && pos.file < 8) {
              adjacentPos = new Position(pos.file + 1, pos.rank);
            } else if (direction === 'vertical' && pos.rank < 9) {
              adjacentPos = new Position(pos.file, pos.rank + 1);
            } else {
              return true; // 跳过边界情况
            }
            
            const board = createEmptyBoard();
            return board.countPiecesBetween(pos, adjacentPos) === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：计数应该等于实际放置的棋子数', () => {
      fc.assert(
        fc.property(
          horizontalMoveArb,
          fc.integer({ min: 0, max: 5 }),
          (move, numPieces) => {
            const minFile = Math.min(move.from.file, move.to.file);
            const maxFile = Math.max(move.from.file, move.to.file);
            const availableSpaces = maxFile - minFile - 1;
            
            // 如果没有中间空间，跳过
            if (availableSpaces <= 0) {
              return true;
            }
            
            // 限制棋子数量不超过可用空间
            const actualNumPieces = Math.min(numPieces, availableSpaces);
            
            let board = createEmptyBoard();
            
            // 放置指定数量的棋子
            for (let i = 0; i < actualNumPieces; i++) {
              const file = minFile + 1 + i;
              board = board.setPiece(
                new Position(file, move.from.rank),
                new Piece(PieceType.Soldier, Color.Red)
              );
            }
            
            const count = board.countPiecesBetween(move.from, move.to);
            return count === actualNumPieces;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('属性：起点和终点的棋子不应该被计数', () => {
      fc.assert(
        fc.property(
          horizontalMoveArb,
          pieceArb,
          pieceArb,
          (move, piece1, piece2) => {
            let board = createEmptyBoard();
            
            // 在起点和终点放置棋子
            board = board.setPiece(move.from, piece1);
            board = board.setPiece(move.to, piece2);
            
            // 计数应该是 0（不包括起点和终点）
            return board.countPiecesBetween(move.from, move.to) === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('isPathClear 和 countPiecesBetween 的关系', () => {
    it('属性：路径畅通当且仅当中间棋子数为 0', () => {
      fc.assert(
        fc.property(
          horizontalMoveArb,
          fc.array(pieceArb, { minLength: 0, maxLength: 5 }),
          (move, pieces) => {
            let board = createEmptyBoard();
            
            // 在路径中间随机放置棋子
            const minFile = Math.min(move.from.file, move.to.file);
            const maxFile = Math.max(move.from.file, move.to.file);
            
            let actualPiecesPlaced = 0;
            for (let i = 0; i < pieces.length && i < maxFile - minFile - 1; i++) {
              const file = minFile + 1 + i;
              board = board.setPiece(new Position(file, move.from.rank), pieces[i]);
              actualPiecesPlaced++;
            }
            
            const isClear = board.isPathClear(move.from, move.to);
            const count = board.countPiecesBetween(move.from, move.to);
            
            return (isClear && count === 0) || (!isClear && count > 0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
