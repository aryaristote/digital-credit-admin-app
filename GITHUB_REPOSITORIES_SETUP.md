# GitHub Repositories Setup Guide

Complete guide for managing separate GitHub repositories for client-app and admin-app.

---

## 📦 Repository Structure

This project consists of **3 separate repositories**:

1. **Root Repository** (monorepo)

   - Contains both client-app and admin-app
   - URL: Your main repository

2. **Client App Repository**

   - Dedicated repository for client application
   - URL: `https://github.com/aryaristote/digital-credit-client-app.git`

3. **Admin App Repository**
   - Dedicated repository for admin application
   - URL: `https://github.com/aryaristote/digital-credit-admin-app.git`

---

## 🔧 Setting Up Remotes

### Root Repository

```bash
cd "C:\Users\AriKa\OneDrive - IST\Desktop\Jambo-test"

# Check current remotes
git remote -v

# Add root repository remote (if not exists)
git remote add origin https://github.com/your-username/jambo-test.git

# Or update existing
git remote set-url origin https://github.com/your-username/jambo-test.git
```

### Client App Repository

```bash
cd "C:\Users\AriKa\OneDrive - IST\Desktop\Jambo-test\client-app"

# Add client-app remote
git remote add origin https://github.com/aryaristote/digital-credit-client-app.git

# Or update existing
git remote set-url origin https://github.com/aryaristote/digital-credit-client-app.git

# Verify
git remote -v
```

### Admin App Repository

```bash
cd "C:\Users\AriKa\OneDrive - IST\Desktop\Jambo-test\admin-app"

# Add admin-app remote
git remote add origin https://github.com/aryaristote/digital-credit-admin-app.git

# Or update existing
git remote set-url origin https://github.com/aryaristote/digital-credit-admin-app.git

# Verify
git remote -v
```

---

## 📤 Pushing Changes

### Push Client App

```bash
cd "C:\Users\AriKa\OneDrive - IST\Desktop\Jambo-test\client-app"

# Check status
git status

# Stage all changes
git add .

# Commit with meaningful message
git commit -m "feat: add performance optimizations and caching

- Implement Redis caching module
- Add rate limiting guards
- Create database indexes migration
- Add GraphQL and gRPC integrations
- Update commit message guidelines

Includes:
- Cache decorators and interceptors
- Performance monitoring
- Complete caching documentation"

# Push to GitHub
git push -u origin main
```

### Push Admin App

```bash
cd "C:\Users\AriKa\OneDrive - IST\Desktop\Jambo-test\admin-app"

# Check status
git status

# Stage all changes
git add .

# Commit with meaningful message
git commit -m "feat: add performance optimizations and admin improvements

- Add caching support
- Implement rate limiting
- Update admin services
- Add comprehensive documentation

Includes:
- Performance monitoring
- Cache service integration
- Updated admin workflows"

# Push to GitHub
git push -u origin main
```

---

## 🌿 Branch Naming Convention

Follow the format: `<type>/<short-description>`

### Examples:

**Features:**

- `feat/performance-caching`
- `feat/graphql-integration`
- `feat/credit-repayment-calculator`

**Bug Fixes:**

- `fix/savings-balance-validation`
- `fix/auth-token-refresh`

**Documentation:**

- `docs/api-documentation-update`
- `docs/setup-guide-improvements`

**Refactoring:**

- `refactor/user-service-simplification`
- `refactor/cache-module-structure`

---

## 🔀 Creating Pull Requests

### Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make Changes and Commit**

   ```bash
   git add .
   git commit -m "feat(scope): your feature description"
   ```

3. **Push Branch**

   ```bash
   git push -u origin feat/your-feature-name
   ```

4. **Create PR on GitHub**
   - Use PR template
   - Fill all sections
   - Link related issues
   - Request reviewers

### PR Title Format

Follow Conventional Commits:

```
<type>(<scope>): <subject>
```

Examples:

- `feat(credit): add repayment calculator`
- `fix(savings): correct balance validation`
- `docs: update API documentation`

---

## ✅ Verification Checklist

### Client App Repository

- [ ] Remote configured: `https://github.com/aryaristote/digital-credit-client-app.git`
- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] Branches follow naming convention
- [ ] PR template in place

### Admin App Repository

- [ ] Remote configured: `https://github.com/aryaristote/digital-credit-admin-app.git`
- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] Branches follow naming convention
- [ ] PR template in place

---

## 📋 Current Changes to Push

### Client App

- ✅ Performance & caching implementation
- ✅ GraphQL & gRPC integration
- ✅ Database indexes migration
- ✅ Commit message guidelines
- ✅ PR templates

### Admin App

- ✅ Performance optimizations
- ✅ Caching support
- ✅ Documentation updates
- ✅ Admin service improvements

---

## 🚀 Quick Push Commands

### Client App

```bash
cd client-app
git add .
git commit -m "feat: add performance optimizations and API integrations"
git push origin main
```

### Admin App

```bash
cd admin-app
git add .
git commit -m "feat: add performance optimizations and improvements"
git push origin main
```

---

## 🔍 Troubleshooting

### Issue: Remote Already Exists

```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin <repository-url>
```

### Issue: Authentication Failed

```bash
# Update credentials
git config --global credential.helper store

# Or use SSH
git remote set-url origin git@github.com:aryaristote/digital-credit-client-app.git
```

### Issue: Branch Tracking

```bash
# Set upstream branch
git push -u origin main

# Or for feature branch
git push -u origin feat/your-feature
```

---

## 📚 Related Documentation

- [COMMIT_MESSAGES_GUIDE.md](COMMIT_MESSAGES_GUIDE.md) - Commit conventions
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) - Git workflow

---

## ✅ Summary

After setup:

- ✅ Both repositories have correct remotes
- ✅ All changes pushed to GitHub
- ✅ Branches follow naming conventions
- ✅ PR templates ready
- ✅ Clear tracking and history
