# Testing Guide

Comprehensive testing guide for unit, integration, and E2E tests in both applications.

---

## 🎯 Testing Philosophy

### Test-Driven Development (TDD)

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while tests pass

### Testing Principles

- **Fast**: Tests should run quickly
- **Independent**: Tests should not depend on each other
- **Repeatable**: Same results every time
- **Self-validating**: Clear pass/fail
- **Timely**: Write tests before/alongside code

---

## 🧪 Test Types

### 1. Unit Tests

**Purpose**: Test individual functions/methods

**Location**: `*.spec.ts` files next to source files

**Example**:

```typescript
// credit.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { CreditService } from "./credit.service";
import { UsersService } from "../users/users.service";
import { CreditRepository } from "./credit.repository";

describe("CreditService", () => {
  let service: CreditService;
  let usersService: UsersService;
  let repository: CreditRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditService,
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CreditRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreditService>(CreditService);
    usersService = module.get<UsersService>(UsersService);
    repository = module.get<CreditRepository>(CreditRepository);
  });

  describe("createRequest", () => {
    it("should create credit request successfully", async () => {
      // Arrange
      const userId = "123";
      const dto = { requestedAmount: 5000, requestedDurationMonths: 6 };
      const mockUser = { id: userId, creditScore: 750 };

      jest.spyOn(usersService, "findById").mockResolvedValue(mockUser);
      jest.spyOn(repository, "create").mockResolvedValue({
        id: "req-123",
        ...dto,
        userId,
        status: "pending",
      });

      // Act
      const result = await service.createRequest(userId, dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe("pending");
      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(repository.create).toHaveBeenCalled();
    });

    it("should throw error when credit score is too low", async () => {
      // Arrange
      const userId = "123";
      const dto = { requestedAmount: 5000, requestedDurationMonths: 6 };
      const mockUser = { id: userId, creditScore: 500 };

      jest.spyOn(usersService, "findById").mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.createRequest(userId, dto)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
```

### 2. Integration Tests

**Purpose**: Test module/component interactions

**Location**: `test/integration/` directory

**Example**:

```typescript
// test/integration/credit.integration.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreditModule } from "../../src/modules/credit/credit.module";
import { CreditService } from "../../src/modules/credit/credit.service";
import { CreditRequest } from "../../src/modules/credit/entities/credit-request.entity";

describe("Credit Integration", () => {
  let app: INestApplication;
  let service: CreditService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: "test",
          password: "test",
          database: "test_db",
          entities: [CreditRequest],
          synchronize: true,
        }),
        CreditModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    service = module.get<CreditService>(CreditService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create and persist credit request", async () => {
    const result = await service.createRequest("user-123", {
      requestedAmount: 5000,
      requestedDurationMonths: 6,
    });

    expect(result.id).toBeDefined();
    expect(result.status).toBe("pending");
  });
});
```

### 3. E2E Tests

**Purpose**: Test complete request/response flows

**Location**: `test/e2e/` directory

**Example**:

```typescript
// test/e2e/credit.e2e-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("CreditController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    // Login to get token
    const loginResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/credit/request (POST)", () => {
    it("should create credit request", () => {
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

    it("should return 401 without token", () => {
      return request(app.getHttpServer())
        .post("/api/v1/credit/request")
        .send({
          requestedAmount: 5000,
          requestedDurationMonths: 6,
        })
        .expect(401);
    });
  });
});
```

---

## 🔧 Test Utilities

### Test Helpers

```typescript
// test/helpers/test-helpers.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "123",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    creditScore: 700,
    isActive: true,
    ...overrides,
  };
}

export function createMockCreditRequest(
  overrides?: Partial<CreditRequest>
): CreditRequest {
  return {
    id: "req-123",
    userId: "user-123",
    requestedAmount: 5000,
    requestedDurationMonths: 6,
    status: "pending",
    createdAt: new Date(),
    ...overrides,
  };
}
```

### Database Helpers

```typescript
// test/helpers/database-helpers.ts
export async function clearDatabase(connection: Connection) {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
  }
}

export async function seedTestData(connection: Connection) {
  // Seed test data
}
```

---

## 📊 Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test -- credit.service.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create credit request"

# Run E2E tests
npm run test:e2e
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:cov

# View HTML report
open coverage/index.html
```

### Coverage Thresholds

```json
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## 🎨 Mocking Strategies

### Service Mocks

```typescript
const mockUsersService = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
```

### Repository Mocks

```typescript
const mockRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
```

### External Library Mocks

```typescript
// Mock bcrypt
jest.mock("bcrypt");
(bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
(bcrypt.compare as jest.Mock).mockResolvedValue(true);

// Mock JWT
jest.mock("@nestjs/jwt");
(jwtService.sign as jest.Mock).mockReturnValue("mock-token");
```

---

## 🐛 Debugging Tests

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debugging Tips

```typescript
// Use console.log for debugging (remove before commit)
console.log("Debug:", { userId, dto, result });

// Use debugger statement (remove before commit)
debugger;

// Print full object
console.log(JSON.stringify(result, null, 2));
```

---

## ✅ Test Checklist

### Before Writing Tests

- [ ] Understand what to test
- [ ] Identify dependencies to mock
- [ ] Plan test cases (success, error, edge cases)
- [ ] Write test before implementation (TDD)

### While Writing Tests

- [ ] Use AAA pattern (Arrange, Act, Assert)
- [ ] Test one thing per test
- [ ] Use descriptive test names
- [ ] Mock external dependencies
- [ ] Test edge cases

### After Writing Tests

- [ ] All tests pass
- [ ] Coverage meets standards
- [ ] No console.log/debugger
- [ ] Tests are independent
- [ ] Clean up after tests

---

## 📚 Test Examples

### Controller Test

```typescript
describe("CreditController", () => {
  let controller: CreditController;
  let service: CreditService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CreditController],
      providers: [
        {
          provide: CreditService,
          useValue: {
            createRequest: jest.fn(),
            getRequests: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreditController>(CreditController);
    service = module.get<CreditService>(CreditService);
  });

  it("should create credit request", async () => {
    const dto = { requestedAmount: 5000, requestedDurationMonths: 6 };
    const result = { id: "123", ...dto, status: "pending" };

    jest.spyOn(service, "createRequest").mockResolvedValue(result);

    expect(await controller.createRequest("user-123", dto)).toEqual(result);
    expect(service.createRequest).toHaveBeenCalledWith("user-123", dto);
  });
});
```

### Guard Test

```typescript
describe("AdminGuard", () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it("should allow admin user", () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: UserRole.ADMIN },
        }),
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should reject non-admin user", () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: UserRole.CUSTOMER },
        }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
```

---

**See Also:**

- [Code Quality Guide](CODE_QUALITY.md) - Code quality standards
- [Main README](README.md) - Project overview
