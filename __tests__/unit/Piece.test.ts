import { Piece, createPiece, getOpponentColor } from '../../src/core/Piece';
import { Color, PieceType } from '../../src/core/types';

describe('Piece 单元测试', () => {
  describe('createPiece', () => {
    test('应该创建红方将', () => {
      const piece = createPiece(PieceType.General, Color.Red);
      expect(piece.type).toBe(PieceType.General);
      expect(piece.color).toBe(Color.Red);
    });

    test('应该创建黑方车', () => {
      const piece = createPiece(PieceType.Chariot, Color.Black);
      expect(piece.type).toBe(PieceType.Chariot);
      expect(piece.color).toBe(Color.Black);
    });

    test('应该创建所有类型的棋子', () => {
      const types = [
        PieceType.General,
        PieceType.Advisor,
        PieceType.Elephant,
        PieceType.Horse,
        PieceType.Chariot,
        PieceType.Cannon,
        PieceType.Soldier,
      ];

      types.forEach((type) => {
        const redPiece = createPiece(type, Color.Red);
        const blackPiece = createPiece(type, Color.Black);

        expect(redPiece.type).toBe(type);
        expect(redPiece.color).toBe(Color.Red);
        expect(blackPiece.type).toBe(type);
        expect(blackPiece.color).toBe(Color.Black);
      });
    });
  });

  describe('Piece.equals', () => {
    test('应该识别相同的棋子', () => {
      const piece1 = createPiece(PieceType.General, Color.Red);
      const piece2 = createPiece(PieceType.General, Color.Red);
      expect(piece1.equals(piece2)).toBe(true);
    });

    test('应该识别不同类型的棋子', () => {
      const piece1 = createPiece(PieceType.General, Color.Red);
      const piece2 = createPiece(PieceType.Advisor, Color.Red);
      expect(piece1.equals(piece2)).toBe(false);
    });

    test('应该识别不同颜色的棋子', () => {
      const piece1 = createPiece(PieceType.General, Color.Red);
      const piece2 = createPiece(PieceType.General, Color.Black);
      expect(piece1.equals(piece2)).toBe(false);
    });

    test('应该识别完全不同的棋子', () => {
      const piece1 = createPiece(PieceType.Chariot, Color.Red);
      const piece2 = createPiece(PieceType.Cannon, Color.Black);
      expect(piece1.equals(piece2)).toBe(false);
    });
  });

  describe('getOpponentColor', () => {
    test('红方的对手应该是黑方', () => {
      expect(getOpponentColor(Color.Red)).toBe(Color.Black);
    });

    test('黑方的对手应该是红方', () => {
      expect(getOpponentColor(Color.Black)).toBe(Color.Red);
    });

    test('应该可以连续切换', () => {
      const color1 = Color.Red;
      const color2 = getOpponentColor(color1);
      const color3 = getOpponentColor(color2);
      expect(color2).toBe(Color.Black);
      expect(color3).toBe(Color.Red);
    });
  });

  describe('Piece.getSymbol', () => {
    test('红方棋子应该返回大写字母', () => {
      expect(createPiece(PieceType.General, Color.Red).getSymbol()).toBe('G');
      expect(createPiece(PieceType.Advisor, Color.Red).getSymbol()).toBe('A');
      expect(createPiece(PieceType.Elephant, Color.Red).getSymbol()).toBe('E');
      expect(createPiece(PieceType.Horse, Color.Red).getSymbol()).toBe('H');
      expect(createPiece(PieceType.Chariot, Color.Red).getSymbol()).toBe('R');
      expect(createPiece(PieceType.Cannon, Color.Red).getSymbol()).toBe('C');
      expect(createPiece(PieceType.Soldier, Color.Red).getSymbol()).toBe('S');
    });

    test('黑方棋子应该返回小写字母', () => {
      expect(createPiece(PieceType.General, Color.Black).getSymbol()).toBe('g');
      expect(createPiece(PieceType.Advisor, Color.Black).getSymbol()).toBe('a');
      expect(createPiece(PieceType.Elephant, Color.Black).getSymbol()).toBe('e');
      expect(createPiece(PieceType.Horse, Color.Black).getSymbol()).toBe('h');
      expect(createPiece(PieceType.Chariot, Color.Black).getSymbol()).toBe('r');
      expect(createPiece(PieceType.Cannon, Color.Black).getSymbol()).toBe('c');
      expect(createPiece(PieceType.Soldier, Color.Black).getSymbol()).toBe('s');
    });
  });

  describe('Piece.toString', () => {
    test('应该返回可读的中文描述', () => {
      expect(createPiece(PieceType.General, Color.Red).toString()).toBe('红将/帅');
      expect(createPiece(PieceType.General, Color.Black).toString()).toBe('黑将/帅');
      expect(createPiece(PieceType.Chariot, Color.Red).toString()).toBe('红车');
      expect(createPiece(PieceType.Soldier, Color.Black).toString()).toBe('黑兵/卒');
    });
  });

  describe('Piece 不可变性', () => {
    test('棋子属性应该是只读的（TypeScript 编译时检查）', () => {
      const piece = createPiece(PieceType.General, Color.Red);
      
      // TypeScript 的 readonly 在编译时检查，运行时不会抛出错误
      // 但我们可以验证属性确实存在且可读
      expect(piece.type).toBe(PieceType.General);
      expect(piece.color).toBe(Color.Red);
      
      // 在严格模式下，尝试修改 readonly 属性会被 TypeScript 阻止
      // 这里我们验证属性是可读的
      expect(() => {
        const type = piece.type;
        const color = piece.color;
        expect(type).toBeDefined();
        expect(color).toBeDefined();
      }).not.toThrow();
    });
  });
});
