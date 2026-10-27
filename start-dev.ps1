$ErrorActionPreference = 'Stop'

$backendPath = Join-Path $PSScriptRoot 'backend'
$frontendPath = Join-Path $PSScriptRoot 'frontend'
$pythonPath = Join-Path $backendPath '.venv\Scripts\python.exe'

if (-not (Test-Path $pythonPath) -or -not (Test-Path (Join-Path $frontendPath 'node_modules'))) {
    & (Join-Path $PSScriptRoot 'setup.ps1')
}

$docker = Get-Command docker -ErrorAction SilentlyContinue
if ($docker) {
    & docker compose -f (Join-Path $backendPath 'docker-compose.yml') up -d db
    if ($LASTEXITCODE -ne 0) {
        throw 'PostgreSQL did not start. Check Docker Desktop and retry.'
    }
}
elseif (-not (Test-NetConnection 127.0.0.1 -Port 5433 -InformationLevel Quiet)) {
    Write-Warning 'Docker is unavailable and PostgreSQL is not listening on port 5433. Set DATABASE_URL in backend/.env to a PostgreSQL server you can access before using the API.'
}

$backendCommand = "Set-Location -LiteralPath '$backendPath'; . .\.venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --reload --reload-dir app --host 0.0.0.0 --port 8000"
$frontendCommand = "Set-Location -LiteralPath '$frontendPath'; npm run dev"

Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList "-NoExit -ExecutionPolicy Bypass -Command `"$backendCommand`""
Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList "-NoExit -ExecutionPolicy Bypass -Command `"$frontendCommand`""

Write-Host 'Backend: http://localhost:8000/docs'
Write-Host 'Frontend: http://localhost:5173/'