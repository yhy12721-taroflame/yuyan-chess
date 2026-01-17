# 🎮 象棋线上对战 - APP 打包指南

## 📱 支持平台

- ✅ iOS（iPhone、iPad）
- ✅ Android（手机、平板）
- ✅ Web（浏览器）

## 🚀 快速开始（5 分钟）

### 前置要求

```bash
# 1. 安装 Node.js（已有）
node --version  # v24.13.0

# 2. 安装 Capacitor CLI
npm install -g @capacitor/cli

# 3. 验证安装
cap --version
```

### 打包步骤

#### 第 1 步：构建 Web 应用

```bash
# 编译 TypeScript 和打包 UI
npm run build:ui

# 验证构建成功
ls -la public/app.js
```

#### 第 2 步：初始化 Capacitor 项目

```bash
# 初始化 Capacitor（仅需一次）
cap init

# 提示输入：
# App name: 象棋线上对战
# App Package ID: com.xiangqi.game
# Web dir: public
```

#### 第 3 步：添加平台

```bash
# 添加 iOS
cap add ios

# 添加 Android
cap add android
```

#### 第 4 步：同步代码

```bash
# 同步 Web 代码到原生项目
cap sync
```

#### 第 5 步：打开 IDE 进行最终构建

**iOS：**
```bash
cap open ios
# 在 Xcode 中：
# 1. 选择目标设备或模拟器
# 2. 点击 "Run" 按钮
# 3. 或者 Product > Archive 进行发布构建
```

**Android：**
```bash
cap open android
# 在 Android Studio 中：
# 1. 选择目标设备或模拟器
# 2. 点击 "Run" 按钮
# 3. 或者 Build > Build Bundle(s) / APK(s) 进行发布构建
```

---

## 📋 详细步骤

### 1️⃣ 环境设置

#### macOS（iOS 开发）

```bash
# 安装 Xcode（从 App Store）
# 或使用命令行工具
xcode-select --install

# 安装 CocoaPods
sudo gem install cocoapods

# 验证
xcode-select --print-path
```

#### Windows/macOS/Linux（Android 开发）

```bash
# 安装 Android Studio
# 下载：https://developer.android.com/studio

# 设置环境变量（Windows）
# ANDROID_HOME: C:\Users\[用户名]\AppData\Local\Android\sdk
# PATH: 添加 %ANDROID_HOME%\platform-tools

# 验证
adb --version
```

### 2️⃣ 项目配置

#### capacitor.config.json

```json
{
  "appId": "com.xiangqi.game",
  "appName": "象棋线上对战",
  "webDir": "public",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 0
    }
  }
}
```

#### iOS 配置（ios/App/App/Info.plist）

```xml
<key>NSLocalNetworkUsageDescription</key>
<string>此应用需要访问本地网络以进行在线对战</string>
<key>NSBonjourServices</key>
<array>
  <string>_http._tcp</string>
  <string>_ws._tcp</string>
</array>
```

#### Android 配置（android/app/build.gradle）

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 34
    }
}
```

### 3️⃣ 构建 APK（Android）

#### 调试版本

```bash
# 构建调试 APK
cd android
./gradlew assembleDebug

# APK 位置
# android/app/build/outputs/apk/debug/app-debug.apk
```

#### 发布版本

```bash
# 1. 生成签名密钥（仅需一次）
keytool -genkey -v -keystore xiangqi-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias xiangqi-key

# 2. 配置签名（android/app/build.gradle）
signingConfigs {
    release {
        storeFile file("../xiangqi-release.keystore")
        storePassword "your_password"
        keyAlias "xiangqi-key"
        keyPassword "your_password"
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}

# 3. 构建发布 APK
cd android
./gradlew assembleRelease

# APK 位置
# android/app/build/outputs/apk/release/app-release.apk
```

### 4️⃣ 构建 IPA（iOS）

#### 调试版本

```bash
# 在 Xcode 中
# 1. 选择 "Any iOS Device (arm64)"
# 2. Product > Build
```

#### 发布版本

```bash
# 在 Xcode 中
# 1. 选择 "Any iOS Device (arm64)"
# 2. Product > Archive
# 3. 在 Organizer 中选择 Archive
# 4. 点击 "Distribute App"
# 5. 选择 "App Store Connect"
# 6. 按照提示完成上传
```

---

## 📦 分发方式

### 方式 1：直接安装（开发/测试）

#### Android

```bash
# 连接 Android 设备
adb devices

# 安装 APK
adb install app-release.apk

# 卸载
adb uninstall com.xiangqi.game
```

#### iOS

```bash
# 使用 Xcode 安装到设备
# 或使用 Apple Configurator 2
```

### 方式 2：应用商店发布

#### Google Play Store

1. 创建 Google Play 开发者账户（$25 一次性费用）
2. 创建应用
3. 上传签名的 APK
4. 填写应用信息
5. 提交审核

#### Apple App Store

1. 创建 Apple Developer 账户（$99/年）
2. 创建应用
3. 上传签名的 IPA
4. 填写应用信息
5. 提交审核

### 方式 3：企业分发

#### Android

```bash
# 生成 QR 码
# 用户扫描 QR 码下载 APK
# 或通过企业 MDM 分发
```

#### iOS

```bash
# 使用 Apple Business Manager
# 或通过 MDM 分发
```

---

## 🔧 常见问题

### Q1: 如何在真机上测试？

**Android：**
```bash
# 启用开发者模式
# 设置 > 关于手机 > 连续点击"版本号"7 次

# 启用 USB 调试
# 设置 > 开发者选项 > USB 调试

# 连接设备
adb devices

# 运行应用
cap run android
```

**iOS：**
```bash
# 在 Xcode 中
# 1. 连接 iPhone
# 2. 选择设备
# 3. 点击 Run
```

### Q2: 如何处理网络权限？

**Android（android/app/src/AndroidManifest.xml）：**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**iOS（ios/App/App/Info.plist）：**
```xml
<key>NSLocalNetworkUsageDescription</key>
<string>此应用需要访问本地网络</string>
```

### Q3: 如何处理 HTTPS/WSS？

```javascript
// 在 src/app.ts 中
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${protocol}//${window.location.host}`;
```

### Q4: 如何调试应用？

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

### Q5: 如何优化应用大小？

```bash
# 1. 启用 ProGuard（Android）
# android/app/build.gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}

# 2. 启用 Bitcode（iOS）
# Xcode > Build Settings > Enable Bitcode = Yes

# 3. 移除未使用的代码
npm run build:ui -- --minify
```

---

## 📊 构建检查清单

- [ ] 运行 `npm run build:ui` 成功
- [ ] 运行 `cap sync` 成功
- [ ] iOS 在 Xcode 中编译成功
- [ ] Android 在 Android Studio 中编译成功
- [ ] 在真机上测试所有功能
- [ ] 测试网络连接（在线对战）
- [ ] 测试离线功能（本地对战）
- [ ] 检查应用权限
- [ ] 检查应用大小
- [ ] 准备应用商店发布

---

## 🎯 下一步

### 立即开始

```bash
# 1. 构建 Web 应用
npm run build:ui

# 2. 初始化 Capacitor
cap init

# 3. 添加平台
cap add ios
cap add android

# 4. 同步代码
cap sync

# 5. 打开 IDE
cap open ios    # 或 cap open android
```

### 发布到应用商店

1. **Google Play Store**：按照 [Google Play 发布指南](https://developer.android.com/studio/publish)
2. **Apple App Store**：按照 [App Store 发布指南](https://developer.apple.com/app-store/submission/)

---

## 📞 支持

### 遇到问题？

1. 查看 [Capacitor 文档](https://capacitorjs.com/docs)
2. 查看 [Android 开发文档](https://developer.android.com/docs)
3. 查看 [iOS 开发文档](https://developer.apple.com/documentation/)

### 需要帮助？

- 查看本文档
- 查看项目中的其他文档
- 查看应用中的错误日志

---

## ✅ 完成

现在您可以：

✅ 在 iOS 上运行应用
✅ 在 Android 上运行应用
✅ 发布到 App Store
✅ 发布到 Google Play
✅ 分发给用户

**祝您打包成功！** 🚀

---

**版本**：1.0.0
**最后更新**：2026-01-17
**状态**：✅ 准备就绪
