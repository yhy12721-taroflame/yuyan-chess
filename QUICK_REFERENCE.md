# 📋 快速参考卡 - 象棋线上对战

## 🚀 最快的方式（30 秒）

```powershell
.\build-app.ps1
# 选择 8
```

---

## 📱 打包步骤

### 第 1 步：构建
```bash
npm run build:ui
```

### 第 2 步：初始化
```bash
npx @capacitor/cli init
```

### 第 3 步：添加平台
```bash
npx @capacitor/cli add ios
npx @capacitor/cli add android
```

### 第 4 步：同步
```bash
npx @capacitor/cli sync
```

### 第 5 步：打开 IDE
```bash
npx @capacitor/cli open ios    # 或 android
```

### 第 6 步：点击 Run

---

## 🎯 常用命令

| 命令 | 说明 |
|------|------|
| `npm run build:ui` | 构建 Web 应用 |
| `npm run dev` | 启动开发服务器 |
| `npm test` | 运行测试 |
| `npm run server:dev` | 启动服务器 |
| `npx @capacitor/cli init` | 初始化 Capacitor |
| `npx @capacitor/cli add ios` | 添加 iOS |
| `npx @capacitor/cli add android` | 添加 Android |
| `npx @capacitor/cli sync` | 同步代码 |
| `npx @capacitor/cli open ios` | 打开 Xcode |
| `npx @capacitor/cli open android` | 打开 Android Studio |

---

## 📚 文档速查

| 需求 | 文档 |
|------|------|
| 快速打包 | `START_APP_PACKAGING.md` |
| 5 分钟打包 | `APP_BUILD_QUICK_START.md` |
| 详细指南 | `APP_PACKAGING_GUIDE.md` |
| 项目状态 | `PROJECT_STATUS.md` |
| 文档索引 | `DOCUMENTATION_INDEX.md` |
| 快速部署 | `SERVER_DEPLOYMENT_QUICK_START.md` |
| 项目说明 | `README.md` |

---

## 🔧 环境要求

### 必需
- ✅ Node.js v24.13.0
- ✅ npm
- ✅ Capacitor CLI

### iOS（macOS）
- ✅ Xcode
- ✅ CocoaPods

### Android
- ✅ Android Studio
- ✅ Android SDK

---

## 📱 测试应用

### 本地对战
1. 打开应用
2. 点击"本地对战"
3. 开始游戏

### 线上对战
1. 打开应用
2. 点击"线上对决"
3. 创建或加入房间

---

## 🎯 三种打包方式

### 方式 1：脚本（推荐）
```powershell
.\build-app.ps1
```

### 方式 2：手动
```bash
npm run build:ui
npx @capacitor/cli init
npx @capacitor/cli add ios
npx @capacitor/cli add android
npx @capacitor/cli sync
npx @capacitor/cli open ios
```

### 方式 3：查看指南
打开 `APP_PACKAGING_GUIDE.md`

---

## 🔍 常见问题

### 如何在真机上测试？

**Android：**
1. 启用开发者模式
2. 启用 USB 调试
3. 连接设备
4. 在 Android Studio 中点击 Run

**iOS：**
1. 连接 iPhone
2. 在 Xcode 中选择设备
3. 点击 Run

### 如何调试？

**Android：**
```bash
adb logcat
```

**iOS：**
```
Safari > Develop > [设备名] > [应用名]
```

### 应用大小？

- iOS：50-100 MB
- Android：30-50 MB

---

## 📦 发布到应用商店

### Google Play
1. 创建账户（$25）
2. 生成签名密钥
3. 构建发布 APK
4. 上传到 Google Play Console

### Apple App Store
1. 创建账户（$99/年）
2. 在 Xcode 中配置签名
3. 构建发布版本
4. 上传到 App Store Connect

---

## ✅ 检查清单

- [ ] 安装 Capacitor CLI
- [ ] 运行脚本
- [ ] 选择"完整打包流程"
- [ ] 打开 IDE
- [ ] 在真机上测试
- [ ] 准备发布

---

## 🎉 立即开始

```powershell
.\build-app.ps1
```

---

**版本**：1.0.0
**最后更新**：2026-01-17
**状态**：✅ 准备就绪
