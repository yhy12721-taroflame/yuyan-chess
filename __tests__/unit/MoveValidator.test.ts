import { Board, createEmptyBoard, createInitialBoard } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Piece } from '../../src/core/Piece';
import { Move } from '../../src/core/Move';
import { MoveValidator } from '../../src/core/MoveValidator';
import { Color, PieceType } from '../../src/core/types';

describe('移动验证器 - 各棋子规则', () => {
  describe('将/帅移动验证', () => {
    it('应该允许将向上移动一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));

      const move = new Move(new Position(4, 0), new Position(4, 1));
      expect(MoveValidator.validateGeneralMove(board, move, new Piece(PieceType.General, Color.Red))).toBe(true);
    });

    it('应该允许将向右移动一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));

      const move = new Move(new Position(4, 0), new Position(5, 0));
      expect(MoveValidator.validateGeneralMove(board, move, new Piece(PieceType.General, Color.Red))).toBe(true);
    });

    it('应该禁止将移动超过一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));

      const move = new Move(new Position(4, 0), new Position(4, 2));
      expect(MoveValidator.validateGeneralMove(board, move, new Piece(PieceType.General, Color.Red))).toBe(false);
    });

    it('应该禁止将斜向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));

      const move = new Move(new Position(4, 0), new Position(5, 1));
      expect(MoveValidator.validateGeneralMove(board, move, new Piece(PieceType.General, Color.Red))).toBe(false);
    });

    it('应该禁止将离开九宫', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 2), new Piece(PieceType.General, Color.Red));

      const move = new Move(new Position(4, 2), new Position(4, 3));
      expect(MoveValidator.validateGeneralMove(board, move, new Piece(PieceType.General, Color.Red))).toBe(false);
    });
  });

  describe('士/仕移动验证', () => {
    it('应该允许士斜向移动一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(3, 0), new Piece(PieceType.Advisor, Color.Red));

      const move = new Move(new Position(3, 0), new Position(4, 1));
      expect(MoveValidator.validateAdvisorMove(board, move, new Piece(PieceType.Advisor, Color.Red))).toBe(true);
    });

    it('应该禁止士直线移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(3, 0), new Piece(PieceType.Advisor, Color.Red));

      const move = new Move(new Position(3, 0), new Position(3, 1));
      expect(MoveValidator.validateAdvisorMove(board, move, new Piece(PieceType.Advisor, Color.Red))).toBe(false);
    });

    it('应该禁止士离开九宫', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(4, 2), new Piece(PieceType.Advisor, Color.Red));

      const move = new Move(new Position(4, 2), new Position(5, 3));
      expect(MoveValidator.validateAdvisorMove(board, move, new Piece(PieceType.Advisor, Color.Red))).toBe(false);
    });
  });

  describe('象/相移动验证', () => {
    it('应该允许象斜向移动两格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 0), new Piece(PieceType.Elephant, Color.Red));

      const move = new Move(new Position(2, 0), new Position(4, 2));
      expect(MoveValidator.validateElephantMove(board, move, new Piece(PieceType.Elephant, Color.Red))).toBe(true);
    });

    it('应该禁止象过河', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 4), new Piece(PieceType.Elephant, Color.Red));

      const move = new Move(new Position(2, 4), new Position(4, 6));
      expect(MoveValidator.validateElephantMove(board, move, new Piece(PieceType.Elephant, Color.Red))).toBe(false);
    });

    it('应该禁止象塞象眼', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 0), new Piece(PieceType.Elephant, Color.Red));
      board = board.setPiece(new Position(3, 1), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(2, 0), new Position(4, 2));
      expect(MoveValidator.validateElephantMove(board, move, new Piece(PieceType.Elephant, Color.Red))).toBe(false);
    });

    it('应该允许黑方象过河', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 9), new Piece(PieceType.Elephant, Color.Black));

      const move = new Move(new Position(2, 9), new Position(4, 7));
      expect(MoveValidator.validateElephantMove(board, move, new Piece(PieceType.Elephant, Color.Black))).toBe(true);
    });

    it('应该禁止黑方象过河到红方', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(2, 5), new Piece(PieceType.Elephant, Color.Black));

      const move = new Move(new Position(2, 5), new Position(4, 3));
      expect(MoveValidator.validateElephantMove(board, move, new Piece(PieceType.Elephant, Color.Black))).toBe(false);
    });
  });

  describe('马移动验证', () => {
    it('应该允许马日字形移动（横2纵1）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 0), new Piece(PieceType.Horse, Color.Red));

      const move = new Move(new Position(1, 0), new Position(3, 1));
      expect(MoveValidator.validateHorseMove(board, move, new Piece(PieceType.Horse, Color.Red))).toBe(true);
    });

    it('应该允许马日字形移动（纵2横1）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 0), new Piece(PieceType.Horse, Color.Red));

      const move = new Move(new Position(1, 0), new Position(2, 2));
      expect(MoveValidator.validateHorseMove(board, move, new Piece(PieceType.Horse, Color.Red))).toBe(true);
    });

    it('应该禁止马蹩马腿', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 0), new Piece(PieceType.Horse, Color.Red));
      board = board.setPiece(new Position(2, 0), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(1, 0), new Position(3, 1));
      expect(MoveValidator.validateHorseMove(board, move, new Piece(PieceType.Horse, Color.Red))).toBe(false);
    });

    it('应该禁止马直线移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 0), new Piece(PieceType.Horse, Color.Red));

      const move = new Move(new Position(1, 0), new Position(1, 2));
      expect(MoveValidator.validateHorseMove(board, move, new Piece(PieceType.Horse, Color.Red))).toBe(false);
    });
  });

  describe('车移动验证', () => {
    it('应该允许车横向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 0), new Piece(PieceType.Chariot, Color.Red));

      const move = new Move(new Position(0, 0), new Position(8, 0));
      expect(MoveValidator.validateChariotMove(board, move, new Piece(PieceType.Chariot, Color.Red))).toBe(true);
    });

    it('应该允许车纵向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 0), new Piece(PieceType.Chariot, Color.Red));

      const move = new Move(new Position(0, 0), new Position(0, 9));
      expect(MoveValidator.validateChariotMove(board, move, new Piece(PieceType.Chariot, Color.Red))).toBe(true);
    });

    it('应该禁止车有阻挡', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 0), new Piece(PieceType.Chariot, Color.Red));
      board = board.setPiece(new Position(4, 0), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(0, 0), new Position(8, 0));
      expect(MoveValidator.validateChariotMove(board, move, new Piece(PieceType.Chariot, Color.Red))).toBe(false);
    });

    it('应该禁止车斜向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 0), new Piece(PieceType.Chariot, Color.Red));

      const move = new Move(new Position(0, 0), new Position(4, 4));
      expect(MoveValidator.validateChariotMove(board, move, new Piece(PieceType.Chariot, Color.Red))).toBe(false);
    });
  });

  describe('炮移动验证', () => {
    it('应该允许炮非吃子移动（无阻挡）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 2), new Piece(PieceType.Cannon, Color.Red));

      const move = new Move(new Position(1, 2), new Position(1, 5));
      expect(MoveValidator.validateCannonMove(board, move, new Piece(PieceType.Cannon, Color.Red))).toBe(true);
    });

    it('应该禁止炮非吃子移动（有阻挡）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 2), new Piece(PieceType.Cannon, Color.Red));
      board = board.setPiece(new Position(1, 4), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(1, 2), new Position(1, 5));
      expect(MoveValidator.validateCannonMove(board, move, new Piece(PieceType.Cannon, Color.Red))).toBe(false);
    });

    it('应该允许炮吃子移动（恰好一个炮架）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 2), new Piece(PieceType.Cannon, Color.Red));
      board = board.setPiece(new Position(1, 4), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(1, 6), new Piece(PieceType.Chariot, Color.Black));

      const move = new Move(new Position(1, 2), new Position(1, 6));
      expect(MoveValidator.validateCannonMove(board, move, new Piece(PieceType.Cannon, Color.Red))).toBe(true);
    });

    it('应该禁止炮吃子移动（多个炮架）', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(1, 2), new Piece(PieceType.Cannon, Color.Red));
      board = board.setPiece(new Position(1, 4), new Piece(PieceType.Soldier, Color.Red));
      board = board.setPiece(new Position(1, 5), new Piece(PieceType.Soldier, Color.Black));
      board = board.setPiece(new Position(1, 6), new Piece(PieceType.Chariot, Color.Black));

      const move = new Move(new Position(1, 2), new Position(1, 6));
      expect(MoveValidator.validateCannonMove(board, move, new Piece(PieceType.Cannon, Color.Red))).toBe(false);
    });
  });

  describe('兵/卒移动验证', () => {
    it('应该允许兵过河前前进一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 3), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(0, 3), new Position(0, 4));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Red))).toBe(true);
    });

    it('应该禁止兵过河前横向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 3), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(0, 3), new Position(1, 3));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Red))).toBe(false);
    });

    it('应该允许兵过河后前进一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 5), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(0, 5), new Position(0, 6));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Red))).toBe(true);
    });

    it('应该允许兵过河后横向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 5), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(0, 5), new Position(1, 5));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Red))).toBe(true);
    });

    it('应该禁止兵后退', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 5), new Piece(PieceType.Soldier, Color.Red));

      const move = new Move(new Position(0, 5), new Position(0, 4));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Red))).toBe(false);
    });

    it('应该允许卒过河前前进一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 6), new Piece(PieceType.Soldier, Color.Black));

      const move = new Move(new Position(0, 6), new Position(0, 5));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Black))).toBe(true);
    });

    it('应该禁止卒过河前横向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 6), new Piece(PieceType.Soldier, Color.Black));

      const move = new Move(new Position(0, 6), new Position(1, 6));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Black))).toBe(false);
    });

    it('应该允许卒过河后前进一格', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 4), new Piece(PieceType.Soldier, Color.Black));

      const move = new Move(new Position(0, 4), new Position(0, 3));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Black))).toBe(true);
    });

    it('应该允许卒过河后横向移动', () => {
      let board = createEmptyBoard();
      board = board.setPiece(new Position(0, 4), new Piece(PieceType.Soldier, Color.Black));

      const move = new Move(new Position(0, 4), new Position(1, 4));
      expect(MoveValidator.validateSoldierMove(board, move, new Piece(PieceType.Soldier, Color.Black))).toBe(true);
    });
  });

  describe('综合移动合法性检查', () => {
    it('应该允许初始棋盘上的合法移动', () => {
      const board = createInitialBoard();

      // 红方兵前进
      const move = new Move(new Position(0, 3), new Position(0, 4));
      expect(MoveValidator.isMoveLegal(board, move, Color.Red)).toBe(true);
    });

    it('应该禁止移动对方棋子', () => {
      const board = createInitialBoard();

      // 尝试移动黑方棋子
      const move = new Move(new Position(0, 6), new Position(0, 5));
      expect(MoveValidator.isMoveLegal(board, move, Color.Red)).toBe(false);
    });

    it('应该禁止移动到己方棋子位置', () => {
      const board = createInitialBoard();

      // 尝试移动红方兵到红方车的位置
      const move = new Move(new Position(0, 3), new Position(0, 0));
      expect(MoveValidator.isMoveLegal(board, move, Color.Red)).toBe(false);
    });
  });

  describe('获取合法移动', () => {
    it('应该返回初始棋盘上红方兵的合法移动', () => {
      const board = createInitialBoard();

      const legalMoves = MoveValidator.getLegalMoves(board, new Position(0, 3), Color.Red);
      expect(legalMoves.length).toBeGreaterThan(0);
      expect(legalMoves.some(pos => pos.file === 0 && pos.rank === 4)).toBe(true);
    });

    it('应该返回空数组如果位置没有己方棋子', () => {
      const board = createInitialBoard();

      const legalMoves = MoveValidator.getLegalMoves(board, new Position(4, 4), Color.Red);
      expect(legalMoves.length).toBe(0);
    });

    it('应该返回空数组如果尝试移动对方棋子', () => {
      const board = createInitialBoard();

      const legalMoves = MoveValidator.getLegalMoves(board, new Position(0, 6), Color.Red);
      expect(legalMoves.length).toBe(0);
    });
  });
});
