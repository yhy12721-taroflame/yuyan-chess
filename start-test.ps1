# 象棋線上對戰 - 測試啟動腳本 (PowerShell)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  象棋線上對戰 - 測試啟動" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查 Node.js 是否已安裝
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 已安裝: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 錯誤：未找到 Node.js，請先安裝 Node.js" -ForegroundColor Red
    Read-Host "按 Enter 鍵退出"
    exit 1
}

Write-Host ""

# 檢查依賴是否已安裝
if (-not (Test-Path "node_modules")) {
    Write-Host "正在安裝依賴..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 錯誤：依賴安裝失敗" -ForegroundColor Red
        Read-Host "按 Enter 鍵退出"
        exit 1
    }
    Write-Host "✓ 依賴已安裝" -ForegroundColor Green
    Write-Host ""
}

# 編譯服務器
Write-Host "正在編譯服務器..." -ForegroundColor Yellow
npm run server:build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 錯誤：服務器編譯失敗" -ForegroundColor Red
    Read-Host "按 Enter 鍵退出"
    exit 1
}
Write-Host "✓ 服務器已編譯" -ForegroundColor Green
Write-Host ""

# 啟動服務器
Write-Host "正在啟動服務器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  服務器已啟動" -ForegroundColor Green
Write-Host "  WebSocket 地址: ws://localhost:8080" -ForegroundColor Green
Write-Host "  測試頁面: http://localhost:8080/test.html" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 打開測試頁面
Start-Process "http://localhost:8080/test.html"

# 啟動服務器
npm run server
