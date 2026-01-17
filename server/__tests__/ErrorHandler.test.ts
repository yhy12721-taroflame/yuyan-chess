/**
 * 错误处理器单元测试
 */

import { ErrorHandler } from '../src/utils/ErrorHandler';
import { ErrorCode } from '../src/types';

describe('ErrorHandler', () => {
  describe('创建错误消息', () => {
    it('应该创建有效的错误消息', () => {
      const message = ErrorHandler.createErrorMessage(ErrorCode.INVALID_MOVE);

      expect(message).toBeDefined();
      expect(message.type).toBe('error');
      expect(message.data.code).toBe(ErrorCode.INVALID_MOVE);
      expect(message.data.message).toBeDefined();
      expect(typeof message.data.message).toBe('string');
    });

    it('应该使用自定义错误消息', () => {
      const customMsg = '自定义错误消息';
      const message = ErrorHandler.createErrorMessage(ErrorCode.INVALID_MOVE, customMsg);

      expect(message.data.message).toBe(customMsg);
    });

    it('应该为所有错误代码创建消息', () => {
      const errorCodes = ErrorHandler.getAllErrorCodes();

      errorCodes.forEach(code => {
        const message = ErrorHandler.createErrorMessage(code);
        expect(message.data.code).toBe(code);
        expect(message.data.message).toBeDefined();
      });
    });
  });

  describe('获取错误消息', () => {
    it('应该返回正确的错误消息', () => {
      const message = ErrorHandler.getErrorMessage(ErrorCode.ROOM_NOT_FOUND);

      expect(message).toBe('房间不存在');
    });

    it('应该为所有错误代码返回消息', () => {
      const errorCodes = ErrorHandler.getAllErrorCodes();

      errorCodes.forEach(code => {
        const message = ErrorHandler.getErrorMessage(code);
        expect(message).toBeDefined();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('错误代码验证', () => {
    it('应该验证有效的错误代码', () => {
      expect(ErrorHandler.isValidErrorCode(ErrorCode.INVALID_MOVE)).toBe(true);
      expect(ErrorHandler.isValidErrorCode(ErrorCode.ROOM_FULL)).toBe(true);
    });

    it('应该拒绝无效的错误代码', () => {
      expect(ErrorHandler.isValidErrorCode('INVALID_CODE')).toBe(false);
      expect(ErrorHandler.isValidErrorCode('')).toBe(false);
    });
  });

  describe('获取所有错误代码', () => {
    it('应该返回所有错误代码', () => {
      const codes = ErrorHandler.getAllErrorCodes();

      expect(codes).toBeDefined();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes.length).toBeGreaterThan(0);
    });

    it('所有错误代码应该是有效的', () => {
      const codes = ErrorHandler.getAllErrorCodes();

      codes.forEach(code => {
        expect(ErrorHandler.isValidErrorCode(code)).toBe(true);
      });
    });
  });

  describe('错误处理方法', () => {
    it('应该处理连接错误', () => {
      const message = ErrorHandler.handleConnectionError('连接失败');

      expect(message.data.code).toBe(ErrorCode.CONNECTION_FAILED);
    });

    it('应该处理房间错误', () => {
      const message = ErrorHandler.handleRoomError(ErrorCode.ROOM_NOT_FOUND, '房间不存在');

      expect(message.data.code).toBe(ErrorCode.ROOM_NOT_FOUND);
    });

    it('应该处理游戏错误', () => {
      const message = ErrorHandler.handleGameError(ErrorCode.INVALID_MOVE, '无效的移动');

      expect(message.data.code).toBe(ErrorCode.INVALID_MOVE);
    });

    it('应该处理消息错误', () => {
      const message = ErrorHandler.handleMessageError(ErrorCode.INVALID_MESSAGE_FORMAT, '消息格式无效');

      expect(message.data.code).toBe(ErrorCode.INVALID_MESSAGE_FORMAT);
    });

    it('应该处理玩家错误', () => {
      const message = ErrorHandler.handlePlayerError(ErrorCode.PLAYER_NOT_FOUND, '玩家不存在');

      expect(message.data.code).toBe(ErrorCode.PLAYER_NOT_FOUND);
    });

    it('应该处理服务器错误', () => {
      const message = ErrorHandler.handleServerError('服务器错误');

      expect(message.data.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    });
  });

  describe('错误响应验证', () => {
    it('应该验证有效的错误响应', () => {
      const response = ErrorHandler.createErrorMessage(ErrorCode.INVALID_MOVE);

      expect(ErrorHandler.isErrorResponse(response)).toBe(true);
    });

    it('应该拒绝无效的错误响应', () => {
      expect(ErrorHandler.isErrorResponse(null)).toBe(false);
      expect(ErrorHandler.isErrorResponse({})).toBe(false);
      expect(ErrorHandler.isErrorResponse({ type: 'error' })).toBe(false);
      expect(ErrorHandler.isErrorResponse({ type: 'error', data: {} })).toBe(false);
    });

    it('应该拒绝非错误类型的响应', () => {
      const response = {
        type: 'success',
        data: { code: ErrorCode.INVALID_MOVE, message: '错误' }
      };

      expect(ErrorHandler.isErrorResponse(response)).toBe(false);
    });
  });

  describe('日志记录', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });

    it('应该记录错误', () => {
      ErrorHandler.logError(ErrorCode.INVALID_MOVE, '测试错误');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('应该记录警告', () => {
      ErrorHandler.logWarning(ErrorCode.INVALID_MOVE, '测试警告');

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('应该记录信息', () => {
      ErrorHandler.logInfo('测试信息');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('应该在记录错误时包含原始错误对象', () => {
      const error = new Error('原始错误');
      ErrorHandler.logError(ErrorCode.INVALID_MOVE, '测试错误', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('INVALID_MOVE'),
        error
      );
    });
  });

  describe('错误消息的一致性', () => {
    it('相同的错误代码应该返回相同的消息', () => {
      const message1 = ErrorHandler.getErrorMessage(ErrorCode.ROOM_FULL);
      const message2 = ErrorHandler.getErrorMessage(ErrorCode.ROOM_FULL);

      expect(message1).toBe(message2);
    });

    it('创建的错误消息应该包含正确的错误代码', () => {
      const errorCodes = ErrorHandler.getAllErrorCodes();

      errorCodes.forEach(code => {
        const message = ErrorHandler.createErrorMessage(code);
        expect(message.data.code).toBe(code);
      });
    });
  });
});
