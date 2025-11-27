# Git History Reset Script for Windows PowerShell
# This script completely erases git history and creates a fresh repository

Write-Host "🔄 Git History Reset Script" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  WARNING: This will erase ALL git history!" -ForegroundColor Yellow
Write-Host "⚠️  Make sure you have:" -ForegroundColor Yellow
Write-Host "   1. Rotated your Supabase keys" -ForegroundColor Yellow
Write-Host "   2. Backed up your repository" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Aborted. No changes made." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Step 1: Removing .git directory..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

Write-Host "✅ Git history removed" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Step 2: Initializing fresh git repository..." -ForegroundColor Yellow
git init

Write-Host "✅ Fresh repository initialized" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Step 3: Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "✅ Files staged" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Step 4: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Pet adoption portal v2.0.0

- Modern React + TypeScript application
- Supabase backend integration
- Comprehensive testing suite (18 tests)
- CI/CD pipeline with GitHub Actions
- Enterprise-grade code quality (A+)
- Error boundaries and proper error handling
- Centralized types and constants
- Comprehensive documentation
"

Write-Host "✅ Initial commit created" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Step 5: Adding GitHub remote..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Please enter your GitHub repository URL:"
Write-Host "Example: https://github.com/yourusername/adoptdontshop-website.git"
$repoUrl = Read-Host "Repository URL"

git remote add origin $repoUrl

Write-Host "✅ Remote added" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Step 6: Ready to push!" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  FINAL WARNING: This will OVERWRITE everything on GitHub!" -ForegroundColor Yellow
Write-Host ""
$pushConfirm = Read-Host "Push to GitHub now? (yes/no)"

if ($pushConfirm -eq "yes") {
    Write-Host ""
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
    git push -f origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCCESS! Git history has been reset!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. ✅ Verify on GitHub that old commits are gone"
        Write-Host "2. ✅ Test your application still works"
        Write-Host "3. ✅ Update your .env with new Supabase keys"
        Write-Host "4. ✅ Inform collaborators to re-clone the repository"
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. You may need to:" -ForegroundColor Red
        Write-Host "   - Check your GitHub authentication"
        Write-Host "   - Verify the repository URL"
        Write-Host "   - Try: git push -f origin master (if using master branch)"
    }
} else {
    Write-Host ""
    Write-Host "⏸️  Push skipped. You can push manually later with:" -ForegroundColor Yellow
    Write-Host "   git push -f origin main"
}

Write-Host ""
Write-Host "🎉 Script complete!" -ForegroundColor Green
