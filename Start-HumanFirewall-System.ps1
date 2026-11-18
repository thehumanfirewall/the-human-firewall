$ErrorActionPreference = 'Stop'
$root = Join-Path $env:USERPROFILE 'OneDrive\Desktop\The Human Firewall'
Set-Location -LiteralPath $root
$health = $false
try { $health = [bool](Invoke-RestMethod -Uri 'http://127.0.0.1:3107/api/health' -TimeoutSec 2).ok } catch {}
if (-not $health) {
  $outLog = Join-Path $root 'hf-backend-stdout.log'
  $errLog = Join-Path $root 'hf-backend-stderr.log'
  Start-Process -FilePath 'node.exe' -ArgumentList 'server/index.cjs' -WorkingDirectory $root -RedirectStandardOutput $outLog -RedirectStandardError $errLog -PassThru | Out-Null
  foreach($attempt in 1..12){
    Start-Sleep -Milliseconds 750
    try { $health = [bool](Invoke-RestMethod -Uri 'http://127.0.0.1:3107/api/health' -TimeoutSec 2).ok } catch {}
    if ($health) { break }
  }
}
if (-not $health) {
  Write-Host 'BACKEND STARTUP LOG:' -ForegroundColor Yellow
  if(Test-Path $errLog){Get-Content $errLog -Tail 35}
  if(Test-Path $outLog){Get-Content $outLog -Tail 15}
  throw 'Backend could not start. See log output above.'
}
Write-Host 'DATABASE API READY: http://localhost:3107' -ForegroundColor Green
$frontendRunning = [bool](Get-NetTCPConnection -LocalPort 5180 -State Listen -ErrorAction SilentlyContinue)
if(-not $frontendRunning){
  Start-Process -FilePath 'cmd.exe' -ArgumentList '/k npm run dev -- --host localhost --port 5180 --strictPort' -WorkingDirectory $root | Out-Null
  Start-Sleep -Seconds 3
}
Start-Process 'http://localhost:5180/'
Write-Host 'GAME: http://localhost:5180/' -ForegroundColor Cyan
Write-Host 'Sign in with player.demo or admin.demo.' -ForegroundColor Yellow
