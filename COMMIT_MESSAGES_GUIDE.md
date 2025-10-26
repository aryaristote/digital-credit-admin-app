# Commit Messages & PR Structure Guide

Complete guide for writing meaningful commit messages and creating well-structured pull requests.

---

## 📝 Commit Message Format

We follow the **Conventional Commits** specification for consistent, meaningful commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Components

#### Type

Required. The type of change:

| Type       | Description                                 | Example                                     |
| ---------- | ------------------------------------------- | ------------------------------------------- |
| `feat`     | New feature                                 | `feat(credit): add repayment calculator`    |
| `fix`      | Bug fix                                     | `fix(savings): correct balance calculation` |
| `docs`     | Documentation changes                       | `docs: update API documentation`            |
| `style`    | Code style changes (formatting, whitespace) | `style: format code with prettier`          |
| `refactor` | Code refactoring                            | `refactor(users): simplify user service`    |
| `perf`     | Performance improvements                    | `perf: optimize database queries`           |
| `test`     | Adding or updating tests                    | `test(credit): add repayment tests`         |
| `chore`    | Build process, dependencies                 | `chore: update dependencies`                |
| `ci`       | CI/CD changes                               | `ci: add GitHub Actions workflow`           |
| `build`    | Build system changes                        | `build: update webpack config`              |

#### Scope

Optional. The area of the codebase affected:

- `auth` - Authentication
- `credit` - Credit requests and repayments
- `savings` - Savings accounts and transactions
- `users` - User management
- `admin` - Admin features
- `frontend` - Frontend changes
- `backend` - Backend changes
- `api` - API changes
- `db` - Database changes

#### Subject

Required. Short description (50 chars or less):

- Use imperative mood ("add feature" not "added feature")
- No period at the end
- Capitalize first letter
- Be specific and descriptive

#### Body

Optional. Detailed explanation:

- Wrap at 72 characters
- Explain **why** the change was made
- Include relevant context
- Use bullet points for multiple changes

#### Footer

Optional. For breaking changes or issue references:

- `Closes #123` - Closes an issue
- `Fixes #456` - Fixes a bug
- `BREAKING CHANGE: description` - Breaking changes

---

## ✅ Good Commit Message Examples

### Simple Feature

```
feat(credit): add automatic credit approval

Automatically approve credit requests when user credit score >= 600.
Interest rate determined by credit score range.

Closes #123
```

### Bug Fix

```
fix(savings): enforce balance check before withdrawal

Add validation to prevent withdrawals when balance is insufficient.
Returns 400 Bad Request with detailed error message.

Previously, insufficient balance checks were only done in UI,
allowing API bypass.

Fixes #456
```

### Documentation

```
docs: update API documentation with new endpoints

Add Swagger documentation for:
- Credit repayment endpoints
- Savings transaction endpoints
- Request/response examples
- Error codes and handling
```

### Refactoring

```
refactor(users): simplify user service methods

- Extract credit score calculation to separate method
- Consolidate user validation logic
- Improve error handling consistency

No functional changes, only code organization improvements.
```

### Performance

```
perf: optimize database queries with indexes

Add database indexes for frequently queried columns:
- users.email
- credit_requests.user_id
- credit_requests.status
- transactions.savings_account_id

Reduces query time by ~60% for large datasets.
```

### Breaking Change

```
feat(api): migrate to RESTful resource naming

BREAKING CHANGE: API endpoints renamed for REST compliance

- GET /api/credits -> GET /api/v1/credit-requests
- POST /api/credits -> POST /api/v1/credit-requests
- PUT /api/credits/:id/repay -> POST /api/v1/credit-requests/:id/repayments

Migration guide available in MIGRATION.md
```

---

## ❌ Bad Commit Message Examples

### Too Vague

```
❌ fix: bug fix
❌ update code
❌ changes
```

### Wrong Mood

```
❌ Fixed bug in credit service
❌ Added new feature
❌ Updated documentation
```

### Too Long Subject

```
❌ feat(credit): add comprehensive credit approval system with automatic scoring and interest rate calculation based on multiple factors
```

### Missing Context

```
❌ fix: error
❌ feat: new thing
```

---

## 🔀 Pull Request Structure

### PR Title Format

Follow the same format as commit messages:

```
<type>(<scope>): <subject>
```

Examples:

- `feat(credit): add repayment calculator`
- `fix(savings): correct balance validation`
- `docs: update API documentation`

### PR Description Template

Use the provided PR template (`.github/PULL_REQUEST_TEMPLATE.md`) which includes:

1. **Description** - What the PR does
2. **Related Issue** - Link to related issues
3. **Type of Change** - Checklist of change types
4. **Testing** - Test coverage and verification
5. **Screenshots** - Visual changes (if applicable)
6. **Checklist** - Pre-submission checklist
7. **Review Focus Areas** - What reviewers should focus on
8. **Additional Notes** - Extra context

### PR Best Practices

#### 1. One Logical Change Per PR

✅ **Good**: Single feature or bug fix
❌ **Bad**: Multiple unrelated changes

#### 2. Keep PRs Small

✅ **Good**: Focused, reviewable changes
❌ **Bad**: Large, sweeping changes

#### 3. Write Clear Descriptions

✅ **Good**: Explain what, why, and how
❌ **Bad**: "Fixed stuff"

#### 4. Include Tests

✅ **Good**: Tests for new features/fixes
❌ **Bad**: No tests or breaking existing tests

#### 5. Update Documentation

✅ **Good**: Keep docs in sync with code
❌ **Bad**: Code changes without doc updates

---

## 📋 Commit Workflow

### 1. Create Feature Branch

```bash
git checkout -b feat/credit-repayment-calculator
```

### 2. Make Changes

- Write code
- Add tests
- Update documentation

### 3. Stage Changes

```bash
git add .
# Or selectively:
git add src/modules/credit/
git add tests/credit/
```

### 4. Commit with Meaningful Message

```bash
git commit -m "feat(credit): add repayment calculator

Add calculator to estimate monthly repayments based on:
- Loan amount
- Interest rate
- Term length

Includes validation and error handling.
UI displays estimated monthly payment before submission.

Closes #123"
```

### 5. Push Branch

```bash
git push origin feat/credit-repayment-calculator
```

### 6. Create Pull Request

- Use PR template
- Fill in all relevant sections
- Request reviewers
- Link related issues

---

## 🎯 Branch Naming Convention

Format: `<type>/<short-description>`

Examples:

- `feat/credit-repayment-calculator`
- `fix/savings-balance-validation`
- `docs/api-documentation-update`
- `refactor/user-service-simplification`
- `test/credit-repayment-tests`

---

## 🔄 Commit Message Examples by Scenario

### Adding a New Feature

```
feat(credit): add bulk credit operations

Allow admins to approve/reject multiple credit requests at once.
Includes:
- Bulk selection UI
- Batch processing endpoint
- Progress tracking
- Error handling for partial failures

Closes #789
```

### Fixing a Bug

```
fix(savings): prevent negative balance withdrawal

Add server-side validation to ensure balance never goes negative.
Return 400 Bad Request with clear error message if withdrawal
would result in negative balance.

Previously only validated in frontend, allowing API bypass.

Fixes #456
```

### Adding Tests

```
test(credit): add comprehensive repayment tests

Cover test cases:
- Successful repayment
- Insufficient balance error
- Amount validation
- Balance updates
- Transaction creation

Achieves 95% code coverage for credit repayment flow.
```

### Updating Dependencies

```
chore: update NestJS to v10.3.0

Update @nestjs/core and related packages to latest stable.
Includes security patches and performance improvements.

BREAKING CHANGE: Requires Node.js 18+
```

### Code Refactoring

```
refactor(auth): extract JWT logic to separate service

Move JWT token generation and validation to dedicated service.
Improves:
- Code organization
- Testability
- Reusability

No functional changes.
```

---

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Summary

**Commit Messages**:

- ✅ Use Conventional Commits format
- ✅ Be specific and descriptive
- ✅ Use imperative mood
- ✅ Include context in body

**Pull Requests**:

- ✅ One logical change per PR
- ✅ Use PR template
- ✅ Include tests
- ✅ Update documentation
- ✅ Request appropriate reviewers

Following these guidelines ensures:

- 📖 Clear project history
- 🔍 Easy code reviews
- 🐛 Faster bug tracking
- 📚 Better documentation
- 🚀 Smoother collaboration
