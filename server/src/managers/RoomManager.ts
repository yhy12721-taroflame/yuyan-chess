/**
 * 房间管理器
 * 
 * 负责：
 * - 创建和销毁房间
 * - 管理玩家加入和离开
 * - 维护房间列表
 * - 初始化游戏状态
 * - 房间搜索和过滤
 */

// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { Room, Player, PlayerColor, GameState, RoomStatus } from '../types';

/**
 * 房间管理器类
 */
export class RoomManager {
  // 房间映射：roomId -> Room
  private rooms: Map<string, Room> = new Map();
  
  // 玩家到房间的映射：playerId -> roomId
  private playerToRoom: Map<string, string> = new Map();

  /**
   * 创建新房间
   * 
   * @param creatorId 创建者ID
   * @param creatorName 创建者名称
   * @returns 新创建的房间
   */
  createRoom(creatorId: string, creatorName: string): Room {
    // 生成唯一的房间ID
    const roomId = uuidv4();
    
    // 创建房间对象
    const room: Room = {
      id: roomId,
      creatorId,
      creatorName,
      players: {},
      gameState: this.createInitialGameState(),
      status: 'waiting',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // 存储房间
    this.rooms.set(roomId, room);
    
    console.log(`[房间管理] 创建新房间: ${roomId} (创建者: ${creatorName})`);
    
    return room;
  }

  /**
   * 获取房间
   * 
   * @param roomId 房间ID
   * @returns 房间对象，如果不存在则返回 null
   */
  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  /**
   * 检查房间是否存在
   * 
   * @param roomId 房间ID
   * @returns 房间是否存在
   */
  hasRoom(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  /**
   * 玩家加入房间
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   * @param playerName 玩家名称
   * @returns 是否成功加入
   */
  joinRoom(roomId: string, playerId: string, playerName: string): boolean {
    // 检查房间是否存在
    const room = this.rooms.get(roomId);
    if (!room) {
      console.warn(`[房间管理] 房间不存在: ${roomId}`);
      return false;
    }

    // 检查房间是否已满
    const playerCount = Object.keys(room.players).length;
    if (playerCount >= 2) {
      console.warn(`[房间管理] 房间已满: ${roomId}`);
      return false;
    }

    // 检查玩家是否已在房间中
    if (this.playerToRoom.has(playerId)) {
      console.warn(`[房间管理] 玩家已在房间中: ${playerId}`);
      return false;
    }

    // 分配颜色（第一个玩家为红色，第二个为黑色）
    const color: PlayerColor = playerCount === 0 ? 'red' : 'black';

    // 创建玩家对象
    const player: Player = {
      id: playerId,
      name: playerName,
      color,
      isConnected: true,
      lastHeartbeat: Date.now()
    };

    // 添加玩家到房间
    room.players[color] = player;
    room.updatedAt = Date.now();

    // 更新玩家到房间的映射
    this.playerToRoom.set(playerId, roomId);

    console.log(`[房间管理] 玩家 ${playerName} (${playerId}) 加入房间 ${roomId} (颜色: ${color})`);

    // 如果房间已满，初始化游戏状态
    if (Object.keys(room.players).length === 2) {
      this.initializeGameState(roomId);
      room.status = 'playing';
      console.log(`[房间管理] 房间 ${roomId} 已满，游戏开始`);
    }

    return true;
  }

  /**
   * 玩家离开房间
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   */
  leaveRoom(roomId: string, playerId: string): void {
    // 检查房间是否存在
    const room = this.rooms.get(roomId);
    if (!room) {
      console.warn(`[房间管理] 房间不存在: ${roomId}`);
      return;
    }

    // 查找并移除玩家
    let playerColor: PlayerColor | null = null;
    for (const [color, player] of Object.entries(room.players)) {
      if (player && player.id === playerId) {
        playerColor = color as PlayerColor;
        break;
      }
    }

    if (!playerColor) {
      console.warn(`[房间管理] 玩家不在房间中: ${playerId}`);
      return;
    }

    // 移除玩家
    delete room.players[playerColor];
    room.updatedAt = Date.now();

    // 更新玩家到房间的映射
    this.playerToRoom.delete(playerId);

    console.log(`[房间管理] 玩家 ${playerId} 离开房间 ${roomId}`);

    // 如果房间为空，销毁房间
    if (Object.keys(room.players).length === 0) {
      this.destroyRoom(roomId);
    }
  }

  /**
   * 销毁房间
   * 
   * @param roomId 房间ID
   */
  private destroyRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.warn(`[房间管理] 房间不存在: ${roomId}`);
      return;
    }

    // 移除所有玩家的映射
    for (const player of Object.values(room.players)) {
      if (player) {
        this.playerToRoom.delete(player.id);
      }
    }

    // 删除房间
    this.rooms.delete(roomId);

    console.log(`[房间管理] 房间已销毁: ${roomId}`);
  }

  /**
   * 获取所有可用房间（未满员）
   * 
   * @returns 可用房间数组
   */
  getAvailableRooms(): Room[] {
    const availableRooms: Room[] = [];

    this.rooms.forEach((room) => {
      // 只返回未满员的房间
      if (Object.keys(room.players).length < 2) {
        availableRooms.push(room);
      }
    });

    return availableRooms;
  }

  /**
   * 获取所有房间
   * 
   * @returns 所有房间数组
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * 搜索房间
   * 
   * @param query 搜索查询（房间ID或创建者名称）
   * @returns 匹配的房间数组
   */
  searchRooms(query: string): Room[] {
    const results: Room[] = [];
    const lowerQuery = query.toLowerCase();

    this.rooms.forEach((room) => {
      // 按房间ID搜索
      if (room.id.toLowerCase().includes(lowerQuery)) {
        results.push(room);
        return;
      }

      // 按创建者名称搜索
      if (room.creatorName.toLowerCase().includes(lowerQuery)) {
        results.push(room);
        return;
      }
    });

    return results;
  }

  /**
   * 获取玩家所在的房间
   * 
   * @param playerId 玩家ID
   * @returns 房间对象，如果玩家不在任何房间中则返回 null
   */
  getPlayerRoom(playerId: string): Room | null {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) {
      return null;
    }
    return this.getRoom(roomId);
  }

  /**
   * 获取房间中的玩家数
   * 
   * @param roomId 房间ID
   * @returns 玩家数
   */
  getRoomPlayerCount(roomId: string): number {
    const room = this.rooms.get(roomId);
    if (!room) {
      return 0;
    }
    return Object.keys(room.players).length;
  }

  /**
   * 检查房间是否已满
   * 
   * @param roomId 房间ID
   * @returns 房间是否已满
   */
  isRoomFull(roomId: string): boolean {
    return this.getRoomPlayerCount(roomId) >= 2;
  }

  /**
   * 获取房间数
   * 
   * @returns 当前房间数
   */
  getRoomCount(): number {
    return this.rooms.size;
  }

  /**
   * 清空所有房间
   */
  clearAllRooms(): void {
    this.rooms.clear();
    this.playerToRoom.clear();
    console.log('[房间管理] 已清空所有房间');
  }

  /**
   * 创建初始游戏状态
   * 
   * @returns 初始游戏状态
   */
  private createInitialGameState(): GameState {
    return {
      board: null, // 将在游戏开始时初始化
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
   * 初始化游戏状态
   * 
   * @param roomId 房间ID
   */
  private initializeGameState(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.warn(`[房间管理] 房间不存在: ${roomId}`);
      return;
    }

    // 获取红黑两方玩家
    const redPlayer = room.players.red;
    const blackPlayer = room.players.black;

    if (!redPlayer || !blackPlayer) {
      console.warn(`[房间管理] 房间玩家不完整: ${roomId}`);
      return;
    }

    // 初始化游戏状态
    room.gameState = {
      board: null, // 将在实际游戏中初始化
      currentPlayer: 'red',
      moveHistory: [],
      status: 'playing',
      lastMoveTime: Date.now(),
      redPlayer: {
        id: redPlayer.id,
        name: redPlayer.name,
        isConnected: true
      },
      blackPlayer: {
        id: blackPlayer.id,
        name: blackPlayer.name,
        isConnected: true
      }
    };

    console.log(`[房间管理] 游戏状态已初始化: ${roomId}`);
  }

  /**
   * 更新玩家连接状态
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   * @param isConnected 是否连接
   */
  updatePlayerConnectionStatus(roomId: string, playerId: string, isConnected: boolean): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.warn(`[房间管理] 房间不存在: ${roomId}`);
      return;
    }

    // 查找玩家
    for (const player of Object.values(room.players)) {
      if (player && player.id === playerId) {
        player.isConnected = isConnected;
        room.updatedAt = Date.now();
        console.log(`[房间管理] 更新玩家连接状态: ${playerId} -> ${isConnected}`);
        return;
      }
    }

    console.warn(`[房间管理] 玩家不在房间中: ${playerId}`);
  }

  /**
   * 更新玩家最后心跳时间
   * 
   * @param roomId 房间ID
   * @param playerId 玩家ID
   */
  updatePlayerHeartbeat(roomId: string, playerId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.warn(`[房间管理] 房间不存在: ${roomId}`);
      return;
    }

    // 查找玩家
    for (const player of Object.values(room.players)) {
      if (player && player.id === playerId) {
        player.lastHeartbeat = Date.now();
        return;
      }
    }

    console.warn(`[房间管理] 玩家不在房间中: ${playerId}`);
  }
}
