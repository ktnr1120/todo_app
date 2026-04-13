# TODO App サーバー起動スクリプト
# 使用方法: .\start-servers.ps1

Write-Host "Starting TODO App servers..." -ForegroundColor Green

# PID保存ファイル
$pidFile = "$PSScriptRoot\server-pids.txt"

# 既存のPIDファイルを削除
if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force
}

# バックエンド起動
Write-Host "Starting backend server..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "$PSScriptRoot\backend" -PassThru -NoNewWindow
$backendProcess.Id | Out-File -FilePath $pidFile -Append

# 少し待機
Start-Sleep -Seconds 2

# フロントエンド起動
Write-Host "Starting frontend server..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru -NoNewWindow
$frontendProcess.Id | Out-File -FilePath $pidFile -Append

Write-Host "Servers started successfully!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5174" -ForegroundColor Cyan
Write-Host "Use '.\stop-servers.ps1' to stop servers" -ForegroundColor Gray