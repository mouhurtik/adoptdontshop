# 🔄 Git History Reset Guide

## ⚠️ IMPORTANT: Why This Is Necessary

Your Supabase credentials were hardcoded in previous commits. Even though they're removed now, they still exist in git history. Anyone with access to the repository can view old commits and see those credentials.

**This guide will help you**:
1. Completely erase all git history
2. Create a fresh repository with current code only
3. Push to the same GitHub repository as a clean slate

---

## 🚨 Before You Start

### 1. Rotate Your Supabase Keys (CRITICAL!)

Since your credentials were in git history, you should rotate them:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Click **"Reset"** next to the anon key
5. Copy the new key
6. Update your `.env` file with the new key

### 2. Backup (Optional but Recommended)

```bash
# Create a backup of your current repository
cd ..
cp -r adoptdontshop-website adoptdontshop-website-backup
cd adoptdontshop-website
```

---

## 🔥 Method 1: Complete Git History Reset (Recommended)

This method completely erases all git history and creates a fresh repository.

### Step 1: Remove Git History

```bash
# Remove the .git directory (this erases all history)
rm -rf .git

# On Windows (PowerShell):
Remove-Item -Recurse -Force .git

# On Windows (CMD):
rmdir /s /q .git
```

### Step 2: Initialize Fresh Git Repository

```bash
# Initialize a new git repository
git init

# Add all files
git add .

# Create the first commit
git commit -m "Initial commit: Pet adoption portal v2.0.0

- Modern React + TypeScript application
- Supabase backend integration
- Comprehensive testing suite
- CI/CD pipeline with GitHub Actions
- Enterprise-grade code quality (A+)
"
```

### Step 3: Connect to Your GitHub Repository

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/adoptdontshop-website.git

# Or if using SSH:
git remote add origin git@github.com:yourusername/adoptdontshop-website.git
```

### Step 4: Force Push to GitHub

⚠️ **WARNING**: This will completely replace everything on GitHub!

```bash
# Force push to main branch (this overwrites GitHub history)
git push -f origin main

# If your default branch is 'master':
git push -f origin master
```

---

## 🔄 Method 2: Using Git Filter-Branch (Alternative)

This method rewrites history to remove sensitive data while keeping commit history structure.

### Step 1: Install BFG Repo-Cleaner

```bash
# Download BFG (easier than git filter-branch)
# Visit: https://rtyley.github.io/bfg-repo-cleaner/

# Or use git filter-branch (built-in but slower)
```

### Step 2: Remove Sensitive Files from History

```bash
# Using BFG (recommended)
java -jar bfg.jar --delete-files client.ts
java -jar bfg.jar --replace-text passwords.txt

# Using git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/integrations/supabase/client.ts" \
  --prune-empty --tag-name-filter cat -- --all
```

### Step 3: Clean Up and Force Push

```bash
# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push -f origin main
```

---

## ✅ Verification Steps

After resetting git history, verify everything is clean:

### 1. Check Git History

```bash
# View commit history (should only show new commits)
git log

# Should show only your fresh commit(s)
```

### 2. Search for Credentials

```bash
# Search entire git history for your Supabase URL
git log -S "uibsmaizlrekfooryrwq" --all

# Should return nothing if history is clean
```

### 3. Check GitHub

1. Go to your GitHub repository
2. Click on "Commits"
3. Verify only new commits are visible
4. Check that old commits with credentials are gone

---

## 📋 Post-Reset Checklist

After resetting git history:

- [ ] Rotated Supabase keys
- [ ] Removed .git directory
- [ ] Created fresh git repository
- [ ] Made initial commit
- [ ] Connected to GitHub remote
- [ ] Force pushed to GitHub
- [ ] Verified git history is clean
- [ ] Verified credentials not in history
- [ ] Updated .env with new Supabase keys
- [ ] Tested application still works
- [ ] Informed collaborators (if any)

---

## 🔐 Security Best Practices Going Forward

### 1. Always Use .env Files

```bash
# ✅ GOOD - Use environment variables
const url = import.meta.env.VITE_SUPABASE_URL;

# ❌ BAD - Never hardcode
const url = "https://hardcoded-url.supabase.co";
```

### 2. Verify .gitignore

```bash
# Ensure .env is in .gitignore
cat .gitignore | grep .env

# Should show:
# .env
```

### 3. Use Git Hooks (Optional)

Install a pre-commit hook to prevent committing secrets:

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or download from: https://github.com/awslabs/git-secrets

# Set up git-secrets
git secrets --install
git secrets --register-aws
```

### 4. Regular Security Audits

```bash
# Check for accidentally committed secrets
git log -p | grep -i "password\|secret\|key"
```

---

## 🆘 Troubleshooting

### Issue: "Failed to push some refs"

```bash
# Solution: Use force push
git push -f origin main
```

### Issue: "Remote already exists"

```bash
# Solution: Remove and re-add remote
git remote remove origin
git remote add origin https://github.com/yourusername/repo.git
```

### Issue: "Permission denied"

```bash
# Solution: Check your GitHub authentication
# For HTTPS:
git config --global credential.helper store

# For SSH:
ssh -T git@github.com
```

### Issue: Can still see old commits on GitHub

```bash
# Solution: Contact GitHub support to clear cache
# Or wait 24-48 hours for GitHub's cache to clear
```

---

## 📞 Need Help?

If you encounter issues:

1. **Check GitHub Docs**: [Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
2. **BFG Repo-Cleaner**: [Documentation](https://rtyley.github.io/bfg-repo-cleaner/)
3. **Git Filter-Branch**: [Git Documentation](https://git-scm.com/docs/git-filter-branch)

---

## ⚠️ Important Notes

1. **Inform Collaborators**: If others have cloned the repository, they need to re-clone after the reset
2. **Backup First**: Always backup before performing destructive operations
3. **Rotate Keys**: Always rotate compromised credentials
4. **Force Push**: Required to overwrite GitHub history
5. **No Undo**: Once you force push, old history is gone forever

---

## 🎉 After Successful Reset

Your repository will be clean with:
- ✅ No sensitive data in history
- ✅ Fresh commit history
- ✅ All current code preserved
- ✅ Ready for open-source contributions

---

**Created**: November 27, 2024  
**Purpose**: Clean git history after credential exposure  
**Status**: Ready to execute
