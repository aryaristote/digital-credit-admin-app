# CI/CD Quick Start

Quick reference for CI/CD workflows.

---

## 🚀 Quick Commands

### View Workflow Status

```bash
# Visit GitHub Actions tab
https://github.com/your-org/your-repo/actions
```

### Trigger Manual Deployment

1. Go to **Actions** → **Deploy**
2. Click **Run workflow**
3. Select environment (staging/production)
4. Click **Run workflow**

---

## 📋 Workflow Overview

| Workflow           | Trigger                             | Actions                           |
| ------------------ | ----------------------------------- | --------------------------------- |
| Client Backend CI  | Push/PR to `client-app/backend/**`  | Test, Lint, Build, Security Audit |
| Client Frontend CI | Push/PR to `client-app/frontend/**` | Test, Lint, Build, Security Audit |
| Admin Backend CI   | Push/PR to `admin-app/backend/**`   | Test, Lint, Build, Security Audit |
| Admin Frontend CI  | Push/PR to `admin-app/frontend/**`  | Test, Lint, Build, Security Audit |
| Main CI Pipeline   | Push/PR to any branch               | Test & Build All                  |
| Deploy             | Push to `main`                      | Deploy All Apps                   |

---

## 🔐 Required Secrets

Configure in **Settings → Secrets → Actions**:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `CLIENT_API_URL`, `ADMIN_API_URL`
- `JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`

---

## ✅ Status Badges

Add to README:

```markdown
![CI](https://github.com/your-org/your-repo/workflows/Client%20Backend%20CI/badge.svg)
![CI](https://github.com/your-org/your-repo/workflows/Admin%20Backend%20CI/badge.svg)
```

---

## 📚 Full Documentation

See [CI_CD_SETUP.md](CI_CD_SETUP.md) for complete guide.
