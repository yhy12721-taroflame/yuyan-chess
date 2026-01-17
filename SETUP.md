# 开发环境设置指南

## 第一步：安装 Node.js

### Windows 系统

1. 访问 Node.js 官网：https://nodejs.org/
2. 下载 LTS（长期支持）版本（推荐 v20.x）
3. 运行安装程序，按照提示完成安装
4. 验证安装：
   ```bash
   node --version
   npm --version
   ```

### 或使用 Chocolatey（Windows 包管理器）

```bash
choco install nodejs-lts
```

## 第二步：安装项目依赖

在项目目录中运行：

```bash
npm install
```

这将安装所有必需的依赖包，包括：
- React Native
- TypeScript
- Jest（测试框架）
- fast-check（属性测试库）

## 第三步：运行测试

```bash
# 运行所有测试
npm test

# 监视模式
npm run test:watch
```

## 第四步：设置 React Native 开发环境

### Android 开发

1. **安装 Android Studio**
   - 下载：https://developer.android.com/studio
   - 安装 Android SDK（API 33 或更高）
   - 配置环境变量：
     ```
     ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk
     ```

2. **启用 USB 调试**（真机测试）
   - 在手机上启用开发者选项
   - 启用 USB 调试
   - 连接手机到电脑

3. **运行应用**
   ```bash
   npm run android
   ```

### iOS 开发（仅 macOS）

1. **安装 Xcode**
   - 从 App Store 安装 Xcode
   - 安装 Command Line Tools

2. **安装 CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **运行应用**
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

## 快速开始（仅测试核心逻辑）

如果你只想测试游戏核心逻辑（不需要 React Native UI），可以：

1. 安装 Node.js
2. 运行 `npm install`
3. 运行 `npm test`

核心游戏逻辑（`src/core/`）是纯 TypeScript，不依赖 React Native，可以独立测试和运行。

## 故障排除

### npm 命令找不到

确保 Node.js 已正确安装并添加到系统 PATH。重启终端或电脑后再试。

### 测试失败

确保所有依赖都已安装：
```bash
npm install
```

### React Native 构建失败

1. 清理缓存：
   ```bash
   npm start -- --reset-cache
   ```

2. 清理 Android 构建：
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

## 下一步

环境设置完成后，你可以：

1. 运行测试验证 Position 实现
2. 继续实现下一个任务（1.2 Piece 结构）
3. 查看任务列表：`.kiro/specs/xiangqi-game/tasks.md`
