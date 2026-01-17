import * as fc from 'fast-check';
import { Piece, createPiece, getOpponentColor } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

/**
 * 生成棋子类型
 */
const pieceType = () =>
  fc.constantFrom(
    PieceType.General,
    PieceType.Advisor,
    PieceType.Elephant,
    PieceType.Horse,
    PieceType.Chariot,
    PieceType.Cannon,
    PieceType.Soldier
  );

/**
 * 生成颜色
 */
const color = () => fc.constantFrom(Color.Red, Color.Black);

/**
 * 生成棋子
 */
const piece = () =>
  fc.record({
    type: pieceType(),
    color: color(),
  }).map(({ type, color }) => createPiece(type, color));

describe('Piece 属性测试', () => {
  /**
   * 属性：棋子创建的一致性
   * 对于任何类型和颜色，创建的棋子应该保持这些属性
   */
  describe('棋子创建一致性', () => {
    test('创建的棋子应该保持类型和颜色', () => {
      fc.assert(
        fc.property(pieceType(), color(), (type, pieceColor) => {
          const p = createPiece(type, pieceColor);
          expect(p.type).toBe(type);
          expect(p.color).toBe(pieceColor);
        }),
        { numRuns: 100 }
      );
    });

    test('相同参数创建的棋子应该相等', () => {
      fc.assert(
        fc.property(pieceType(), color(), (type, pieceColor) => {
          const piece1 = createPiece(type, pieceColor);
          const piece2 = createPiece(type, pieceColor);
          expect(piece1.equals(piece2)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：对手颜色的对称性
   * 对于任何颜色，获取对手颜色两次应该返回原始颜色
   */
  describe('对手颜色对称性', () => {
    test('连续两次获取对手颜色应该返回原始颜色', () => {
      fc.assert(
        fc.property(color(), (c) => {
          const opponent = getOpponentColor(c);
          const original = getOpponentColor(opponent);
          expect(original).toBe(c);
        }),
        { numRuns: 100 }
      );
    });

    test('对手颜色应该总是不同', () => {
      fc.assert(
        fc.property(color(), (c) => {
          const opponent = getOpponentColor(c);
          expect(opponent).not.toBe(c);
        }),
        { numRuns: 100 }
      );
    });

    test('只有两种颜色', () => {
      fc.assert(
        fc.property(color(), (c) => {
          const opponent = getOpponentColor(c);
          expect([Color.Red, Color.Black]).toContain(c);
          expect([Color.Red, Color.Black]).toContain(opponent);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：棋子符号的一致性
   * 红方棋子应该是大写，黑方棋子应该是小写
   */
  describe('棋子符号一致性', () => {
    test('红方棋子符号应该是大写字母', () => {
      fc.assert(
        fc.property(pieceType(), (type) => {
          const p = createPiece(type, Color.Red);
          const symbol = p.getSymbol();
          expect(symbol).toBe(symbol.toUpperCase());
          expect(symbol).toMatch(/^[A-Z]$/);
        }),
        { numRuns: 100 }
      );
    });

    test('黑方棋子符号应该是小写字母', () => {
      fc.assert(
        fc.property(pieceType(), (type) => {
          const p = createPiece(type, Color.Black);
          const symbol = p.getSymbol();
          expect(symbol).toBe(symbol.toLowerCase());
          expect(symbol).toMatch(/^[a-z]$/);
        }),
        { numRuns: 100 }
      );
    });

    test('相同类型不同颜色的棋子符号应该只有大小写不同', () => {
      fc.assert(
        fc.property(pieceType(), (type) => {
          const redPiece = createPiece(type, Color.Red);
          const blackPiece = createPiece(type, Color.Black);
          const redSymbol = redPiece.getSymbol();
          const blackSymbol = blackPiece.getSymbol();
          expect(redSymbol.toLowerCase()).toBe(blackSymbol);
          expect(blackSymbol.toUpperCase()).toBe(redSymbol);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：棋子相等性的传递性和对称性
   */
  describe('棋子相等性属性', () => {
    test('相等性应该是自反的（a.equals(a) = true）', () => {
      fc.assert(
        fc.property(piece(), (p) => {
          expect(p.equals(p)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    test('相等性应该是对称的（a.equals(b) = b.equals(a)）', () => {
      fc.assert(
        fc.property(piece(), piece(), (p1, p2) => {
          expect(p1.equals(p2)).toBe(p2.equals(p1));
        }),
        { numRuns: 100 }
      );
    });

    test('相等性应该是传递的（a=b, b=c => a=c）', () => {
      fc.assert(
        fc.property(pieceType(), color(), (type, pieceColor) => {
          const p1 = createPiece(type, pieceColor);
          const p2 = createPiece(type, pieceColor);
          const p3 = createPiece(type, pieceColor);

          if (p1.equals(p2) && p2.equals(p3)) {
            expect(p1.equals(p3)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('不同类型或颜色的棋子不应该相等', () => {
      fc.assert(
        fc.property(
          pieceType(),
          pieceType(),
          color(),
          color(),
          (type1, type2, color1, color2) => {
            const p1 = createPiece(type1, color1);
            const p2 = createPiece(type2, color2);

            if (type1 !== type2 || color1 !== color2) {
              expect(p1.equals(p2)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性：toString 应该总是返回非空字符串
   */
  describe('toString 属性', () => {
    test('toString 应该总是返回非空字符串', () => {
      fc.assert(
        fc.property(piece(), (p) => {
          const str = p.toString();
          expect(str).toBeTruthy();
          expect(str.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    test('toString 应该包含颜色信息', () => {
      fc.assert(
        fc.property(piece(), (p) => {
          const str = p.toString();
          const hasColor = str.includes('红') || str.includes('黑');
          expect(hasColor).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});
