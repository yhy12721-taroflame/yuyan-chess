import { createInitialBoard } from '../../src/core/Board';
import { createPosition } from '../../src/core/Position';
import { Color, PieceType } from '../../src/core/types';

describe('初始棋盘设置测试', () => {
  let board: ReturnType<typeof createInitialBoard>;

  beforeEach(() => {
    board = createInitialBoard();
  });

  describe('棋子总数', () => {
    test('应该有 32 个棋子', () => {
      expect(board.getPieceCount()).toBe(32);
    });

    test('红方应该有 16 个棋子', () => {
      expect(board.getPieceCountByColor(Color.Red)).toBe(16);
    });

    test('黑方应该有 16 个棋子', () => {
      expect(board.getPieceCountByColor(Color.Black)).toBe(16);
    });
  });

  describe('红方棋子位置', () => {
    test('红方将应该在 (4, 0)', () => {
      const piece = board.getPiece(createPosition(4, 0));
      expect(piece).toBeDefined();
      expect(piece?.type).toBe(PieceType.General);
      expect(piece?.color).toBe(Color.Red);
    });

    test('红方士应该在 (3, 0) 和 (5, 0)', () => {
      const advisor1 = board.getPiece(createPosition(3, 0));
      const advisor2 = board.getPiece(createPosition(5, 0));

      expect(advisor1?.type).toBe(PieceType.Advisor);
      expect(advisor1?.color).toBe(Color.Red);
      expect(advisor2?.type).toBe(PieceType.Advisor);
      expect(advisor2?.color).toBe(Color.Red);
    });

    test('红方象应该在 (2, 0) 和 (6, 0)', () => {
      const elephant1 = board.getPiece(createPosition(2, 0));
      const elephant2 = board.getPiece(createPosition(6, 0));

      expect(elephant1?.type).toBe(PieceType.Elephant);
      expect(elephant1?.color).toBe(Color.Red);
      expect(elephant2?.type).toBe(PieceType.Elephant);
      expect(elephant2?.color).toBe(Color.Red);
    });

    test('红方马应该在 (1, 0) 和 (7, 0)', () => {
      const horse1 = board.getPiece(createPosition(1, 0));
      const horse2 = board.getPiece(createPosition(7, 0));

      expect(horse1?.type).toBe(PieceType.Horse);
      expect(horse1?.color).toBe(Color.Red);
      expect(horse2?.type).toBe(PieceType.Horse);
      expect(horse2?.color).toBe(Color.Red);
    });

    test('红方车应该在 (0, 0) 和 (8, 0)', () => {
      const chariot1 = board.getPiece(createPosition(0, 0));
      const chariot2 = board.getPiece(createPosition(8, 0));

      expect(chariot1?.type).toBe(PieceType.Chariot);
      expect(chariot1?.color).toBe(Color.Red);
      expect(chariot2?.type).toBe(PieceType.Chariot);
      expect(chariot2?.color).toBe(Color.Red);
    });

    test('红方炮应该在 (1, 2) 和 (7, 2)', () => {
      const cannon1 = board.getPiece(createPosition(1, 2));
      const cannon2 = board.getPiece(createPosition(7, 2));

      expect(cannon1?.type).toBe(PieceType.Cannon);
      expect(cannon1?.color).toBe(Color.Red);
      expect(cannon2?.type).toBe(PieceType.Cannon);
      expect(cannon2?.color).toBe(Color.Red);
    });

    test('红方兵应该在第 4 行的 0, 2, 4, 6, 8 列', () => {
      const files = [0, 2, 4, 6, 8];
      files.forEach((file) => {
        const soldier = board.getPiece(createPosition(file, 3));
        expect(soldier?.type).toBe(PieceType.Soldier);
        expect(soldier?.color).toBe(Color.Red);
      });
    });
  });

  describe('黑方棋子位置', () => {
    test('黑方将应该在 (4, 9)', () => {
      const piece = board.getPiece(createPosition(4, 9));
      expect(piece).toBeDefined();
      expect(piece?.type).toBe(PieceType.General);
      expect(piece?.color).toBe(Color.Black);
    });

    test('黑方士应该在 (3, 9) 和 (5, 9)', () => {
      const advisor1 = board.getPiece(createPosition(3, 9));
      const advisor2 = board.getPiece(createPosition(5, 9));

      expect(advisor1?.type).toBe(PieceType.Advisor);
      expect(advisor1?.color).toBe(Color.Black);
      expect(advisor2?.type).toBe(PieceType.Advisor);
      expect(advisor2?.color).toBe(Color.Black);
    });

    test('黑方象应该在 (2, 9) 和 (6, 9)', () => {
      const elephant1 = board.getPiece(createPosition(2, 9));
      const elephant2 = board.getPiece(createPosition(6, 9));

      expect(elephant1?.type).toBe(PieceType.Elephant);
      expect(elephant1?.color).toBe(Color.Black);
      expect(elephant2?.type).toBe(PieceType.Elephant);
      expect(elephant2?.color).toBe(Color.Black);
    });

    test('黑方马应该在 (1, 9) 和 (7, 9)', () => {
      const horse1 = board.getPiece(createPosition(1, 9));
      const horse2 = board.getPiece(createPosition(7, 9));

      expect(horse1?.type).toBe(PieceType.Horse);
      expect(horse1?.color).toBe(Color.Black);
      expect(horse2?.type).toBe(PieceType.Horse);
      expect(horse2?.color).toBe(Color.Black);
    });

    test('黑方车应该在 (0, 9) 和 (8, 9)', () => {
      const chariot1 = board.getPiece(createPosition(0, 9));
      const chariot2 = board.getPiece(createPosition(8, 9));

      expect(chariot1?.type).toBe(PieceType.Chariot);
      expect(chariot1?.color).toBe(Color.Black);
      expect(chariot2?.type).toBe(PieceType.Chariot);
      expect(chariot2?.color).toBe(Color.Black);
    });

    test('黑方炮应该在 (1, 7) 和 (7, 7)', () => {
      const cannon1 = board.getPiece(createPosition(1, 7));
      const cannon2 = board.getPiece(createPosition(7, 7));

      expect(cannon1?.type).toBe(PieceType.Cannon);
      expect(cannon1?.color).toBe(Color.Black);
      expect(cannon2?.type).toBe(PieceType.Cannon);
      expect(cannon2?.color).toBe(Color.Black);
    });

    test('黑方卒应该在第 7 行的 0, 2, 4, 6, 8 列', () => {
      const files = [0, 2, 4, 6, 8];
      files.forEach((file) => {
        const soldier = board.getPiece(createPosition(file, 6));
        expect(soldier?.type).toBe(PieceType.Soldier);
        expect(soldier?.color).toBe(Color.Black);
      });
    });
  });

  describe('河界区域', () => {
    test('第 5 和 6 行应该是空的（河界）', () => {
      for (let file = 0; file <= 8; file++) {
        expect(board.getPiece(createPosition(file, 4))).toBeUndefined();
        expect(board.getPiece(createPosition(file, 5))).toBeUndefined();
      }
    });
  });

  describe('棋子类型数量', () => {
    test('每方应该有 1 个将', () => {
      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      const redGenerals = redPieces.filter(([_, p]) => p.type === PieceType.General);
      const blackGenerals = blackPieces.filter(([_, p]) => p.type === PieceType.General);

      expect(redGenerals.length).toBe(1);
      expect(blackGenerals.length).toBe(1);
    });

    test('每方应该有 2 个士', () => {
      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      const redAdvisors = redPieces.filter(([_, p]) => p.type === PieceType.Advisor);
      const blackAdvisors = blackPieces.filter(([_, p]) => p.type === PieceType.Advisor);

      expect(redAdvisors.length).toBe(2);
      expect(blackAdvisors.length).toBe(2);
    });

    test('每方应该有 2 个象', () => {
      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      const redElephants = redPieces.filter(([_, p]) => p.type === PieceType.Elephant);
      const blackElephants = blackPieces.filter(([_, p]) => p.type === PieceType.Elephant);

      expect(redElephants.length).toBe(2);
      expect(blackElephants.length).toBe(2);
    });

    test('每方应该有 2 个马', () => {
      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      const redHorses = redPieces.filter(([_, p]) => p.type === PieceType.Horse);
      const blackHorses = blackPieces.filter(([_, p]) => p.type === PieceType.Horse);

      expect(redHorses.length).toBe(2);
      expect(blackHorses.length).toBe(2);
    });

    test('每方应该有 2 个车', () => {
      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      const redChariots = redPieces.filter(([_, p]) => p.type === PieceType.Chariot);
      const blackChariots = blackPieces.filter(([_, p]) => p.type === PieceType.Chariot);

      expect(redChariots.length).toBe(2);
      expect(blackChariots.length).toBe(2);
    });

    test('每方应该有 2 个炮', () => {
      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      const redCannons = redPieces.filter(([_, p]) => p.type === PieceType.Cannon);
      const blackCannons = blackPieces.filter(([_, p]) => p.type === PieceType.Cannon);

      expect(redCannons.length).toBe(2);
      expect(blackCannons.length).toBe(2);
    });

    test('每方应该有 5 个兵/卒', () => {
      const redPieces = board.getAllPieces(Color.Red);
      const blackPieces = board.getAllPieces(Color.Black);

      const redSoldiers = redPieces.filter(([_, p]) => p.type === PieceType.Soldier);
      const blackSoldiers = blackPieces.filter(([_, p]) => p.type === PieceType.Soldier);

      expect(redSoldiers.length).toBe(5);
      expect(blackSoldiers.length).toBe(5);
    });
  });

  describe('将的位置验证', () => {
    test('应该能找到红方将', () => {
      const redGeneralPos = board.findGeneral(Color.Red);
      expect(redGeneralPos).not.toBeNull();
      if (redGeneralPos !== null) {
        expect(redGeneralPos.file).toBe(4);
        expect(redGeneralPos.rank).toBe(0);
      }
    });

    test('应该能找到黑方将', () => {
      const blackGeneralPos = board.findGeneral(Color.Black);
      expect(blackGeneralPos).not.toBeNull();
      if (blackGeneralPos !== null) {
        expect(blackGeneralPos.file).toBe(4);
        expect(blackGeneralPos.rank).toBe(9);
      }
    });
  });
});
