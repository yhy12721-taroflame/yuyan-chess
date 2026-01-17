import { Color, PieceType } from './types';

/**
 * Piece 类表示一个棋子
 * 包含棋子类型和颜色
 */
export class Piece {
  readonly type: PieceType;
  readonly color: Color;

  constructor(type: PieceType, color: Color) {
    this.type = type;
    this.color = color;
  }

  /**
   * 判断两个棋子是否相等
   */
  equals(other: Piece): boolean {
    return this.type === other.type && this.color === other.color;
  }

  /**
   * 返回棋子的字符串表示
   */
  toString(): string {
    const typeNames: Record<PieceType, string> = {
      [PieceType.General]: '将/帅',
      [PieceType.Advisor]: '士/仕',
      [PieceType.Elephant]: '象/相',
      [PieceType.Horse]: '马',
      [PieceType.Chariot]: '车',
      [PieceType.Cannon]: '炮',
      [PieceType.Soldier]: '兵/卒',
    };

    const colorName = this.color === Color.Red ? '红' : '黑';
    return `${colorName}${typeNames[this.type]}`;
  }

  /**
   * 获取棋子的符号表示（用于棋盘渲染）
   * 红方：大写字母，黑方：小写字母
   */
  getSymbol(): string {
    const symbols: Record<PieceType, string> = {
      [PieceType.General]: 'G',
      [PieceType.Advisor]: 'A',
      [PieceType.Elephant]: 'E',
      [PieceType.Horse]: 'H',
      [PieceType.Chariot]: 'R',
      [PieceType.Cannon]: 'C',
      [PieceType.Soldier]: 'S',
    };

    const symbol = symbols[this.type];
    return this.color === Color.Black ? symbol.toLowerCase() : symbol;
  }
}

/**
 * 创建一个新的 Piece 对象
 * @param type 棋子类型
 * @param color 棋子颜色
 * @returns Piece 对象
 */
export function createPiece(type: PieceType, color: Color): Piece {
  return new Piece(type, color);
}

/**
 * 获取对手的颜色
 * @param color 当前颜色
 * @returns 对手的颜色
 */
export function getOpponentColor(color: Color): Color {
  return color === Color.Red ? Color.Black : Color.Red;
}
