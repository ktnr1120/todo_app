# TODO App サーバー停止スクリプト
# 使用方法: .\stop-servers.ps1

Write-Host "Stopping TODO App servers..." -ForegroundColor Yellow

# PID保存ファイル
$pidFile = "$PSScriptRoot\server-pids.txt"

if (!(Test-Path $pidFile)) {
    Write-Host "No server PIDs found. Servers may not be running." -ForegroundColor Red
    exit 1
}

# PIDファイルを読み込み
$pids = Get-Content $pidFile

$stoppedCount = 0
foreach ($pid in $pids) {
    try {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $pid -Force
            Write-Host "Stopped process PID: $pid" -ForegroundColor Green
            $stoppedCount++
        } else {
            Write-Host "Process PID $pid not found (already stopped)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Failed to stop process PID $pid : $_" -ForegroundColor Red
    }
}

# PIDファイルを削除
Remove-Item $pidFile -Force

Write-Host "Stopped $stoppedCount server(s)" -ForegroundColor Green