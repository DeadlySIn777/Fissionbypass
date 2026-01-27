# FissionBypass Pro - Complete Setup Script
# This script runs all automation tasks in sequence
#
# Prerequisites:
# 1. Node.js installed (for asset generation)
# 2. GitHub Personal Access Token set as environment variable
#
# Usage:
#   $env:GITHUB_TOKEN = "your_token_here"
#   .\scripts\setup_complete.ps1

param(
    [switch]$SkipAssets,
    [switch]$SkipRelease,
    [switch]$SkipRepoConfig
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       FissionBypass Pro - Complete Setup Script           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Push-Location $ProjectDir

# Step 1: Generate Assets
if (-not $SkipAssets) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "📸 Step 1: Generating Assets" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    
    if (Test-Path "node_modules") {
        node scripts/generate_assets.js
    } else {
        Write-Host "Installing Node.js dependencies..." -ForegroundColor Gray
        npm install
        node scripts/generate_assets.js
    }
    Write-Host ""
}

# Step 2: Git commit and push
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "📤 Step 2: Git Commit & Push" -ForegroundColor Yellow  
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$status = git status --porcelain
if ($status) {
    Write-Host "Staging changes..." -ForegroundColor Gray
    git add -A
    git commit -m "Automated update: assets and configuration"
    git push origin main
    Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}
Write-Host ""

# Step 3: Update Repository Configuration
if (-not $SkipRepoConfig) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "⚙️ Step 3: Updating Repository Configuration" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    
    if ($env:GITHUB_TOKEN) {
        & "$ScriptDir\update_repo_config.ps1"
    } else {
        Write-Host "⚠️ Skipping - GITHUB_TOKEN not set" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Step 4: Create GitHub Release
if (-not $SkipRelease) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "🚀 Step 4: Creating GitHub Release" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    
    if ($env:GITHUB_TOKEN) {
        & "$ScriptDir\create_release.ps1"
    } else {
        Write-Host "⚠️ Skipping - GITHUB_TOKEN not set" -ForegroundColor Yellow
        Write-Host "   To create release manually:" -ForegroundColor Gray
        Write-Host "   1. Go to https://github.com/DeadlySIn777/Fissionbypass/releases" -ForegroundColor Gray
        Write-Host "   2. Click 'Draft a new release'" -ForegroundColor Gray
        Write-Host "   3. Select tag v2.0.0" -ForegroundColor Gray
        Write-Host "   4. Upload dist/FissionBypassPro.exe" -ForegroundColor Gray
    }
    Write-Host ""
}

Pop-Location

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   • Assets generated: assets/social_card.png, assets/screenshot_main.png"
Write-Host "   • Repository: https://github.com/DeadlySIn777/Fissionbypass"
Write-Host "   • Releases: https://github.com/DeadlySIn777/Fissionbypass/releases"
Write-Host ""
Write-Host "🔑 To enable API features, set:" -ForegroundColor Yellow
Write-Host '   $env:GITHUB_TOKEN = "your_personal_access_token"' -ForegroundColor Gray
Write-Host ""
