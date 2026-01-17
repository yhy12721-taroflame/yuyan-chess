import { Position } from './Position';
import { Piece } from './Piece';
import { Color, PieceType } from './types';

/**
 * Board 类表示象棋棋盘
 * 使用 Map 存储棋子位置，实现不可变更新
 */
export class Board {
  private readonly pieces: Map<string, Piece>;

  constructor(pieces: Map<string, Piece> = new Map()) {
    this.pieces = new Map(pieces);
  }

  /**
   * 将位置转换为字符串键（用于 Map）
   */
  private static positionToKey(pos: Position): string {
    return `${pos.file},${pos.rank}`;
  }

  /**
   * 获取指定位置的棋子
   * @param pos 位置
   * @returns 棋子或 undefined
   */
  getPiece(pos: Position): Piece | undefined {
    return this.pieces.get(Board.positionToKey(pos));
  }

  /**
   * 在指定位置放置棋子（不可变操作，返回新棋盘）
   * @param pos 位置
   * @param piece 棋子（null 表示移除棋子）
   * @returns 新的棋盘
   */
  setPiece(pos: Position, piece: Piece | null): Board {
    const newPieces = new Map(this.pieces);
    const key = Board.positionToKey(pos);

    if (piece === null) {
      newPieces.delete(key);
    } else {
      newPieces.set(key, piece);
    }

    return new Board(newPieces);
  }

  /**
   * 查找指定颜色的将/帅位置
   * @param color 颜色
   * @returns 将/帅的位置，如果找不到返回 null
   */
  findGeneral(color: Color): Position | null {
    for (const [key, piece] of this.pieces.entries()) {
      if (piece.type === PieceType.General && piece.color === color) {
        const [file, rank] = key.split(',').map(Number);
        return new Position(file, rank);
      }
    }
    return null;
  }

  /**
   * 获取指定颜色的所有棋子及其位置
   * @param color 颜色
   * @returns 位置和棋子的数组
   */
  getAllPieces(color: Color): Array<[Position, Piece]> {
    const result: Array<[Position, Piece]> = [];

    for (const [key, piece] of this.pieces.entries()) {
      if (piece.color === color) {
        const [file, rank] = key.split(',').map(Number);
        result.push([new Position(file, rank), piece]);
      }
    }

    return result;
  }

  /**
   * 获取棋盘上所有棋子的数量
   */
  getPieceCount(): number {
    return this.pieces.size;
  }

  /**
   * 获取指定颜色的棋子数量
   */
  getPieceCountByColor(color: Color): number {
    let count = 0;
    for (const piece of this.pieces.values()) {
      if (piece.color === color) {
        count++;
      }
    }
    return count;
  }

  /**
   * 检查棋盘是否为空
   */
  isEmpty(): boolean {
    return this.pieces.size === 0;
  }

  /**
   * 清空棋盘（返回新的空棋盘）
   */
  clear(): Board {
    return new Board();
  }

  /**
   * 渲染棋盘为字符串（用于调试和显示）
   * @returns 棋盘的字符串表示
   */
  render(): string {
    let output = '';

    // 从上到下（rank 9 到 0）
    for (let rank = 9; rank >= 0; rank--) {
      // 添加行号
      output += `${rank} `;

      // 从左到右（file 0 到 8）
      for (let file = 0; file <= 8; file++) {
        const pos = new Position(file, rank);
        const piece = this.getPiece(pos);

        if (piece) {
          output += piece.getSymbol() + ' ';
        } else {
          // 显示河界
          if (rank === 4 || rank === 5) {
            output += '~ ';
          } else {
            output += '. ';
          }
        }
      }

      output += '\n';
    }

    // 添加列号
    output += '  0 1 2 3 4 5 6 7 8\n';

    return output;
  }

  /**
   * 克隆棋盘（返回相同内容的新棋盘）
   */
  clone(): Board {
    return new Board(this.pieces);
  }

  /**
   * 检查两个位置之间的路径是否畅通（不包括起点和终点）
   * 只适用于直线路径（横向、纵向或斜向）
   * @param from 起始位置
   * @param to 目标位置
   * @returns 如果路径畅通返回 true，否则返回 false
   */
  isPathClear(from: Position, to: Position): boolean {
    const positions = this.getPositionsBetween(from, to);
    
    for (const pos of positions) {
      if (this.getPiece(pos) !== undefined) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 计算两个位置之间的棋子数量（不包括起点和终点）
   * @param from 起始位置
   * @param to 目标位置
   * @returns 中间的棋子数量
   */
  countPiecesBetween(from: Position, to: Position): number {
    const positions = this.getPositionsBetween(from, to);
    let count = 0;
    
    for (const pos of positions) {
      if (this.getPiece(pos) !== undefined) {
        count++;
      }
    }
    
    return count;
  }

  /**
   * 获取两个位置之间的所有位置（不包括起点和终点）
   * 只适用于直线路径（横向、纵向或斜向）
   * @param from 起始位置
   * @param to 目标位置
   * @returns 中间位置的数组
   */
  private getPositionsBetween(from: Position, to: Position): Position[] {
    const positions: Position[] = [];
    
    const fileDelta = to.file - from.file;
    const rankDelta = to.rank - from.rank;
    
    // 计算步进方向
    const fileStep = fileDelta === 0 ? 0 : fileDelta > 0 ? 1 : -1;
    const rankStep = rankDelta === 0 ? 0 : rankDelta > 0 ? 1 : -1;
    
    // 计算步数
    const steps = Math.max(Math.abs(fileDelta), Math.abs(rankDelta));
    
    // 生成中间位置
    for (let i = 1; i < steps; i++) {
      const file = from.file + fileStep * i;
      const rank = from.rank + rankStep * i;
      positions.push(new Position(file, rank));
    }
    
    return positions;
  }

  /**
   * 检查两个将/帅是否对面（在同一列且中间无棋子）
   * 这是象棋的特殊规则：两个将/帅不能直接对面
   * @returns 如果两个将/帅对面返回 true，否则返回 false
   */
  areGeneralsFacing(): boolean {
    const redGeneralPos = this.findGeneral(Color.Red);
    const blackGeneralPos = this.findGeneral(Color.Black);
    
    // 如果找不到任何一个将/帅，返回 false
    if (redGeneralPos === null || blackGeneralPos === null) {
      return false;
    }
    
    // 必须在同一列
    if (redGeneralPos.file !== blackGeneralPos.file) {
      return false;
    }
    
    // 检查它们之间是否有棋子
    return this.isPathClear(redGeneralPos, blackGeneralPos);
  }
}

/**
 * 创建一个空棋盘
 */
export function createEmptyBoard(): Board {
  return new Board();
}

/**
 * 创建标准的初始棋盘布局
 * 按照象棋规则放置所有 32 个棋子
 */
export function createInitialBoard(): Board {
  let board = createEmptyBoard();

  // ========== 红方棋子（底部，rank 0-4）==========
  
  // 红方将（帅）- 中心位置
  board = board.setPiece(
    new Position(4, 0),
    new Piece(PieceType.General, Color.Red)
  );

  // 红方士（仕）- 将两侧
  board = board.setPiece(
    new Position(3, 0),
    new Piece(PieceType.Advisor, Color.Red)
  );
  board = board.setPiece(
    new Position(5, 0),
    new Piece(PieceType.Advisor, Color.Red)
  );

  // 红方象（相）- 士两侧
  board = board.setPiece(
    new Position(2, 0),
    new Piece(PieceType.Elephant, Color.Red)
  );
  board = board.setPiece(
    new Position(6, 0),
    new Piece(PieceType.Elephant, Color.Red)
  );

  // 红方马 - 象两侧
  board = board.setPiece(
    new Position(1, 0),
    new Piece(PieceType.Horse, Color.Red)
  );
  board = board.setPiece(
    new Position(7, 0),
    new Piece(PieceType.Horse, Color.Red)
  );

  // 红方车 - 两端
  board = board.setPiece(
    new Position(0, 0),
    new Piece(PieceType.Chariot, Color.Red)
  );
  board = board.setPiece(
    new Position(8, 0),
    new Piece(PieceType.Chariot, Color.Red)
  );

  // 红方炮 - 第三行，马的前方
  board = board.setPiece(
    new Position(1, 2),
    new Piece(PieceType.Cannon, Color.Red)
  );
  board = board.setPiece(
    new Position(7, 2),
    new Piece(PieceType.Cannon, Color.Red)
  );

  // 红方兵 - 第四行，间隔放置
  board = board.setPiece(
    new Position(0, 3),
    new Piece(PieceType.Soldier, Color.Red)
  );
  board = board.setPiece(
    new Position(2, 3),
    new Piece(PieceType.Soldier, Color.Red)
  );
  board = board.setPiece(
    new Position(4, 3),
    new Piece(PieceType.Soldier, Color.Red)
  );
  board = board.setPiece(
    new Position(6, 3),
    new Piece(PieceType.Soldier, Color.Red)
  );
  board = board.setPiece(
    new Position(8, 3),
    new Piece(PieceType.Soldier, Color.Red)
  );

  // ========== 黑方棋子（顶部，rank 5-9）==========
  
  // 黑方将 - 中心位置
  board = board.setPiece(
    new Position(4, 9),
    new Piece(PieceType.General, Color.Black)
  );

  // 黑方士 - 将两侧
  board = board.setPiece(
    new Position(3, 9),
    new Piece(PieceType.Advisor, Color.Black)
  );
  board = board.setPiece(
    new Position(5, 9),
    new Piece(PieceType.Advisor, Color.Black)
  );

  // 黑方象 - 士两侧
  board = board.setPiece(
    new Position(2, 9),
    new Piece(PieceType.Elephant, Color.Black)
  );
  board = board.setPiece(
    new Position(6, 9),
    new Piece(PieceType.Elephant, Color.Black)
  );

  // 黑方马 - 象两侧
  board = board.setPiece(
    new Position(1, 9),
    new Piece(PieceType.Horse, Color.Black)
  );
  board = board.setPiece(
    new Position(7, 9),
    new Piece(PieceType.Horse, Color.Black)
  );

  // 黑方车 - 两端
  board = board.setPiece(
    new Position(0, 9),
    new Piece(PieceType.Chariot, Color.Black)
  );
  board = board.setPiece(
    new Position(8, 9),
    new Piece(PieceType.Chariot, Color.Black)
  );

  // 黑方炮 - 第八行，马的前方
  board = board.setPiece(
    new Position(1, 7),
    new Piece(PieceType.Cannon, Color.Black)
  );
  board = board.setPiece(
    new Position(7, 7),
    new Piece(PieceType.Cannon, Color.Black)
  );

  // 黑方卒 - 第七行，间隔放置
  board = board.setPiece(
    new Position(0, 6),
    new Piece(PieceType.Soldier, Color.Black)
  );
  board = board.setPiece(
    new Position(2, 6),
    new Piece(PieceType.Soldier, Color.Black)
  );
  board = board.setPiece(
    new Position(4, 6),
    new Piece(PieceType.Soldier, Color.Black)
  );
  board = board.setPiece(
    new Position(6, 6),
    new Piece(PieceType.Soldier, Color.Black)
  );
  board = board.setPiece(
    new Position(8, 6),
    new Piece(PieceType.Soldier, Color.Black)
  );

  return board;
}
