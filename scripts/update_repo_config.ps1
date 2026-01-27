# GitHub Repository Configuration Script
# Updates topics and description via GitHub API
# You need to set your GitHub token first:
# $env:GITHUB_TOKEN = "your_token_here"

param(
    [string]$Token = $env:GITHUB_TOKEN,
    [string]$Owner = "DeadlySIn777",
    [string]$Repo = "Fissionbypass"
)

if (-not $Token) {
    Write-Host "❌ Error: GITHUB_TOKEN not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:GITHUB_TOKEN = 'your_personal_access_token'" -ForegroundColor Yellow
    exit 1
}

$Headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

# Update repository description and homepage
Write-Host "📝 Updating repository description..." -ForegroundColor Cyan

$RepoData = @{
    description = "🚀 CNC G-Code Optimizer - Restore rapid moves limited by Fusion 360 Personal/Hobby license. 40-60% faster cycle times. 14 controllers, 15 materials, AI-powered."
    homepage = "https://github.com/DeadlySIn777/Fissionbypass#readme"
    has_wiki = $true
    has_discussions = $true
} | ConvertTo-Json

$RepoUrl = "https://api.github.com/repos/$Owner/$Repo"
try {
    $result = Invoke-RestMethod -Uri $RepoUrl -Method Patch -Headers $Headers -Body $RepoData -ContentType "application/json"
    Write-Host "✅ Repository updated!" -ForegroundColor Green
    Write-Host "   Description: $($result.description)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to update repository: $_" -ForegroundColor Red
}

# Update topics (requires separate API call with special accept header)
Write-Host "🏷️ Updating repository topics..." -ForegroundColor Cyan

$TopicsHeaders = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/vnd.github.mercy-preview+json"  # Required for topics API
    "X-GitHub-Api-Version" = "2022-11-28"
}

$Topics = @{
    names = @(
        "cnc",
        "gcode", 
        "g-code",
        "fusion360",
        "fusion-360",
        "cam",
        "cad-cam",
        "optimizer",
        "machining",
        "grbl",
        "linuxcnc",
        "mach3",
        "hobby-cnc",
        "feed-rate",
        "rapids"
    )
} | ConvertTo-Json

$TopicsUrl = "https://api.github.com/repos/$Owner/$Repo/topics"
try {
    $result = Invoke-RestMethod -Uri $TopicsUrl -Method Put -Headers $TopicsHeaders -Body $Topics -ContentType "application/json"
    Write-Host "✅ Topics updated!" -ForegroundColor Green
    Write-Host "   Topics: $($result.names -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to update topics: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Configuration complete!" -ForegroundColor Green
Write-Host "   View at: https://github.com/$Owner/$Repo" -ForegroundColor Cyan
