@echo off
REM 象棋線上對戰 - 測試啟動腳本

echo.
echo ========================================
echo   象棋線上對戰 - 測試啟動
echo ========================================
echo.

REM 檢查 Node.js 是否已安裝
node --version >nul 2>&1
if errorlevel 1 (
    echo 錯誤：未找到 Node.js，請先安裝 Node.js
    pause
    exit /b 1
)

echo ✓ Node.js 已安裝
echo.

REM 檢查依賴是否已安裝
if not exist "node_modules" (
    echo 正在安裝依賴...
    call npm install
    if errorlevel 1 (
        echo 錯誤：依賴安裝失敗
        pause
        exit /b 1
    )
    echo ✓ 依賴已安裝
    echo.
)

REM 編譯服務器
echo 正在編譯服務器...
call npm run server:build
if errorlevel 1 (
    echo 錯誤：服務器編譯失敗
    pause
    exit /b 1
)
echo ✓ 服務器已編譯
echo.

REM 啟動服務器
echo 正在啟動服務器...
echo.
echo ========================================
echo   服務器已啟動
echo   WebSocket 地址: ws://localhost:8080
echo   測試頁面: http://localhost:8080/test.html
echo ========================================
echo.

start http://localhost:8080/test.html

call npm run server

pause
