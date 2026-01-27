# GitHub Release Creation Script
# Run this script to create a release via GitHub API
# You need to set your GitHub token first:
# $env:GITHUB_TOKEN = "your_token_here"

param(
    [string]$Token = $env:GITHUB_TOKEN,
    [string]$Owner = "DeadlySIn777",
    [string]$Repo = "Fissionbypass",
    [string]$TagName = "v2.0.0",
    [string]$ReleaseName = "FissionBypass Pro v2.0.0",
    [string]$ExePath = "dist\FissionBypassPro.exe"
)

if (-not $Token) {
    Write-Host "❌ Error: GITHUB_TOKEN not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:GITHUB_TOKEN = 'your_personal_access_token'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create a token:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/settings/tokens"
    Write-Host "2. Generate new token (classic)"
    Write-Host "3. Select 'repo' scope"
    Write-Host "4. Copy the token"
    exit 1
}

$ReleaseBody = @"
# 🚀 FissionBypass Pro v2.0.0

**The Ultimate CNC G-Code Optimizer** - Transform CAM-generated G-code into optimized, production-ready toolpaths.

## ✨ Features

- **14 CNC Controller Profiles**: GRBL, LinuxCNC, FANUC, HAAS, SIEMENS, MAZAK, OKUMA, DMG MORI, Mach3, Mach4, TORMACH, SHOPBOT, CENTROID, HURCO
- **15 Material Presets**: Aluminum, Steel, Stainless, Titanium, Brass, Bronze, Copper, Delrin, Acrylic, HDPE, G10/FR4, Carbon Fiber, Cast Iron, Wood
- **AI-Powered Analysis**: Optional Ollama integration for advanced G-code optimization
- **40-60% Faster Cycle Times**: Through intelligent feed rate optimization

## 🔧 What It Fixes

Fusion 360 Personal/Hobby license artificially limits feedrates:
- Restores ``G0`` rapid moves (converted to slow ``G1`` by Fusion)
- Optimizes conservative CAM-generated feed rates
- Maintains safe, machine-appropriate speeds

## 📥 Download

Download ``FissionBypassPro.exe`` from the assets below.

**SHA256**: ``417AC667114AEC8AC834D7296F6D120C8142296ED531A62AEEC223BE8A1BD3B8``

## 📋 Requirements

| Requirement | Minimum |
|-------------|---------|
| OS | Windows 10/11 (64-bit) |
| RAM | 4 GB |
| Storage | 50 MB |
| Optional | Ollama for AI features |

## 🛡️ Security

- [VirusTotal Scan](https://www.virustotal.com/gui/file/417AC667114AEC8AC834D7296F6D120C8142296ED531A62AEEC223BE8A1BD3B8) - 66/72 Clean
- No internet connections (except optional localhost Ollama)
- No telemetry or data collection

## ⚠️ Disclaimer

**Use at your own risk.** Always simulate optimized G-code before running on your CNC. The author is not responsible for any damages.
"@

$Headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

Write-Host "🚀 Creating GitHub Release for $TagName..." -ForegroundColor Cyan

# Check if release already exists
$CheckUrl = "https://api.github.com/repos/$Owner/$Repo/releases/tags/$TagName"
try {
    $existing = Invoke-RestMethod -Uri $CheckUrl -Headers $Headers -ErrorAction Stop
    Write-Host "⚠️ Release $TagName already exists (ID: $($existing.id))" -ForegroundColor Yellow
    Write-Host "   URL: $($existing.html_url)" -ForegroundColor Gray
    $releaseId = $existing.id
} catch {
    # Create new release
    $ReleaseData = @{
        tag_name = $TagName
        name = $ReleaseName
        body = $ReleaseBody
        draft = $false
        prerelease = $false
    } | ConvertTo-Json

    $CreateUrl = "https://api.github.com/repos/$Owner/$Repo/releases"
    try {
        $release = Invoke-RestMethod -Uri $CreateUrl -Method Post -Headers $Headers -Body $ReleaseData -ContentType "application/json"
        Write-Host "✅ Release created successfully!" -ForegroundColor Green
        Write-Host "   URL: $($release.html_url)" -ForegroundColor Gray
        $releaseId = $release.id
    } catch {
        Write-Host "❌ Failed to create release: $_" -ForegroundColor Red
        exit 1
    }
}

# Upload the EXE asset
if (Test-Path $ExePath) {
    Write-Host "📦 Uploading $ExePath..." -ForegroundColor Cyan
    
    $FileName = Split-Path $ExePath -Leaf
    $UploadUrl = "https://uploads.github.com/repos/$Owner/$Repo/releases/$releaseId/assets?name=$FileName"
    
    $FileBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $ExePath))
    
    $UploadHeaders = @{
        "Authorization" = "Bearer $Token"
        "Accept" = "application/vnd.github+json"
        "Content-Type" = "application/octet-stream"
        "X-GitHub-Api-Version" = "2022-11-28"
    }
    
    try {
        $asset = Invoke-RestMethod -Uri $UploadUrl -Method Post -Headers $UploadHeaders -Body $FileBytes
        Write-Host "✅ Asset uploaded successfully!" -ForegroundColor Green
        Write-Host "   Download URL: $($asset.browser_download_url)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Failed to upload asset: $_" -ForegroundColor Red
        Write-Host "   (Asset may already exist on the release)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ EXE not found at: $ExePath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Done! Visit: https://github.com/$Owner/$Repo/releases" -ForegroundColor Green
