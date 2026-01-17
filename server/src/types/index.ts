/**
 * 象棋线上对战服务器类型定义
 * 
 * 定义系统中使用的所有类型和接口
 */

/**
 * 消息基础类型
 */
export interface Message {
  type: string;
  data: any;
}

/**
 * 玩家颜色
 */
export type PlayerColor = 'red' | 'black';

/**
 * 房间状态
 */
export type RoomStatus = 'waiting' | 'playing' | 'finished';

/**
 * 游戏状态
 */
export type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw';

/**
 * 连接状态
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

/**
 * 位置坐标
 */
export interface Position {
  x: number; // 0-8
  y: number; // 0-9
}

/**
 * 移动
 */
export interface Move {
  from: Position;
  to: Position;
  timestamp: number;
  playerId: string;
}

/**
 * 玩家信息
 */
export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isConnected: boolean;
  lastHeartbeat: number;
}

/**
 * 房间信息
 */
export interface Room {
  id: string;
  creatorId: string;
  creatorName: string;
  players: {
    red?: Player;
    black?: Player;
  };
  gameState: GameState;
  status: RoomStatus;
  createdAt: number;
  updatedAt: number;
}

/**
 * 游戏状态
 */
export interface GameState {
  board: any; // 棋盘状态，使用现有的 Board 类型
  currentPlayer: PlayerColor;
  moveHistory: Move[];
  status: GameStatus;
  lastMoveTime: number;
  redPlayer: {
    id: string;
    name: string;
    isConnected: boolean;
  };
  blackPlayer: {
    id: string;
    name: string;
    isConnected: boolean;
  };
}

/**
 * 游戏状态快照
 */
export interface GameStateSnapshot {
  board: string; // 棋盘的序列化表示
  currentPlayer: PlayerColor;
  moveCount: number;
  status: GameStatus;
}

/**
 * 游戏结果
 */
export interface GameResult {
  winner?: PlayerColor;
  reason: 'checkmate' | 'stalemate' | 'draw' | 'resignation';
  endTime: number;
}

/**
 * 错误代码
 */
export enum ErrorCode {
  // 连接错误
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  RECONNECTION_FAILED = 'RECONNECTION_FAILED',
  
  // 房间错误
  ROOM_NOT_FOUND = 'ROOM_NOT_FOUND',
  ROOM_FULL = 'ROOM_FULL',
  ROOM_NOT_AVAILABLE = 'ROOM_NOT_AVAILABLE',
  
  // 游戏错误
  INVALID_MOVE = 'INVALID_MOVE',
  NOT_YOUR_TURN = 'NOT_YOUR_TURN',
  GAME_NOT_STARTED = 'GAME_NOT_STARTED',
  GAME_ALREADY_FINISHED = 'GAME_ALREADY_FINISHED',
  
  // 玩家错误
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  INVALID_PLAYER_NAME = 'INVALID_PLAYER_NAME',
  
  // 消息错误
  INVALID_MESSAGE_FORMAT = 'INVALID_MESSAGE_FORMAT',
  UNKNOWN_MESSAGE_TYPE = 'UNKNOWN_MESSAGE_TYPE',
  
  // 服务器错误
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

/**
 * 错误响应
 */
export interface ErrorResponse {
  code: ErrorCode;
  message: string;
}

/**
 * 连接消息
 */
export interface ConnectMessage extends Message {
  type: 'connect';
  data: {
    playerName: string;
  };
}

/**
 * 连接确认消息
 */
export interface ConnectAckMessage extends Message {
  type: 'connect_ack';
  data: {
    playerId: string;
  };
}

/**
 * 创建房间消息
 */
export interface CreateRoomMessage extends Message {
  type: 'create_room';
  data: {
    playerName: string;
  };
}

/**
 * 加入房间消息
 */
export interface JoinRoomMessage extends Message {
  type: 'join_room';
  data: {
    roomId: string;
    playerName: string;
  };
}

/**
 * 房间列表消息
 */
export interface RoomListMessage extends Message {
  type: 'room_list';
  data: {
    rooms: Room[];
  };
}

/**
 * 移动消息
 */
export interface MoveMessage extends Message {
  type: 'move';
  data: {
    roomId: string;
    from: Position;
    to: Position;
  };
}

/**
 * 移动确认消息
 */
export interface MoveAckMessage extends Message {
  type: 'move_ack';
  data: {
    success: boolean;
    error?: string;
    gameState?: GameStateSnapshot;
  };
}

/**
 * 游戏状态消息
 */
export interface GameStateMessage extends Message {
  type: 'game_state';
  data: GameStateSnapshot;
}

/**
 * 心跳消息
 */
export interface HeartbeatMessage extends Message {
  type: 'heartbeat';
  data: {
    timestamp: number;
  };
}

/**
 * 心跳确认消息
 */
export interface HeartbeatAckMessage extends Message {
  type: 'heartbeat_ack';
  data: {
    timestamp: number;
  };
}

/**
 * 错误消息
 */
export interface ErrorMessage extends Message {
  type: 'error';
  data: {
    code: ErrorCode;
    message: string;
  };
}
