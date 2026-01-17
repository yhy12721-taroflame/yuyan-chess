# 象棋线上对战 - APP 打包脚本（PowerShell）
# 支持 iOS 和 Android

function Show-Menu {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  象棋线上对战 - APP 打包工具" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "请选择操作：" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. 构建 Web 应用" -ForegroundColor Green
    Write-Host "2. 初始化 Capacitor（仅需一次）" -ForegroundColor Green
    Write-Host "3. 添加 iOS 平台" -ForegroundColor Green
    Write-Host "4. 添加 Android 平台" -ForegroundColor Green
    Write-Host "5. 同步代码到原生项目" -ForegroundColor Green
    Write-Host "6. 打开 iOS 项目（Xcode）" -ForegroundColor Green
    Write-Host "7. 打开 Android 项目（Android Studio）" -ForegroundColor Green
    Write-Host "8. 完整打包流程（1-5）" -ForegroundColor Green
    Write-Host "9. 退出" -ForegroundColor Green
    Write-Host ""
}

function Check-Prerequisites {
    Write-Host "检查环境..." -ForegroundColor Yellow
    
    # 检查 Node.js
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) {
        Write-Host "❌ 错误：未找到 Node.js" -ForegroundColor Red
        Write-Host "请先安装 Node.js：https://nodejs.org/" -ForegroundColor Red
        Read-Host "按 Enter 继续"
        exit 1
    }
    
    # 检查 npm
    $npm = Get-Command npm -ErrorAction SilentlyContinue
    if (-not $npm) {
        Write-Host "❌ 错误：未找到 npm" -ForegroundColor Red
        Read-Host "按 Enter 继续"
        exit 1
    }
    
    Write-Host "✅ Node.js 和 npm 已安装" -ForegroundColor Green
    Write-Host ""
}

function Build-Web {
    Write-Host ""
    Write-Host "📦 构建 Web 应用..." -ForegroundColor Yellow
    npm run build:ui
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Web 应用构建成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 构建失败" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "按 Enter 继续"
}

function Init-Capacitor {
    Write-Host ""
    Write-Host "🔧 初始化 Capacitor..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请按照提示输入以下信息：" -ForegroundColor Cyan
    Write-Host "- App name: 象棋线上对战" -ForegroundColor Cyan
    Write-Host "- App Package ID: com.xiangqi.game" -ForegroundColor Cyan
    Write-Host "- Web dir: public" -ForegroundColor Cyan
    Write-Host ""
    
    npx @capacitor/cli init
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Capacitor 初始化成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 初始化失败" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "按 Enter 继续"
}

function Add-iOS {
    Write-Host ""
    Write-Host "🍎 添加 iOS 平台..." -ForegroundColor Yellow
    npx @capacitor/cli add ios
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ iOS 平台添加成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 添加 iOS 失败" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "按 Enter 继续"
}

function Add-Android {
    Write-Host ""
    Write-Host "🤖 添加 Android 平台..." -ForegroundColor Yellow
    npx @capacitor/cli add android
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Android 平台添加成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 添加 Android 失败" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "按 Enter 继续"
}

function Sync-Code {
    Write-Host ""
    Write-Host "🔄 同步代码到原生项目..." -ForegroundColor Yellow
    npx @capacitor/cli sync
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 代码同步成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 同步失败" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "按 Enter 继续"
}

function Open-iOS {
    Write-Host ""
    Write-Host "🍎 打开 iOS 项目..." -ForegroundColor Yellow
    
    if (-not (Test-Path "ios")) {
        Write-Host "❌ 错误：iOS 项目不存在" -ForegroundColor Red
        Write-Host "请先运行'添加 iOS 平台'" -ForegroundColor Red
        Read-Host "按 Enter 继续"
        return
    }
    
    npx @capacitor/cli open ios
    Read-Host "按 Enter 继续"
}

function Open-Android {
    Write-Host ""
    Write-Host "🤖 打开 Android 项目..." -ForegroundColor Yellow
    
    if (-not (Test-Path "android")) {
        Write-Host "❌ 错误：Android 项目不存在" -ForegroundColor Red
        Write-Host "请先运行'添加 Android 平台'" -ForegroundColor Red
        Read-Host "按 Enter 继续"
        return
    }
    
    npx @capacitor/cli open android
    Read-Host "按 Enter 继续"
}

function Full-Build {
    Write-Host ""
    Write-Host "🚀 执行完整打包流程..." -ForegroundColor Yellow
    Write-Host ""
    
    # 第 1 步
    Write-Host "第 1 步：构建 Web 应用..." -ForegroundColor Cyan
    npm run build:ui
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 构建失败" -ForegroundColor Red
        Read-Host "按 Enter 继续"
        return
    }
    Write-Host "✅ Web 应用构建成功" -ForegroundColor Green
    Write-Host ""
    
    # 第 2 步
    Write-Host "第 2 步：初始化 Capacitor..." -ForegroundColor Cyan
    if (-not (Test-Path "capacitor.config.json")) {
        Write-Host "请按照提示输入以下信息：" -ForegroundColor Cyan
        Write-Host "- App name: 象棋线上对战" -ForegroundColor Cyan
        Write-Host "- App Package ID: com.xiangqi.game" -ForegroundColor Cyan
        Write-Host "- Web dir: public" -ForegroundColor Cyan
        Write-Host ""
        
        npx @capacitor/cli init
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ 初始化失败" -ForegroundColor Red
            Read-Host "按 Enter 继续"
            return
        }
        Write-Host "✅ Capacitor 初始化成功" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Capacitor 已初始化" -ForegroundColor Cyan
    }
    Write-Host ""
    
    # 第 3 步
    Write-Host "第 3 步：添加 iOS 平台..." -ForegroundColor Cyan
    if (-not (Test-Path "ios")) {
        npx @capacitor/cli add ios
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ iOS 平台添加成功" -ForegroundColor Green
        } else {
            Write-Host "⚠️  iOS 添加失败（可能需要 macOS）" -ForegroundColor Yellow
        }
    } else {
        Write-Host "ℹ️  iOS 平台已存在" -ForegroundColor Cyan
    }
    Write-Host ""
    
    # 第 4 步
    Write-Host "第 4 步：添加 Android 平台..." -ForegroundColor Cyan
    if (-not (Test-Path "android")) {
        npx @capacitor/cli add android
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Android 添加失败" -ForegroundColor Red
            Read-Host "按 Enter 继续"
            return
        }
        Write-Host "✅ Android 平台添加成功" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Android 平台已存在" -ForegroundColor Cyan
    }
    Write-Host ""
    
    # 第 5 步
    Write-Host "第 5 步：同步代码..." -ForegroundColor Cyan
    npx @capacitor/cli sync
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 同步失败" -ForegroundColor Red
        Read-Host "按 Enter 继续"
        return
    }
    Write-Host "✅ 代码同步成功" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ 完整打包流程完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "- iOS: 运行 'cap open ios' 在 Xcode 中打开" -ForegroundColor Cyan
    Write-Host "- Android: 运行 'cap open android' 在 Android Studio 中打开" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "按 Enter 继续"
}

# 主程序
Check-Prerequisites

while ($true) {
    Show-Menu
    $choice = Read-Host "请输入选择（1-9）"
    
    switch ($choice) {
        "1" { Build-Web }
        "2" { Init-Capacitor }
        "3" { Add-iOS }
        "4" { Add-Android }
        "5" { Sync-Code }
        "6" { Open-iOS }
        "7" { Open-Android }
        "8" { Full-Build }
        "9" {
            Write-Host ""
            Write-Host "👋 再见！" -ForegroundColor Cyan
            Write-Host ""
            exit 0
        }
        default {
            Write-Host "❌ 无效的选择，请重试" -ForegroundColor Red
            Read-Host "按 Enter 继续"
        }
    }
}
