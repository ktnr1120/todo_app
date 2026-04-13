# TODO App サーバー状態確認スクリプト
# 使用方法: .\check-servers.ps1

Write-Host "Checking TODO App server status..." -ForegroundColor Green
Write-Host ""

# バックエンド確認 (ポート3000)
Write-Host "Backend Server (port 3000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $content = $response.Content | ConvertFrom-Json
        Write-Host "  Status: RUNNING" -ForegroundColor Green
        Write-Host "  Response: $($content | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Status: STOPPED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# フロントエンド確認 (ポート5174)
Write-Host "Frontend Server (port 5174):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174/" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  Status: RUNNING" -ForegroundColor Green
        Write-Host "  Title: $($response.ParsedHtml.title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Status: STOPPED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Quick commands:" -ForegroundColor Cyan
Write-Host "  Start: .\start-servers.ps1" -ForegroundColor Gray
Write-Host "  Stop:  .\stop-servers.ps1" -ForegroundColor Gray