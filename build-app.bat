@echo off
REM 象棋线上对战 - APP 打包脚本
REM 支持 iOS 和 Android

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   象棋线上对战 - APP 打包工具
echo ========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到 Node.js
    echo 请先安装 Node.js：https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到 npm
    echo 请先安装 npm
    pause
    exit /b 1
)

echo ✅ Node.js 和 npm 已安装
echo.

REM 菜单
:menu
echo 请选择操作：
echo.
echo 1. 构建 Web 应用
echo 2. 初始化 Capacitor（仅需一次）
echo 3. 添加 iOS 平台
echo 4. 添加 Android 平台
echo 5. 同步代码到原生项目
echo 6. 打开 iOS 项目（Xcode）
echo 7. 打开 Android 项目（Android Studio）
echo 8. 完整打包流程（1-5）
echo 9. 退出
echo.

set /p choice="请输入选择（1-9）："

if "%choice%"=="1" goto build_web
if "%choice%"=="2" goto init_capacitor
if "%choice%"=="3" goto add_ios
if "%choice%"=="4" goto add_android
if "%choice%"=="5" goto sync_code
if "%choice%"=="6" goto open_ios
if "%choice%"=="7" goto open_android
if "%choice%"=="8" goto full_build
if "%choice%"=="9" goto exit_script
goto menu

:build_web
echo.
echo 📦 构建 Web 应用...
call npm run build:ui
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    goto menu
)
echo ✅ Web 应用构建成功
echo.
pause
goto menu

:init_capacitor
echo.
echo 🔧 初始化 Capacitor...
echo.
echo 请按照提示输入以下信息：
echo - App name: 象棋线上对战
echo - App Package ID: com.xiangqi.game
echo - Web dir: public
echo.
call npx @capacitor/cli init
if errorlevel 1 (
    echo ❌ 初始化失败
    pause
    goto menu
)
echo ✅ Capacitor 初始化成功
echo.
pause
goto menu

:add_ios
echo.
echo 🍎 添加 iOS 平台...
call npx @capacitor/cli add ios
if errorlevel 1 (
    echo ❌ 添加 iOS 失败
    pause
    goto menu
)
echo ✅ iOS 平台添加成功
echo.
pause
goto menu

:add_android
echo.
echo 🤖 添加 Android 平台...
call npx @capacitor/cli add android
if errorlevel 1 (
    echo ❌ 添加 Android 失败
    pause
    goto menu
)
echo ✅ Android 平台添加成功
echo.
pause
goto menu

:sync_code
echo.
echo 🔄 同步代码到原生项目...
call npx @capacitor/cli sync
if errorlevel 1 (
    echo ❌ 同步失败
    pause
    goto menu
)
echo ✅ 代码同步成功
echo.
pause
goto menu

:open_ios
echo.
echo 🍎 打开 iOS 项目...
if not exist "ios" (
    echo ❌ 错误：iOS 项目不存在
    echo 请先运行"添加 iOS 平台"
    pause
    goto menu
)
call npx @capacitor/cli open ios
pause
goto menu

:open_android
echo.
echo 🤖 打开 Android 项目...
if not exist "android" (
    echo ❌ 错误：Android 项目不存在
    echo 请先运行"添加 Android 平台"
    pause
    goto menu
)
call npx @capacitor/cli open android
pause
goto menu

:full_build
echo.
echo 🚀 执行完整打包流程...
echo.

echo 第 1 步：构建 Web 应用...
call npm run build:ui
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    goto menu
)
echo ✅ Web 应用构建成功
echo.

echo 第 2 步：初始化 Capacitor...
if not exist "capacitor.config.json" (
    echo 请按照提示输入以下信息：
    echo - App name: 象棋线上对战
    echo - App Package ID: com.xiangqi.game
    echo - Web dir: public
    echo.
    call npx @capacitor/cli init
    if errorlevel 1 (
        echo ❌ 初始化失败
        pause
        goto menu
    )
    echo ✅ Capacitor 初始化成功
    echo.
)

echo 第 3 步：添加 iOS 平台...
if not exist "ios" (
    call npx @capacitor/cli add ios
    if errorlevel 1 (
        echo ⚠️  iOS 添加失败（可能需要 macOS）
    ) else (
        echo ✅ iOS 平台添加成功
    )
) else (
    echo ℹ️  iOS 平台已存在
)
echo.

echo 第 4 步：添加 Android 平台...
if not exist "android" (
    call npx @capacitor/cli add android
    if errorlevel 1 (
        echo ❌ Android 添加失败
        pause
        goto menu
    )
    echo ✅ Android 平台添加成功
) else (
    echo ℹ️  Android 平台已存在
)
echo.

echo 第 5 步：同步代码...
call npx @capacitor/cli sync
if errorlevel 1 (
    echo ❌ 同步失败
    pause
    goto menu
)
echo ✅ 代码同步成功
echo.

echo ========================================
echo ✅ 完整打包流程完成！
echo ========================================
echo.
echo 下一步：
echo - iOS: 运行 "cap open ios" 在 Xcode 中打开
echo - Android: 运行 "cap open android" 在 Android Studio 中打开
echo.
pause
goto menu

:exit_script
echo.
echo 👋 再见！
echo.
exit /b 0
