import { Board } from './Board';
import { Position, isInPalace, hasCrossedRiver, isValid } from './Position';
import { Piece } from './Piece';
import { Move } from './Move';
import { Color, PieceType } from './types';

/**
 * 移动验证器 - 验证象棋中各棋子的移动规则
 */
export class MoveValidator {
  /**
   * 验证将/帅的移动
   * 规则：
   * - 只能移动一格（横向或纵向）
   * - 必须留在九宫内
   */
  static validateGeneralMove(board: Board, move: Move, piece: Piece): boolean {
    const deltaFile = Math.abs(move.to.file - move.from.file);
    const deltaRank = Math.abs(move.to.rank - move.from.rank);

    // 必须移动一格（横向或纵向）
    if (!((deltaFile === 1 && deltaRank === 0) || (deltaFile === 0 && deltaRank === 1))) {
      return false;
    }

    // 必须留在九宫内
    if (!isInPalace(move.to, piece.color)) {
      return false;
    }

    return true;
  }

  /**
   * 验证士/仕的移动
   * 规则：
   * - 只能斜向移动一格
   * - 必须留在九宫内
   */
  static validateAdvisorMove(board: Board, move: Move, piece: Piece): boolean {
    const deltaFile = Math.abs(move.to.file - move.from.file);
    const deltaRank = Math.abs(move.to.rank - move.from.rank);

    // 必须斜向移动一格
    if (!(deltaFile === 1 && deltaRank === 1)) {
      return false;
    }

    // 必须留在九宫内
    if (!isInPalace(move.to, piece.color)) {
      return false;
    }

    return true;
  }

  /**
   * 验证象/相的移动
   * 规则：
   * - 只能斜向移动两格
   * - 不能过河
   * - 不能塞象眼（中间位置必须无棋子）
   */
  static validateElephantMove(board: Board, move: Move, piece: Piece): boolean {
    const deltaFile = Math.abs(move.to.file - move.from.file);
    const deltaRank = Math.abs(move.to.rank - move.from.rank);

    // 必须斜向移动两格
    if (!(deltaFile === 2 && deltaRank === 2)) {
      return false;
    }

    // 不能过河
    if (piece.color === Color.Red && move.to.rank >= 5) {
      return false;
    }
    if (piece.color === Color.Black && move.to.rank <= 4) {
      return false;
    }

    // 检查象眼（中间位置）
    const midFile = (move.from.file + move.to.file) / 2;
    const midRank = (move.from.rank + move.to.rank) / 2;
    const midPos = new Position(midFile, midRank);

    if (board.getPiece(midPos) !== undefined) {
      return false;
    }

    return true;
  }

  /**
   * 验证马的移动
   * 规则：
   * - 日字形移动（一步横/纵，一步斜）
   * - 不能蹩马腿（第一步的位置必须无棋子）
   */
  static validateHorseMove(board: Board, move: Move, piece: Piece): boolean {
    const deltaFile = Math.abs(move.to.file - move.from.file);
    const deltaRank = Math.abs(move.to.rank - move.from.rank);

    // 必须日字形移动
    if (!((deltaFile === 2 && deltaRank === 1) || (deltaFile === 1 && deltaRank === 2))) {
      return false;
    }

    // 计算蹩马腿的位置
    let blockingPos: Position;
    if (deltaFile === 2) {
      // 横向移动两格，检查第一步的位置
      const blockingFile = move.from.file + (move.to.file > move.from.file ? 1 : -1);
      blockingPos = new Position(blockingFile, move.from.rank);
    } else {
      // 纵向移动两格，检查第一步的位置
      const blockingRank = move.from.rank + (move.to.rank > move.from.rank ? 1 : -1);
      blockingPos = new Position(move.from.file, blockingRank);
    }

    // 检查蹩马腿
    if (board.getPiece(blockingPos) !== undefined) {
      return false;
    }

    return true;
  }

  /**
   * 验证车的移动
   * 规则：
   * - 只能直线移动（横向或纵向）
   * - 路径必须无阻挡
   */
  static validateChariotMove(board: Board, move: Move, piece: Piece): boolean {
    // 必须直线移动
    if (move.from.file !== move.to.file && move.from.rank !== move.to.rank) {
      return false;
    }

    // 路径必须无阻挡
    return board.isPathClear(move.from, move.to);
  }

  /**
   * 验证炮的移动
   * 规则：
   * - 只能直线移动（横向或纵向）
   * - 非吃子移动：路径必须无阻挡
   * - 吃子移动：路径中必须恰好有一个棋子（炮架）
   */
  static validateCannonMove(board: Board, move: Move, piece: Piece): boolean {
    // 必须直线移动
    if (move.from.file !== move.to.file && move.from.rank !== move.to.rank) {
      return false;
    }

    const targetPiece = board.getPiece(move.to);
    const piecesBetween = board.countPiecesBetween(move.from, move.to);

    if (targetPiece === undefined) {
      // 非吃子移动：路径必须无阻挡
      return piecesBetween === 0;
    } else {
      // 吃子移动：路径中必须恰好有一个棋子（炮架）
      return piecesBetween === 1;
    }
  }

  /**
   * 验证兵/卒的移动
   * 规则：
   * - 过河前：只能前进一格
   * - 过河后：可以前进或横向移动一格
   * - 不能后退
   */
  static validateSoldierMove(board: Board, move: Move, piece: Piece): boolean {
    const deltaFile = Math.abs(move.to.file - move.from.file);
    let deltaRank = move.to.rank - move.from.rank;

    // 调整rank差值方向（黑方向下移动）
    if (piece.color === Color.Black) {
      deltaRank = -deltaRank;
    }

    // 不能后退
    if (deltaRank < 0) {
      return false;
    }

    // 必须移动一格
    if (deltaFile + deltaRank !== 1) {
      return false;
    }

    // 检查是否过河
    const hasCrossed = hasCrossedRiver(move.from, piece.color);

    if (!hasCrossed) {
      // 过河前：只能前进（deltaRank === 1, deltaFile === 0）
      return deltaRank === 1 && deltaFile === 0;
    } else {
      // 过河后：可以前进或横向移动
      return true;
    }
  }

  /**
   * 验证棋子的移动是否符合该棋子的规则
   */
  static validatePieceMovement(board: Board, move: Move, piece: Piece): boolean {
    switch (piece.type) {
      case PieceType.General:
        return this.validateGeneralMove(board, move, piece);
      case PieceType.Advisor:
        return this.validateAdvisorMove(board, move, piece);
      case PieceType.Elephant:
        return this.validateElephantMove(board, move, piece);
      case PieceType.Horse:
        return this.validateHorseMove(board, move, piece);
      case PieceType.Chariot:
        return this.validateChariotMove(board, move, piece);
      case PieceType.Cannon:
        return this.validateCannonMove(board, move, piece);
      case PieceType.Soldier:
        return this.validateSoldierMove(board, move, piece);
      default:
        return false;
    }
  }

  /**
   * 验证移动是否合法（综合所有规则）
   * 检查：
   * 1. 起点有己方棋子
   * 2. 终点在棋盘内
   * 3. 终点不是己方棋子
   * 4. 棋子移动规则
   * 5. 不会导致将帅对面
   * 6. 不会导致己方被将军（暂时不检查，因为还没实现将军检测）
   */
  static isMoveLegal(board: Board, move: Move, playerColor: Color): boolean {
    // 检查起点是否有己方棋子
    const piece = board.getPiece(move.from);
    if (piece === undefined || piece.color !== playerColor) {
      return false;
    }

    // 检查终点是否在棋盘内
    if (!isValid(move.to)) {
      return false;
    }

    // 检查终点是否是己方棋子
    const targetPiece = board.getPiece(move.to);
    if (targetPiece !== undefined && targetPiece.color === playerColor) {
      return false;
    }

    // 检查棋子移动规则
    if (!this.validatePieceMovement(board, move, piece)) {
      return false;
    }

    // 执行移动，检查是否导致将帅对面
    let newBoard = board.setPiece(move.from, null);
    newBoard = newBoard.setPiece(move.to, piece);

    if (newBoard.areGeneralsFacing()) {
      return false;
    }

    return true;
  }

  /**
   * 检查指定颜色的玩家是否被将军
   * 将军：对方的棋子可以在下一步吃掉己方的将/帅
   */
  static isInCheck(board: Board, playerColor: Color): boolean {
    // 找到己方的将/帅
    const generalPos = board.findGeneral(playerColor);
    if (generalPos === null) {
      return false; // 将/帅不存在（不应该发生）
    }

    // 获取对方的所有棋子
    const opponentColor = playerColor === Color.Red ? Color.Black : Color.Red;
    const opponentPieces = board.getAllPieces(opponentColor);

    // 检查对方是否有棋子可以吃掉己方的将/帅
    for (const [pos, piece] of opponentPieces) {
      // 跳过对方的将/帅（将/帅不能互相攻击）
      if (piece.type === PieceType.General) {
        continue;
      }

      const move = new Move(pos, generalPos);

      // 检查对方棋子是否可以移动到将/帅的位置
      // 注意：这里不检查将帅对面和自我将军，因为我们只是检查威胁
      if (this.validatePieceMovement(board, move, piece)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 获取指定棋子的所有合法移动
   */
  static getLegalMoves(board: Board, pos: Position, playerColor: Color): Position[] {
    const piece = board.getPiece(pos);
    if (piece === undefined || piece.color !== playerColor) {
      return [];
    }

    const legalMoves: Position[] = [];

    // 遍历棋盘上的所有位置
    for (let file = 0; file <= 8; file++) {
      for (let rank = 0; rank <= 9; rank++) {
        const targetPos = new Position(file, rank);
        const move = new Move(pos, targetPos);

        if (this.isMoveLegal(board, move, playerColor)) {
          legalMoves.push(targetPos);
        }
      }
    }

    return legalMoves;
  }

  /**
   * 获取指定玩家的所有合法移动
   */
  static getAllLegalMoves(board: Board, playerColor: Color): Move[] {
    const legalMoves: Move[] = [];
    const pieces = board.getAllPieces(playerColor);

    for (const [pos, piece] of pieces) {
      const targetPositions = this.getLegalMoves(board, pos, playerColor);
      for (const targetPos of targetPositions) {
        legalMoves.push(new Move(pos, targetPos));
      }
    }

    return legalMoves;
  }
}
