# ============================================================
# TechStore — автодеплой на Render
# Запусти: .\deploy-render.ps1
# ============================================================

$GITHUB_REPO = "https://github.com/xxxSKYFLYxxx/techstore"
$REPO_NAME   = "xxxSKYFLYxxx/techstore"

Write-Host ""
Write-Host "  TechStore Deploy to Render" -ForegroundColor Cyan
Write-Host ""

# ── Шаг 1: API ключ ─────────────────────────────────────────
Write-Host "Шаг 1: Получи API ключ на https://dashboard.render.com/u/settings" -ForegroundColor Yellow
Write-Host "       Account Settings -> API Keys -> Create API Key" -ForegroundColor Gray
Write-Host ""
$API_KEY = Read-Host "Вставь Render API Key"
if (-not $API_KEY) { Write-Host "API ключ не указан" -ForegroundColor Red; exit 1 }

$headers = @{
    "Authorization" = "Bearer $API_KEY"
    "Content-Type"  = "application/json"
}

# ── Шаг 2: Создать PostgreSQL ─────────────────────────────────
Write-Host ""
Write-Host "[1/3] Создаю PostgreSQL..." -ForegroundColor Yellow

$dbBody = @{
    name           = "techstore-db"
    databaseName   = "techstore"
    user           = "techstore_user"
    plan           = "free"
    region         = "frankfurt"
} | ConvertTo-Json

$db = Invoke-RestMethod -Uri "https://api.render.com/v1/postgres" `
    -Method POST -Headers $headers -Body $dbBody
$dbId = $db.id
$dbConnString = $db.connectionInfo.externalConnectionString

Write-Host "   PostgreSQL создан: $dbId" -ForegroundColor Green
Start-Sleep -Seconds 5

# ── Шаг 3: Создать Backend ────────────────────────────────────
Write-Host "[2/3] Создаю Backend API..." -ForegroundColor Yellow

$backendBody = @{
    type           = "web_service"
    name           = "techstore-api"
    repo           = $GITHUB_REPO
    branch         = "main"
    rootDir        = "backend"
    buildCommand   = "npm install && npm run build && npx prisma generate && npx prisma migrate deploy"
    startCommand   = "npm start"
    plan           = "free"
    region         = "frankfurt"
    envVars        = @(
        @{ key="NODE_ENV";              value="production" }
        @{ key="PORT";                  value="10000" }
        @{ key="DATABASE_URL";          value=$dbConnString }
        @{ key="JWT_SECRET";            generateValue=$true }
        @{ key="JWT_REFRESH_SECRET";    generateValue=$true }
        @{ key="JWT_EXPIRES_IN";        value="15m" }
        @{ key="JWT_REFRESH_EXPIRES_IN";value="7d" }
        @{ key="CLIENT_URL";            value="https://techstore-web.onrender.com" }
    )
} | ConvertTo-Json -Depth 5

$backend = Invoke-RestMethod -Uri "https://api.render.com/v1/services" `
    -Method POST -Headers $headers -Body $backendBody
$backendId  = $backend.service.id
$backendUrl = $backend.service.serviceDetails.url
Write-Host "   Backend создан: $backendUrl" -ForegroundColor Green

# ── Шаг 4: Создать Frontend ───────────────────────────────────
Write-Host "[3/3] Создаю Frontend Next.js..." -ForegroundColor Yellow

$frontendBody = @{
    type           = "web_service"
    name           = "techstore-web"
    repo           = $GITHUB_REPO
    branch         = "main"
    rootDir        = "frontend"
    buildCommand   = "npm install && npm run build"
    startCommand   = "npm start"
    plan           = "free"
    region         = "frankfurt"
    envVars        = @(
        @{ key="NODE_ENV";              value="production" }
        @{ key="PORT";                  value="10000" }
        @{ key="NEXT_PUBLIC_API_URL";   value="$backendUrl/api" }
    )
} | ConvertTo-Json -Depth 5

$frontend = Invoke-RestMethod -Uri "https://api.render.com/v1/services" `
    -Method POST -Headers $headers -Body $frontendBody
$frontendId  = $frontend.service.id
$frontendUrl = $frontend.service.serviceDetails.url
Write-Host "   Frontend создан: $frontendUrl" -ForegroundColor Green

# ── Шаг 5: Получить Deploy Hooks и добавить в GitHub ─────────
Write-Host ""
Write-Host "Настраиваю GitHub Secrets для автодеплоя..." -ForegroundColor Yellow

$backendHook  = "https://api.render.com/deploy/$backendId?key=$API_KEY"
$frontendHook = "https://api.render.com/deploy/$frontendId?key=$API_KEY"

# Set GitHub secrets via gh CLI
& gh secret set RENDER_BACKEND_DEPLOY_HOOK  --repo $REPO_NAME --body $backendHook
& gh secret set RENDER_FRONTEND_DEPLOY_HOOK --repo $REPO_NAME --body $frontendHook

Write-Host ""
Write-Host "  ГОТОВО!" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  $backendUrl" -ForegroundColor Cyan
Write-Host "  Frontend: $frontendUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Каждый git push -> автодеплой через GitHub Actions" -ForegroundColor Gray
Write-Host "  Первый деплой займёт 5-10 минут (идёт сборка)" -ForegroundColor Gray
Write-Host ""
