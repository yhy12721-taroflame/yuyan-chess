/**
 * 重连管理器
 * 
 * 负责：
 * - 存储玩家连接信息用于重连恢复
 * - 检测重连请求
 * - 恢复玩家的房间信息和游戏状态
 * - 管理重连超时
 */

/**
 * 玩家重连信息
 */
interface ReconnectionInfo {
  playerId: string;
  playerName: string;
  roomId?: string;
  lastSeen: number;
  reconnectAttempts: number;
}

/**
 * 重连管理器类
 */
export class ReconnectionManager {
  // 重连信息映射：playerId -> ReconnectionInfo
  private reconnectionInfos: Map<string, ReconnectionInfo> = new Map();
  
  // 玩家名称到ID的映射，用于快速查询
  private playerNameToId: Map<string, string> = new Map();
  
  // 重连超时时间（毫秒），默认 5 分钟
  private reconnectionTimeout: number = 5 * 60 * 1000;

  /**
   * 构造函数
   * 
   * @param reconnectionTimeout 重连超时时间（毫秒）
   */
  constructor(reconnectionTimeout?: number) {
    if (reconnectionTimeout) {
      this.reconnectionTimeout = reconnectionTimeout;
    }
  }

  /**
   * 存储玩家连接信息
   * 
   * @param playerId 玩家ID
   * @param playerName 玩家名称
   * @param roomId 房间ID（可选）
   */
  storeConnectionInfo(playerId: string, playerName: string, roomId?: string): void {
    const reconnectionInfo: ReconnectionInfo = {
      playerId,
      playerName,
      roomId,
      lastSeen: Date.now(),
      reconnectAttempts: 0
    };

    this.reconnectionInfos.set(playerId, reconnectionInfo);
    this.playerNameToId.set(playerName, playerId);

    console.log(`[重连管理] 存储连接信息: ${playerId} (${playerName})`);
  }

  /**
   * 更新玩家房间信息
   * 
   * @param playerId 玩家ID
   * @param roomId 房间ID
   */
  updateRoomInfo(playerId: string, roomId: string): void {
    const reconnectionInfo = this.reconnectionInfos.get(playerId);
    if (!reconnectionInfo) {
      console.warn(`[重连管理] 玩家信息不存在: ${playerId}`);
      return;
    }

    reconnectionInfo.roomId = roomId;
    reconnectionInfo.lastSeen = Date.now();

    console.log(`[重连管理] 更新房间信息: ${playerId} -> ${roomId}`);
  }

  /**
   * 检测重连请求
   * 
   * @param playerName 玩家名称
   * @returns 重连信息，如果不存在或已超时则返回 undefined
   */
  detectReconnection(playerName: string): ReconnectionInfo | undefined {
    const playerId = this.playerNameToId.get(playerName);
    if (!playerId) {
      return undefined;
    }

    const reconnectionInfo = this.reconnectionInfos.get(playerId);
    if (!reconnectionInfo) {
      return undefined;
    }

    // 检查是否超时
    const now = Date.now();
    if (now - reconnectionInfo.lastSeen > this.reconnectionTimeout) {
      console.log(`[重连管理] 重连信息已超时: ${playerId}`);
      this.removeReconnectionInfo(playerId);
      return undefined;
    }

    // 增加重连尝试次数
    reconnectionInfo.reconnectAttempts++;
    reconnectionInfo.lastSeen = now;

    console.log(`[重连管理] 检测到重连: ${playerId} (尝试次数: ${reconnectionInfo.reconnectAttempts})`);

    return reconnectionInfo;
  }

  /**
   * 获取重连信息
   * 
   * @param playerId 玩家ID
   * @returns 重连信息，如果不存在则返回 undefined
   */
  getReconnectionInfo(playerId: string): ReconnectionInfo | undefined {
    return this.reconnectionInfos.get(playerId);
  }

  /**
   * 移除重连信息
   * 
   * @param playerId 玩家ID
   */
  removeReconnectionInfo(playerId: string): void {
    const reconnectionInfo = this.reconnectionInfos.get(playerId);
    if (!reconnectionInfo) {
      console.warn(`[重连管理] 重连信息不存在: ${playerId}`);
      return;
    }

    this.reconnectionInfos.delete(playerId);
    this.playerNameToId.delete(reconnectionInfo.playerName);

    console.log(`[重连管理] 移除重连信息: ${playerId}`);
  }

  /**
   * 清理超时的重连信息
   * 
   * @returns 清理的重连信息数量
   */
  cleanupTimeoutReconnections(): number {
    const now = Date.now();
    let cleanupCount = 0;

    const timeoutPlayersIds: string[] = [];

    this.reconnectionInfos.forEach((reconnectionInfo, playerId) => {
      if (now - reconnectionInfo.lastSeen > this.reconnectionTimeout) {
        timeoutPlayersIds.push(playerId);
      }
    });

    timeoutPlayersIds.forEach((playerId) => {
      this.removeReconnectionInfo(playerId);
      cleanupCount++;
    });

    if (cleanupCount > 0) {
      console.log(`[重连管理] 清理了 ${cleanupCount} 个超时的重连信息`);
    }

    return cleanupCount;
  }

  /**
   * 获取所有重连信息
   * 
   * @returns 所有重连信息的数组
   */
  getAllReconnectionInfos(): ReconnectionInfo[] {
    return Array.from(this.reconnectionInfos.values());
  }

  /**
   * 获取重连信息数量
   * 
   * @returns 重连信息数量
   */
  getReconnectionInfoCount(): number {
    return this.reconnectionInfos.size;
  }

  /**
   * 清空所有重连信息
   */
  clearAllReconnectionInfos(): void {
    this.reconnectionInfos.clear();
    this.playerNameToId.clear();
    console.log('[重连管理] 已清空所有重连信息');
  }

  /**
   * 设置重连超时时间
   * 
   * @param timeoutMs 超时时间（毫秒）
   */
  setReconnectionTimeout(timeoutMs: number): void {
    this.reconnectionTimeout = timeoutMs;
    console.log(`[重连管理] 设置重连超时时间: ${timeoutMs}ms`);
  }

  /**
   * 获取重连超时时间
   * 
   * @returns 超时时间（毫秒）
   */
  getReconnectionTimeout(): number {
    return this.reconnectionTimeout;
  }
}
