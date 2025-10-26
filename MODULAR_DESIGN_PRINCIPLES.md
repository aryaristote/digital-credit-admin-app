# Modular Design Principles

Essential principles for maintaining clean, modular architecture in both applications.

---

## 🎯 Core Principles

### 1. Module Independence

**Rule**: Each module should be independently testable and deployable

**Implementation:**

```typescript
// ✅ Good: Module exports only what's needed
@Module({
  exports: [CreditService], // Only export service, not repository
})
export class CreditModule {}

// ❌ Bad: Export everything
@Module({
  exports: [CreditService, CreditRepository, CreditController], // Too much
})
```

### 2. Single Responsibility

**Rule**: Each module handles one domain concern

**Examples:**

- ✅ `AuthModule` - Only authentication
- ✅ `UsersModule` - Only user management
- ✅ `SavingsModule` - Only savings operations
- ❌ One module handling users, savings, and credits

### 3. Dependency Direction

**Rule**: Dependencies flow inward (toward core modules)

```
Presentation Layer (Controllers)
         ↓
Business Logic Layer (Services)
         ↓
Data Access Layer (Repositories)
         ↓
Database Layer
```

### 4. Interface Segregation

**Rule**: Modules depend on interfaces, not concrete implementations

```typescript
// ✅ Good: Depend on interface
constructor(private creditService: ICreditService) {}

// ❌ Bad: Depend on concrete class
constructor(private creditService: CreditService) {}
```

---

## 📦 Module Design Patterns

### Pattern 1: Core Module (No Dependencies)

**Example**: UsersModule

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository], // Export for other modules
})
export class UsersModule {}
```

**Characteristics:**

- No dependencies on other feature modules
- Core business entity
- Exported for use by other modules

### Pattern 2: Feature Module (Has Dependencies)

**Example**: CreditModule

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([CreditRequest]),
    UsersModule, // Dependency
    SavingsModule, // Dependency
    NotificationsModule, // Dependency
  ],
  controllers: [CreditController],
  providers: [CreditService, CreditRepository],
  exports: [CreditService],
})
export class CreditModule {}
```

**Characteristics:**

- Depends on other modules
- Orchestrates multiple concerns
- Exports only what's needed

### Pattern 3: Shared Module (Global)

**Example**: Common utilities

```typescript
@Global()
@Module({
  providers: [CommonService, LoggerService],
  exports: [CommonService, LoggerService],
})
export class SharedModule {}
```

**Characteristics:**

- Available to all modules
- Common functionality
- Avoid overuse

---

## 🔄 Communication Patterns

### 1. Direct Service Import

**Pattern**: Module A imports Module B to use Service B

```typescript
// Module A
@Module({
  imports: [ModuleB],
})
export class ModuleA {
  constructor(private serviceB: ServiceB) {}
}
```

**Use When:**

- Tight coupling is acceptable
- Service needs to call methods synchronously
- Shared transaction context needed

### 2. Event-Driven Communication

**Pattern**: Module A publishes events, Module B listens

```typescript
// Module A
this.eventEmitter.emit('credit.approved', data);

// Module B
@OnEvent('credit.approved')
handleCreditApproved(data) {}
```

**Use When:**

- Loose coupling desired
- Asynchronous processing
- Multiple listeners needed

### 3. Shared Repository

**Pattern**: Multiple modules use same repository

```typescript
// Export repository
@Module({
  exports: [UsersRepository],
})
export class UsersModule {}

// Import in other module
@Module({
  imports: [UsersModule],
})
export class CreditModule {
  constructor(private usersRepo: UsersRepository) {}
}
```

**Use When:**

- Cross-module data access needed
- Shared business logic
- Avoid circular dependencies

---

## 🎨 Module Boundaries

### Clear Boundaries

**Within Module:**

- ✅ Entities can reference each other
- ✅ Services can call other services
- ✅ Repositories can query related entities

**Between Modules:**

- ✅ Use exported services only
- ✅ Use DTOs for data transfer
- ✅ Use events for async communication
- ❌ Direct entity access
- ❌ Bypass service layer
- ❌ Circular dependencies

### Example: Clear Boundary

```typescript
// CreditModule - Don't access User entity directly
@Injectable()
export class CreditService {
  constructor(
    private usersService: UsersService // ✅ Use service
  ) // private userRepository: UserRepository, // ❌ Don't bypass
  {}

  async createRequest(userId: string, dto: CreateCreditRequestDto) {
    const user = await this.usersService.findById(userId); // ✅ Service call
    // Business logic
  }
}
```

---

## 🔍 Module Testing

### Unit Testing Modules

```typescript
describe("CreditModule", () => {
  let module: TestingModule;
  let service: CreditService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CreditModule,
        // Mock dependencies
        UsersModule, // Or mock
      ],
    }).compile();

    service = module.get<CreditService>(CreditService);
  });

  it("should create credit request", async () => {
    // Test with mocked dependencies
  });
});
```

### Integration Testing

```typescript
describe("Credit Integration", () => {
  it("should create request and notify user", async () => {
    // Test full flow across modules
  });
});
```

---

## 📊 Module Metrics

### Healthy Module Metrics

- **Cohesion**: High (related functionality together)
- **Coupling**: Low (minimal dependencies)
- **Size**: 3-7 files per module (controller, service, repository, module)
- **Dependencies**: Max 3-4 module dependencies
- **Cycles**: Zero circular dependencies

### Module Complexity Indicators

**Low Complexity:**

- 1-2 module dependencies
- 3-5 services/providers
- Clear single responsibility

**Medium Complexity:**

- 3-4 module dependencies
- 5-8 services/providers
- Multiple related concerns

**High Complexity (Refactor Needed):**

- 5+ module dependencies
- 10+ services/providers
- Mixed responsibilities

---

## 🚀 Scaling Modules

### Horizontal Scaling

```
Module → Microservice

Current:
AppModule
├── CreditModule (in same process)

Future:
├── Credit Service (separate process)
    └── CreditModule
```

### Vertical Scaling

```
Module → Sub-modules

Current:
CreditModule (all credit operations)

Future:
CreditModule
├── CreditRequestModule
├── CreditRepaymentModule
└── CreditAnalyticsModule
```

---

## 📚 Best Practices Checklist

### Module Design

- [ ] Single responsibility per module
- [ ] Clear module boundaries
- [ ] Minimal dependencies
- [ ] Explicit exports
- [ ] No circular dependencies

### Service Design

- [ ] Business logic in services
- [ ] Services export for reuse
- [ ] Use interfaces for contracts
- [ ] Single responsibility

### Repository Design

- [ ] One repository per entity
- [ ] Encapsulate data access
- [ ] Use transactions for critical ops
- [ ] Return entities, not DTOs

### Controller Design

- [ ] Thin controllers
- [ ] Delegate to services
- [ ] Use DTOs for validation
- [ ] Proper error handling

---

## 🔄 Refactoring Patterns

### Pattern 1: Extract Module

**When**: Module grows too large

```typescript
// Before: One large CreditModule
CreditModule {
  // Requests
  // Repayments
  // Analytics
}

// After: Split into sub-modules
CreditModule {
  imports: [
    CreditRequestModule,
    CreditRepaymentModule,
    CreditAnalyticsModule,
  ],
}
```

### Pattern 2: Extract Service

**When**: Service has multiple responsibilities

```typescript
// Before: One service handling everything
CreditService {
  createRequest()
  approveRequest()
  makeRepayment()
  getStatistics()
}

// After: Separate services
CreditRequestService
CreditApprovalService
CreditRepaymentService
CreditAnalyticsService
```

### Pattern 3: Extract Repository

**When**: Complex data access logic

```typescript
// Before: Direct TypeORM usage in service
CreditService {
  this.repository.createQueryBuilder()...
}

// After: Repository pattern
CreditRepository {
  findPendingWithUserDetails()
  findApprovedThisMonth()
}
```

---

## 🎯 Module Ownership

### Module Responsibilities

**Module Owner Should:**

- Maintain module's public API
- Document module usage
- Ensure backward compatibility
- Refactor internal implementation freely

**Module Consumer Should:**

- Use only exported services
- Respect module boundaries
- Not depend on internal implementation
- Update when module API changes

---

## 📖 Additional Resources

- [NestJS Modules](https://docs.nestjs.com/modules)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**See Main Architecture Guide**: `ARCHITECTURE.md`
