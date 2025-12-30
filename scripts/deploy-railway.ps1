# Railway Deployment Script for Windows PowerShell
# This script helps automate Railway deployment

Write-Host "🚂 Railway Deployment Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
try {
    $railwayVersion = railway --version 2>&1
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please install Railway CLI first:" -ForegroundColor Yellow
    Write-Host "  Run: iwr https://railway.app/install.sh | iex" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Login to Railway
Write-Host "🔐 Logging in to Railway..." -ForegroundColor Yellow
railway login

# Create new project or use existing
$createNew = Read-Host "Create new project? (y/n)"
if ($createNew -eq "y") {
    railway init
} else {
    railway link
}

# Deploy Backend
Write-Host ""
Write-Host "📦 Deploying Backend..." -ForegroundColor Yellow
Set-Location EcommerceApplication
railway up --service backend
Set-Location ..

# Deploy Frontend
Write-Host ""
Write-Host "📦 Deploying Frontend..." -ForegroundColor Yellow
Set-Location Frontend
railway up --service frontend
Set-Location ..

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set environment variables in Railway dashboard"
Write-Host "2. Add MySQL database"
Write-Host "3. Configure CORS settings"
Write-Host ""
Write-Host "See DEPLOY_FREE_STEPS.md for detailed instructions"

