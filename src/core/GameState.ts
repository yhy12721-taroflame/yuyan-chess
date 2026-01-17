import { Board } from './Board';
import { Color } from './types';

/**
 * 游戏状态枚举
 */
export enum GameStatus {
  InProgress = 'IN_PROGRESS',    // 进行中
  Checkmate = 'CHECKMATE',        // 将死
  Stalemate = 'STALEMATE',        // 困毙（和棋）
}

/**
 * 游戏状态类
 * 表示象棋游戏的完整状态
 */
export class GameState {
  readonly board: Board;
  readonly activePlayer: Color;
  readonly turnNumber: number;
  readonly status: GameStatus;
  readonly winner: Color | null;

  constructor(
    board: Board,
    activePlayer: Color,
    turnNumber: number,
    status: GameStatus = GameStatus.InProgress,
    winner: Color | null = null
  ) {
    this.board = board;
    this.activePlayer = activePlayer;
    this.turnNumber = turnNumber;
    this.status = status;
    this.winner = winner;
  }

  /**
   * 创建初始游戏状态
   * 红方先手，回合数从 1 开始
   */
  static createInitial(): GameState {
    const board = require('./Board').createInitialBoard();
    return new GameState(
      board,
      Color.Red,
      1,
      GameStatus.InProgress,
      null
    );
  }

  /**
   * 创建新的游戏状态（用于应用移动后）
   */
  withUpdates(
    board?: Board,
    activePlayer?: Color,
    turnNumber?: number,
    status?: GameStatus,
    winner?: Color | null
  ): GameState {
    return new GameState(
      board ?? this.board,
      activePlayer ?? this.activePlayer,
      turnNumber ?? this.turnNumber,
      status ?? this.status,
      winner ?? this.winner
    );
  }

  /**
   * 检查游戏是否已结束
   */
  isGameOver(): boolean {
    return this.status !== GameStatus.InProgress;
  }

  /**
   * 获取游戏赢家
   */
  getWinner(): Color | null {
    return this.winner;
  }

  /**
   * 获取游戏状态字符串表示
   */
  toString(): string {
    switch (this.status) {
      case GameStatus.InProgress:
        return `进行中 - 第 ${this.turnNumber} 回合 - ${this.activePlayer === Color.Red ? '红' : '黑'}方回合`;
      case GameStatus.Checkmate:
        return `将死 - ${this.winner === Color.Red ? '红' : '黑'}方获胜`;
      case GameStatus.Stalemate:
        return `困毙 - 和棋`;
      default:
        return '未知状态';
    }
  }
}
