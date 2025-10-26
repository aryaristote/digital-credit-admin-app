# Code Quality & Testing Guide

Comprehensive guide for maintaining high code quality, comprehensive testing, and long-term maintainability in both applications.

---

## 🎯 Code Quality Standards

### 1. TypeScript Best Practices

#### Type Safety

```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  email: string;
  creditScore: number;
}

async function getUser(id: string): Promise<User | null> {
  return this.repository.findOne({ where: { id } });
}

// ❌ Bad: Using 'any'
async function getUser(id: any): Promise<any> {
  return this.repository.findOne({ where: { id } });
}
```

#### Type Definitions

- Use interfaces for object shapes
- Use type aliases for unions/intersections
- Avoid `any` - use `unknown` if type is truly unknown
- Use strict TypeScript settings

### 2. Code Organization

#### File Structure

```
module/
├── dto/
│   ├── create-module.dto.ts
│   └── update-module.dto.ts
├── entities/
│   └── module.entity.ts
├── module.controller.ts
├── module.service.ts
├── module.repository.ts (if needed)
└── module.module.ts
```

#### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `user.service.ts`)
- **Classes**: `PascalCase` (e.g., `UserService`)
- **Variables/Functions**: `camelCase` (e.g., `getUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)
- **Interfaces**: `IPascalCase` or `PascalCase` (e.g., `IUserRepository`)

### 3. ESLint Rules

#### Key Rules Enforced

```javascript
{
  // Code quality
  "no-console": "warn",           // Avoid console.log in production
  "no-debugger": "error",         // No debugger statements
  "no-unused-vars": "error",      // Remove unused variables

  // TypeScript specific
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",

  // Best practices
  "prefer-const": "error",        // Use const for constants
  "eqeqeq": ["error", "always"],  // Always use ===
  "curly": ["error", "all"],      // Always use braces
}
```

### 4. Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 90,
  "arrowParens": "always"
}
```

---

## 🧪 Testing Strategy

### Testing Pyramid

```
        /\
       /  \      E2E Tests (10%)
      /____\
     /      \    Integration Tests (20%)
    /________\
   /          \  Unit Tests (70%)
  /____________\
```

### 1. Unit Tests

**Purpose**: Test individual functions/methods in isolation

**Example**: Service method

```typescript
describe("CreditService", () => {
  describe("createRequest", () => {
    it("should create credit request when user has valid credit score", async () => {
      // Arrange
      const userId = "123";
      const dto = { requestedAmount: 5000, requestedDurationMonths: 6 };
      const mockUser = { id: userId, creditScore: 750 };

      // Act
      const result = await creditService.createRequest(userId, dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe("pending");
      expect(creditRepository.create).toHaveBeenCalled();
    });

    it("should throw error when credit score is too low", async () => {
      // Arrange
      const userId = "123";
      const dto = { requestedAmount: 5000, requestedDurationMonths: 6 };
      const mockUser = { id: userId, creditScore: 500 };

      // Act & Assert
      await expect(creditService.createRequest(userId, dto)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
```

**Best Practices**:

- Use AAA pattern (Arrange, Act, Assert)
- One assertion per test (when possible)
- Descriptive test names
- Mock external dependencies
- Test edge cases and error scenarios

### 2. Integration Tests

**Purpose**: Test module interactions

**Example**: Service with Repository

```typescript
describe("CreditService Integration", () => {
  let app: INestApplication;
  let creditService: CreditService;
  let repository: Repository<CreditRequest>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testDbConfig), CreditModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    creditService = module.get<CreditService>(CreditService);
    repository = module.get<Repository<CreditRequest>>(
      getRepositoryToken(CreditRequest)
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create and retrieve credit request", async () => {
    const request = await creditService.createRequest(userId, dto);
    const found = await repository.findOne({ where: { id: request.id } });

    expect(found).toBeDefined();
    expect(found.requestedAmount).toBe(dto.requestedAmount);
  });
});
```

### 3. E2E Tests

**Purpose**: Test complete request flows

**Example**: API endpoint

```typescript
describe("Credit E2E", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it("/credit/request (POST) should create credit request", () => {
    return request(app.getHttpServer())
      .post("/api/v1/credit/request")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        requestedAmount: 5000,
        requestedDurationMonths: 6,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body.status).toBe("pending");
      });
  });
});
```

---

## 📊 Code Coverage Standards

### Coverage Targets

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Critical Paths (100% Coverage)

- Authentication/Authorization logic
- Financial transaction logic
- Data validation
- Error handling

### Generating Coverage Report

```bash
# Backend
npm run test:cov

# View coverage
open coverage/index.html
```

---

## 🔍 Code Review Checklist

### Before Submitting PR

- [ ] All tests pass (`npm test`)
- [ ] Code coverage meets standards (`npm run test:cov`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`tsc --noEmit`)
- [ ] No console.log/debugger statements
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Documentation updated
- [ ] No hardcoded values (use env/config)
- [ ] Sensitive data excluded from logs

### Code Review Focus Areas

1. **Security**

   - SQL injection prevention
   - XSS prevention
   - Authentication/Authorization
   - Input validation

2. **Performance**

   - Database query optimization
   - N+1 query prevention
   - Caching opportunities
   - Async operations

3. **Maintainability**

   - Clear naming
   - Proper comments
   - DRY principle
   - Single responsibility

4. **Testing**
   - Adequate test coverage
   - Edge cases covered
   - Error scenarios tested

---

## 🛠️ Development Workflow

### Pre-commit Hook Setup

```bash
# Install husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

### Code Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting

```bash
# Lint and auto-fix
npm run lint

# Lint without fixing
npm run lint:check
```

---

## 📚 Testing Best Practices

### 1. Test Naming

```typescript
// ✅ Good: Descriptive names
describe("CreditService", () => {
  describe("createRequest", () => {
    it("should throw BadRequestException when credit score is below 600", () => {});
    it("should auto-approve when credit score is 700+ and amount <= 10000", () => {});
  });
});

// ❌ Bad: Vague names
describe("CreditService", () => {
  it("test 1", () => {});
  it("works", () => {});
});
```

### 2. Test Organization

```typescript
describe("Feature", () => {
  // Setup (beforeAll, beforeEach)

  describe("method", () => {
    describe("success cases", () => {
      it("should...", () => {});
    });

    describe("error cases", () => {
      it("should throw...", () => {});
    });

    describe("edge cases", () => {
      it("should handle...", () => {});
    });
  });

  // Cleanup (afterEach, afterAll)
});
```

### 3. Mocking Strategy

```typescript
// ✅ Good: Mock at service level
const mockUsersService = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
};

// ✅ Good: Use Jest mocks for external libraries
jest.mock("bcrypt");
(bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

// ❌ Bad: Mock at implementation level
jest.mock("../users/users.service");
```

### 4. Test Data

```typescript
// ✅ Good: Factory functions
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "123",
    email: "test@example.com",
    creditScore: 700,
    ...overrides,
  };
}

// ❌ Bad: Repeated test data
const user1 = { id: "123", email: "test@example.com" };
const user2 = { id: "123", email: "test@example.com" };
```

---

## 🔧 Maintainability Patterns

### 1. Error Handling

```typescript
// ✅ Good: Consistent error handling
@Injectable()
export class CreditService {
  async createRequest(userId: string, dto: CreateCreditRequestDto) {
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      // Business logic
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to create credit request");
    }
  }
}
```

### 2. Logging

```typescript
// ✅ Good: Structured logging
this.logger.log(`Creating credit request for user ${userId}`, "CreditService");
this.logger.error(
  `Failed to create request: ${error.message}`,
  error.stack,
  "CreditService"
);

// ❌ Bad: Console.log
console.log("Creating request");
console.error(error);
```

### 3. Constants

```typescript
// ✅ Good: Extract magic numbers/strings
const MIN_CREDIT_SCORE = 600;
const AUTO_APPROVAL_SCORE = 700;
const MAX_CREDIT_AMOUNT = 100000;

if (user.creditScore >= AUTO_APPROVAL_SCORE) {
  // Auto approve
}

// ❌ Bad: Magic numbers
if (user.creditScore >= 700) {
  // Auto approve
}
```

### 4. Documentation

```typescript
/**
 * Creates a new credit request for a user
 *
 * @param userId - The ID of the user requesting credit
 * @param dto - Credit request details (amount, duration)
 * @returns Created credit request with status
 * @throws BadRequestException if credit score is too low
 * @throws NotFoundException if user doesn't exist
 */
async createRequest(
  userId: string,
  dto: CreateCreditRequestDto,
): Promise<CreditRequest> {
  // Implementation
}
```

---

## 📈 Continuous Improvement

### Code Metrics to Track

- Test coverage percentage
- Code complexity (cyclomatic complexity)
- Technical debt
- Code duplication
- Build time
- Test execution time

### Tools for Monitoring

- **Coverage**: Jest coverage reports
- **Complexity**: ESLint complexity rules
- **Duplication**: SonarQube / Code Climate
- **Performance**: Lighthouse CI (frontend)

---

## 🎓 Learning Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)

---

**See Also:**

- [Testing Guide](TESTING_GUIDE.md) - Detailed testing documentation
- [Code Quality Checklist](CODE_QUALITY_CHECKLIST.md) - Quick reference checklist
