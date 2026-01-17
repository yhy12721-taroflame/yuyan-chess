# Vercel 部署腳本

Write-Host "🚀 開始部署到 Vercel..." -ForegroundColor Green

# 步驟 1：構建應用
Write-Host "`n📦 構建 Web UI..." -ForegroundColor Cyan
npm run build:ui
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Web UI 構建失敗" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 構建伺服器..." -ForegroundColor Cyan
npm run server:build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 伺服器構建失敗" -ForegroundColor Red
    exit 1
}

# 步驟 2：驗證構建
Write-Host "`n✅ 驗證構建文件..." -ForegroundColor Cyan
if (-not (Test-Path "public/app.js")) {
    Write-Host "❌ public/app.js 不存在" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "server/dist/server.js")) {
    Write-Host "❌ server/dist/server.js 不存在" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 構建文件驗證成功" -ForegroundColor Green

# 步驟 3：檢查 Git 狀態
Write-Host "`n📝 檢查 Git 狀態..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  有未提交的更改：" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host "`n提交更改？(y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq 'y') {
        git add .
        $message = Read-Host "提交信息"
        git commit -m $message
    }
}

# 步驟 4：推送到 GitHub
Write-Host "`n📤 推送到 GitHub..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 推送失敗" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ 推送成功！" -ForegroundColor Green
Write-Host "`n📋 後續步驟：" -ForegroundColor Cyan
Write-Host "1. 訪問 https://vercel.com" -ForegroundColor White
Write-Host "2. 登錄你的 Vercel 帳號" -ForegroundColor White
Write-Host "3. 導入 xiangqi-game 倉庫" -ForegroundColor White
Write-Host "4. 配置部署設置（見 CLOUD_DEPLOYMENT_GUIDE.md）" -ForegroundColor White
Write-Host "5. 點擊 Deploy" -ForegroundColor White

Write-Host "`n🎉 部署準備完成！" -ForegroundColor Green
