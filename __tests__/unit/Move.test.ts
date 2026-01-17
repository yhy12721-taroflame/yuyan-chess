import { Move, createMove } from '../../src/core/Move';
import { createPosition } from '../../src/core/Position';

describe('Move 单元测试', () => {
  describe('createMove', () => {
    test('应该创建有效的移动', () => {
      const from = createPosition(0, 0);
      const to = createPosition(0, 1);
      const move = createMove(from, to);

      expect(move.from).toBe(from);
      expect(move.to).toBe(to);
    });

    test('应该允许创建相同位置的移动', () => {
      const pos = createPosition(4, 4);
      const move = createMove(pos, pos);

      expect(move.from).toBe(pos);
      expect(move.to).toBe(pos);
    });
  });

  describe('Move.equals', () => {
    test('应该识别相同的移动', () => {
      const move1 = createMove(createPosition(0, 0), createPosition(0, 1));
      const move2 = createMove(createPosition(0, 0), createPosition(0, 1));

      expect(move1.equals(move2)).toBe(true);
    });

    test('应该识别不同起点的移动', () => {
      const move1 = createMove(createPosition(0, 0), createPosition(0, 1));
      const move2 = createMove(createPosition(1, 0), createPosition(0, 1));

      expect(move1.equals(move2)).toBe(false);
    });

    test('应该识别不同终点的移动', () => {
      const move1 = createMove(createPosition(0, 0), createPosition(0, 1));
      const move2 = createMove(createPosition(0, 0), createPosition(0, 2));

      expect(move1.equals(move2)).toBe(false);
    });

    test('应该识别完全不同的移动', () => {
      const move1 = createMove(createPosition(0, 0), createPosition(0, 1));
      const move2 = createMove(createPosition(2, 2), createPosition(3, 3));

      expect(move1.equals(move2)).toBe(false);
    });
  });

  describe('移动距离计算', () => {
    test('getFileDelta 应该返回列距离', () => {
      const move1 = createMove(createPosition(0, 0), createPosition(3, 0));
      expect(move1.getFileDelta()).toBe(3);

      const move2 = createMove(createPosition(5, 0), createPosition(2, 0));
      expect(move2.getFileDelta()).toBe(3);
    });

    test('getRankDelta 应该返回行距离', () => {
      const move1 = createMove(createPosition(0, 0), createPosition(0, 5));
      expect(move1.getRankDelta()).toBe(5);

      const move2 = createMove(createPosition(0, 7), createPosition(0, 2));
      expect(move2.getRankDelta()).toBe(5);
    });

    test('对角线移动的距离应该相等', () => {
      const move = createMove(createPosition(0, 0), createPosition(3, 3));
      expect(move.getFileDelta()).toBe(move.getRankDelta());
    });
  });

  describe('移动类型判断', () => {
    test('isHorizontal 应该识别水平移动', () => {
      const horizontal = createMove(createPosition(0, 0), createPosition(5, 0));
      expect(horizontal.isHorizontal()).toBe(true);
      expect(horizontal.isVertical()).toBe(false);
      expect(horizontal.isDiagonal()).toBe(false);
    });

    test('isVertical 应该识别垂直移动', () => {
      const vertical = createMove(createPosition(0, 0), createPosition(0, 5));
      expect(vertical.isVertical()).toBe(true);
      expect(vertical.isHorizontal()).toBe(false);
      expect(vertical.isDiagonal()).toBe(false);
    });

    test('isDiagonal 应该识别对角线移动', () => {
      const diagonal = createMove(createPosition(0, 0), createPosition(3, 3));
      expect(diagonal.isDiagonal()).toBe(true);
      expect(diagonal.isHorizontal()).toBe(false);
      expect(diagonal.isVertical()).toBe(false);
    });

    test('isStraight 应该识别直线移动', () => {
      const horizontal = createMove(createPosition(0, 0), createPosition(5, 0));
      const vertical = createMove(createPosition(0, 0), createPosition(0, 5));
      const diagonal = createMove(createPosition(0, 0), createPosition(3, 3));

      expect(horizontal.isStraight()).toBe(true);
      expect(vertical.isStraight()).toBe(true);
      expect(diagonal.isStraight()).toBe(false);
    });

    test('不规则移动不应该是任何标准类型', () => {
      const irregular = createMove(createPosition(0, 0), createPosition(2, 3));
      expect(irregular.isHorizontal()).toBe(false);
      expect(irregular.isVertical()).toBe(false);
      expect(irregular.isDiagonal()).toBe(false);
      expect(irregular.isStraight()).toBe(false);
    });

    test('原地不动不应该是任何移动类型', () => {
      const noMove = createMove(createPosition(4, 4), createPosition(4, 4));
      expect(noMove.isHorizontal()).toBe(false);
      expect(noMove.isVertical()).toBe(false);
      expect(noMove.isDiagonal()).toBe(false);
      expect(noMove.isStraight()).toBe(false);
    });
  });

  describe('移动方向', () => {
    test('getFileDirection 应该返回列方向', () => {
      const right = createMove(createPosition(0, 0), createPosition(3, 0));
      expect(right.getFileDirection()).toBe(1);

      const left = createMove(createPosition(5, 0), createPosition(2, 0));
      expect(left.getFileDirection()).toBe(-1);

      const noFileMove = createMove(createPosition(0, 0), createPosition(0, 5));
      expect(noFileMove.getFileDirection()).toBe(0);
    });

    test('getRankDirection 应该返回行方向', () => {
      const up = createMove(createPosition(0, 0), createPosition(0, 5));
      expect(up.getRankDirection()).toBe(1);

      const down = createMove(createPosition(0, 7), createPosition(0, 2));
      expect(down.getRankDirection()).toBe(-1);

      const noRankMove = createMove(createPosition(0, 0), createPosition(5, 0));
      expect(noRankMove.getRankDirection()).toBe(0);
    });

    test('对角线移动应该有两个方向', () => {
      const diagonal = createMove(createPosition(0, 0), createPosition(3, 3));
      expect(diagonal.getFileDirection()).toBe(1);
      expect(diagonal.getRankDirection()).toBe(1);
    });
  });

  describe('Move.toString', () => {
    test('应该返回可读的字符串表示', () => {
      const move = createMove(createPosition(0, 0), createPosition(3, 5));
      const str = move.toString();

      expect(str).toContain('(0, 0)');
      expect(str).toContain('(3, 5)');
      expect(str).toContain('->');
    });
  });

  describe('Move 不可变性', () => {
    test('移动属性应该是只读的（TypeScript 编译时检查）', () => {
      const move = createMove(createPosition(0, 0), createPosition(1, 1));

      // TypeScript 的 readonly 在编译时检查
      // 验证属性确实存在且可读
      expect(move.from).toBeDefined();
      expect(move.to).toBeDefined();

      expect(() => {
        const from = move.from;
        const to = move.to;
        expect(from).toBeDefined();
        expect(to).toBeDefined();
      }).not.toThrow();
    });
  });
});
