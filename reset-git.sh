#!/bin/bash

# Git History Reset Script
# This script completely erases git history and creates a fresh repository

echo "🔄 Git History Reset Script"
echo "=========================="
echo ""
echo "⚠️  WARNING: This will erase ALL git history!"
echo "⚠️  Make sure you have:"
echo "   1. Rotated your Supabase keys"
echo "   2. Backed up your repository"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted. No changes made."
    exit 1
fi

echo ""
echo "📝 Step 1: Removing .git directory..."
rm -rf .git

echo "✅ Git history removed"
echo ""
echo "📝 Step 2: Initializing fresh git repository..."
git init

echo "✅ Fresh repository initialized"
echo ""
echo "📝 Step 3: Adding all files..."
git add .

echo "✅ Files staged"
echo ""
echo "📝 Step 4: Creating initial commit..."
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

echo "✅ Initial commit created"
echo ""
echo "📝 Step 5: Adding GitHub remote..."
echo ""
echo "Please enter your GitHub repository URL:"
echo "Example: https://github.com/yourusername/adoptdontshop-website.git"
read -p "Repository URL: " repo_url

git remote add origin "$repo_url"

echo "✅ Remote added"
echo ""
echo "📝 Step 6: Ready to push!"
echo ""
echo "⚠️  FINAL WARNING: This will OVERWRITE everything on GitHub!"
echo ""
read -p "Push to GitHub now? (yes/no): " push_confirm

if [ "$push_confirm" = "yes" ]; then
    echo ""
    echo "🚀 Pushing to GitHub..."
    git push -f origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Git history has been reset!"
        echo ""
        echo "Next steps:"
        echo "1. ✅ Verify on GitHub that old commits are gone"
        echo "2. ✅ Test your application still works"
        echo "3. ✅ Update your .env with new Supabase keys"
        echo "4. ✅ Inform collaborators to re-clone the repository"
    else
        echo ""
        echo "❌ Push failed. You may need to:"
        echo "   - Check your GitHub authentication"
        echo "   - Verify the repository URL"
        echo "   - Try: git push -f origin master (if using master branch)"
    fi
else
    echo ""
    echo "⏸️  Push skipped. You can push manually later with:"
    echo "   git push -f origin main"
fi

echo ""
echo "🎉 Script complete!"
