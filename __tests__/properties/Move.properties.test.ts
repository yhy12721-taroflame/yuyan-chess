import * as fc from 'fast-check';
import { Move, createMove } from '../../src/core/Move';
import { Position, createPosition } from '../../src/core/Position';

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
 * 生成移动
 */
const move = () =>
  fc
    .record({
      from: validPosition(),
      to: validPosition(),
    })
    .map(({ from, to }) => createMove(from, to));

describe('Move 属性测试', () => {
  /**
   * 属性：移动创建的一致性
   * 对于任何两个位置，创建的移动应该保持这些位置
   */
  describe('移动创建一致性', () => {
    test('创建的移动应该保持起点和终点', () => {
      fc.assert(
        fc.property(validPosition(), validPosition(), (from, to) => {
          const m = createMove(from, to);
          expect(m.from).toBe(from);
          expect(m.to).toBe(to);
        }),
        { numRuns: 100 }
      );
    });

    test('相同参数创建的移动应该相等', () => {
      fc.assert(
        fc.property(validPosition(), validPosition(), (from, to) => {
          const move1 = createMove(from, to);
          const move2 = createMove(from, to);
          expect(move1.equals(move2)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：移动相等性的传递性和对称性
   */
  describe('移动相等性属性', () => {
    test('相等性应该是自反的（a.equals(a) = true）', () => {
      fc.assert(
        fc.property(move(), (m) => {
          expect(m.equals(m)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    test('相等性应该是对称的（a.equals(b) = b.equals(a)）', () => {
      fc.assert(
        fc.property(move(), move(), (m1, m2) => {
          expect(m1.equals(m2)).toBe(m2.equals(m1));
        }),
        { numRuns: 100 }
      );
    });

    test('相等性应该是传递的（a=b, b=c => a=c）', () => {
      fc.assert(
        fc.property(validPosition(), validPosition(), (from, to) => {
          const m1 = createMove(from, to);
          const m2 = createMove(from, to);
          const m3 = createMove(from, to);

          if (m1.equals(m2) && m2.equals(m3)) {
            expect(m1.equals(m3)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：距离计算的非负性
   */
  describe('距离计算属性', () => {
    test('文件距离应该总是非负', () => {
      fc.assert(
        fc.property(move(), (m) => {
          expect(m.getFileDelta()).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });

    test('等级距离应该总是非负', () => {
      fc.assert(
        fc.property(move(), (m) => {
          expect(m.getRankDelta()).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });

    test('距离应该与位置差的绝对值相等', () => {
      fc.assert(
        fc.property(move(), (m) => {
          const fileDelta = Math.abs(m.to.file - m.from.file);
          const rankDelta = Math.abs(m.to.rank - m.from.rank);

          expect(m.getFileDelta()).toBe(fileDelta);
          expect(m.getRankDelta()).toBe(rankDelta);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：移动类型的互斥性
   */
  describe('移动类型互斥性', () => {
    test('水平和垂直移动应该互斥', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isHorizontal()) {
            expect(m.isVertical()).toBe(false);
          }
          if (m.isVertical()) {
            expect(m.isHorizontal()).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('对角线移动不应该是直线移动', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isDiagonal()) {
            expect(m.isStraight()).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('直线移动应该是水平或垂直', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isStraight()) {
            expect(m.isHorizontal() || m.isVertical()).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：对角线移动的特征
   */
  describe('对角线移动属性', () => {
    test('对角线移动的文件和等级距离应该相等', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isDiagonal()) {
            expect(m.getFileDelta()).toBe(m.getRankDelta());
            expect(m.getFileDelta()).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('如果文件和等级距离相等且非零，应该是对角线移动', () => {
      fc.assert(
        fc.property(move(), (m) => {
          const fileDelta = m.getFileDelta();
          const rankDelta = m.getRankDelta();

          if (fileDelta === rankDelta && fileDelta > 0) {
            expect(m.isDiagonal()).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：水平移动的特征
   */
  describe('水平移动属性', () => {
    test('水平移动的等级距离应该为零', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isHorizontal()) {
            expect(m.getRankDelta()).toBe(0);
            expect(m.getFileDelta()).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('水平移动的行方向应该为零', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isHorizontal()) {
            expect(m.getRankDirection()).toBe(0);
            expect(Math.abs(m.getFileDirection())).toBe(1);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：垂直移动的特征
   */
  describe('垂直移动属性', () => {
    test('垂直移动的文件距离应该为零', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isVertical()) {
            expect(m.getFileDelta()).toBe(0);
            expect(m.getRankDelta()).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('垂直移动的列方向应该为零', () => {
      fc.assert(
        fc.property(move(), (m) => {
          if (m.isVertical()) {
            expect(m.getFileDirection()).toBe(0);
            expect(Math.abs(m.getRankDirection())).toBe(1);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：方向的有效性
   */
  describe('方向属性', () => {
    test('方向应该总是 -1, 0, 或 1', () => {
      fc.assert(
        fc.property(move(), (m) => {
          const fileDir = m.getFileDirection();
          const rankDir = m.getRankDirection();

          expect([-1, 0, 1]).toContain(fileDir);
          expect([-1, 0, 1]).toContain(rankDir);
        }),
        { numRuns: 100 }
      );
    });

    test('如果起点和终点相同，方向应该都是零', () => {
      fc.assert(
        fc.property(validPosition(), (pos) => {
          const m = createMove(pos, pos);
          expect(m.getFileDirection()).toBe(0);
          expect(m.getRankDirection()).toBe(0);
        }),
        { numRuns: 100 }
      );
    });

    test('方向的符号应该与坐标差的符号一致', () => {
      fc.assert(
        fc.property(move(), (m) => {
          const fileDiff = m.to.file - m.from.file;
          const rankDiff = m.to.rank - m.from.rank;

          expect(m.getFileDirection()).toBe(Math.sign(fileDiff));
          expect(m.getRankDirection()).toBe(Math.sign(rankDiff));
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：toString 应该总是返回非空字符串
   */
  describe('toString 属性', () => {
    test('toString 应该总是返回非空字符串', () => {
      fc.assert(
        fc.property(move(), (m) => {
          const str = m.toString();
          expect(str).toBeTruthy();
          expect(str.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    test('toString 应该包含箭头符号', () => {
      fc.assert(
        fc.property(move(), (m) => {
          const str = m.toString();
          expect(str).toContain('->');
        }),
        { numRuns: 100 }
      );
    });
  });
});
