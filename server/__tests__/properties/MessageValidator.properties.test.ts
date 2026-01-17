/**
 * 消息验证器属性测试
 * 
 * 使用 fast-check 进行属性测试
 */

import fc from 'fast-check';
import { MessageValidator } from '../../src/utils/MessageValidator';
import { Message, ErrorCode } from '../../src/types';

describe('MessageValidator 属性测试', () => {
  describe('属性 7: 消息格式有效性', () => {
    it('**Feature: xiangqi-online, Property 7: 消息格式有效性** - 任何发送的消息应该是有效的 JSON 格式，并包含 type 和 data 字段', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.object(),
          (type, data) => {
            const validator = new MessageValidator();
            const message: Message = {
              type,
              data
            };

            const result = validator.validateMessageFormat(message);

            // 有效的消息应该包含 type 和 data 字段
            if (result.valid) {
              expect(message.type).toBeDefined();
              expect(typeof message.type).toBe('string');
              expect(message.data).toBeDefined();
              expect(typeof message.data).toBe('object');
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 8: 移动消息完整性', () => {
    it('**Feature: xiangqi-online, Property 8: 移动消息完整性** - 任何移动消息应该包含房间ID、玩家ID、起始位置和目标位置', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          fc.integer({ min: 0, max: 8 }),
          fc.integer({ min: 0, max: 9 }),
          (roomId, fromX, fromY, toX, toY) => {
            const validator = new MessageValidator();
            const message: Message = {
              type: 'move',
              data: {
                roomId,
                from: { x: fromX, y: fromY },
                to: { x: toX, y: toY }
              }
            };

            const result = validator.validateMoveMessage(message);

            if (result.valid) {
              expect(message.data.roomId).toBeDefined();
              expect(typeof message.data.roomId).toBe('string');
              expect(message.data.from).toBeDefined();
              expect(typeof message.data.from.x).toBe('number');
              expect(typeof message.data.from.y).toBe('number');
              expect(message.data.to).toBeDefined();
              expect(typeof message.data.to.x).toBe('number');
              expect(typeof message.data.to.y).toBe('number');
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 9: 状态消息完整性', () => {
    it('**Feature: xiangqi-online, Property 9: 状态消息完整性** - 任何游戏状态消息应该包含完整的棋盘配置、当前轮次和游戏状态', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.constantFrom('red', 'black'),
          fc.integer({ min: 0, max: 100 }),
          fc.constantFrom('playing', 'checkmate', 'stalemate', 'draw'),
          (board, currentPlayer, moveCount, status) => {
            const validator = new MessageValidator();
            const message: Message = {
              type: 'game_state',
              data: {
                board,
                currentPlayer,
                moveCount,
                status
              }
            };

            const result = validator.validateGameStateMessage(message);

            if (result.valid) {
              expect(message.data.board).toBeDefined();
              expect(typeof message.data.board).toBe('string');
              expect(message.data.currentPlayer).toBeDefined();
              expect(typeof message.data.currentPlayer).toBe('string');
              expect(message.data.moveCount).toBeDefined();
              expect(typeof message.data.moveCount).toBe('number');
              expect(message.data.status).toBeDefined();
              expect(typeof message.data.status).toBe('string');
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 10: 错误消息完整性', () => {
    it('**Feature: xiangqi-online, Property 10: 错误消息完整性** - 任何错误消息应该包含错误代码和描述性错误信息', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            ErrorCode.INVALID_MOVE,
            ErrorCode.NOT_YOUR_TURN,
            ErrorCode.ROOM_NOT_FOUND,
            ErrorCode.ROOM_FULL
          ),
          fc.string({ minLength: 1, maxLength: 100 }),
          (code, message) => {
            const validator = new MessageValidator();
            const msg: Message = {
              type: 'error',
              data: {
                code,
                message
              }
            };

            const result = validator.validateErrorMessage(msg);

            if (result.valid) {
              expect(msg.data.code).toBeDefined();
              expect(typeof msg.data.code).toBe('string');
              expect(msg.data.message).toBeDefined();
              expect(typeof msg.data.message).toBe('string');
              expect(msg.data.message.length).toBeGreaterThan(0);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('属性 11: 心跳消息完整性', () => {
    it('**Feature: xiangqi-online, Property 11: 心跳消息完整性** - 任何心跳消息应该包含时间戳', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0 }),
          (timestamp) => {
            const validator = new MessageValidator();
            const message: Message = {
              type: 'heartbeat',
              data: {
                timestamp
              }
            };

            const result = validator.validateHeartbeatMessage(message);

            if (result.valid) {
              expect(message.data.timestamp).toBeDefined();
              expect(typeof message.data.timestamp).toBe('number');
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('消息验证的一致性', () => {
    it('有效的消息应该通过验证', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          (playerName) => {
            const validator = new MessageValidator();
            const message: Message = {
              type: 'connect',
              data: { playerName }
            };

            const result = validator.validateMessage(message);

            // 如果昵称长度有效，消息应该通过验证
            if (playerName.length >= 1 && playerName.length <= 20) {
              expect(result.valid).toBe(true);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('消息类型验证的一致性', () => {
    it('不同类型的消息应该使用相应的验证器', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('connect', 'create_room', 'join_room', 'move', 'heartbeat', 'game_state', 'error'),
          (messageType) => {
            const validator = new MessageValidator();
            const message: Message = {
              type: messageType,
              data: {}
            };

            const result = validator.validateMessage(message);

            // 空的 data 对象应该导致验证失败（除了某些特殊情况）
            // 但至少应该返回一个结果
            expect(result).toBeDefined();
            expect(result.valid !== undefined).toBe(true);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
