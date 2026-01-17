import {
  Position,
  createPosition,
  isInPalace,
  hasCrossedRiver,
  isValid,
} from '../../src/core/Position';
import { Color } from '../../src/core/types';

describe('Position 单元测试', () => {
  describe('createPosition', () => {
    test('应该创建有效的位置', () => {
      const pos = createPosition(4, 5);
      expect(pos.file).toBe(4);
      expect(pos.rank).toBe(5);
    });

    test('应该拒绝列坐标超出范围', () => {
      expect(() => createPosition(-1, 5)).toThrow();
      expect(() => createPosition(9, 5)).toThrow();
    });

    test('应该拒绝行坐标超出范围', () => {
      expect(() => createPosition(4, -1)).toThrow();
      expect(() => createPosition(4, 10)).toThrow();
    });

    test('应该接受边界值', () => {
      expect(() => createPosition(0, 0)).not.toThrow();
      expect(() => createPosition(8, 9)).not.toThrow();
    });
  });

  describe('isValid', () => {
    test('应该验证有效位置', () => {
      expect(isValid(new Position(0, 0))).toBe(true);
      expect(isValid(new Position(8, 9))).toBe(true);
      expect(isValid(new Position(4, 5))).toBe(true);
    });

    test('应该拒绝无效位置', () => {
      expect(isValid(new Position(-1, 5))).toBe(false);
      expect(isValid(new Position(9, 5))).toBe(false);
      expect(isValid(new Position(4, -1))).toBe(false);
      expect(isValid(new Position(4, 10))).toBe(false);
    });
  });

  describe('isInPalace', () => {
    test('红方九宫 - 应该识别九宫内的位置', () => {
      expect(isInPalace(createPosition(3, 0), Color.Red)).toBe(true);
      expect(isInPalace(createPosition(4, 1), Color.Red)).toBe(true);
      expect(isInPalace(createPosition(5, 2), Color.Red)).toBe(true);
    });

    test('红方九宫 - 应该拒绝九宫外的位置', () => {
      expect(isInPalace(createPosition(2, 1), Color.Red)).toBe(false); // 列太小
      expect(isInPalace(createPosition(6, 1), Color.Red)).toBe(false); // 列太大
      expect(isInPalace(createPosition(4, 3), Color.Red)).toBe(false); // 行太大
    });

    test('黑方九宫 - 应该识别九宫内的位置', () => {
      expect(isInPalace(createPosition(3, 7), Color.Black)).toBe(true);
      expect(isInPalace(createPosition(4, 8), Color.Black)).toBe(true);
      expect(isInPalace(createPosition(5, 9), Color.Black)).toBe(true);
    });

    test('黑方九宫 - 应该拒绝九宫外的位置', () => {
      expect(isInPalace(createPosition(2, 8), Color.Black)).toBe(false); // 列太小
      expect(isInPalace(createPosition(6, 8), Color.Black)).toBe(false); // 列太大
      expect(isInPalace(createPosition(4, 6), Color.Black)).toBe(false); // 行太小
    });
  });

  describe('hasCrossedRiver', () => {
    test('红方 - 应该识别已过河的位置', () => {
      expect(hasCrossedRiver(createPosition(0, 5), Color.Red)).toBe(true);
      expect(hasCrossedRiver(createPosition(4, 6), Color.Red)).toBe(true);
      expect(hasCrossedRiver(createPosition(8, 9), Color.Red)).toBe(true);
    });

    test('红方 - 应该识别未过河的位置', () => {
      expect(hasCrossedRiver(createPosition(0, 0), Color.Red)).toBe(false);
      expect(hasCrossedRiver(createPosition(4, 3), Color.Red)).toBe(false);
      expect(hasCrossedRiver(createPosition(8, 4), Color.Red)).toBe(false);
    });

    test('黑方 - 应该识别已过河的位置', () => {
      expect(hasCrossedRiver(createPosition(0, 4), Color.Black)).toBe(true);
      expect(hasCrossedRiver(createPosition(4, 2), Color.Black)).toBe(true);
      expect(hasCrossedRiver(createPosition(8, 0), Color.Black)).toBe(true);
    });

    test('黑方 - 应该识别未过河的位置', () => {
      expect(hasCrossedRiver(createPosition(0, 9), Color.Black)).toBe(false);
      expect(hasCrossedRiver(createPosition(4, 7), Color.Black)).toBe(false);
      expect(hasCrossedRiver(createPosition(8, 5), Color.Black)).toBe(false);
    });
  });

  describe('Position.equals', () => {
    test('应该识别相同的位置', () => {
      const pos1 = createPosition(4, 5);
      const pos2 = createPosition(4, 5);
      expect(pos1.equals(pos2)).toBe(true);
    });

    test('应该识别不同的位置', () => {
      const pos1 = createPosition(4, 5);
      const pos2 = createPosition(4, 6);
      const pos3 = createPosition(5, 5);
      expect(pos1.equals(pos2)).toBe(false);
      expect(pos1.equals(pos3)).toBe(false);
    });
  });
});
