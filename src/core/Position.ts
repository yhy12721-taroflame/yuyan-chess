import { Color } from './types';

/**
 * Position 类表示棋盘上的一个位置
 * 使用 file（列，0-8）和 rank（行，0-9）坐标系统
 */
export class Position {
  readonly file: number; // 列：0-8
  readonly rank: number; // 行：0-9

  constructor(file: number, rank: number) {
    this.file = file;
    this.rank = rank;
  }

  /**
   * 判断两个位置是否相等
   */
  equals(other: Position): boolean {
    return this.file === other.file && this.rank === other.rank;
  }

  /**
   * 返回位置的字符串表示
   */
  toString(): string {
    return `(${this.file}, ${this.rank})`;
  }
}

/**
 * 创建一个新的 Position 对象
 * @param file 列坐标（0-8）
 * @param rank 行坐标（0-9）
 * @returns Position 对象
 * @throws Error 如果坐标超出范围
 */
export function createPosition(file: number, rank: number): Position {
  if (!isValid(new Position(file, rank))) {
    throw new Error(
      `位置坐标超出范围: file=${file} (应在 0-8), rank=${rank} (应在 0-9)`
    );
  }
  return new Position(file, rank);
}

/**
 * 判断位置是否在九宫内
 * @param pos 位置
 * @param color 棋子颜色
 * @returns 如果位置在指定颜色的九宫内返回 true
 */
export function isInPalace(pos: Position, color: Color): boolean {
  const inFileRange = pos.file >= 3 && pos.file <= 5;
  
  if (color === Color.Red) {
    // 红方九宫：行 0-2，列 3-5
    return pos.rank <= 2 && inFileRange;
  } else {
    // 黑方九宫：行 7-9，列 3-5
    return pos.rank >= 7 && inFileRange;
  }
}

/**
 * 判断棋子是否已过河
 * @param pos 位置
 * @param color 棋子颜色
 * @returns 如果棋子已过河返回 true
 */
export function hasCrossedRiver(pos: Position, color: Color): boolean {
  if (color === Color.Red) {
    // 红方过河：行 >= 5
    return pos.rank >= 5;
  } else {
    // 黑方过河：行 <= 4
    return pos.rank <= 4;
  }
}

/**
 * 验证位置是否在棋盘范围内
 * @param pos 位置
 * @returns 如果位置有效返回 true
 */
export function isValid(pos: Position): boolean {
  return (
    pos.file >= 0 &&
    pos.file <= 8 &&
    pos.rank >= 0 &&
    pos.rank <= 9
  );
}
