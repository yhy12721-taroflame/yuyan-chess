"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/core/Position.ts
  var Position = class {
    // 行：0-9
    constructor(file, rank) {
      this.file = file;
      this.rank = rank;
    }
    /**
     * 判断两个位置是否相等
     */
    equals(other) {
      return this.file === other.file && this.rank === other.rank;
    }
    /**
     * 返回位置的字符串表示
     */
    toString() {
      return `(${this.file}, ${this.rank})`;
    }
  };
  function isInPalace(pos, color) {
    const inFileRange = pos.file >= 3 && pos.file <= 5;
    if (color === "RED" /* Red */) {
      return pos.rank <= 2 && inFileRange;
    } else {
      return pos.rank >= 7 && inFileRange;
    }
  }
  function hasCrossedRiver(pos, color) {
    if (color === "RED" /* Red */) {
      return pos.rank >= 5;
    } else {
      return pos.rank <= 4;
    }
  }
  function isValid(pos) {
    return pos.file >= 0 && pos.file <= 8 && pos.rank >= 0 && pos.rank <= 9;
  }

  // src/core/Piece.ts
  var Piece = class {
    constructor(type, color) {
      this.type = type;
      this.color = color;
    }
    /**
     * 判断两个棋子是否相等
     */
    equals(other) {
      return this.type === other.type && this.color === other.color;
    }
    /**
     * 返回棋子的字符串表示
     */
    toString() {
      const typeNames = {
        ["GENERAL" /* General */]: "\u5C06/\u5E05",
        ["ADVISOR" /* Advisor */]: "\u58EB/\u4ED5",
        ["ELEPHANT" /* Elephant */]: "\u8C61/\u76F8",
        ["HORSE" /* Horse */]: "\u9A6C",
        ["CHARIOT" /* Chariot */]: "\u8F66",
        ["CANNON" /* Cannon */]: "\u70AE",
        ["SOLDIER" /* Soldier */]: "\u5175/\u5352"
      };
      const colorName = this.color === "RED" /* Red */ ? "\u7EA2" : "\u9ED1";
      return `${colorName}${typeNames[this.type]}`;
    }
    /**
     * 获取棋子的符号表示（用于棋盘渲染）
     * 红方：大写字母，黑方：小写字母
     */
    getSymbol() {
      const symbols = {
        ["GENERAL" /* General */]: "G",
        ["ADVISOR" /* Advisor */]: "A",
        ["ELEPHANT" /* Elephant */]: "E",
        ["HORSE" /* Horse */]: "H",
        ["CHARIOT" /* Chariot */]: "R",
        ["CANNON" /* Cannon */]: "C",
        ["SOLDIER" /* Soldier */]: "S"
      };
      const symbol = symbols[this.type];
      return this.color === "BLACK" /* Black */ ? symbol.toLowerCase() : symbol;
    }
  };

  // src/core/Board.ts
  var Board = class _Board {
    constructor(pieces = /* @__PURE__ */ new Map()) {
      this.pieces = new Map(pieces);
    }
    /**
     * 将位置转换为字符串键（用于 Map）
     */
    static positionToKey(pos) {
      return `${pos.file},${pos.rank}`;
    }
    /**
     * 获取指定位置的棋子
     * @param pos 位置
     * @returns 棋子或 undefined
     */
    getPiece(pos) {
      return this.pieces.get(_Board.positionToKey(pos));
    }
    /**
     * 在指定位置放置棋子（不可变操作，返回新棋盘）
     * @param pos 位置
     * @param piece 棋子（null 表示移除棋子）
     * @returns 新的棋盘
     */
    setPiece(pos, piece) {
      const newPieces = new Map(this.pieces);
      const key = _Board.positionToKey(pos);
      if (piece === null) {
        newPieces.delete(key);
      } else {
        newPieces.set(key, piece);
      }
      return new _Board(newPieces);
    }
    /**
     * 查找指定颜色的将/帅位置
     * @param color 颜色
     * @returns 将/帅的位置，如果找不到返回 null
     */
    findGeneral(color) {
      for (const [key, piece] of this.pieces.entries()) {
        if (piece.type === "GENERAL" /* General */ && piece.color === color) {
          const [file, rank] = key.split(",").map(Number);
          return new Position(file, rank);
        }
      }
      return null;
    }
    /**
     * 获取指定颜色的所有棋子及其位置
     * @param color 颜色
     * @returns 位置和棋子的数组
     */
    getAllPieces(color) {
      const result = [];
      for (const [key, piece] of this.pieces.entries()) {
        if (piece.color === color) {
          const [file, rank] = key.split(",").map(Number);
          result.push([new Position(file, rank), piece]);
        }
      }
      return result;
    }
    /**
     * 获取棋盘上所有棋子的数量
     */
    getPieceCount() {
      return this.pieces.size;
    }
    /**
     * 获取指定颜色的棋子数量
     */
    getPieceCountByColor(color) {
      let count = 0;
      for (const piece of this.pieces.values()) {
        if (piece.color === color) {
          count++;
        }
      }
      return count;
    }
    /**
     * 检查棋盘是否为空
     */
    isEmpty() {
      return this.pieces.size === 0;
    }
    /**
     * 清空棋盘（返回新的空棋盘）
     */
    clear() {
      return new _Board();
    }
    /**
     * 渲染棋盘为字符串（用于调试和显示）
     * @returns 棋盘的字符串表示
     */
    render() {
      let output = "";
      for (let rank = 9; rank >= 0; rank--) {
        output += `${rank} `;
        for (let file = 0; file <= 8; file++) {
          const pos = new Position(file, rank);
          const piece = this.getPiece(pos);
          if (piece) {
            output += piece.getSymbol() + " ";
          } else {
            if (rank === 4 || rank === 5) {
              output += "~ ";
            } else {
              output += ". ";
            }
          }
        }
        output += "\n";
      }
      output += "  0 1 2 3 4 5 6 7 8\n";
      return output;
    }
    /**
     * 克隆棋盘（返回相同内容的新棋盘）
     */
    clone() {
      return new _Board(this.pieces);
    }
    /**
     * 检查两个位置之间的路径是否畅通（不包括起点和终点）
     * 只适用于直线路径（横向、纵向或斜向）
     * @param from 起始位置
     * @param to 目标位置
     * @returns 如果路径畅通返回 true，否则返回 false
     */
    isPathClear(from, to) {
      const positions = this.getPositionsBetween(from, to);
      for (const pos of positions) {
        if (this.getPiece(pos) !== void 0) {
          return false;
        }
      }
      return true;
    }
    /**
     * 计算两个位置之间的棋子数量（不包括起点和终点）
     * @param from 起始位置
     * @param to 目标位置
     * @returns 中间的棋子数量
     */
    countPiecesBetween(from, to) {
      const positions = this.getPositionsBetween(from, to);
      let count = 0;
      for (const pos of positions) {
        if (this.getPiece(pos) !== void 0) {
          count++;
        }
      }
      return count;
    }
    /**
     * 获取两个位置之间的所有位置（不包括起点和终点）
     * 只适用于直线路径（横向、纵向或斜向）
     * @param from 起始位置
     * @param to 目标位置
     * @returns 中间位置的数组
     */
    getPositionsBetween(from, to) {
      const positions = [];
      const fileDelta = to.file - from.file;
      const rankDelta = to.rank - from.rank;
      const fileStep = fileDelta === 0 ? 0 : fileDelta > 0 ? 1 : -1;
      const rankStep = rankDelta === 0 ? 0 : rankDelta > 0 ? 1 : -1;
      const steps = Math.max(Math.abs(fileDelta), Math.abs(rankDelta));
      for (let i = 1; i < steps; i++) {
        const file = from.file + fileStep * i;
        const rank = from.rank + rankStep * i;
        positions.push(new Position(file, rank));
      }
      return positions;
    }
    /**
     * 检查两个将/帅是否对面（在同一列且中间无棋子）
     * 这是象棋的特殊规则：两个将/帅不能直接对面
     * @returns 如果两个将/帅对面返回 true，否则返回 false
     */
    areGeneralsFacing() {
      const redGeneralPos = this.findGeneral("RED" /* Red */);
      const blackGeneralPos = this.findGeneral("BLACK" /* Black */);
      if (redGeneralPos === null || blackGeneralPos === null) {
        return false;
      }
      if (redGeneralPos.file !== blackGeneralPos.file) {
        return false;
      }
      return this.isPathClear(redGeneralPos, blackGeneralPos);
    }
  };
  function createEmptyBoard() {
    return new Board();
  }
  function createInitialBoard() {
    let board = createEmptyBoard();
    board = board.setPiece(
      new Position(4, 0),
      new Piece("GENERAL" /* General */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(3, 0),
      new Piece("ADVISOR" /* Advisor */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(5, 0),
      new Piece("ADVISOR" /* Advisor */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(2, 0),
      new Piece("ELEPHANT" /* Elephant */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(6, 0),
      new Piece("ELEPHANT" /* Elephant */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(1, 0),
      new Piece("HORSE" /* Horse */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(7, 0),
      new Piece("HORSE" /* Horse */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(0, 0),
      new Piece("CHARIOT" /* Chariot */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(8, 0),
      new Piece("CHARIOT" /* Chariot */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(1, 2),
      new Piece("CANNON" /* Cannon */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(7, 2),
      new Piece("CANNON" /* Cannon */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(0, 3),
      new Piece("SOLDIER" /* Soldier */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(2, 3),
      new Piece("SOLDIER" /* Soldier */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(4, 3),
      new Piece("SOLDIER" /* Soldier */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(6, 3),
      new Piece("SOLDIER" /* Soldier */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(8, 3),
      new Piece("SOLDIER" /* Soldier */, "RED" /* Red */)
    );
    board = board.setPiece(
      new Position(4, 9),
      new Piece("GENERAL" /* General */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(3, 9),
      new Piece("ADVISOR" /* Advisor */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(5, 9),
      new Piece("ADVISOR" /* Advisor */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(2, 9),
      new Piece("ELEPHANT" /* Elephant */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(6, 9),
      new Piece("ELEPHANT" /* Elephant */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(1, 9),
      new Piece("HORSE" /* Horse */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(7, 9),
      new Piece("HORSE" /* Horse */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(0, 9),
      new Piece("CHARIOT" /* Chariot */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(8, 9),
      new Piece("CHARIOT" /* Chariot */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(1, 7),
      new Piece("CANNON" /* Cannon */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(7, 7),
      new Piece("CANNON" /* Cannon */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(0, 6),
      new Piece("SOLDIER" /* Soldier */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(2, 6),
      new Piece("SOLDIER" /* Soldier */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(4, 6),
      new Piece("SOLDIER" /* Soldier */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(6, 6),
      new Piece("SOLDIER" /* Soldier */, "BLACK" /* Black */)
    );
    board = board.setPiece(
      new Position(8, 6),
      new Piece("SOLDIER" /* Soldier */, "BLACK" /* Black */)
    );
    return board;
  }

  // src/core/Move.ts
  var Move = class {
    constructor(from, to) {
      this.from = from;
      this.to = to;
    }
    /**
     * 判断两个移动是否相等
     */
    equals(other) {
      return this.from.equals(other.from) && this.to.equals(other.to);
    }
    /**
     * 返回移动的字符串表示
     */
    toString() {
      return `${this.from.toString()} -> ${this.to.toString()}`;
    }
    /**
     * 计算移动的文件（列）距离
     */
    getFileDelta() {
      return Math.abs(this.to.file - this.from.file);
    }
    /**
     * 计算移动的等级（行）距离
     */
    getRankDelta() {
      return Math.abs(this.to.rank - this.from.rank);
    }
    /**
     * 判断是否是水平移动（同一行）
     */
    isHorizontal() {
      return this.from.rank === this.to.rank && this.from.file !== this.to.file;
    }
    /**
     * 判断是否是垂直移动（同一列）
     */
    isVertical() {
      return this.from.file === this.to.file && this.from.rank !== this.to.rank;
    }
    /**
     * 判断是否是对角线移动
     */
    isDiagonal() {
      return this.getFileDelta() === this.getRankDelta() && this.getFileDelta() > 0;
    }
    /**
     * 判断是否是直线移动（水平或垂直）
     */
    isStraight() {
      return this.isHorizontal() || this.isVertical();
    }
    /**
     * 获取移动方向的文件（列）符号（-1, 0, 1）
     */
    getFileDirection() {
      return Math.sign(this.to.file - this.from.file);
    }
    /**
     * 获取移动方向的等级（行）符号（-1, 0, 1）
     */
    getRankDirection() {
      return Math.sign(this.to.rank - this.from.rank);
    }
  };

  // src/core/MoveValidator.ts
  var MoveValidator = class {
    /**
     * 验证将/帅的移动
     * 规则：
     * - 只能移动一格（横向或纵向）
     * - 必须留在九宫内
     */
    static validateGeneralMove(board, move, piece) {
      const deltaFile = Math.abs(move.to.file - move.from.file);
      const deltaRank = Math.abs(move.to.rank - move.from.rank);
      if (!(deltaFile === 1 && deltaRank === 0 || deltaFile === 0 && deltaRank === 1)) {
        return false;
      }
      if (!isInPalace(move.to, piece.color)) {
        return false;
      }
      return true;
    }
    /**
     * 验证士/仕的移动
     * 规则：
     * - 只能斜向移动一格
     * - 必须留在九宫内
     */
    static validateAdvisorMove(board, move, piece) {
      const deltaFile = Math.abs(move.to.file - move.from.file);
      const deltaRank = Math.abs(move.to.rank - move.from.rank);
      if (!(deltaFile === 1 && deltaRank === 1)) {
        return false;
      }
      if (!isInPalace(move.to, piece.color)) {
        return false;
      }
      return true;
    }
    /**
     * 验证象/相的移动
     * 规则：
     * - 只能斜向移动两格
     * - 不能过河
     * - 不能塞象眼（中间位置必须无棋子）
     */
    static validateElephantMove(board, move, piece) {
      const deltaFile = Math.abs(move.to.file - move.from.file);
      const deltaRank = Math.abs(move.to.rank - move.from.rank);
      if (!(deltaFile === 2 && deltaRank === 2)) {
        return false;
      }
      if (piece.color === "RED" /* Red */ && move.to.rank >= 5) {
        return false;
      }
      if (piece.color === "BLACK" /* Black */ && move.to.rank <= 4) {
        return false;
      }
      const midFile = (move.from.file + move.to.file) / 2;
      const midRank = (move.from.rank + move.to.rank) / 2;
      const midPos = new Position(midFile, midRank);
      if (board.getPiece(midPos) !== void 0) {
        return false;
      }
      return true;
    }
    /**
     * 验证马的移动
     * 规则：
     * - 日字形移动（一步横/纵，一步斜）
     * - 不能蹩马腿（第一步的位置必须无棋子）
     */
    static validateHorseMove(board, move, piece) {
      const deltaFile = Math.abs(move.to.file - move.from.file);
      const deltaRank = Math.abs(move.to.rank - move.from.rank);
      if (!(deltaFile === 2 && deltaRank === 1 || deltaFile === 1 && deltaRank === 2)) {
        return false;
      }
      let blockingPos;
      if (deltaFile === 2) {
        const blockingFile = move.from.file + (move.to.file > move.from.file ? 1 : -1);
        blockingPos = new Position(blockingFile, move.from.rank);
      } else {
        const blockingRank = move.from.rank + (move.to.rank > move.from.rank ? 1 : -1);
        blockingPos = new Position(move.from.file, blockingRank);
      }
      if (board.getPiece(blockingPos) !== void 0) {
        return false;
      }
      return true;
    }
    /**
     * 验证车的移动
     * 规则：
     * - 只能直线移动（横向或纵向）
     * - 路径必须无阻挡
     */
    static validateChariotMove(board, move, piece) {
      if (move.from.file !== move.to.file && move.from.rank !== move.to.rank) {
        return false;
      }
      return board.isPathClear(move.from, move.to);
    }
    /**
     * 验证炮的移动
     * 规则：
     * - 只能直线移动（横向或纵向）
     * - 非吃子移动：路径必须无阻挡
     * - 吃子移动：路径中必须恰好有一个棋子（炮架）
     */
    static validateCannonMove(board, move, piece) {
      if (move.from.file !== move.to.file && move.from.rank !== move.to.rank) {
        return false;
      }
      const targetPiece = board.getPiece(move.to);
      const piecesBetween = board.countPiecesBetween(move.from, move.to);
      if (targetPiece === void 0) {
        return piecesBetween === 0;
      } else {
        return piecesBetween === 1;
      }
    }
    /**
     * 验证兵/卒的移动
     * 规则：
     * - 过河前：只能前进一格
     * - 过河后：可以前进或横向移动一格
     * - 不能后退
     */
    static validateSoldierMove(board, move, piece) {
      const deltaFile = Math.abs(move.to.file - move.from.file);
      let deltaRank = move.to.rank - move.from.rank;
      if (piece.color === "BLACK" /* Black */) {
        deltaRank = -deltaRank;
      }
      if (deltaRank < 0) {
        return false;
      }
      if (deltaFile + deltaRank !== 1) {
        return false;
      }
      const hasCrossed = hasCrossedRiver(move.from, piece.color);
      if (!hasCrossed) {
        return deltaRank === 1 && deltaFile === 0;
      } else {
        return true;
      }
    }
    /**
     * 验证棋子的移动是否符合该棋子的规则
     */
    static validatePieceMovement(board, move, piece) {
      switch (piece.type) {
        case "GENERAL" /* General */:
          return this.validateGeneralMove(board, move, piece);
        case "ADVISOR" /* Advisor */:
          return this.validateAdvisorMove(board, move, piece);
        case "ELEPHANT" /* Elephant */:
          return this.validateElephantMove(board, move, piece);
        case "HORSE" /* Horse */:
          return this.validateHorseMove(board, move, piece);
        case "CHARIOT" /* Chariot */:
          return this.validateChariotMove(board, move, piece);
        case "CANNON" /* Cannon */:
          return this.validateCannonMove(board, move, piece);
        case "SOLDIER" /* Soldier */:
          return this.validateSoldierMove(board, move, piece);
        default:
          return false;
      }
    }
    /**
     * 验证移动是否合法（综合所有规则）
     * 检查：
     * 1. 起点有己方棋子
     * 2. 终点在棋盘内
     * 3. 终点不是己方棋子
     * 4. 棋子移动规则
     * 5. 不会导致将帅对面
     * 6. 不会导致己方被将军（暂时不检查，因为还没实现将军检测）
     */
    static isMoveLegal(board, move, playerColor) {
      const piece = board.getPiece(move.from);
      if (piece === void 0 || piece.color !== playerColor) {
        return false;
      }
      if (!isValid(move.to)) {
        return false;
      }
      const targetPiece = board.getPiece(move.to);
      if (targetPiece !== void 0 && targetPiece.color === playerColor) {
        return false;
      }
      if (!this.validatePieceMovement(board, move, piece)) {
        return false;
      }
      let newBoard = board.setPiece(move.from, null);
      newBoard = newBoard.setPiece(move.to, piece);
      if (newBoard.areGeneralsFacing()) {
        return false;
      }
      return true;
    }
    /**
     * 检查指定颜色的玩家是否被将军
     * 将军：对方的棋子可以在下一步吃掉己方的将/帅
     */
    static isInCheck(board, playerColor) {
      const generalPos = board.findGeneral(playerColor);
      if (generalPos === null) {
        return false;
      }
      const opponentColor = playerColor === "RED" /* Red */ ? "BLACK" /* Black */ : "RED" /* Red */;
      const opponentPieces = board.getAllPieces(opponentColor);
      for (const [pos, piece] of opponentPieces) {
        if (piece.type === "GENERAL" /* General */) {
          continue;
        }
        const move = new Move(pos, generalPos);
        if (this.validatePieceMovement(board, move, piece)) {
          return true;
        }
      }
      return false;
    }
    /**
     * 获取指定棋子的所有合法移动
     */
    static getLegalMoves(board, pos, playerColor) {
      const piece = board.getPiece(pos);
      if (piece === void 0 || piece.color !== playerColor) {
        return [];
      }
      const legalMoves = [];
      for (let file = 0; file <= 8; file++) {
        for (let rank = 0; rank <= 9; rank++) {
          const targetPos = new Position(file, rank);
          const move = new Move(pos, targetPos);
          if (this.isMoveLegal(board, move, playerColor)) {
            legalMoves.push(targetPos);
          }
        }
      }
      return legalMoves;
    }
    /**
     * 获取指定玩家的所有合法移动
     */
    static getAllLegalMoves(board, playerColor) {
      const legalMoves = [];
      const pieces = board.getAllPieces(playerColor);
      for (const [pos, piece] of pieces) {
        const targetPositions = this.getLegalMoves(board, pos, playerColor);
        for (const targetPos of targetPositions) {
          legalMoves.push(new Move(pos, targetPos));
        }
      }
      return legalMoves;
    }
  };

  // src/app.ts
  var PIECE_NAMES = {
    ["GENERAL" /* General */]: { red: "\u5E05", black: "\u5C06" },
    ["ADVISOR" /* Advisor */]: { red: "\u4ED5", black: "\u58EB" },
    ["ELEPHANT" /* Elephant */]: { red: "\u76F8", black: "\u8C61" },
    ["HORSE" /* Horse */]: { red: "\u9A6C", black: "\u9A6C" },
    ["CHARIOT" /* Chariot */]: { red: "\u8F66", black: "\u8F66" },
    ["CANNON" /* Cannon */]: { red: "\u70AE", black: "\u70AE" },
    ["SOLDIER" /* Soldier */]: { red: "\u5175", black: "\u5352" }
  };
  var XiangqiUI = class {
    constructor() {
      this.board = createInitialBoard();
      this.selectedPosition = null;
      this.legalMoves = [];
      this.currentPlayer = "RED" /* Red */;
      this.invalidClickOverlay = null;
      this.isInCheck = false;
      // 棋盘尺寸参数
      this.PADDING = 40;
      // 边距
      this.PIECE_RADIUS = 22;
      // 棋子半径
      // 计算的尺寸
      this.boardWidth = 0;
      this.boardHeight = 0;
      this.canvas = document.getElementById("board-canvas");
      this.boardElement = document.querySelector(".board");
      this.ctx = this.canvas.getContext("2d");
      this.initCanvas();
      this.updateBoardStyle();
      this.render();
      this.updateInfo();
      this.canvas.addEventListener("click", (e) => this.handleClick(e));
      window.addEventListener("resize", () => {
        this.initCanvas();
        this.render();
      });
    }
    /**
     * 重新初始化 Canvas（用于显示游戏界面后）
     */
    reinitialize() {
      this.initCanvas();
      this.render();
    }
    /**
     * 更新棋盘样式（背景颜色）
     */
    updateBoardStyle() {
      this.boardElement.classList.remove("red-turn", "black-turn", "piece-selected", "in-check");
      document.body.classList.remove("red-turn-bg", "black-turn-bg", "piece-selected-bg", "in-check-bg");
      if (this.isInCheck) {
        this.boardElement.classList.add("in-check");
        document.body.classList.add("in-check-bg");
      } else if (this.selectedPosition) {
        this.boardElement.classList.add("piece-selected");
        document.body.classList.add("piece-selected-bg");
      } else {
        if (this.currentPlayer === "RED" /* Red */) {
          this.boardElement.classList.add("red-turn");
          document.body.classList.add("red-turn-bg");
        } else {
          this.boardElement.classList.add("black-turn");
          document.body.classList.add("black-turn-bg");
        }
      }
    }
    /**
     * 初始化Canvas尺寸
     */
    initCanvas() {
      const container = this.canvas.parentElement;
      const containerWidth = container.clientWidth;
      const availableWidth = containerWidth - this.PADDING * 2;
      const cellSize = Math.floor(availableWidth / 8);
      this.boardWidth = cellSize * 8 + this.PADDING * 2;
      this.boardHeight = cellSize * 9 + this.PADDING * 2;
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.boardWidth * dpr;
      this.canvas.height = this.boardHeight * dpr;
      this.canvas.style.width = `${this.boardWidth}px`;
      this.canvas.style.height = `${this.boardHeight}px`;
      this.ctx.scale(dpr, dpr);
    }
    /**
     * 将棋盘坐标转换为Canvas坐标
     */
    boardToCanvas(file, rank) {
      const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
      return {
        x: this.PADDING + file * cellSize,
        y: this.PADDING + (9 - rank) * cellSize
        // rank从下往上，Canvas从上往下
      };
    }
    /**
     * 将Canvas坐标转换为棋盘坐标
     */
    canvasToBoard(x, y) {
      const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
      const file = Math.round((x - this.PADDING) / cellSize);
      const rank = 9 - Math.round((y - this.PADDING) / cellSize);
      if (file >= 0 && file <= 8 && rank >= 0 && rank <= 9) {
        return { file, rank };
      }
      return null;
    }
    /**
     * 渲染整个棋盘
     */
    render() {
      this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
      this.updateBoardStyle();
      this.drawBoard();
      this.drawRiver();
      if (this.selectedPosition) {
        this.drawSelection(this.selectedPosition);
      }
      this.drawLegalMoves();
      this.drawPieces();
      if (this.selectedPosition) {
        this.drawAttackableTargets();
      }
      if (this.invalidClickOverlay) {
        this.drawInvalidClickFeedback();
      }
    }
    /**
     * 绘制棋盘线条
     */
    drawBoard() {
      const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
      this.ctx.strokeStyle = "#8b4513";
      this.ctx.lineWidth = 2;
      for (let rank = 0; rank <= 9; rank++) {
        const { x: x1, y } = this.boardToCanvas(0, rank);
        const { x: x2 } = this.boardToCanvas(8, rank);
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y);
        this.ctx.lineTo(x2, y);
        this.ctx.stroke();
      }
      for (let file = 0; file <= 8; file++) {
        if (file === 0 || file === 8) {
          const { x, y: y1 } = this.boardToCanvas(file, 0);
          const { y: y2 } = this.boardToCanvas(file, 9);
          this.ctx.beginPath();
          this.ctx.moveTo(x, y1);
          this.ctx.lineTo(x, y2);
          this.ctx.stroke();
        } else {
          const { x, y: y1 } = this.boardToCanvas(file, 5);
          const { y: y2 } = this.boardToCanvas(file, 9);
          this.ctx.beginPath();
          this.ctx.moveTo(x, y1);
          this.ctx.lineTo(x, y2);
          this.ctx.stroke();
          const { y: y3 } = this.boardToCanvas(file, 0);
          const { y: y4 } = this.boardToCanvas(file, 4);
          this.ctx.beginPath();
          this.ctx.moveTo(x, y3);
          this.ctx.lineTo(x, y4);
          this.ctx.stroke();
        }
      }
      this.drawPalaceDiagonals();
    }
    /**
     * 绘制九宫斜线
     */
    drawPalaceDiagonals() {
      this.ctx.strokeStyle = "#8b4513";
      this.ctx.lineWidth = 2;
      const redPalace = [
        { from: { file: 3, rank: 0 }, to: { file: 5, rank: 2 } },
        { from: { file: 5, rank: 0 }, to: { file: 3, rank: 2 } }
      ];
      const blackPalace = [
        { from: { file: 3, rank: 7 }, to: { file: 5, rank: 9 } },
        { from: { file: 5, rank: 7 }, to: { file: 3, rank: 9 } }
      ];
      [...redPalace, ...blackPalace].forEach(({ from, to }) => {
        const start = this.boardToCanvas(from.file, from.rank);
        const end = this.boardToCanvas(to.file, to.rank);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
      });
    }
    /**
     * 绘制河界文字
     */
    drawRiver() {
      const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
      const riverY = this.PADDING + cellSize * 4.5;
      this.ctx.font = "bold 24px Arial, sans-serif";
      this.ctx.fillStyle = "rgba(100, 149, 237, 0.4)";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText("\u695A\u6CB3", this.PADDING + cellSize * 2, riverY);
      this.ctx.fillText("\u6C49\u754C", this.PADDING + cellSize * 6, riverY);
    }
    /**
     * 绘制选中高亮
     */
    drawSelection(pos) {
      const { x, y } = this.boardToCanvas(pos.file, pos.rank);
      this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.PIECE_RADIUS + 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    /**
     * 绘制可移动位置
     */
    drawLegalMoves() {
      if (this.legalMoves.length === 0) return;
      const isLinearMove = this.isLinearMovement();
      if (isLinearMove && this.selectedPosition) {
        this.drawMovementPath();
      }
      for (const pos of this.legalMoves) {
        const { x, y } = this.boardToCanvas(pos.file, pos.rank);
        this.ctx.fillStyle = "rgba(76, 175, 80, 0.15)";
        this.ctx.beginPath();
        this.ctx.arc(x, y, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = "rgba(76, 175, 80, 1)";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 14, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.strokeStyle = "rgba(129, 199, 132, 0.8)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }
    /**
     * 检查是否是直线移动
     */
    isLinearMovement() {
      if (!this.selectedPosition || this.legalMoves.length === 0) return false;
      const selectedPiece = this.board.getPiece(this.selectedPosition);
      if (!selectedPiece) return false;
      const linearPieces = ["CHARIOT" /* Chariot */, "CANNON" /* Cannon */, "SOLDIER" /* Soldier */];
      return linearPieces.includes(selectedPiece.type);
    }
    /**
     * 绘制移动路径（连接线）
     */
    drawMovementPath() {
      if (!this.selectedPosition) return;
      const startCoords = this.boardToCanvas(this.selectedPosition.file, this.selectedPosition.rank);
      const sortedMoves = [...this.legalMoves].sort((a, b) => {
        const distA = Math.abs(a.file - this.selectedPosition.file) + Math.abs(a.rank - this.selectedPosition.rank);
        const distB = Math.abs(b.file - this.selectedPosition.file) + Math.abs(b.rank - this.selectedPosition.rank);
        return distA - distB;
      });
      this.ctx.strokeStyle = "rgba(255, 200, 0, 0.4)";
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([4, 4]);
      for (const pos of sortedMoves) {
        const endCoords = this.boardToCanvas(pos.file, pos.rank);
        this.ctx.beginPath();
        this.ctx.moveTo(startCoords.x, startCoords.y);
        this.ctx.lineTo(endCoords.x, endCoords.y);
        this.ctx.stroke();
      }
      this.ctx.setLineDash([]);
    }
    /**
     * 绘制所有棋子
     */
    drawPieces() {
      for (let rank = 0; rank <= 9; rank++) {
        for (let file = 0; file <= 8; file++) {
          const pos = new Position(file, rank);
          const piece = this.board.getPiece(pos);
          if (piece) {
            this.drawPiece(file, rank, piece.type, piece.color);
          }
        }
      }
    }
    /**
     * 绘制单个棋子
     */
    drawPiece(file, rank, type, color) {
      const { x, y } = this.boardToCanvas(file, rank);
      const gradient = this.ctx.createRadialGradient(
        x - this.PIECE_RADIUS * 0.3,
        y - this.PIECE_RADIUS * 0.3,
        0,
        x,
        y,
        this.PIECE_RADIUS
      );
      if (color === "RED" /* Red */) {
        gradient.addColorStop(0, "#ff6b6b");
        gradient.addColorStop(1, "#c92a2a");
        this.ctx.strokeStyle = "#8b0000";
      } else {
        gradient.addColorStop(0, "#495057");
        gradient.addColorStop(1, "#212529");
        this.ctx.strokeStyle = "#000";
      }
      this.ctx.fillStyle = gradient;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.PIECE_RADIUS, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      const name = PIECE_NAMES[type];
      const text = color === "RED" /* Red */ ? name.red : name.black;
      this.ctx.font = "bold 20px Arial, sans-serif";
      this.ctx.fillStyle = color === "RED" /* Red */ ? "#1a1a1a" : "white";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(text, x, y);
    }
    /**
     * 绘制可攻击的棋子（红色边框）
     */
    drawAttackableTargets() {
      if (!this.selectedPosition) return;
      for (const targetPos of this.legalMoves) {
        const targetPiece = this.board.getPiece(targetPos);
        if (targetPiece && targetPiece.color !== this.currentPlayer) {
          const { x, y } = this.boardToCanvas(targetPos.file, targetPos.rank);
          this.ctx.strokeStyle = "rgba(255, 0, 0, 1)";
          this.ctx.lineWidth = 4;
          this.ctx.beginPath();
          this.ctx.arc(x, y, this.PIECE_RADIUS + 6, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.strokeStyle = "rgba(255, 100, 100, 0.6)";
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.arc(x, y, this.PIECE_RADIUS + 4, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    }
    /**
     * 绘制无效点击反馈（暗色覆盖层）
     */
    drawInvalidClickFeedback() {
      if (!this.invalidClickOverlay) return;
      const { x, y, alpha } = this.invalidClickOverlay;
      this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.PIECE_RADIUS + 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.PIECE_RADIUS + 8, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    /**
     * 显示无效点击反馈
     */
    showInvalidClickFeedback(x, y) {
      this.invalidClickOverlay = { x, y, alpha: 1 };
      const startTime = Date.now();
      const duration = 300;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        if (this.invalidClickOverlay) {
          this.invalidClickOverlay.alpha = 1 - progress;
        }
        this.render();
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.invalidClickOverlay = null;
          this.render();
        }
      };
      animate();
    }
    /**
     * 处理点击事件
     */
    handleClick(event) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const coords = this.canvasToBoard(x, y);
      if (!coords) return;
      const { file, rank } = coords;
      const pos = new Position(file, rank);
      const piece = this.board.getPiece(pos);
      const canvasCoords = this.boardToCanvas(file, rank);
      if (this.selectedPosition) {
        if (this.selectedPosition.equals(pos)) {
          this.selectedPosition = null;
          this.legalMoves = [];
          this.render();
          return;
        }
        if (this.legalMoves.some((legalPos) => legalPos.equals(pos))) {
          const selectedPiece = this.board.getPiece(this.selectedPosition);
          if (selectedPiece) {
            this.board = this.board.setPiece(this.selectedPosition, null);
            this.board = this.board.setPiece(pos, selectedPiece);
            this.currentPlayer = this.currentPlayer === "RED" /* Red */ ? "BLACK" /* Black */ : "RED" /* Red */;
            this.isInCheck = MoveValidator.isInCheck(this.board, this.currentPlayer);
            console.log(`${selectedPiece.color === "RED" /* Red */ ? "\u7EA2" : "\u9ED1"}\u65B9\u79FB\u52A8: ${this.selectedPosition.toString()} -> ${pos.toString()}`);
            this.selectedPosition = null;
            this.legalMoves = [];
            this.updateInfo();
            this.render();
          }
        } else if (piece && piece.color === this.currentPlayer) {
          this.selectedPosition = pos;
          this.legalMoves = MoveValidator.getLegalMoves(this.board, pos, this.currentPlayer);
          console.log(`\u9009\u4E2D\u68CB\u5B50: ${piece.toString()} at ${pos.toString()}, \u53EF\u79FB\u52A8\u4F4D\u7F6E\u6570: ${this.legalMoves.length}`);
          this.render();
        } else {
          this.showInvalidClickFeedback(canvasCoords.x, canvasCoords.y);
        }
      } else if (piece && piece.color === this.currentPlayer) {
        this.selectedPosition = pos;
        this.legalMoves = MoveValidator.getLegalMoves(this.board, pos, this.currentPlayer);
        console.log(`\u9009\u4E2D\u68CB\u5B50: ${piece.toString()} at ${pos.toString()}, \u53EF\u79FB\u52A8\u4F4D\u7F6E\u6570: ${this.legalMoves.length}`);
        this.render();
      } else {
        this.showInvalidClickFeedback(canvasCoords.x, canvasCoords.y);
      }
    }
    /**
     * 更新信息显示
     */
    updateInfo() {
      const redCount = this.board.getPieceCountByColor("RED" /* Red */);
      const blackCount = this.board.getPieceCountByColor("BLACK" /* Black */);
      const totalCount = this.board.getPieceCount();
      document.getElementById("red-count").textContent = redCount.toString();
      document.getElementById("black-count").textContent = blackCount.toString();
      document.getElementById("total-count").textContent = totalCount.toString();
      const playerIndicator = document.getElementById("player-indicator");
      if (this.currentPlayer === "RED" /* Red */) {
        playerIndicator.textContent = "\u{1F534} \u5F53\u524D\u73A9\u5BB6\uFF1A\u7EA2\u65B9";
        playerIndicator.className = "current-player-indicator red";
      } else {
        playerIndicator.textContent = "\u26AB \u5F53\u524D\u73A9\u5BB6\uFF1A\u9ED1\u65B9";
        playerIndicator.className = "current-player-indicator black";
      }
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    const ui = new XiangqiUI();
    window.xiangqiUI = ui;
    console.log("\u8C61\u68CB\u6E38\u620F\u5DF2\u52A0\u8F7D\uFF01");
    initializeWebSocket();
  });
  async function initializeWebSocket() {
    try {
      const { WebSocketClient } = await import("./client/WebSocketClient");
      const serverUrl = "wss://yuyan.up.railway.app";
      const wsClient = new WebSocketClient(serverUrl);
      await wsClient.connect();
      console.log("\u2713 WebSocket \u5DF2\u8FDE\u63A5\u5230\u670D\u52A1\u5668");
      window.wsClient = wsClient;
    } catch (error) {
      console.error("\u2717 WebSocket \u8FDE\u63A5\u5931\u8D25:", error);
    }
  }
})();
