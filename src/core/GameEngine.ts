import { GameState, GameStatus } from './GameState';
import { Board } from './Board';
import { Move } from './Move';
import { MoveValidator } from './MoveValidator';
import { Color } from './types';

/**
 * 游戏引擎
 * 管理游戏流程、移动执行、胜负判定等
 */
export class GameEngine {
  private currentState: GameState;

  constructor(initialState?: GameState) {
    this.currentState = initialState ?? GameState.createInitial();
  }

  /**
   * 创建新游戏
   */
  static createGame(): GameEngine {
    return new GameEngine(GameState.createInitial());
  }

  /**
   * 获取当前游戏状态
   */
  getCurrentState(): GameState {
    return this.currentState;
  }

  /**
   * 执行移动
   * @param move 要执行的移动
   * @returns 是否成功执行
   */
  makeMove(move: Move): boolean {
    // 检查游戏是否已结束
    if (this.currentState.isGameOver()) {
      console.error('游戏已结束');
      return false;
    }

    // 检查移动是否合法
    if (!MoveValidator.isMoveLegal(this.currentState.board, move, this.currentState.activePlayer)) {
      console.error('非法移动');
      return false;
    }

    // 执行移动
    const piece = this.currentState.board.getPiece(move.from);
    if (piece === undefined) {
      console.error('起点没有棋子');
      return false;
    }

    let newBoard = this.currentState.board.setPiece(move.from, null);
    newBoard = newBoard.setPiece(move.to, piece);

    // 切换玩家
    const nextPlayer = this.currentState.activePlayer === Color.Red ? Color.Black : Color.Red;
    const nextTurn = this.currentState.turnNumber + 1;

    // 检查对方是否被将军
    const isOpponentInCheck = MoveValidator.isInCheck(newBoard, nextPlayer);

    // 获取对方的所有合法移动
    const opponentLegalMoves = MoveValidator.getAllLegalMoves(newBoard, nextPlayer);

    let newStatus = GameStatus.InProgress;
    let newWinner: Color | null = null;

    if (isOpponentInCheck) {
      // 对方被将军，检查是否将死
      if (opponentLegalMoves.length === 0) {
        // 将死
        newStatus = GameStatus.Checkmate;
        newWinner = this.currentState.activePlayer;
      }
    } else {
      // 对方没有被将军，检查是否困毙
      if (opponentLegalMoves.length === 0) {
        // 困毙（和棋）
        newStatus = GameStatus.Stalemate;
      }
    }

    // 更新游戏状态
    this.currentState = this.currentState.withUpdates(
      newBoard,
      nextPlayer,
      nextTurn,
      newStatus,
      newWinner
    );

    return true;
  }

  /**
   * 获取当前玩家的所有合法移动
   */
  getLegalMoves(): Move[] {
    return MoveValidator.getAllLegalMoves(this.currentState.board, this.currentState.activePlayer);
  }

  /**
   * 获取当前活跃玩家
   */
  getActivePlayer(): Color {
    return this.currentState.activePlayer;
  }

  /**
   * 检查游戏是否已结束
   */
  isGameOver(): boolean {
    return this.currentState.isGameOver();
  }

  /**
   * 获取游戏赢家
   */
  getWinner(): Color | null {
    return this.currentState.getWinner();
  }

  /**
   * 检查指定玩家是否被将军
   */
  isPlayerInCheck(color: Color): boolean {
    return MoveValidator.isInCheck(this.currentState.board, color);
  }

  /**
   * 获取游戏状态
   */
  getGameStatus(): GameStatus {
    return this.currentState.status;
  }

  /**
   * 获取当前回合数
   */
  getTurnNumber(): number {
    return this.currentState.turnNumber;
  }

  /**
   * 获取棋盘
   */
  getBoard(): Board {
    return this.currentState.board;
  }
}
