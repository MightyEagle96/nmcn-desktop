Write-Host "----------------------------" -ForegroundColor Cyan
Write-Host " Git Auto Commit Script 🚀" -ForegroundColor Cyan
Write-Host "----------------------------`n"

# Check if this is a git repo
if (-not (Test-Path ".git")) {
    Write-Host "❌ This is not a git repository." -ForegroundColor Red
    exit 1
}

# Show status
git status

Write-Host ""

$commitMessage = Read-Host "Enter commit message"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "❌ Commit message cannot be empty." -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Adding files..."
git add .

Write-Host "📝 Committing..."
git commit -m "$commitMessage"

# Ask to push
$push = Read-Host "Push to remote? (y/n)"

if ($push -eq "y") {
    Write-Host "🚀 Pushing..."
    git push
} else {
    Write-Host "⏭️ Skipped push."
}

Write-Host "`n✅ Done!"
