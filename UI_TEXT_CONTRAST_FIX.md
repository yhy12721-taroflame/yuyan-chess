# UI 文字对比度修复

## 问题描述

红方棋子在红色背景上的文字不清楚，因为所有棋子都使用白色文字，而白色在红色背景上的对比度不足。

## 解决方案

修改了 `src/app.ts` 中的 `drawPiece` 方法，使用不同的文字颜色策略：

- **红方棋子**：使用深色文字（`#1a1a1a`，接近黑色）
  - 红色背景 + 深色文字 = 高对比度，文字清晰
  
- **黑方棋子**：继续使用白色文字
  - 黑色背景 + 白色文字 = 高对比度，文字清晰

## 修改的代码

**文件**：`src/app.ts`

**方法**：`drawPiece` (第409-450行)

```typescript
// 修改前
this.ctx.fillStyle = 'white';

// 修改后
this.ctx.fillStyle = color === Color.Red ? '#1a1a1a' : 'white';
```

## 构建和部署

1. **重新构建 Web UI**
   ```bash
   npm run build:ui
   ```

2. **同步到 Android 项目**
   ```bash
   npx @capacitor/cli sync
   ```

3. **在 Android Studio 中重新构建**
   - `Build` → `Clean Project`
   - `Build` → `Rebuild Project`

## 验证

在 Android 设备或模拟器上运行应用，检查：
- ✅ 红方棋子的文字清晰可读
- ✅ 黑方棋子的文字清晰可读
- ✅ 棋子背景颜色正确
- ✅ 整体UI美观

## 相关文件

- `src/app.ts` - 棋子绘制逻辑
- `public/app.js` - 编译后的 Web 应用
- `android/app/src/main/assets/public/app.js` - Android 项目中的 Web 应用

---

**状态**：✅ 已修复并部署到 Android 项目
