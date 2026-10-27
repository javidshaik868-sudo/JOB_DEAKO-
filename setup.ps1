$ErrorActionPreference = 'Stop'

$backendPath = Join-Path $PSScriptRoot 'backend'
$frontendPath = Join-Path $PSScriptRoot 'frontend'
$venvPath = Join-Path $backendPath '.venv'
$pythonPath = Join-Path $venvPath 'Scripts\python.exe'

if (-not (Test-Path $pythonPath)) {
    python -m venv $venvPath
}

$activateScript = Join-Path $venvPath 'Scripts\Activate.ps1'
if (-not (Test-Path (Join-Path $backendPath '.env'))) {
    Copy-Item (Join-Path $backendPath '.env.example') (Join-Path $backendPath '.env')
}

Push-Location $backendPath
try {
    . $activateScript
    python -m pip install -r requirements.txt
}
finally {
    Pop-Location
}

Push-Location $frontendPath
try {
    npm install
}
finally {
    Pop-Location
}

Write-Host 'Job Dheako dependencies are ready.'