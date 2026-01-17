/**
 * 游戏状态管理器
 * 
 * 负责：
 * - 维护游戏状态
 * - 验证和应用移动
 * - 检测游戏结束条件
 * - 提供状态快照
 */

import { GameState, GameStateSnapshot, Move, Position, PlayerColor, GameStatus } from '../types';

/**
 * 游戏状态管理器类
 */
export class GameStateManager {
  /**
   * 创建新游戏状态
   * 
   * @returns 初始游戏状态
   */
  createGameState(): GameState {
    return {
      board: null, // 将在实际游戏中初始化
      currentPlayer: 'red',
      moveHistory: [],
      status: 'playing',
      lastMoveTime: Date.now(),
      redPlayer: {
        id: '',
        name: '',
        isConnected: true
      },
      blackPlayer: {
        id: '',
        name: '',
        isConnected: true
      }
    };
  }

  /**
   * 验证移动
   * 
   * @param gameState 游戏状态
   * @param move 移动
   * @param playerId 玩家ID
   * @returns 验证结果
   */
  validateMove(
    gameState: GameState,
    move: Move,
    playerId: string
  ): { valid: boolean; error?: string } {
    // 检查游戏是否已结束
    if (gameState.status !== 'playing') {
      return { valid: false, error: '游戏已结束' };
    }

    // 检查是否是当前玩家的轮次
    const currentPlayerId = gameState.currentPlayer === 'red' 
      ? gameState.redPlayer.id 
      : gameState.blackPlayer.id;

    if (playerId !== currentPlayerId) {
      return { valid: false, error: '不是你的轮次' };
    }

    // 检查起始位置和目标位置是否有效
    if (!this.isValidPosition(move.from) || !this.isValidPosition(move.to)) {
      return { valid: false, error: '无效的位置' };
    }

    // 检查起始位置和目标位置是否相同
    if (move.from.x === move.to.x && move.from.y === move.to.y) {
      return { valid: false, error: '起始位置和目标位置不能相同' };
    }

    // 这里可以添加更多的象棋规则验证
    // 由于我们使用现有的 GameEngine，这里只做基本验证

    return { valid: true };
  }

  /**
   * 应用移动
   * 
   * @param gameState 游戏状态
   * @param move 移动
   * @param playerId 玩家ID
   * @returns 应用结果
   */
  applyMove(
    gameState: GameState,
    move: Move,
    playerId: string
  ): { success: boolean; error?: string; newState?: GameState } {
    // 验证移动
    const validation = this.validateMove(gameState, move, playerId);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 创建新的游戏状态副本
    const newState = JSON.parse(JSON.stringify(gameState)) as GameState;

    // 添加移动到历史记录
    newState.moveHistory.push(move);
    newState.lastMoveTime = Date.now();

    // 切换当前玩家
    newState.currentPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';

    // 检查游戏是否结束
    const endResult = this.checkGameEnd(newState);
    if (endResult.ended) {
      newState.status = endResult.status as GameStatus;
    }

    return { success: true, newState };
  }

  /**
   * 获取游戏状态快照
   * 
   * @param gameState 游戏状态
   * @returns 游戏状态快照
   */
  getStateSnapshot(gameState: GameState): GameStateSnapshot {
    return {
      board: gameState.board ? JSON.stringify(gameState.board) : '',
      currentPlayer: gameState.currentPlayer,
      moveCount: gameState.moveHistory.length,
      status: gameState.status
    };
  }

  /**
   * 检查游戏是否结束
   * 
   * @param gameState 游戏状态
   * @returns 游戏结束信息
   */
  checkGameEnd(gameState: GameState): { ended: boolean; status?: GameStatus } {
    // 这里可以添加象棋游戏结束的检测逻辑
    // 例如：将军、将死、和棋等
    // 由于我们使用现有的 GameEngine，这里只做基本检测

    // 暂时返回游戏未结束
    return { ended: false };
  }

  /**
   * 检查位置是否有效
   * 
   * @param position 位置
   * @returns 位置是否有效
   */
  private isValidPosition(position: Position): boolean {
    return position.x >= 0 && position.x <= 8 && position.y >= 0 && position.y <= 9;
  }

  /**
   * 获取移动历史
   * 
   * @param gameState 游戏状态
   * @returns 移动历史数组
   */
  getMoveHistory(gameState: GameState): Move[] {
    return gameState.moveHistory;
  }

  /**
   * 获取最后一步移动
   * 
   * @param gameState 游戏状态
   * @returns 最后一步移动，如果没有则返回 null
   */
  getLastMove(gameState: GameState): Move | null {
    if (gameState.moveHistory.length === 0) {
      return null;
    }
    return gameState.moveHistory[gameState.moveHistory.length - 1];
  }

  /**
   * 获取移动数
   * 
   * @param gameState 游戏状态
   * @returns 移动数
   */
  getMoveCount(gameState: GameState): number {
    return gameState.moveHistory.length;
  }

  /**
   * 验证游戏状态一致性
   * 
   * @param gameState 游戏状态
   * @returns 是否一致
   */
  validateGameStateConsistency(gameState: GameState): boolean {
    // 检查必需的字段
    if (!gameState.board && gameState.moveHistory.length > 0) {
      // 如果有移动历史，棋盘应该不为空
      return false;
    }

    if (!gameState.currentPlayer || !['red', 'black'].includes(gameState.currentPlayer)) {
      return false;
    }

    if (!gameState.status || !['playing', 'checkmate', 'stalemate', 'draw'].includes(gameState.status)) {
      return false;
    }

    if (!gameState.redPlayer || !gameState.blackPlayer) {
      return false;
    }

    if (!gameState.redPlayer.id || !gameState.blackPlayer.id) {
      return false;
    }

    return true;
  }

  /**
   * 重置游戏状态
   * 
   * @param gameState 游戏状态
   * @returns 重置后的游戏状态
   */
  resetGameState(gameState: GameState): GameState {
    return {
      board: null,
      currentPlayer: 'red',
      moveHistory: [],
      status: 'playing',
      lastMoveTime: Date.now(),
      redPlayer: gameState.redPlayer,
      blackPlayer: gameState.blackPlayer
    };
  }
}
