/**
 * 消息验证器单元测试
 */

import { MessageValidator } from '../src/utils/MessageValidator';
import { Message, ErrorCode } from '../src/types';

describe('MessageValidator', () => {
  let validator: MessageValidator;

  beforeEach(() => {
    validator = new MessageValidator();
  });

  describe('消息格式验证', () => {
    it('应该验证有效的消息格式', () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: 'Alice' }
      };

      const result = validator.validateMessageFormat(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝非对象消息', () => {
      const result = validator.validateMessageFormat('not an object');

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(ErrorCode.INVALID_MESSAGE_FORMAT);
    });

    it('应该拒绝缺少 type 字段的消息', () => {
      const message = {
        data: { playerName: 'Alice' }
      };

      const result = validator.validateMessageFormat(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 data 字段的消息', () => {
      const message = {
        type: 'connect'
      };

      const result = validator.validateMessageFormat(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝 type 不是字符串的消息', () => {
      const message = {
        type: 123,
        data: { playerName: 'Alice' }
      };

      const result = validator.validateMessageFormat(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝 data 不是对象的消息', () => {
      const message = {
        type: 'connect',
        data: 'not an object'
      };

      const result = validator.validateMessageFormat(message);

      expect(result.valid).toBe(false);
    });
  });

  describe('连接消息验证', () => {
    it('应该验证有效的连接消息', () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: 'Alice' }
      };

      const result = validator.validateConnectMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝缺少 playerName 的连接消息', () => {
      const message: Message = {
        type: 'connect',
        data: {}
      };

      const result = validator.validateConnectMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝昵称过短的连接消息', () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: '' }
      };

      const result = validator.validateConnectMessage(message);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(ErrorCode.INVALID_PLAYER_NAME);
    });

    it('应该拒绝昵称过长的连接消息', () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: 'a'.repeat(21) }
      };

      const result = validator.validateConnectMessage(message);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(ErrorCode.INVALID_PLAYER_NAME);
    });
  });

  describe('创建房间消息验证', () => {
    it('应该验证有效的创建房间消息', () => {
      const message: Message = {
        type: 'create_room',
        data: { playerName: 'Alice' }
      };

      const result = validator.validateCreateRoomMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝缺少 playerName 的创建房间消息', () => {
      const message: Message = {
        type: 'create_room',
        data: {}
      };

      const result = validator.validateCreateRoomMessage(message);

      expect(result.valid).toBe(false);
    });
  });

  describe('加入房间消息验证', () => {
    it('应该验证有效的加入房间消息', () => {
      const message: Message = {
        type: 'join_room',
        data: { roomId: 'room123', playerName: 'Alice' }
      };

      const result = validator.validateJoinRoomMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝缺少 roomId 的加入房间消息', () => {
      const message: Message = {
        type: 'join_room',
        data: { playerName: 'Alice' }
      };

      const result = validator.validateJoinRoomMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 playerName 的加入房间消息', () => {
      const message: Message = {
        type: 'join_room',
        data: { roomId: 'room123' }
      };

      const result = validator.validateJoinRoomMessage(message);

      expect(result.valid).toBe(false);
    });
  });

  describe('移动消息验证', () => {
    it('应该验证有效的移动消息', () => {
      const message: Message = {
        type: 'move',
        data: {
          roomId: 'room123',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 }
        }
      };

      const result = validator.validateMoveMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝缺少 roomId 的移动消息', () => {
      const message: Message = {
        type: 'move',
        data: {
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 }
        }
      };

      const result = validator.validateMoveMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 from 的移动消息', () => {
      const message: Message = {
        type: 'move',
        data: {
          roomId: 'room123',
          to: { x: 1, y: 1 }
        }
      };

      const result = validator.validateMoveMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 to 的移动消息', () => {
      const message: Message = {
        type: 'move',
        data: {
          roomId: 'room123',
          from: { x: 0, y: 0 }
        }
      };

      const result = validator.validateMoveMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝 from 坐标不完整的移动消息', () => {
      const message: Message = {
        type: 'move',
        data: {
          roomId: 'room123',
          from: { x: 0 },
          to: { x: 1, y: 1 }
        }
      };

      const result = validator.validateMoveMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝 to 坐标不完整的移动消息', () => {
      const message: Message = {
        type: 'move',
        data: {
          roomId: 'room123',
          from: { x: 0, y: 0 },
          to: { y: 1 }
        }
      };

      const result = validator.validateMoveMessage(message);

      expect(result.valid).toBe(false);
    });
  });

  describe('心跳消息验证', () => {
    it('应该验证有效的心跳消息', () => {
      const message: Message = {
        type: 'heartbeat',
        data: { timestamp: Date.now() }
      };

      const result = validator.validateHeartbeatMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝缺少 timestamp 的心跳消息', () => {
      const message: Message = {
        type: 'heartbeat',
        data: {}
      };

      const result = validator.validateHeartbeatMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝 timestamp 不是数字的心跳消息', () => {
      const message: Message = {
        type: 'heartbeat',
        data: { timestamp: 'not a number' }
      };

      const result = validator.validateHeartbeatMessage(message);

      expect(result.valid).toBe(false);
    });
  });

  describe('游戏状态消息验证', () => {
    it('应该验证有效的游戏状态消息', () => {
      const message: Message = {
        type: 'game_state',
        data: {
          board: '{}',
          currentPlayer: 'red',
          moveCount: 0,
          status: 'playing'
        }
      };

      const result = validator.validateGameStateMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝缺少 board 的游戏状态消息', () => {
      const message: Message = {
        type: 'game_state',
        data: {
          currentPlayer: 'red',
          moveCount: 0,
          status: 'playing'
        }
      };

      const result = validator.validateGameStateMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 currentPlayer 的游戏状态消息', () => {
      const message: Message = {
        type: 'game_state',
        data: {
          board: '{}',
          moveCount: 0,
          status: 'playing'
        }
      };

      const result = validator.validateGameStateMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 moveCount 的游戏状态消息', () => {
      const message: Message = {
        type: 'game_state',
        data: {
          board: '{}',
          currentPlayer: 'red',
          status: 'playing'
        }
      };

      const result = validator.validateGameStateMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 status 的游戏状态消息', () => {
      const message: Message = {
        type: 'game_state',
        data: {
          board: '{}',
          currentPlayer: 'red',
          moveCount: 0
        }
      };

      const result = validator.validateGameStateMessage(message);

      expect(result.valid).toBe(false);
    });
  });

  describe('错误消息验证', () => {
    it('应该验证有效的错误消息', () => {
      const message: Message = {
        type: 'error',
        data: {
          code: ErrorCode.INVALID_MOVE,
          message: '无效的移动'
        }
      };

      const result = validator.validateErrorMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝缺少 code 的错误消息', () => {
      const message: Message = {
        type: 'error',
        data: {
          message: '无效的移动'
        }
      };

      const result = validator.validateErrorMessage(message);

      expect(result.valid).toBe(false);
    });

    it('应该拒绝缺少 message 的错误消息', () => {
      const message: Message = {
        type: 'error',
        data: {
          code: ErrorCode.INVALID_MOVE
        }
      };

      const result = validator.validateErrorMessage(message);

      expect(result.valid).toBe(false);
    });
  });

  describe('通用消息验证', () => {
    it('应该根据消息类型验证消息', () => {
      const message: Message = {
        type: 'connect',
        data: { playerName: 'Alice' }
      };

      const result = validator.validateMessage(message);

      expect(result.valid).toBe(true);
    });

    it('应该拒绝未知的消息类型', () => {
      const message: Message = {
        type: 'unknown',
        data: {}
      };

      const result = validator.validateMessage(message);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(ErrorCode.UNKNOWN_MESSAGE_TYPE);
    });
  });
});
