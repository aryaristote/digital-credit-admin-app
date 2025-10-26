# GitHub Repositories Setup Script
# This script configures separate remotes for client-app and admin-app

Write-Host "Setting up GitHub repositories..." -ForegroundColor Green

# Setup Client App Repository
Write-Host "`n[1/2] Configuring Client App Repository..." -ForegroundColor Yellow
Set-Location "client-app"
git remote set-url origin https://github.com/aryaristote/digital-credit-client-app.git
Write-Host "Client App Remote:" -ForegroundColor Cyan
git remote -v
Set-Location ..

# Setup Admin App Repository
Write-Host "`n[2/2] Configuring Admin App Repository..." -ForegroundColor Yellow
Set-Location "admin-app"
git remote set-url origin https://github.com/aryaristote/digital-credit-admin-app.git
Write-Host "Admin App Remote:" -ForegroundColor Cyan
git remote -v
Set-Location ..

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Review changes: git status" -ForegroundColor White
Write-Host "2. Stage changes: git add ." -ForegroundColor White
Write-Host "3. Commit: git commit -m 'feat: your message'" -ForegroundColor White
Write-Host "4. Push: git push origin main" -ForegroundColor White

