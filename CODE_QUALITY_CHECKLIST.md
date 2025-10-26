# Code Quality Checklist

Quick reference checklist for maintaining code quality in both applications.

---

## 📋 Pre-Commit Checklist

### Code Quality

- [ ] **Linting**: `npm run lint` passes
- [ ] **Formatting**: Code formatted with Prettier (`npm run format`)
- [ ] **Type Checking**: TypeScript compiles without errors (`tsc --noEmit`)
- [ ] **Tests**: All tests pass (`npm test`)
- [ ] **Coverage**: Coverage meets standards (`npm run test:cov`)

### Code Standards

- [ ] **No console.log**: Removed all console.log statements
- [ ] **No debugger**: Removed all debugger statements
- [ ] **No hardcoded values**: Using environment variables/config
- [ ] **Error handling**: Proper try-catch blocks
- [ ] **Input validation**: DTOs have validation decorators
- [ ] **Type safety**: No `any` types (use `unknown` if needed)

### Security

- [ ] **Sensitive data**: No passwords/secrets in code
- [ ] **SQL injection**: Using parameterized queries (TypeORM)
- [ ] **XSS prevention**: Output encoding where needed
- [ ] **Authentication**: Routes protected with guards
- [ ] **Authorization**: Role checks implemented

---

## 📝 Code Review Checklist

### Functionality

- [ ] **Purpose**: Code meets requirements
- [ ] **Edge cases**: Edge cases handled
- [ ] **Error scenarios**: Error handling implemented
- [ ] **Performance**: No obvious performance issues

### Code Structure

- [ ] **Naming**: Clear, descriptive names
- [ ] **Comments**: Complex logic documented
- [ ] **Length**: Functions < 50 lines (ideally)
- [ ] **Complexity**: Low cyclomatic complexity
- [ ] **DRY**: No code duplication

### Testing

- [ ] **Unit tests**: Service methods tested
- [ ] **Integration tests**: Module interactions tested
- [ ] **E2E tests**: API endpoints tested
- [ ] **Coverage**: Critical paths covered
- [ ] **Edge cases**: Edge cases tested

### Documentation

- [ ] **README**: Updated if needed
- [ ] **API docs**: Swagger annotations added
- [ ] **Code comments**: Complex logic explained
- [ ] **JSDoc**: Public methods documented

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] **Test file**: `*.spec.ts` file created
- [ ] **Setup**: Proper test setup/teardown
- [ ] **Mocks**: Dependencies mocked
- [ ] **AAA pattern**: Arrange, Act, Assert
- [ ] **Descriptive names**: Clear test descriptions
- [ ] **Assertions**: Proper assertions used

### Integration Tests

- [ ] **Database**: Test database configured
- [ ] **Cleanup**: Database cleaned after tests
- [ ] **Fixtures**: Test data setup
- [ ] **Isolation**: Tests don't depend on each other

### E2E Tests

- [ ] **Setup**: App initialization tested
- [ ] **Auth**: Authentication flow tested
- [ ] **Endpoints**: Critical endpoints tested
- [ ] **Error cases**: Error responses tested

---

## 🔍 Code Quality Metrics

### Standards

- **Type Coverage**: 100% (no `any`)
- **Test Coverage**: 80%+ statements
- **Function Length**: < 50 lines
- **File Length**: < 300 lines
- **Cyclomatic Complexity**: < 10

### Tools

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Testing**: Jest
- **Coverage**: Jest coverage reports

---

## 🚀 CI/CD Checklist

### Before Merge

- [ ] **Build**: Application builds successfully
- [ ] **Tests**: All tests pass in CI
- [ ] **Linting**: Linting passes in CI
- [ ] **Type check**: TypeScript compiles
- [ ] **Coverage**: Coverage meets threshold

### Deployment

- [ ] **Environment variables**: All env vars set
- [ ] **Database migrations**: Migrations run
- [ ] **Secrets**: Secrets configured
- [ ] **Monitoring**: Logging/monitoring setup

---

## 📚 Documentation Checklist

### Code Documentation

- [ ] **JSDoc comments**: Public methods documented
- [ ] **Inline comments**: Complex logic explained
- [ ] **README**: Setup instructions clear
- [ ] **API docs**: Swagger annotations complete

### Architecture Documentation

- [ ] **Architecture**: Architecture documented
- [ ] **Design decisions**: Decisions documented
- [ ] **Dependencies**: Dependencies explained
- [ ] **Deployment**: Deployment guide updated

---

## 🎯 Best Practices Quick Reference

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

async function getUser(id: string): Promise<User | null> {
  return this.repository.findOne({ where: { id } });
}

// ❌ Bad
async function getUser(id: any): Promise<any> {
  return this.repository.findOne({ where: { id } });
}
```

### Error Handling

```typescript
// ✅ Good
try {
  const result = await this.service.method();
  return result;
} catch (error) {
  if (error instanceof NotFoundException) {
    throw error;
  }
  throw new InternalServerErrorException("Operation failed");
}

// ❌ Bad
const result = await this.service.method();
return result;
```

### Testing

```typescript
// ✅ Good
it("should throw error when credit score is below 600", async () => {
  const user = { creditScore: 500 };
  await expect(service.createRequest(user.id, dto)).rejects.toThrow(
    BadRequestException
  );
});

// ❌ Bad
it("test 1", async () => {
  // Test code
});
```

---

## 🔧 Quick Commands

```bash
# Linting
npm run lint                 # Lint and fix
npm run lint:check          # Lint without fixing

# Formatting
npm run format              # Format all files

# Testing
npm test                    # Run tests
npm run test:watch          # Watch mode
npm run test:cov            # Coverage report
npm run test:e2e            # E2E tests

# Type checking
tsc --noEmit                # Check types

# Build
npm run build               # Build application
```

---

**See Also:**

- [Code Quality Guide](CODE_QUALITY.md) - Detailed quality standards
- [Testing Guide](TESTING_GUIDE.md) - Testing best practices
