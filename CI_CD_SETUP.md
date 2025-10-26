# CI/CD Workflow Setup

Comprehensive guide for Continuous Integration and Continuous Deployment workflows.

---

## 🎯 Overview

The project uses **GitHub Actions** for CI/CD automation. Each application (Client Backend, Client Frontend, Admin Backend, Admin Frontend) has dedicated workflows for:

- ✅ **Continuous Integration (CI)**: Automated testing, linting, and building
- ✅ **Continuous Deployment (CD)**: Automated deployment workflows
- ✅ **Security Audits**: Dependency vulnerability scanning
- ✅ **Code Quality**: Linting, formatting, and coverage checks

---

## 📋 Available Workflows

### 1. Client Backend CI (`client-backend-ci.yml`)

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Changes in `client-app/backend/**`

**Jobs**:

- **Lint & Test**: Runs linter, formatter check, and tests with coverage
- **Build**: Builds the application
- **Security Audit**: Scans dependencies for vulnerabilities

**Services**:

- PostgreSQL 14 (test database)
- Redis 7 (for Bull Queue)

---

### 2. Client Frontend CI (`client-frontend-ci.yml`)

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Changes in `client-app/frontend/**`

**Jobs**:

- **Lint & Test**: Runs linter, formatter check, type check, and tests
- **Build**: Builds the React application
- **Security Audit**: Scans dependencies for vulnerabilities

---

### 3. Admin Backend CI (`admin-backend-ci.yml`)

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Changes in `admin-app/backend/**`

**Jobs**:

- **Lint & Test**: Runs linter, formatter check, and tests with coverage
- **Build**: Builds the application
- **Security Audit**: Scans dependencies for vulnerabilities

**Services**:

- PostgreSQL 14 (test database)

---

### 4. Admin Frontend CI (`admin-frontend-ci.yml`)

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Changes in `admin-app/frontend/**`

**Jobs**:

- **Lint & Test**: Runs linter, formatter check, type check, and tests
- **Build**: Builds the React application
- **Security Audit**: Scans dependencies for vulnerabilities

---

### 5. Main CI Pipeline (`main.yml`)

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs**:

- **Test All**: Runs tests for all applications in parallel
- **Build All**: Builds all applications in parallel

---

### 6. Deploy Workflow (`deploy.yml`)

**Triggers**:

- Push to `main` branch (automatic)
- Manual workflow dispatch

**Jobs**:

- **Deploy Client Backend**: Deploys client backend with migrations
- **Deploy Admin Backend**: Deploys admin backend with migrations
- **Deploy Frontends**: Deploys both frontend applications

---

## 🚀 Setting Up CI/CD

### Prerequisites

1. **GitHub Repository**: Ensure your code is in a GitHub repository
2. **GitHub Actions**: Enabled by default on GitHub repositories
3. **Secrets**: Configure repository secrets for deployment (see below)

### Step 1: Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

#### Database Secrets (for deployment)

```
DB_HOST=your-database-host
DB_PORT=5432
DB_USERNAME=your-database-user
DB_PASSWORD=your-database-password
DB_DATABASE=digital_credit_client
```

#### API URLs (for frontend builds)

```
CLIENT_API_URL=https://api.client.example.com
ADMIN_API_URL=https://api.admin.example.com
```

#### Additional Secrets (as needed)

```
JWT_SECRET=your-jwt-secret
REDIS_HOST=your-redis-host
REDIS_PORT=6379
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

### Step 2: Configure Codecov (Optional)

For code coverage tracking:

1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Get your Codecov token
4. Add to GitHub Secrets:
   ```
   CODECOV_TOKEN=your-codecov-token
   ```

### Step 3: Verify Workflows

1. Push code to trigger workflows
2. Check **Actions** tab in GitHub
3. Verify all workflows pass

---

## 🔧 Workflow Configuration

### Modifying Workflows

Workflows are located in `.github/workflows/`. Each workflow file uses YAML syntax.

**Example: Adding a new step**

```yaml
steps:
  - name: Your Custom Step
    run: echo "Hello from CI"
```

### Common Modifications

#### Change Node.js Version

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20" # Change version here
```

#### Add Environment Variables

```yaml
- name: Run tests
  env:
    CUSTOM_VAR: value
  run: npm test
```

#### Change Trigger Paths

```yaml
on:
  push:
    paths:
      - "your-path/**"
```

---

## 📊 CI/CD Process Flow

### On Push to `develop`

```
1. Client Backend CI
   ├── Lint & Test
   ├── Build
   └── Security Audit

2. Client Frontend CI
   ├── Lint & Test
   ├── Build
   └── Security Audit

3. Admin Backend CI
   ├── Lint & Test
   ├── Build
   └── Security Audit

4. Admin Frontend CI
   ├── Lint & Test
   ├── Build
   └── Security Audit
```

### On Push to `main`

```
1. All CI workflows (same as develop)
2. Deploy Workflow
   ├── Deploy Client Backend
   ├── Deploy Admin Backend
   └── Deploy Frontends
```

### On Pull Request

```
1. All CI workflows run
2. Must pass before merge
3. No deployment
```

---

## 🐳 Docker Deployment (Optional)

### Docker Build in CI

Add to workflow:

```yaml
- name: Build Docker image
  run: |
    docker build -t your-app:latest client-app/backend

- name: Push to Registry
  run: |
    docker push your-app:latest
```

### Docker Compose Deployment

```yaml
- name: Deploy with Docker Compose
  run: |
    docker-compose up -d
```

---

## ☁️ Cloud Platform Deployment

### AWS (Example)

```yaml
- name: Deploy to AWS
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy to ECS
  run: |
    aws ecs update-service --cluster your-cluster --service your-service --force-new-deployment
```

### Azure (Example)

```yaml
- name: Deploy to Azure
  uses: azure/webapps-deploy@v2
  with:
    app-name: your-app-name
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
    package: "./dist"
```

### Google Cloud (Example)

```yaml
- name: Deploy to GCP
  uses: google-github-actions/deploy-cloudrun@v1
  with:
    service: your-service
    image: gcr.io/your-project/your-image
```

---

## 🔍 Monitoring & Notifications

### Slack Notifications

Add to workflow:

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications

GitHub automatically sends email notifications for workflow failures.

---

## 📈 Best Practices

### 1. **Parallel Jobs**

Run independent jobs in parallel to speed up CI:

```yaml
jobs:
  test:
    # Runs in parallel
  build:
    # Runs in parallel
  deploy:
    needs: [test, build] # Waits for both
```

### 2. **Cache Dependencies**

Always cache `node_modules`:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: "npm"
```

### 3. **Fail Fast**

Set up dependencies so failures stop the pipeline:

```yaml
build:
  needs: test # Won't build if tests fail
```

### 4. **Environment Variables**

Use GitHub Secrets for sensitive data:

```yaml
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

### 5. **Artifact Retention**

Keep build artifacts for debugging:

```yaml
retention-days: 7
```

---

## 🐛 Troubleshooting

### Issue: Workflow Not Triggering

**Solution**: Check workflow file syntax and trigger conditions

### Issue: Tests Failing in CI

**Possible Causes**:

- Missing environment variables
- Database connection issues
- Path issues

**Solution**: Check workflow logs and compare with local setup

### Issue: Build Failing

**Possible Causes**:

- Missing dependencies
- TypeScript errors
- Environment variables not set

**Solution**: Test build locally first

### Issue: Deployment Failing

**Possible Causes**:

- Missing secrets
- Wrong credentials
- Network issues

**Solution**: Verify secrets and deployment configuration

---

## 📚 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [DATABASE_MIGRATIONS.md](DATABASE_MIGRATIONS.md) - Database migration setup
- [SECURITY.md](SECURITY.md) - Security best practices
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing guidelines

---

## ✅ Summary

CI/CD workflows are now configured for:

- ✅ **Client Backend**: Automated testing, linting, building
- ✅ **Client Frontend**: Automated testing, linting, building
- ✅ **Admin Backend**: Automated testing, linting, building
- ✅ **Admin Frontend**: Automated testing, linting, building
- ✅ **Deployment**: Automated deployment with migrations
- ✅ **Security**: Dependency vulnerability scanning
- ✅ **Quality**: Code coverage and linting

All workflows are:

- **Automated**: Run on push/PR
- **Parallel**: Fast execution
- **Secure**: Use GitHub Secrets
- **Reliable**: Fail fast on errors
- **Transparent**: Clear status reporting
