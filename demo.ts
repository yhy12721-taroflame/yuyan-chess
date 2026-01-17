/**
 * 象棋游戏引擎演示
 * 展示目前已实现的功能
 */

import { createPosition, isInPalace, hasCrossedRiver, isValid } from './src/core/Position';
import { createPiece, getOpponentColor } from './src/core/Piece';
import { createMove } from './src/core/Move';
import { createInitialBoard } from './src/core/Board';
import { Color, PieceType } from './src/core/types';

console.log('='.repeat(60));
console.log('🎮 象棋游戏引擎演示');
console.log('='.repeat(60));
console.log();

// ========== 1. Position（位置）演示 ==========
console.log('📍 1. Position（位置）功能演示');
console.log('-'.repeat(60));

const pos1 = createPosition(4, 1);
console.log(`创建位置: ${pos1.toString()}`);
console.log(`  - 是否在红方九宫内: ${isInPalace(pos1, Color.Red)}`);
console.log(`  - 是否在黑方九宫内: ${isInPalace(pos1, Color.Black)}`);
console.log(`  - 红方是否过河: ${hasCrossedRiver(pos1, Color.Red)}`);
console.log(`  - 位置是否有效: ${isValid(pos1)}`);
console.log();

const pos2 = createPosition(0, 6);
console.log(`创建位置: ${pos2.toString()}`);
console.log(`  - 是否在红方九宫内: ${isInPalace(pos2, Color.Red)}`);
console.log(`  - 是否在黑方九宫内: ${isInPalace(pos2, Color.Black)}`);
console.log(`  - 黑方是否过河: ${hasCrossedRiver(pos2, Color.Black)}`);
console.log();

// ========== 2. Piece（棋子）演示 ==========
console.log('♟️  2. Piece（棋子）功能演示');
console.log('-'.repeat(60));

const redGeneral = createPiece(PieceType.General, Color.Red);
console.log(`创建棋子: ${redGeneral.toString()}`);
console.log(`  - 符号: ${redGeneral.getSymbol()}`);
console.log(`  - 类型: ${redGeneral.type}`);
console.log(`  - 颜色: ${redGeneral.color}`);
console.log();

const blackChariot = createPiece(PieceType.Chariot, Color.Black);
console.log(`创建棋子: ${blackChariot.toString()}`);
console.log(`  - 符号: ${blackChariot.getSymbol()}`);
console.log();

const redSoldier = createPiece(PieceType.Soldier, Color.Red);
console.log(`创建棋子: ${redSoldier.toString()}`);
console.log(`  - 符号: ${redSoldier.getSymbol()}`);
console.log();

console.log(`对手颜色切换:`);
console.log(`  - 红方的对手: ${getOpponentColor(Color.Red)}`);
console.log(`  - 黑方的对手: ${getOpponentColor(Color.Black)}`);
console.log();

// ========== 3. Move（移动）演示 ==========
console.log('🎯 3. Move（移动）功能演示');
console.log('-'.repeat(60));

const move1 = createMove(createPosition(0, 0), createPosition(0, 5));
console.log(`创建移动: ${move1.toString()}`);
console.log(`  - 文件距离: ${move1.getFileDelta()}`);
console.log(`  - 等级距离: ${move1.getRankDelta()}`);
console.log(`  - 是否水平移动: ${move1.isHorizontal()}`);
console.log(`  - 是否垂直移动: ${move1.isVertical()}`);
console.log(`  - 是否对角线移动: ${move1.isDiagonal()}`);
console.log(`  - 是否直线移动: ${move1.isStraight()}`);
console.log(`  - 文件方向: ${move1.getFileDirection()}`);
console.log(`  - 等级方向: ${move1.getRankDirection()}`);
console.log();

const move2 = createMove(createPosition(0, 0), createPosition(5, 0));
console.log(`创建移动: ${move2.toString()}`);
console.log(`  - 是否水平移动: ${move2.isHorizontal()}`);
console.log(`  - 是否垂直移动: ${move2.isVertical()}`);
console.log();

const move3 = createMove(createPosition(0, 0), createPosition(3, 3));
console.log(`创建移动: ${move3.toString()}`);
console.log(`  - 是否对角线移动: ${move3.isDiagonal()}`);
console.log(`  - 文件距离: ${move3.getFileDelta()}`);
console.log(`  - 等级距离: ${move3.getRankDelta()}`);
console.log();

// ========== 4. 综合示例 ==========
console.log('🎲 4. 综合示例：模拟一个简单的移动');
console.log('-'.repeat(60));

const startPos = createPosition(4, 0);
const endPos = createPosition(4, 1);
const piece = createPiece(PieceType.General, Color.Red);
const move = createMove(startPos, endPos);

console.log(`棋子: ${piece.toString()} (${piece.getSymbol()})`);
console.log(`起始位置: ${startPos.toString()}`);
console.log(`  - 在九宫内: ${isInPalace(startPos, Color.Red)}`);
console.log(`目标位置: ${endPos.toString()}`);
console.log(`  - 在九宫内: ${isInPalace(endPos, Color.Red)}`);
console.log(`移动: ${move.toString()}`);
console.log(`  - 移动类型: ${move.isVertical() ? '垂直' : move.isHorizontal() ? '水平' : '其他'}`);
console.log(`  - 移动距离: ${move.getRankDelta()} 格`);
console.log();

// ========== 5. 显示所有棋子类型 ==========
console.log('📋 5. 所有棋子类型展示');
console.log('-'.repeat(60));

const pieceTypes = [
  PieceType.General,
  PieceType.Advisor,
  PieceType.Elephant,
  PieceType.Horse,
  PieceType.Chariot,
  PieceType.Cannon,
  PieceType.Soldier,
];

console.log('红方棋子:');
pieceTypes.forEach((type) => {
  const piece = createPiece(type, Color.Red);
  console.log(`  ${piece.getSymbol()} - ${piece.toString()}`);
});

console.log();
console.log('黑方棋子:');
pieceTypes.forEach((type) => {
  const piece = createPiece(type, Color.Black);
  console.log(`  ${piece.getSymbol()} - ${piece.toString()}`);
});

console.log();
console.log('='.repeat(60));
console.log('✅ 演示完成！');
console.log('='.repeat(60));
console.log();
console.log('📊 当前进度:');
console.log('  ✅ Position（位置）结构 - 完成');
console.log('  ✅ Piece（棋子）结构 - 完成');
console.log('  ✅ Move（移动）结构 - 完成');
console.log('  ✅ Board（棋盘）结构 - 完成');
console.log('  ✅ 初始棋盘设置 - 完成');
console.log('  ⬜ 移动验证 - 待实现');
console.log('  ⬜ GameEngine（游戏引擎）- 待实现');
console.log();

// ========== 6. 初始棋盘展示 ==========
console.log('🎮 6. 初始棋盘布局');
console.log('-'.repeat(60));

const initialBoard = createInitialBoard();
console.log(`棋盘上的棋子总数: ${initialBoard.getPieceCount()}`);
console.log(`红方棋子数: ${initialBoard.getPieceCountByColor(Color.Red)}`);
console.log(`黑方棋子数: ${initialBoard.getPieceCountByColor(Color.Black)}`);
console.log();
console.log('棋盘布局:');
console.log(initialBoard.render());
console.log('图例:');
console.log('  大写字母 = 红方棋子');
console.log('  小写字母 = 黑方棋子');
console.log('  G/g = 将/帅, A/a = 士/仕, E/e = 象/相');
console.log('  H/h = 马, R/r = 车, C/c = 炮, S/s = 兵/卒');
console.log('  ~ = 河界, . = 空位');
console.log();
