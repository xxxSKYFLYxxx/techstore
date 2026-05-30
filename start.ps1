$pgBin  = "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe"
$pgData = "C:\Program Files\PostgreSQL\17\data"
$root   = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  TechStore - starting..." -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] PostgreSQL..." -ForegroundColor Yellow
$pgStatus = & $pgBin status -D $pgData 2>&1
if ($pgStatus -like "*server is running*") {
    Write-Host "      already running" -ForegroundColor Green
} else {
    & $pgBin start -D $pgData -l "$pgData\pg.log" | Out-Null
    Start-Sleep -Seconds 2
    $pgStatus = & $pgBin status -D $pgData 2>&1
    if ($pgStatus -like "*server is running*") {
        Write-Host "      started" -ForegroundColor Green
    } else {
        Write-Host "      ERROR - check $pgData\pg.log" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[2/3] Backend  -> http://localhost:4000" -ForegroundColor Yellow
$backendPath = Join-Path $root "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev"
Start-Sleep -Seconds 3
Write-Host "      ok" -ForegroundColor Green

Write-Host "[3/3] Frontend -> http://localhost:3000" -ForegroundColor Yellow
$frontendPath = Join-Path $root "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"
Start-Sleep -Seconds 2
Write-Host "      ok" -ForegroundColor Green

Write-Host ""
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  admin@techstore.ru / admin123" -ForegroundColor Cyan
Write-Host ""