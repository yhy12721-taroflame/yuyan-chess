import { Position } from './Position';

/**
 * Move 类表示一次移动
 * 包含起始位置和目标位置
 */
export class Move {
  readonly from: Position;
  readonly to: Position;

  constructor(from: Position, to: Position) {
    this.from = from;
    this.to = to;
  }

  /**
   * 判断两个移动是否相等
   */
  equals(other: Move): boolean {
    return this.from.equals(other.from) && this.to.equals(other.to);
  }

  /**
   * 返回移动的字符串表示
   */
  toString(): string {
    return `${this.from.toString()} -> ${this.to.toString()}`;
  }

  /**
   * 计算移动的文件（列）距离
   */
  getFileDelta(): number {
    return Math.abs(this.to.file - this.from.file);
  }

  /**
   * 计算移动的等级（行）距离
   */
  getRankDelta(): number {
    return Math.abs(this.to.rank - this.from.rank);
  }

  /**
   * 判断是否是水平移动（同一行）
   */
  isHorizontal(): boolean {
    return this.from.rank === this.to.rank && this.from.file !== this.to.file;
  }

  /**
   * 判断是否是垂直移动（同一列）
   */
  isVertical(): boolean {
    return this.from.file === this.to.file && this.from.rank !== this.to.rank;
  }

  /**
   * 判断是否是对角线移动
   */
  isDiagonal(): boolean {
    return this.getFileDelta() === this.getRankDelta() && this.getFileDelta() > 0;
  }

  /**
   * 判断是否是直线移动（水平或垂直）
   */
  isStraight(): boolean {
    return this.isHorizontal() || this.isVertical();
  }

  /**
   * 获取移动方向的文件（列）符号（-1, 0, 1）
   */
  getFileDirection(): number {
    return Math.sign(this.to.file - this.from.file);
  }

  /**
   * 获取移动方向的等级（行）符号（-1, 0, 1）
   */
  getRankDirection(): number {
    return Math.sign(this.to.rank - this.from.rank);
  }
}

/**
 * 创建一个新的 Move 对象
 * @param from 起始位置
 * @param to 目标位置
 * @returns Move 对象
 */
export function createMove(from: Position, to: Position): Move {
  return new Move(from, to);
}
