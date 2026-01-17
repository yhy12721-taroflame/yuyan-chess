# 🚀 APP 打包快速开始（5 分钟）

## ⚡ 一键打包

### 第 1 步：准备环境

```bash
# 安装 Capacitor CLI（全局）
npm install -g @capacitor/cli

# 验证安装
cap --version
```

### 第 2 步：构建 Web 应用

```bash
# 编译 TypeScript 和打包 UI
npm run build:ui

# 验证成功
ls -la public/app.js
```

### 第 3 步：初始化 Capacitor（仅需一次）

```bash
# 初始化项目
cap init

# 按照提示输入：
# App name: 象棋线上对战
# App Package ID: com.xiangqi.game
# Web dir: public
```

### 第 4 步：添加平台

```bash
# 添加 iOS（需要 macOS）
cap add ios

# 添加 Android
cap add android
```

### 第 5 步：同步代码

```bash
# 同步 Web 代码到原生项目
cap sync
```

### 第 6 步：打开 IDE 构建

#### iOS（macOS）

```bash
# 打开 Xcode
cap open ios

# 在 Xcode 中：
# 1. 选择目标设备或模拟器
# 2. 点击 "Run" 按钮（或 Cmd+R）
# 3. 应用将在设备上运行
```

#### Android

```bash
# 打开 Android Studio
cap open android

# 在 Android Studio 中：
# 1. 选择目标设备或模拟器
# 2. 点击 "Run" 按钮（或 Shift+F10）
# 3. 应用将在设备上运行
```

---

## 📱 测试应用

### 本地对战

1. 打开应用
2. 点击"本地对战"
3. 开始游戏

### 线上对战

1. 打开应用
2. 点击"线上对决"
3. 输入玩家名称
4. 创建或加入房间
5. 与朋友对战

---

## 🎯 发布到应用商店

### Google Play Store

```bash
# 1. 生成签名密钥
keytool -genkey -v -keystore xiangqi-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias xiangqi-key

# 2. 在 Android Studio 中构建发布版本
# Build > Generate Signed Bundle / APK

# 3. 上传到 Google Play Console
```

### Apple App Store

```bash
# 在 Xcode 中
# 1. Product > Archive
# 2. 在 Organizer 中选择 Archive
# 3. 点击 "Distribute App"
# 4. 按照提示完成上传
```

---

## 🔧 常见问题

### Q: 如何在真机上测试？

**Android：**
```bash
# 1. 启用开发者模式（连续点击"版本号"7 次）
# 2. 启用 USB 调试
# 3. 连接设备
# 4. 在 Android Studio 中点击 Run
```

**iOS：**
```bash
# 1. 连接 iPhone
# 2. 在 Xcode 中选择设备
# 3. 点击 Run
```

### Q: 如何调试应用？

**Android：**
```bash
# 查看日志
adb logcat

# 打开 Chrome DevTools
# chrome://inspect
```

**iOS：**
```bash
# 在 Safari 中
# Develop > [设备名] > [应用名]
```

### Q: 如何处理网络连接？

应用支持：
- ✅ 本地对战（无需网络）
- ✅ 线上对战（需要网络）
- ✅ 自动重连
- ✅ 离线缓存

### Q: 应用大小是多少？

- iOS：约 50-100 MB
- Android：约 30-50 MB

---

## 📋 检查清单

- [ ] 运行 `npm run build:ui` 成功
- [ ] 运行 `cap init` 成功
- [ ] 运行 `cap add ios` 和 `cap add android` 成功
- [ ] 运行 `cap sync` 成功
- [ ] iOS 在 Xcode 中编译成功
- [ ] Android 在 Android Studio 中编译成功
- [ ] 在真机上测试本地对战
- [ ] 在真机上测试线上对战
- [ ] 检查应用权限
- [ ] 准备发布到应用商店

---

## 🎉 完成

现在您可以：

✅ 在 iOS 上运行应用
✅ 在 Android 上运行应用
✅ 发布到 App Store
✅ 发布到 Google Play

**祝您打包成功！** 🚀

---

**版本**：1.0.0
**最后更新**：2026-01-17
**状态**：✅ 准备就绪

## 📚 更多信息

- 详细指南：查看 `APP_PACKAGING_GUIDE.md`
- 部署指南：查看 `SERVER_DEPLOYMENT_QUICK_START.md`
- 项目文档：查看 `README.md`
