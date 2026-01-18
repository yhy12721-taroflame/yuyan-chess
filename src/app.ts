/**
 * 象棋游戏 Web UI - 使用Canvas绘制基于交叉点的棋盘
 */

import { createInitialBoard } from './core/Board';
import { Position } from './core/Position';
import { MoveValidator } from './core/MoveValidator';
import { Color, PieceType } from './core/types';

// 棋子中文名称映射
const PIECE_NAMES: Record<PieceType, { red: string; black: string }> = {
  [PieceType.General]: { red: '帅', black: '将' },
  [PieceType.Advisor]: { red: '仕', black: '士' },
  [PieceType.Elephant]: { red: '相', black: '象' },
  [PieceType.Horse]: { red: '马', black: '马' },
  [PieceType.Chariot]: { red: '车', black: '车' },
  [PieceType.Cannon]: { red: '炮', black: '炮' },
  [PieceType.Soldier]: { red: '兵', black: '卒' },
};

class XiangqiUI {
  public board = createInitialBoard();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private boardElement: HTMLElement;
  public selectedPosition: Position | null = null;
  public legalMoves: Position[] = [];
  public currentPlayer: Color = Color.Red;
  private invalidClickOverlay: { x: number; y: number; alpha: number } | null = null;
  public isInCheck: boolean = false;
  
  // 棋盘尺寸参数
  private readonly PADDING = 40; // 边距
  private readonly PIECE_RADIUS = 22; // 棋子半径
  
  // 计算的尺寸
  private boardWidth = 0;
  private boardHeight = 0;

  constructor() {
    this.canvas = document.getElementById('board-canvas') as HTMLCanvasElement;
    this.boardElement = document.querySelector('.board') as HTMLElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.initCanvas();
    this.updateBoardStyle();
    this.render();
    this.updateInfo();
    
    // 添加点击事件
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
    // 响应式调整
    window.addEventListener('resize', () => {
      this.initCanvas();
      this.render();
    });
  }

  /**
   * 重新初始化 Canvas（用于显示游戏界面后）
   */
  public reinitialize(): void {
    this.initCanvas();
    this.render();
  }

  /**
   * 更新信息显示（公开方法）
   */
  public updateInfo(): void {
    const redCount = this.board.getPieceCountByColor(Color.Red);
    const blackCount = this.board.getPieceCountByColor(Color.Black);
    const totalCount = this.board.getPieceCount();

    document.getElementById('red-count')!.textContent = redCount.toString();
    document.getElementById('black-count')!.textContent = blackCount.toString();
    document.getElementById('total-count')!.textContent = totalCount.toString();
    
    // 更新当前玩家显示
    const playerIndicator = document.getElementById('player-indicator')!;
    if (this.currentPlayer === Color.Red) {
      playerIndicator.textContent = '🔴 当前玩家：红方';
      playerIndicator.className = 'current-player-indicator red';
    } else {
      playerIndicator.textContent = '⚫ 当前玩家：黑方';
      playerIndicator.className = 'current-player-indicator black';
    }
  }

  /**
   * 重新渲染棋盘（公开方法）
   */
  public render(): void {
    // 清空画布
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
    
    // 更新棋盘样式
    this.updateBoardStyle();
    
    // 绘制棋盘线条
    this.drawBoard();
    
    // 绘制河界文字
    this.drawRiver();
    
    // 绘制选中高亮
    if (this.selectedPosition) {
      this.drawSelection(this.selectedPosition);
    }
    
    // 绘制可移动位置
    this.drawLegalMoves();
    
    // 绘制所有棋子
    this.drawPieces();
    
    // 绘制可攻击的棋子红色边框
    if (this.selectedPosition) {
      this.drawAttackableTargets();
    }
    
    // 绘制无效点击反馈
    if (this.invalidClickOverlay) {
      this.drawInvalidClickFeedback();
    }
  }

  /**
   * 更新棋盘样式（背景颜色）
   */
  private updateBoardStyle(): void {
    // 移除所有样式类
    this.boardElement.classList.remove('red-turn', 'black-turn', 'piece-selected', 'in-check');
    document.body.classList.remove('red-turn-bg', 'black-turn-bg', 'piece-selected-bg', 'in-check-bg');
    
    // 如果玩家被将军，显示闪烁效果
    if (this.isInCheck) {
      this.boardElement.classList.add('in-check');
      document.body.classList.add('in-check-bg');
    } else if (this.selectedPosition) {
      // 如果选中了棋子，显示灰色背景
      this.boardElement.classList.add('piece-selected');
      document.body.classList.add('piece-selected-bg');
    } else {
      // 否则根据当前玩家显示颜色
      if (this.currentPlayer === Color.Red) {
        this.boardElement.classList.add('red-turn');
        document.body.classList.add('red-turn-bg');
      } else {
        this.boardElement.classList.add('black-turn');
        document.body.classList.add('black-turn-bg');
      }
    }
  }

  /**
   * 初始化Canvas尺寸
   */
  private initCanvas(): void {
    const container = this.canvas.parentElement!;
    const containerWidth = container.clientWidth;
    
    // 计算合适的单元格大小
    const availableWidth = containerWidth - this.PADDING * 2;
    const cellSize = Math.floor(availableWidth / 8); // 8个间隔（9条线）
    
    // 计算实际棋盘尺寸
    this.boardWidth = cellSize * 8 + this.PADDING * 2;
    this.boardHeight = cellSize * 9 + this.PADDING * 2;
    
    // 设置Canvas尺寸（使用设备像素比以获得清晰显示）
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.boardWidth * dpr;
    this.canvas.height = this.boardHeight * dpr;
    this.canvas.style.width = `${this.boardWidth}px`;
    this.canvas.style.height = `${this.boardHeight}px`;
    
    // 缩放上下文以匹配设备像素比
    this.ctx.scale(dpr, dpr);
  }

  /**
   * 将棋盘坐标转换为Canvas坐标
   */
  private boardToCanvas(file: number, rank: number): { x: number; y: number } {
    const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
    return {
      x: this.PADDING + file * cellSize,
      y: this.PADDING + (9 - rank) * cellSize, // rank从下往上，Canvas从上往下
    };
  }

  /**
   * 将Canvas坐标转换为棋盘坐标
   */
  private canvasToBoard(x: number, y: number): { file: number; rank: number } | null {
    const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
    const file = Math.round((x - this.PADDING) / cellSize);
    const rank = 9 - Math.round((y - this.PADDING) / cellSize);
    
    // 检查是否在有效范围内
    if (file >= 0 && file <= 8 && rank >= 0 && rank <= 9) {
      return { file, rank };
    }
    return null;
  }

  /**
   * 绘制棋盘线条
   */
  private drawBoard(): void {
    const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
    
    this.ctx.strokeStyle = '#8b4513';
    this.ctx.lineWidth = 2;
    
    // 绘制横线（10条，rank 0-9）
    for (let rank = 0; rank <= 9; rank++) {
      const { x: x1, y } = this.boardToCanvas(0, rank);
      const { x: x2 } = this.boardToCanvas(8, rank);
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y);
      this.ctx.lineTo(x2, y);
      this.ctx.stroke();
    }
    
    // 绘制竖线（9条，file 0-8）
    for (let file = 0; file <= 8; file++) {
      // 两边的竖线（file 0 和 8）贯穿整个棋盘
      if (file === 0 || file === 8) {
        const { x, y: y1 } = this.boardToCanvas(file, 0);
        const { y: y2 } = this.boardToCanvas(file, 9);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y1);
        this.ctx.lineTo(x, y2);
        this.ctx.stroke();
      } else {
        // 中间的竖线在河界处断开
        // 上半部分（rank 5-9，黑方）
        const { x, y: y1 } = this.boardToCanvas(file, 5);
        const { y: y2 } = this.boardToCanvas(file, 9);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y1);
        this.ctx.lineTo(x, y2);
        this.ctx.stroke();
        
        // 下半部分（rank 0-4，红方）
        const { y: y3 } = this.boardToCanvas(file, 0);
        const { y: y4 } = this.boardToCanvas(file, 4);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y3);
        this.ctx.lineTo(x, y4);
        this.ctx.stroke();
      }
    }
    
    // 绘制九宫斜线
    this.drawPalaceDiagonals();
  }

  /**
   * 绘制九宫斜线
   */
  private drawPalaceDiagonals(): void {
    this.ctx.strokeStyle = '#8b4513';
    this.ctx.lineWidth = 2;
    
    // 红方九宫（rank 0-2, file 3-5）
    const redPalace = [
      { from: { file: 3, rank: 0 }, to: { file: 5, rank: 2 } },
      { from: { file: 5, rank: 0 }, to: { file: 3, rank: 2 } },
    ];
    
    // 黑方九宫（rank 7-9, file 3-5）
    const blackPalace = [
      { from: { file: 3, rank: 7 }, to: { file: 5, rank: 9 } },
      { from: { file: 5, rank: 7 }, to: { file: 3, rank: 9 } },
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
  private drawRiver(): void {
    const cellSize = (this.boardWidth - this.PADDING * 2) / 8;
    const riverY = this.PADDING + cellSize * 4.5;
    
    this.ctx.font = 'bold 24px Arial, sans-serif';
    this.ctx.fillStyle = 'rgba(100, 149, 237, 0.4)';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // 楚河
    this.ctx.fillText('楚河', this.PADDING + cellSize * 2, riverY);
    
    // 汉界
    this.ctx.fillText('汉界', this.PADDING + cellSize * 6, riverY);
  }

  /**
   * 绘制选中高亮
   */
  private drawSelection(pos: Position): void {
    const { x, y } = this.boardToCanvas(pos.file, pos.rank);
    
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.PIECE_RADIUS + 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * 绘制可移动位置
   */
  private drawLegalMoves(): void {
    if (this.legalMoves.length === 0) return;
    
    // 检查是否是直线移动（车、炮、兵等）
    const isLinearMove = this.isLinearMovement();
    
    // 如果是直线移动，绘制连接线
    if (isLinearMove && this.selectedPosition) {
      this.drawMovementPath();
    }
    
    // 绘制可移动位置的标记（绿色圆形）
    for (const pos of this.legalMoves) {
      const { x, y } = this.boardToCanvas(pos.file, pos.rank);
      
      // 绘制外层阴影圆圈
      this.ctx.fillStyle = 'rgba(76, 175, 80, 0.15)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 18, 0, Math.PI * 2);
      this.ctx.fill();
      
      // 绘制绿色圆形框（粗边框）
      this.ctx.strokeStyle = 'rgba(76, 175, 80, 1)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 14, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // 绘制内层高亮
      this.ctx.strokeStyle = 'rgba(129, 199, 132, 0.8)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  /**
   * 检查是否是直线移动
   */
  private isLinearMovement(): boolean {
    if (!this.selectedPosition || this.legalMoves.length === 0) return false;
    
    const selectedPiece = this.board.getPiece(this.selectedPosition);
    if (!selectedPiece) return false;
    
    // 车、炮、兵/卒可以直线移动
    const linearPieces = [PieceType.Chariot, PieceType.Cannon, PieceType.Soldier];
    return linearPieces.includes(selectedPiece.type);
  }

  /**
   * 绘制移动路径（连接线）
   */
  private drawMovementPath(): void {
    if (!this.selectedPosition) return;
    
    const startCoords = this.boardToCanvas(this.selectedPosition.file, this.selectedPosition.rank);
    
    // 按照距离排序可移动位置
    const sortedMoves = [...this.legalMoves].sort((a, b) => {
      const distA = Math.abs(a.file - this.selectedPosition!.file) + Math.abs(a.rank - this.selectedPosition!.rank);
      const distB = Math.abs(b.file - this.selectedPosition!.file) + Math.abs(b.rank - this.selectedPosition!.rank);
      return distA - distB;
    });
    
    // 绘制从起点到每个可移动位置的路径
    this.ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 4]); // 虚线
    
    for (const pos of sortedMoves) {
      const endCoords = this.boardToCanvas(pos.file, pos.rank);
      
      this.ctx.beginPath();
      this.ctx.moveTo(startCoords.x, startCoords.y);
      this.ctx.lineTo(endCoords.x, endCoords.y);
      this.ctx.stroke();
    }
    
    this.ctx.setLineDash([]); // 恢复实线
  }

  /**
   * 绘制所有棋子
   */
  private drawPieces(): void {
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
  private drawPiece(file: number, rank: number, type: PieceType, color: Color): void {
    const { x, y } = this.boardToCanvas(file, rank);
    
    // 绘制棋子圆形背景
    const gradient = this.ctx.createRadialGradient(
      x - this.PIECE_RADIUS * 0.3,
      y - this.PIECE_RADIUS * 0.3,
      0,
      x,
      y,
      this.PIECE_RADIUS
    );
    
    if (color === Color.Red) {
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(1, '#c92a2a');
      this.ctx.strokeStyle = '#8b0000';
    } else {
      gradient.addColorStop(0, '#495057');
      gradient.addColorStop(1, '#212529');
      this.ctx.strokeStyle = '#000';
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.PIECE_RADIUS, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // 绘制棋子文字
    const name = PIECE_NAMES[type];
    const text = color === Color.Red ? name.red : name.black;
    
    this.ctx.font = 'bold 20px Arial, sans-serif';
    // 红方棋子使用深色文字以提高对比度，黑方棋子使用白色文字
    this.ctx.fillStyle = color === Color.Red ? '#1a1a1a' : 'white';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  /**
   * 绘制可攻击的棋子（红色边框）
   */
  private drawAttackableTargets(): void {
    if (!this.selectedPosition) return;
    
    // 遍历所有可移动位置，检查是否有对方棋子
    for (const targetPos of this.legalMoves) {
      const targetPiece = this.board.getPiece(targetPos);
      
      // 如果目标位置有对方棋子，绘制红色边框
      if (targetPiece && targetPiece.color !== this.currentPlayer) {
        const { x, y } = this.boardToCanvas(targetPos.file, targetPos.rank);
        
        // 绘制红色边框
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.PIECE_RADIUS + 6, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 绘制内层高亮
        this.ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
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
  private drawInvalidClickFeedback(): void {
    if (!this.invalidClickOverlay) return;
    
    const { x, y, alpha } = this.invalidClickOverlay;
    
    // 绘制暗色圆形覆盖
    this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.PIECE_RADIUS + 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 绘制红色边框表示错误
    this.ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.PIECE_RADIUS + 8, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  /**
   * 显示无效点击反馈
   */
  private showInvalidClickFeedback(x: number, y: number): void {
    this.invalidClickOverlay = { x, y, alpha: 1 };
    
    // 动画：逐渐淡出
    const startTime = Date.now();
    const duration = 300; // 毫秒
    
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
  private handleClick(event: MouseEvent): void {
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
      // 如果已经选中了棋子，尝试移动
      if (this.selectedPosition.equals(pos)) {
        // 点击同一个棋子，取消选中
        this.selectedPosition = null;
        this.legalMoves = [];
        this.render();
        return;
      }

      // 检查目标位置是否是合法移动
      if (this.legalMoves.some(legalPos => legalPos.equals(pos))) {
        // 执行移动
        const selectedPiece = this.board.getPiece(this.selectedPosition);
        if (selectedPiece) {
          this.board = this.board.setPiece(this.selectedPosition, null);
          this.board = this.board.setPiece(pos, selectedPiece);
          
          // 切换玩家
          this.currentPlayer = this.currentPlayer === Color.Red ? Color.Black : Color.Red;
          
          // 移动完成后检测新玩家是否被将军
          this.isInCheck = MoveValidator.isInCheck(this.board, this.currentPlayer);
          
          console.log(`${selectedPiece.color === Color.Red ? '红' : '黑'}方移动: ${this.selectedPosition.toString()} -> ${pos.toString()}`);
          
          // 发送移动消息到服务器
          if ((window as any).wsClient) {
            console.log('[移动] 发送移动消息到服务器:', {
              from: this.selectedPosition.toString(),
              to: pos.toString()
            });
            (window as any).wsClient.send({
              type: 'move',
              data: {
                from: this.selectedPosition.toString(),
                to: pos.toString()
              }
            });
          } else {
            console.warn('[移动] WebSocket 客户端未初始化');
          }
          
          this.selectedPosition = null;
          this.legalMoves = [];
          this.updateInfo();
          this.render();
        }
      } else if (piece && piece.color === this.currentPlayer) {
        // 点击另一个己方棋子，选中它
        this.selectedPosition = pos;
        this.legalMoves = MoveValidator.getLegalMoves(this.board, pos, this.currentPlayer);
        console.log(`选中棋子: ${piece.toString()} at ${pos.toString()}, 可移动位置数: ${this.legalMoves.length}`);
        this.render();
      } else {
        // 点击空位或对方棋子，显示无效反馈
        this.showInvalidClickFeedback(canvasCoords.x, canvasCoords.y);
      }
    } else if (piece && piece.color === this.currentPlayer) {
      // 选中棋子
      this.selectedPosition = pos;
      this.legalMoves = MoveValidator.getLegalMoves(this.board, pos, this.currentPlayer);
      console.log(`选中棋子: ${piece.toString()} at ${pos.toString()}, 可移动位置数: ${this.legalMoves.length}`);
      this.render();
    } else {
      // 点击空位或对方棋子，显示无效反馈
      this.showInvalidClickFeedback(canvasCoords.x, canvasCoords.y);
    }
  }

  /**
   * 初始化应用
   */
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  const ui = new XiangqiUI();
  (window as any).xiangqiUI = ui;
  console.log('象棋游戏已加载！');
  
  // 初始化 WebSocket 连接
  initializeWebSocket();
});

// 初始化 WebSocket 连接
async function initializeWebSocket() {
  try {
    // 动态导入 WebSocket 客户端
    const { WebSocketClient } = await import('./client/WebSocketClient');
    
    // 创建 WebSocket 客户端实例
    const serverUrl = 'wss://yuyan.up.railway.app';
    const wsClient = new WebSocketClient(serverUrl);
    
    console.log('[WebSocket] 正在连接到服务器:', serverUrl);
    
    // 连接到服务器
    await wsClient.connect();
    console.log('✓ WebSocket 已连接到服务器，玩家ID:', wsClient.getPlayerId());
    
    // 注册消息处理器 - 监听移动消息
    wsClient.on('move_made', (data: any) => {
      console.log(`[move_made 消息] 从 ${data.from} 到 ${data.to}，玩家ID: ${data.playerId}，我的ID: ${wsClient.getPlayerId()}`);
      // 只应用来自其他玩家的移动，忽略自己的移动
      if (data.playerId !== wsClient.getPlayerId()) {
        console.log('[远程移动] 应用来自其他玩家的移动');
        applyRemoteMove(data.from, data.to);
      } else {
        console.log('[远程移动] 忽略自己的移动');
      }
    });
    
    // 保存到全局变量供后续使用
    (window as any).wsClient = wsClient;
    console.log('[WebSocket] 初始化完成');
  } catch (error) {
    console.error('✗ WebSocket 连接失败:', error);
  }
}

/**
 * 应用远程移动（来自其他玩家的移动）
 */
function applyRemoteMove(fromStr: string, toStr: string): void {
  const ui = (window as any).xiangqiUI;
  if (!ui) {
    console.error('[远程移动] UI 未初始化');
    return;
  }
  
  console.log('[远程移动] 开始应用移动:', fromStr, '->', toStr);
  
  try {
    // 解析位置字符串 (格式: "(file, rank)")
    const parsePosition = (posStr: string) => {
      const match = posStr.match(/\((\d+),\s*(\d+)\)/);
      if (!match) throw new Error(`无效的位置格式: ${posStr}`);
      return { file: parseInt(match[1]), rank: parseInt(match[2]) };
    };
    
    const { file: fromFile, rank: fromRank } = parsePosition(fromStr);
    const { file: toFile, rank: toRank } = parsePosition(toStr);
    
    console.log('[远程移动] 解析位置成功:', { fromFile, fromRank, toFile, toRank });
    
    const fromPos = new Position(fromFile, fromRank);
    const toPos = new Position(toFile, toRank);
    
    // 获取要移动的棋子
    const piece = ui.board.getPiece(fromPos);
    if (!piece) {
      console.error(`[远程移动] 源位置没有棋子: ${fromStr}`);
      return;
    }
    
    console.log('[远程移动] 找到棋子:', piece.toString());
    
    // 执行移动
    ui.board = ui.board.setPiece(fromPos, null);
    ui.board = ui.board.setPiece(toPos, piece);
    
    // 切换玩家
    ui.currentPlayer = ui.currentPlayer === Color.Red ? Color.Black : Color.Red;
    
    // 检测新玩家是否被将军
    ui.isInCheck = MoveValidator.isInCheck(ui.board, ui.currentPlayer);
    
    console.log(`[远程移动] 已应用: ${piece.color === Color.Red ? '红' : '黑'}方 ${fromStr} -> ${toStr}`);
    
    // 清除选中状态
    ui.selectedPosition = null;
    ui.legalMoves = [];
    
    // 更新信息显示和重新渲染
    ui.updateInfo();
    ui.render();
    
    console.log('[远程移动] 完成');
  } catch (error) {
    console.error('[远程移动] 应用移动时出错:', error);
  }
}

// 全局函数用于开始游戏
function startGame() {
  const lobbyEl = document.getElementById('lobby');
  const gameEl = document.getElementById('game');
  if (lobbyEl) lobbyEl.style.display = 'none';
  if (gameEl) gameEl.style.display = 'block';
}
