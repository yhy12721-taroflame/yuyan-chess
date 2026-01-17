@echo off
echo ========================================
echo 检查 Node.js 安装状态
echo ========================================
echo.

echo 检查 Node.js...
where node
if %ERRORLEVEL% EQU 0 (
    node --version
    echo [OK] Node.js 已安装
) else (
    echo [错误] 找不到 Node.js
    echo 请确保已安装 Node.js 并重启终端
)

echo.
echo 检查 npm...
where npm
if %ERRORLEVEL% EQU 0 (
    npm --version
    echo [OK] npm 已安装
) else (
    echo [错误] 找不到 npm
)

echo.
echo ========================================
echo 如果看到错误，请：
echo 1. 确认已安装 Node.js
echo 2. 重启 PowerShell/命令提示符
echo 3. 或重启电脑
echo ========================================
pause
