# GitHub Setup Script for Jambo Credit & Savings Platform
# Run this script after creating your GitHub repository

param(
    [Parameter(Mandatory=$true)]
    [string]$GithubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "jambo-credit-savings"
)

Write-Host "🚀 Setting up GitHub repository for Jambo Credit & Savings Platform" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    Write-Host "Please run this script from the project root (Jambo-test folder)" -ForegroundColor Yellow
    exit 1
}

# Check if remote already exists
$existingRemote = git remote -v
if ($existingRemote) {
    Write-Host "⚠️  Remote already configured:" -ForegroundColor Yellow
    Write-Host $existingRemote
    $response = Read-Host "Do you want to remove and reconfigure? (y/n)"
    if ($response -eq 'y') {
        git remote remove origin
        Write-Host "✅ Removed existing remote" -ForegroundColor Green
    } else {
        Write-Host "❌ Aborted" -ForegroundColor Red
        exit 1
    }
}

# Build GitHub URL
$repoUrl = "https://github.com/$GithubUsername/$RepoName.git"

Write-Host ""
Write-Host "📋 Configuration:" -ForegroundColor Cyan
Write-Host "  Username: $GithubUsername"
Write-Host "  Repository: $RepoName"
Write-Host "  URL: $repoUrl"
Write-Host ""

# Confirm
$confirm = Read-Host "Is this correct? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "❌ Aborted" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Configuring Git..." -ForegroundColor Cyan

# Rename master to main
Write-Host "  → Renaming master to main..."
git branch -M main

# Add remote
Write-Host "  → Adding remote origin..."
git remote add origin $repoUrl

# Show commit summary
Write-Host ""
Write-Host "📦 Commits ready to push:" -ForegroundColor Cyan
git log --oneline --color=always | Select-Object -First 10

Write-Host ""
$pushNow = Read-Host "Push to GitHub now? (y/n)"

if ($pushNow -eq 'y') {
    Write-Host ""
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green
    
    try {
        git push -u origin main
        
        Write-Host ""
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your repository:" -ForegroundColor Cyan
        Write-Host "  https://github.com/$GithubUsername/$RepoName"
        Write-Host ""
        
        # Ask about creating develop branch
        $createDevelop = Read-Host "Create 'develop' branch? (y/n)"
        if ($createDevelop -eq 'y') {
            Write-Host ""
            Write-Host "🌿 Creating develop branch..." -ForegroundColor Cyan
            git checkout -b develop
            git push -u origin develop
            git checkout main
            Write-Host "✅ Develop branch created and pushed" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✨ Setup complete! Next steps:" -ForegroundColor Green
        Write-Host "  1. Go to https://github.com/$GithubUsername/$RepoName/settings/branches"
        Write-Host "  2. Add branch protection rules for 'main'"
        Write-Host "  3. Review GITHUB_WORKFLOW.md for branching strategy"
        Write-Host ""
        
    } catch {
        Write-Host ""
        Write-Host "❌ Error pushing to GitHub:" -ForegroundColor Red
        Write-Host $_.Exception.Message
        Write-Host ""
        Write-Host "💡 Possible issues:" -ForegroundColor Yellow
        Write-Host "  - Repository doesn't exist on GitHub"
        Write-Host "  - You don't have write access"
        Write-Host "  - Need to authenticate (run: gh auth login)"
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Remote configured but not pushed" -ForegroundColor Cyan
    Write-Host "   Run this command when ready:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main"
    Write-Host ""
}

Write-Host "📖 For more information, see: GITHUB_WORKFLOW.md" -ForegroundColor Cyan

