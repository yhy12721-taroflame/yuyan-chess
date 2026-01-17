# Android 应用构建说明

## 当前状态

✅ Android 项目结构已完整生成
✅ Capacitor 已正确配置
✅ Web 资源已复制到 Android 项目
✅ 应用名称已设置为 "yu_yan chess"
✅ 应用包名已设置为 "com.yuyan.chess"

## 下一步操作

### 1. 在 Android Studio 中同步 Gradle

Android Studio 已打开项目。请按照以下步骤操作：

1. **等待 Android Studio 完全加载项目**
   - 可能需要 1-2 分钟时间
   - 观察底部状态栏的进度

2. **点击 "Sync Now" 按钮**
   - 如果看到黄色提示条，点击右侧的 "Sync Now" 按钮
   - 如果没有看到，可以使用菜单：`File` → `Sync Project with Gradle Files`

3. **等待 Gradle 同步完成**
   - 同步过程可能需要 2-5 分钟
   - 观察底部的 "Build" 标签页查看进度

### 2. 构建应用

同步完成后，构建应用：

1. **使用菜单构建**
   - `Build` → `Make Project`
   - 或按快捷键 `Ctrl + F9`

2. **或使用 Gradle 命令**
   ```powershell
   # 在项目根目录运行
   android\gradlew.bat build
   ```

### 3. 运行应用

构建成功后，可以在模拟器或真机上运行：

1. **连接 Android 设备或启动模拟器**

2. **运行应用**
   - `Run` → `Run 'app'`
   - 或按快捷键 `Shift + F10`

## 常见问题

### 问题：Gradle 同步失败

**解决方案：**
1. 检查 Java 是否正确安装
2. 在 Android Studio 中：`File` → `Settings` → `Languages & Frameworks` → `Android SDK`
3. 确保 SDK 版本正确（建议 API 36）

### 问题：构建失败

**解决方案：**
1. 清理项目：`Build` → `Clean Project`
2. 重新构建：`Build` → `Rebuild Project`
3. 检查 `android/app/build.gradle` 中的依赖版本

### 问题：应用无法启动

**解决方案：**
1. 检查 `AndroidManifest.xml` 中的权限配置
2. 确保 Web 资源已正确复制到 `android/app/src/main/assets/public/`
3. 查看 Android Studio 的 Logcat 窗口查看错误信息

## 项目文件位置

- **工作区根目录**：`C:\Users\yhy12\.kiro`
- **Android 项目**：`C:\Users\yhy12\.kiro\android`
- **Web 资源**：`C:\Users\yhy12\.kiro\public`
- **应用配置**：`C:\Users\yhy12\.kiro\capacitor.config.json`

## 验证清单

- [x] Android 项目结构完整
- [x] Capacitor 配置正确
- [x] 应用名称设置为 "yu_yan chess"
- [x] 应用包名设置为 "com.yuyan.chess"
- [x] Web 资源已复制
- [ ] Gradle 同步完成（需要在 Android Studio 中操作）
- [ ] 应用构建成功（需要在 Android Studio 中操作）
- [ ] 应用在模拟器/真机上运行成功（需要在 Android Studio 中操作）

## 下一步

完成上述步骤后，应用将可以在 Android 设备上运行。如需打包成 APK 或 AAB 文件用于发布，请参考 `APP_PACKAGING_GUIDE.md`。
