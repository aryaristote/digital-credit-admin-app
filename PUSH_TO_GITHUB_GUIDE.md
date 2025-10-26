# Push to GitHub Guide

Complete guide for pushing changes to both client-app and admin-app repositories.

---

## ✅ Current Status

### Repository Configuration

- ✅ **Client App**: `https://github.com/aryaristote/digital-credit-client-app.git`
- ✅ **Admin App**: `https://github.com/aryaristote/digital-credit-admin-app.git`

---

## 🚀 Push Client App Changes

```bash
cd client-app

# Check current branch
git branch

# Switch to main branch (if needed)
git checkout main

# Check status
git status

# Stage all changes
git add .

# Commit with meaningful message
git commit -m "feat: add performance optimizations and API integrations

- Implement Redis caching module with decorators
- Add rate limiting guards and interceptors
- Create database indexes migration
- Add GraphQL API with resolvers and schemas
- Add gRPC services with protocol buffers
- Implement commit message guidelines
- Add PR templates and contributing guide
- Add performance monitoring interceptor

Includes:
- Cache service with Redis backend
- Performance interceptor for slow request tracking
- Database query optimization with indexes
- Complete caching documentation
- GraphQL playground setup
- gRPC proto definitions

Closes #[issue-number]"

# Push to GitHub
git push origin main
```

---

## 🚀 Push Admin App Changes

```bash
cd admin-app

# Check current branch
git branch

# Switch to main branch (if needed)
git checkout main

# Check status
git status

# Stage all changes
git add .

# Commit with meaningful message
git commit -m "feat: add performance optimizations and admin improvements

- Add caching support for admin operations
- Implement rate limiting
- Update admin services with performance monitoring
- Add comprehensive documentation
- Improve admin workflows

Includes:
- Performance monitoring
- Cache service integration
- Updated admin documentation
- Commit message guidelines"

# Push to GitHub
git push origin main
```

---

## 🌿 Branch Management

### Current Branches

**Client App**: `config-docker-image` → Should merge to `main`
**Admin App**: `config-docker-image` → Should merge to `main`

### Recommended Actions

1. **Merge current branches to main** (if ready)
2. **Or create feature branches** for new changes
3. **Follow branch naming**: `feat/`, `fix/`, `docs/`, etc.

---

## 📋 Step-by-Step Push Process

### Option 1: Merge Current Branch to Main

```bash
# Client App
cd client-app
git checkout main
git merge config-docker-image
git push origin main

# Admin App
cd admin-app
git checkout main
git merge config-docker-image
git push origin main
```

### Option 2: Create Feature Branch

```bash
# Client App
cd client-app
git checkout -b feat/performance-optimizations
git add .
git commit -m "feat: add performance optimizations"
git push origin feat/performance-optimizations

# Create PR on GitHub
```

---

## ✅ Verification Checklist

After pushing, verify:

- [ ] Client app pushed to correct repository
- [ ] Admin app pushed to correct repository
- [ ] All branches properly named
- [ ] Commit messages follow conventions
- [ ] PR templates in place
- [ ] Documentation updated

---

## 🔍 Troubleshooting

### Issue: Authentication Failed

```bash
# Update credentials
git config --global credential.helper store

# Or use SSH
git remote set-url origin git@github.com:aryaristote/digital-credit-client-app.git
```

### Issue: Branch Conflicts

```bash
# Pull latest changes first
git pull origin main

# Resolve conflicts
# Then push
git push origin main
```

---

## 📚 Related Documentation

- [COMMIT_MESSAGES_GUIDE.md](COMMIT_MESSAGES_GUIDE.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [GITHUB_REPOSITORIES_SETUP.md](GITHUB_REPOSITORIES_SETUP.md)
