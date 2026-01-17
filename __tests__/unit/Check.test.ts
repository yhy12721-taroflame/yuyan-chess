import { createInitialBoard, createEmptyBoard } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Piece } from '../../src/core/Piece';
import { Move } from '../../src/core/Move';
import { MoveValidator } from '../../src/core/MoveValidator';
import { Color, PieceType } from '../../src/core/types';

describe('将军检测 (Check Detection)', () => {
  describe('isInCheck - 基本将军检测', () => {
    it('初始棋盘中任何一方都不被将军', () => {
      const board = createInitialBoard();
      expect(MoveValidator.isInCheck(board, Color.Red)).toBe(false);
      expect(MoveValidator.isInCheck(board, Color.Black)).toBe(false);
    });

    it('车可以将军', () => {
      const board = createEmptyBoard();
      // 放置红方将
      let newBoard = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      // 放置黑方将
      newBoard = newBoard.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      // 放置黑方车在红方将的上方
      newBoard = newBoard.setPiece(new Position(4, 3), new Piece(PieceType.Chariot, Color.Black));

      // 红方被将军
      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(true);
      // 黑方没有被将军
      expect(MoveValidator.isInCheck(newBoard, Color.Black)).toBe(false);
    });

    it('炮可以将军（需要炮架）', () => {
      const board = createEmptyBoard();
      // 放置红方将
      let newBoard = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      // 放置黑方将
      newBoard = newBoard.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      // 放置黑方炮
      newBoard = newBoard.setPiece(new Position(4, 5), new Piece(PieceType.Cannon, Color.Black));
      // 放置炮架（黑方兵）
      newBoard = newBoard.setPiece(new Position(4, 2), new Piece(PieceType.Soldier, Color.Black));

      // 红方被将军
      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(true);
    });

    it('马可以将军', () => {
      const board = createEmptyBoard();
      // 放置红方将
      let newBoard = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      // 放置黑方将
      newBoard = newBoard.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      // 放置黑方马在可以攻击红方将的位置
      newBoard = newBoard.setPiece(new Position(3, 2), new Piece(PieceType.Horse, Color.Black));

      // 红方被将军
      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(true);
    });

    it('象不能将军（象不能过河）', () => {
      const board = createEmptyBoard();
      // 放置红方将
      let newBoard = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      // 放置黑方将
      newBoard = newBoard.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      // 放置黑方象（象不能过河，所以不能将军）
      newBoard = newBoard.setPiece(new Position(2, 7), new Piece(PieceType.Elephant, Color.Black));

      // 红方没有被将军
      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(false);
    });

    it('路径被阻挡时不被将军', () => {
      const board = createEmptyBoard();
      // 放置红方将
      let newBoard = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      // 放置黑方将
      newBoard = newBoard.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      // 放置黑方车
      newBoard = newBoard.setPiece(new Position(4, 5), new Piece(PieceType.Chariot, Color.Black));
      // 放置红方兵阻挡路径
      newBoard = newBoard.setPiece(new Position(4, 2), new Piece(PieceType.Soldier, Color.Red));

      // 红方没有被将军（路径被阻挡）
      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(false);
    });

    it('多个对方棋子时，任何一个可以将军就返回 true', () => {
      const board = createEmptyBoard();
      // 放置红方将
      let newBoard = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));
      // 放置黑方将
      newBoard = newBoard.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      // 放置黑方车（不能将军）
      newBoard = newBoard.setPiece(new Position(0, 5), new Piece(PieceType.Chariot, Color.Black));
      // 放置黑方马（可以将军）
      newBoard = newBoard.setPiece(new Position(3, 2), new Piece(PieceType.Horse, Color.Black));

      // 红方被将军
      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(true);
    });
  });

  describe('isInCheck - 边界情况', () => {
    it('棋盘上没有将/帅时返回 false', () => {
      const board = createEmptyBoard();
      // 只放置一个黑方车
      const newBoard = board.setPiece(new Position(4, 5), new Piece(PieceType.Chariot, Color.Black));

      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(false);
    });

    it('只有一个将/帅时返回 false', () => {
      const board = createEmptyBoard();
      // 只放置红方将
      const newBoard = board.setPiece(new Position(4, 0), new Piece(PieceType.General, Color.Red));

      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(false);
    });

    it('将/帅在棋盘角落时的将军检测', () => {
      const board = createEmptyBoard();
      // 放置红方将在角落
      let newBoard = board.setPiece(new Position(0, 0), new Piece(PieceType.General, Color.Red));
      // 放置黑方将
      newBoard = newBoard.setPiece(new Position(4, 9), new Piece(PieceType.General, Color.Black));
      // 放置黑方车
      newBoard = newBoard.setPiece(new Position(0, 5), new Piece(PieceType.Chariot, Color.Black));

      // 红方被将军
      expect(MoveValidator.isInCheck(newBoard, Color.Red)).toBe(true);
    });
  });
});
