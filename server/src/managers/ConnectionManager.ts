/**
 * 连接管理器
 * 
 * 负责：
 * - 为每个连接分配唯一的玩家ID
 * - 维护连接状态映射
 * - 实现连接查询接口
 * - 实现连接状态更新
 * - 实现连接清理
 */

// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { ConnectionStatus } from '../types';

/**
 * 连接信息
 */
interface ConnectionInfo {
  playerId: string;
  playerName: string;
  status: ConnectionStatus;
  connectedAt: number;
  lastHeartbeat: number;
}

/**
 * 连接管理器类
 */
export class ConnectionManager {
  // 连接映射：playerId -> ConnectionInfo
  private connections: Map<string, ConnectionInfo> = new Map();
  
  // 玩家名称到ID的映射，用于快速查询
  private playerNameToId: Map<string, string> = new Map();

  /**
   * 创建新连接
   * 
   * @param playerName 玩家名称
   * @returns 新创建的玩家ID
   */
  createConnection(playerName: string): string {
    // 生成唯一的玩家ID
    const playerId = uuidv4();
    
    // 创建连接信息
    const connectionInfo: ConnectionInfo = {
      playerId,
      playerName,
      status: 'connected',
      connectedAt: Date.now(),
      lastHeartbeat: Date.now()
    };
    
    // 存储连接信息
    this.connections.set(playerId, connectionInfo);
    this.playerNameToId.set(playerName, playerId);
    
    console.log(`[连接管理] 创建新连接: ${playerId} (${playerName})`);
    
    return playerId;
  }

  /**
   * 获取连接信息
   * 
   * @param playerId 玩家ID
   * @returns 连接信息，如果不存在则返回 undefined
   */
  getConnection(playerId: string): ConnectionInfo | undefined {
    return this.connections.get(playerId);
  }

  /**
   * 检查连接是否存在
   * 
   * @param playerId 玩家ID
   * @returns 连接是否存在
   */
  hasConnection(playerId: string): boolean {
    return this.connections.has(playerId);
  }

  /**
   * 获取玩家ID（通过玩家名称）
   * 
   * @param playerName 玩家名称
   * @returns 玩家ID，如果不存在则返回 undefined
   */
  getPlayerIdByName(playerName: string): string | undefined {
    return this.playerNameToId.get(playerName);
  }

  /**
   * 更新连接状态
   * 
   * @param playerId 玩家ID
   * @param status 新的连接状态
   */
  updateConnectionStatus(playerId: string, status: ConnectionStatus): void {
    const connectionInfo = this.connections.get(playerId);
    if (!connectionInfo) {
      console.warn(`[连接管理] 连接不存在: ${playerId}`);
      return;
    }
    
    connectionInfo.status = status;
    console.log(`[连接管理] 更新连接状态: ${playerId} -> ${status}`);
  }

  /**
   * 更新最后心跳时间
   * 
   * @param playerId 玩家ID
   */
  updateLastHeartbeat(playerId: string): void {
    const connectionInfo = this.connections.get(playerId);
    if (!connectionInfo) {
      console.warn(`[连接管理] 连接不存在: ${playerId}`);
      return;
    }
    
    connectionInfo.lastHeartbeat = Date.now();
  }

  /**
   * 获取连接的玩家名称
   * 
   * @param playerId 玩家ID
   * @returns 玩家名称，如果不存在则返回 undefined
   */
  getPlayerName(playerId: string): string | undefined {
    const connectionInfo = this.connections.get(playerId);
    return connectionInfo?.playerName;
  }

  /**
   * 获取连接状态
   * 
   * @param playerId 玩家ID
   * @returns 连接状态，如果不存在则返回 undefined
   */
  getConnectionStatus(playerId: string): ConnectionStatus | undefined {
    const connectionInfo = this.connections.get(playerId);
    return connectionInfo?.status;
  }

  /**
   * 删除连接
   * 
   * @param playerId 玩家ID
   */
  removeConnection(playerId: string): void {
    const connectionInfo = this.connections.get(playerId);
    if (!connectionInfo) {
      console.warn(`[连接管理] 连接不存在: ${playerId}`);
      return;
    }
    
    // 从映射中删除
    this.connections.delete(playerId);
    this.playerNameToId.delete(connectionInfo.playerName);
    
    console.log(`[连接管理] 删除连接: ${playerId}`);
  }

  /**
   * 获取所有连接
   * 
   * @returns 所有连接信息的数组
   */
  getAllConnections(): ConnectionInfo[] {
    return Array.from(this.connections.values());
  }

  /**
   * 获取连接数
   * 
   * @returns 当前连接数
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * 清空所有连接
   */
  clearAllConnections(): void {
    this.connections.clear();
    this.playerNameToId.clear();
    console.log('[连接管理] 已清空所有连接');
  }

  /**
   * 获取超时的连接（超过指定时间没有心跳）
   * 
   * @param timeoutMs 超时时间（毫秒）
   * @returns 超时的连接ID数组
   */
  getTimeoutConnections(timeoutMs: number): string[] {
    const now = Date.now();
    const timeoutConnections: string[] = [];
    
    this.connections.forEach((connectionInfo, playerId) => {
      if (now - connectionInfo.lastHeartbeat > timeoutMs) {
        timeoutConnections.push(playerId);
      }
    });
    
    return timeoutConnections;
  }
}
