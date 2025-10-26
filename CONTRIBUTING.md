# Contributing Guide

Thank you for contributing to the Digital Credit & Savings Platform!

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/jambo-test.git
cd jambo-test
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run start:dev
```

### 3. Create Feature Branch

```bash
git checkout -b feat/your-feature-name
```

---

## 📝 Code Style

### TypeScript

- Follow ESLint configuration
- Use Prettier for formatting
- No `any` types (use proper types)
- Write self-documenting code

### Naming Conventions

- **Files**: `kebab-case.ts` or `PascalCase.tsx`
- **Classes**: `PascalCase`
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `IPascalCase` or `PascalCase`

### Code Organization

```
module/
├── dto/              # Data Transfer Objects
├── entities/         # Database entities
├── controllers/      # API controllers
├── services/         # Business logic
├── repositories/     # Data access layer
└── *.module.ts       # Module definition
```

---

## 🧪 Testing

### Before Submitting

- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] No TypeScript errors: `npm run build`

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for >80% coverage
- Use descriptive test names

```typescript
describe("CreditService", () => {
  describe("createCreditRequest", () => {
    it("should create credit request with valid data", () => {
      // Test implementation
    });

    it("should reject request when credit score is too low", () => {
      // Test implementation
    });
  });
});
```

---

## 📝 Commit Messages

Follow [Conventional Commits](COMMIT_MESSAGES_GUIDE.md):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples**:

- `feat(credit): add repayment calculator`
- `fix(savings): correct balance validation`
- `docs: update API documentation`

---

## 🔀 Pull Request Process

### 1. Before Creating PR

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Meaningful commit messages

### 2. Create PR

1. Push your branch: `git push origin feat/your-feature`
2. Create PR on GitHub
3. Fill out PR template completely
4. Link related issues
5. Request reviewers

### 3. PR Review

- Address review comments promptly
- Keep discussion constructive
- Update PR as needed
- Ensure CI checks pass

### 4. After Approval

- Squash commits if requested
- Wait for CI to pass
- Merge when approved

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**

- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives considered**
Other solutions you've considered.

**Additional context**
Any other relevant information.
```

---

## 📚 Documentation

### Updating Documentation

- Keep README updated
- Document API changes
- Add code comments for complex logic
- Update setup guides if needed

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Link related documentation

---

## ✅ Code Review Checklist

Before requesting review, ensure:

- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Meaningful commit messages
- [ ] PR description complete

---

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome constructive feedback
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Personal attacks
- Trolling or inflammatory comments
- Spam or unsolicited messages

---

## 📞 Getting Help

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Questions**: Ask in PR comments

---

## 🙏 Thank You!

Your contributions help make this project better. We appreciate your time and effort!
