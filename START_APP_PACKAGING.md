# 🚀 开始 APP 打包 - 象棋线上对战

## 👋 欢迎

您的象棋线上对战应用已完全准备好打包成 iOS 和 Android APP！

---

## ⚡ 最快的方式（推荐）

### 第 1 步：运行打包脚本

**Windows PowerShell：**
```powershell
.\build-app.ps1
```

**Windows CMD：**
```cmd
build-app.bat
```

### 第 2 步：选择"完整打包流程"

脚本会自动完成所有步骤：
1. ✅ 构建 Web 应用
2. ✅ 初始化 Capacitor
3. ✅ 添加 iOS 平台
4. ✅ 添加 Android 平台
5. ✅ 同步代码

### 第 3 步：打开 IDE

```bash
# iOS（需要 macOS）
npx @capacitor/cli open ios

# Android
npx @capacitor/cli open android
```

### 第 4 步：点击 Run

在 Xcode 或 Android Studio 中点击 Run 按钮，应用将在设备上运行。

---

## 📱 支持的平台

| 平台 | 状态 | 要求 |
|------|------|------|
| iOS | ✅ 支持 | macOS + Xcode |
| Android | ✅ 支持 | Android Studio |
| Web | ✅ 支持 | 任何浏览器 |

---

## 📚 文档

### 快速开始

- **`APP_BUILD_QUICK_START.md`** - 5 分钟快速开始
- **`APP_PACKAGING_COMPLETE.md`** - 完整总结

### 详细指南

- **`APP_PACKAGING_GUIDE.md`** - 详细打包指南（所有步骤）
- **`APP_QUICK_START.md`** - 独立版快速开始

### 其他文档

- **`SERVER_DEPLOYMENT_QUICK_START.md`** - 服务器部署指南
- **`README.md`** - 项目总体说明

---

## 🎯 三种打包方式

### 方式 1：使用脚本（最简单）⭐ 推荐

```powershell
.\build-app.ps1
# 选择"8. 完整打包流程"
```

**优点：**
- ✅ 最简单
- ✅ 自动完成所有步骤
- ✅ 错误检查
- ✅ 交互式菜单

### 方式 2：手动命令

```bash
npm run build:ui
npx @capacitor/cli init
npx @capacitor/cli add ios
npx @capacitor/cli add android
npx @capacitor/cli sync
npx @capacitor/cli open ios
```

**优点：**
- ✅ 完全控制
- ✅ 了解每一步

### 方式 3：查看详细指南

打开 `APP_PACKAGING_GUIDE.md` 了解所有细节。

---

## ✅ 前置要求

### 已有

- ✅ Node.js v24.13.0
- ✅ npm
- ✅ 项目代码
- ✅ Capacitor 依赖

### 需要安装

```bash
# 全局安装 Capacitor CLI
npm install -g @capacitor/cli

# 验证
cap --version
```

### 平台特定要求

**iOS（macOS 必需）：**
```bash
# 安装 CocoaPods
sudo gem install cocoapods
```

**Android：**
- 安装 Android Studio
- 安装 Android SDK

---

## 🎮 测试应用

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

## 📦 发布到应用商店

### Google Play Store

1. 创建 Google Play 开发者账户（$25）
2. 生成签名密钥
3. 构建发布 APK
4. 上传到 Google Play Console
5. 提交审核

### Apple App Store

1. 创建 Apple Developer 账户（$99/年）
2. 在 Xcode 中配置签名
3. 构建发布版本
4. 上传到 App Store Connect
5. 提交审核

详见：`APP_PACKAGING_GUIDE.md`

---

## 🔍 常见问题

### Q: 如何在真机上测试？

**Android：**
1. 启用开发者模式（连续点击"版本号"7 次）
2. 启用 USB 调试
3. 连接设备
4. 在 Android Studio 中点击 Run

**iOS：**
1. 连接 iPhone
2. 在 Xcode 中选择设备
3. 点击 Run

### Q: 应用大小是多少？

- iOS：约 50-100 MB
- Android：约 30-50 MB

### Q: 如何调试应用？

**Android：**
```bash
adb logcat
# 或打开 chrome://inspect
```

**iOS：**
```
Safari > Develop > [设备名] > [应用名]
```

### Q: 遇到问题怎么办？

1. 查看 `APP_PACKAGING_GUIDE.md`
2. 查看 [Capacitor 文档](https://capacitorjs.com/docs)
3. 查看 [Android 文档](https://developer.android.com/docs)
4. 查看 [iOS 文档](https://developer.apple.com/documentation/)

---

## 🚀 立即开始

### 第 1 步：运行脚本

```powershell
.\build-app.ps1
```

### 第 2 步：选择选项 8

脚本会自动完成所有步骤。

### 第 3 步：打开 IDE

```bash
npx @capacitor/cli open ios    # 或 android
```

### 第 4 步：点击 Run

在 Xcode 或 Android Studio 中点击 Run 按钮。

---

## 📋 检查清单

- [ ] 安装 Capacitor CLI：`npm install -g @capacitor/cli`
- [ ] 运行脚本：`.\build-app.ps1`
- [ ] 选择"完整打包流程"
- [ ] 打开 iOS 项目（macOS）
- [ ] 打开 Android 项目
- [ ] 在真机上测试
- [ ] 准备发布到应用商店

---

## 🎉 完成

现在您可以：

✅ 在 iOS 上运行应用
✅ 在 Android 上运行应用
✅ 发布到 App Store
✅ 发布到 Google Play
✅ 分发给用户

---

## 📞 需要帮助？

- 📖 查看 `APP_PACKAGING_GUIDE.md`
- 📖 查看 `APP_BUILD_QUICK_START.md`
- 📖 查看 `APP_PACKAGING_COMPLETE.md`
- 🌐 查看 [Capacitor 文档](https://capacitorjs.com/docs)

---

**祝您打包成功！** 🚀

**版本**：1.0.0
**最后更新**：2026-01-17
**状态**：✅ 准备就绪
