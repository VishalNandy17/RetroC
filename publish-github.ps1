# GitHub Packages Publishing Script
# This script publishes RetroC v1.1.0 to GitHub Packages

Write-Host "🚀 Publishing RetroC v1.1.0 to GitHub Packages" -ForegroundColor Cyan
Write-Host ""

# Check if GITHUB_TOKEN is set
if (-not $env:GITHUB_TOKEN) {
    Write-Host "❌ Error: GITHUB_TOKEN environment variable is not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your GitHub Personal Access Token:" -ForegroundColor Yellow
    Write-Host '  $env:GITHUB_TOKEN="your-token-here"' -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Get your token from: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "Required scopes: write:packages, read:packages" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GITHUB_TOKEN found" -ForegroundColor Green
Write-Host ""

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Verify package.json version
$packageJson = Get-Content package.json | ConvertFrom-Json
Write-Host "📋 Package Info:" -ForegroundColor Cyan
Write-Host "   Name: $($packageJson.name)" -ForegroundColor White
Write-Host "   Version: $($packageJson.version)" -ForegroundColor White
Write-Host "   Publisher: $($packageJson.publisher)" -ForegroundColor White
Write-Host ""

# Confirm before publishing
$confirm = Read-Host "Publish $($packageJson.name)@$($packageJson.version) to GitHub Packages? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Publishing cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 Publishing to GitHub Packages..." -ForegroundColor Cyan
npm publish

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully published!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Package URL:" -ForegroundColor Cyan
    Write-Host "   https://github.com/VishalNandy17/RetroC/pkgs/npm/retroc" -ForegroundColor White
    Write-Host ""
    Write-Host "📥 Install with:" -ForegroundColor Cyan
    Write-Host "   npm install @VishalNandy17/retroc@$($packageJson.version)" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Publishing failed!" -ForegroundColor Red
    Write-Host "Check the error message above for details." -ForegroundColor Yellow
    exit 1
}

