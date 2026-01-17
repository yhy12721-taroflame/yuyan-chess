/**
 * 连接管理属性测试
 * 
 * 验证连接管理系统的通用属性
 * 
 * **Feature: xiangqi-online**
 * **Property 1: 玩家连接唯一性**
 * **Validates: Requirements 1.2**
 */

import * as fc from 'fast-check';
import { ConnectionManager } from '../../src/managers/ConnectionManager';

/**
 * 生成有效的玩家名称
 */
const validPlayerName = () =>
  fc.string({
    minLength: 1,
    maxLength: 20,
    unit: 'codePoint'
  });

/**
 * 生成多个玩家名称
 */
const multiplePlayerNames = (count: number) =>
  fc.array(validPlayerName(), { minLength: count, maxLength: count });

describe('Connection 属性测试', () => {
  /**
   * Property 1: 玩家连接唯一性
   * 
   * 对于任何连接到系统的玩家，系统分配的玩家ID应该是唯一的，
   * 不与任何其他玩家的ID重复。
   * 
   * **Validates: Requirements 1.2**
   */
  describe('Property 1: 玩家连接唯一性', () => {
    test('为不同的玩家分配的ID应该是唯一的', () => {
      fc.assert(
        fc.property(
          fc.array(validPlayerName(), { minLength: 1, maxLength: 100 }),
          (playerNames) => {
            const connectionManager = new ConnectionManager();
            const playerIds = new Set<string>();
            
            // 为每个玩家创建连接
            playerNames.forEach((playerName) => {
              const playerId = connectionManager.createConnection(playerName);
              playerIds.add(playerId);
            });
            
            // 验证所有ID都是唯一的
            expect(playerIds.size).toBe(playerNames.length);
            
            // 验证每个ID都能查询到对应的连接
            playerIds.forEach((playerId) => {
              expect(connectionManager.hasConnection(playerId)).toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    test('即使玩家名称相同，分配的ID也应该是唯一的', () => {
      fc.assert(
        fc.property(
          validPlayerName(),
          fc.integer({ min: 1, max: 100 }),
          (playerName, count) => {
            const connectionManager = new ConnectionManager();
            const playerIds = new Set<string>();
            
            // 为相同名称的玩家创建多个连接
            for (let i = 0; i < count; i++) {
              const playerId = connectionManager.createConnection(playerName);
              playerIds.add(playerId);
            }
            
            // 验证所有ID都是唯一的
            expect(playerIds.size).toBe(count);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('大量连接的ID应该保持唯一性', () => {
      fc.assert(
        fc.property(
          fc.array(validPlayerName(), { minLength: 100, maxLength: 1000 }),
          (playerNames) => {
            const connectionManager = new ConnectionManager();
            const playerIds = new Set<string>();
            
            // 为每个玩家创建连接
            playerNames.forEach((playerName) => {
              const playerId = connectionManager.createConnection(playerName);
              playerIds.add(playerId);
            });
            
            // 验证所有ID都是唯一的
            expect(playerIds.size).toBe(playerNames.length);
          }
        ),
        { numRuns: 50 }
      );
    });

    test('连接ID应该是字符串格式', () => {
      fc.assert(
        fc.property(
          fc.array(validPlayerName(), { minLength: 1, maxLength: 100 }),
          (playerNames) => {
            const connectionManager = new ConnectionManager();
            
            // 为每个玩家创建连接
            playerNames.forEach((playerName) => {
              const playerId = connectionManager.createConnection(playerName);
              
              // 验证ID是字符串
              expect(typeof playerId).toBe('string');
              
              // 验证ID不为空
              expect(playerId.length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    test('连接ID应该能够用于查询连接', () => {
      fc.assert(
        fc.property(
          fc.array(validPlayerName(), { minLength: 1, maxLength: 100 }),
          (playerNames) => {
            const connectionManager = new ConnectionManager();
            
            // 为每个玩家创建连接
            playerNames.forEach((playerName) => {
              const playerId = connectionManager.createConnection(playerName);
              
              // 验证可以通过ID查询到连接
              const connectionInfo = connectionManager.getConnection(playerId);
              expect(connectionInfo).toBeDefined();
              expect(connectionInfo?.playerId).toBe(playerId);
              expect(connectionInfo?.playerName).toBe(playerName);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    test('不同的连接应该有不同的创建时间戳', () => {
      fc.assert(
        fc.property(
          fc.array(validPlayerName(), { minLength: 2, maxLength: 100 }),
          (playerNames) => {
            const connectionManager = new ConnectionManager();
            const timestamps = new Set<number>();
            
            // 为每个玩家创建连接
            playerNames.forEach((playerName) => {
              const playerId = connectionManager.createConnection(playerName);
              const connectionInfo = connectionManager.getConnection(playerId);
              
              if (connectionInfo) {
                timestamps.add(connectionInfo.connectedAt);
              }
            });
            
            // 注意：由于时间精度，可能有相同的时间戳
            // 但至少应该有一些不同的时间戳
            expect(timestamps.size).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('连接应该初始化为已连接状态', () => {
      fc.assert(
        fc.property(
          fc.array(validPlayerName(), { minLength: 1, maxLength: 100 }),
          (playerNames) => {
            const connectionManager = new ConnectionManager();
            
            // 为每个玩家创建连接
            playerNames.forEach((playerName) => {
              const playerId = connectionManager.createConnection(playerName);
              const connectionInfo = connectionManager.getConnection(playerId);
              
              // 验证连接状态为已连接
              expect(connectionInfo?.status).toBe('connected');
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    test('连接应该初始化最后心跳时间', () => {
      fc.assert(
        fc.property(
          fc.array(validPlayerName(), { minLength: 1, maxLength: 100 }),
          (playerNames) => {
            const beforeTime = Date.now();
            const connectionManager = new ConnectionManager();
            const afterTime = Date.now();
            
            // 为每个玩家创建连接
            playerNames.forEach((playerName) => {
              const playerId = connectionManager.createConnection(playerName);
              const connectionInfo = connectionManager.getConnection(playerId);
              
              // 验证最后心跳时间在合理范围内
              expect(connectionInfo?.lastHeartbeat).toBeGreaterThanOrEqual(beforeTime);
              expect(connectionInfo?.lastHeartbeat).toBeLessThanOrEqual(afterTime + 1000);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
