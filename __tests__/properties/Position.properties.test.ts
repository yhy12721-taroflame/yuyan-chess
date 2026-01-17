import * as fc from 'fast-check';
import {
  Position,
  createPosition,
  isInPalace,
  hasCrossedRiver,
  isValid,
} from '../../src/core/Position';
import { Color } from '../../src/core/types';

/**
 * 生成有效的文件坐标（列）
 */
const validFile = () => fc.integer({ min: 0, max: 8 });

/**
 * 生成有效的等级坐标（行）
 */
const validRank = () => fc.integer({ min: 0, max: 9 });

/**
 * 生成有效的位置
 */
const validPosition = () =>
  fc.record({
    file: validFile(),
    rank: validRank(),
  }).map(({ file, rank }) => new Position(file, rank));

/**
 * 生成颜色
 */
const color = () => fc.constantFrom(Color.Red, Color.Black);

describe('Position 属性测试', () => {
  /**
   * Property 1: Board Position Round-Trip
   * 对于任何有效的位置和棋子，放置棋子后查询应返回相同的棋子
   * （这个属性将在 Board 测试中完整验证，这里验证位置的往返一致性）
   */
  describe('Property 1: 位置往返一致性', () => {
    test('创建位置后应保持坐标不变', () => {
      fc.assert(
        fc.property(validFile(), validRank(), (file, rank) => {
          const pos = createPosition(file, rank);
          expect(pos.file).toBe(file);
          expect(pos.rank).toBe(rank);
        }),
        { numRuns: 100 }
      );
    });

    test('相同坐标的位置应该相等', () => {
      fc.assert(
        fc.property(validFile(), validRank(), (file, rank) => {
          const pos1 = createPosition(file, rank);
          const pos2 = createPosition(file, rank);
          expect(pos1.equals(pos2)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Palace Boundary Detection
   * 对于任何位置，九宫检测应正确识别是否在九宫内
   * 红方九宫：行 0-2，列 3-5
   * 黑方九宫：行 7-9，列 3-5
   */
  describe('Property 2: 九宫边界检测', () => {
    test('九宫检测应与坐标范围一致', () => {
      fc.assert(
        fc.property(validPosition(), color(), (pos, playerColor) => {
          const result = isInPalace(pos, playerColor);
          const inFileRange = pos.file >= 3 && pos.file <= 5;

          if (playerColor === Color.Red) {
            const expected = pos.rank <= 2 && inFileRange;
            expect(result).toBe(expected);
          } else {
            const expected = pos.rank >= 7 && inFileRange;
            expect(result).toBe(expected);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('九宫中心点应始终在九宫内', () => {
      // 红方九宫中心
      expect(isInPalace(createPosition(4, 1), Color.Red)).toBe(true);
      // 黑方九宫中心
      expect(isInPalace(createPosition(4, 8), Color.Black)).toBe(true);
    });

    test('九宫外的位置不应在九宫内', () => {
      fc.assert(
        fc.property(validPosition(), color(), (pos, playerColor) => {
          const inFileRange = pos.file >= 3 && pos.file <= 5;
          
          if (playerColor === Color.Red) {
            if (pos.rank > 2 || !inFileRange) {
              expect(isInPalace(pos, playerColor)).toBe(false);
            }
          } else {
            if (pos.rank < 7 || !inFileRange) {
              expect(isInPalace(pos, playerColor)).toBe(false);
            }
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: River Crossing Detection
   * 对于任何位置和颜色，过河检测应正确识别
   * 红方过河：行 >= 5
   * 黑方过河：行 <= 4
   */
  describe('Property 3: 过河检测', () => {
    test('过河检测应与行坐标一致', () => {
      fc.assert(
        fc.property(validPosition(), color(), (pos, playerColor) => {
          const result = hasCrossedRiver(pos, playerColor);

          if (playerColor === Color.Red) {
            expect(result).toBe(pos.rank >= 5);
          } else {
            expect(result).toBe(pos.rank <= 4);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('河界位置应正确分类', () => {
      // 红方：行 4 未过河，行 5 已过河
      fc.assert(
        fc.property(validFile(), (file) => {
          expect(hasCrossedRiver(createPosition(file, 4), Color.Red)).toBe(false);
          expect(hasCrossedRiver(createPosition(file, 5), Color.Red)).toBe(true);
        }),
        { numRuns: 100 }
      );

      // 黑方：行 5 未过河，行 4 已过河
      fc.assert(
        fc.property(validFile(), (file) => {
          expect(hasCrossedRiver(createPosition(file, 5), Color.Black)).toBe(false);
          expect(hasCrossedRiver(createPosition(file, 4), Color.Black)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 额外属性：位置验证的完整性
   */
  describe('位置验证属性', () => {
    test('有效范围内的所有位置都应该有效', () => {
      fc.assert(
        fc.property(validPosition(), (pos) => {
          expect(isValid(pos)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    test('超出范围的位置应该无效', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -10, max: 20 }),
          fc.integer({ min: -10, max: 20 }),
          (file, rank) => {
            const pos = new Position(file, rank);
            const outOfBounds =
              file < 0 || file > 8 || rank < 0 || rank > 9;

            if (outOfBounds) {
              expect(isValid(pos)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
