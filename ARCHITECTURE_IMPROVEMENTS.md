# Architecture Improvements Guide

Recommended architectural improvements for better modularity, scalability, and maintainability.

---

## 🎯 Improvement Areas

### 1. Interface Abstractions

**Current State**: Direct dependency on concrete classes
**Improvement**: Use interfaces for better testability and flexibility

#### Implementation

```typescript
// Define interface
export interface ICreditService {
  createRequest(userId: string, dto: CreateCreditRequestDto): Promise<CreditRequest>;
  approveRequest(id: string, adminId: string): Promise<CreditRequest>;
}

// Implement interface
@Injectable()
export class CreditService implements ICreditService {
  // Implementation
}

// Use interface in other services
constructor(
  @Inject('ICreditService') private creditService: ICreditService
) {}
```

**Benefits:**

- Easier unit testing (mock interfaces)
- Dependency inversion principle
- Flexibility to swap implementations

---

### 2. Domain Events Pattern

**Current State**: Direct service calls between modules
**Improvement**: Event-driven architecture for loose coupling

#### Implementation

```typescript
// Install: npm install @nestjs/event-emitter

// In app.module.ts
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // ... other modules
  ],
})
export class AppModule {}

// Publish event
@Injectable()
export class CreditService {
  constructor(private eventEmitter: EventEmitter2) {}

  async approveRequest(id: string) {
    const request = await this.updateStatus(id, "approved");

    // Publish domain event
    this.eventEmitter.emit("credit.approved", {
      requestId: request.id,
      userId: request.userId,
      amount: request.approvedAmount,
    });

    return request;
  }
}

// Listen to event
@Injectable()
export class NotificationsService {
  @OnEvent("credit.approved")
  async handleCreditApproved(payload: any) {
    // Send notification
    await this.create({
      userId: payload.userId,
      type: "credit_approved",
      message: `Your credit request for $${payload.amount} has been approved`,
    });
  }
}

@Injectable()
export class AnalyticsService {
  @OnEvent("credit.approved")
  async handleCreditApproved(payload: any) {
    // Update analytics
    await this.updateMetrics("credit_approved", payload.amount);
  }
}
```

**Benefits:**

- Loose coupling between modules
- Easy to add new listeners
- Better scalability
- Event sourcing potential

---

### 3. CQRS Pattern (Command Query Responsibility Segregation)

**Current State**: Same service handles reads and writes
**Improvement**: Separate read and write models

#### Implementation

```typescript
// Commands (Write operations)
@Injectable()
export class CreditCommandService {
  async createRequest(userId: string, dto: CreateCreditRequestDto) {
    // Write operation
    return this.creditRepository.create({ ...dto, userId });
  }

  async approveRequest(id: string) {
    // Write operation
    return this.creditRepository.update(id, { status: "approved" });
  }
}

// Queries (Read operations)
@Injectable()
export class CreditQueryService {
  async getRequest(id: string) {
    // Optimized read query
    return this.creditRepository.findOneWithRelations(id);
  }

  async getUserRequests(userId: string) {
    // Optimized query with joins
    return this.creditRepository.findByUserIdOptimized(userId);
  }
}

// Controller uses both
@Controller("credit")
export class CreditController {
  constructor(
    private commandService: CreditCommandService,
    private queryService: CreditQueryService
  ) {}

  @Post("request")
  async createRequest(@Body() dto: CreateCreditRequestDto) {
    return this.commandService.createRequest(userId, dto);
  }

  @Get("requests")
  async getRequests() {
    return this.queryService.getUserRequests(userId);
  }
}
```

**Benefits:**

- Optimized read queries
- Separate scaling for reads/writes
- Better performance
- Clear separation of concerns

---

### 4. Factory Pattern for Complex Objects

**Current State**: Direct instantiation in services
**Improvement**: Use factories for complex object creation

#### Implementation

```typescript
@Injectable()
export class CreditRequestFactory {
  create(requestedAmount: number, userId: string, creditScore: number) {
    const request = new CreditRequest();
    request.requestedAmount = requestedAmount;
    request.userId = userId;
    request.creditScore = creditScore;

    // Business logic for initial status
    if (creditScore >= 700) {
      request.status = "auto_approved";
    } else if (creditScore >= 600) {
      request.status = "pending";
    } else {
      request.status = "auto_rejected";
    }

    // Calculate interest rate based on score
    request.interestRate = this.calculateInterestRate(creditScore);

    return request;
  }

  private calculateInterestRate(score: number): number {
    if (score >= 800) return 5.0;
    if (score >= 700) return 7.5;
    if (score >= 600) return 10.0;
    return 15.0;
  }
}

// Use in service
@Injectable()
export class CreditService {
  constructor(
    private factory: CreditRequestFactory,
    private repository: CreditRepository
  ) {}

  async createRequest(userId: string, dto: CreateCreditRequestDto) {
    const user = await this.usersService.findById(userId);

    const request = this.factory.create(
      dto.requestedAmount,
      userId,
      user.creditScore
    );

    return this.repository.save(request);
  }
}
```

**Benefits:**

- Complex creation logic encapsulated
- Reusable object creation
- Easy to test
- Single place for business rules

---

### 5. Value Objects Pattern

**Current State**: Primitive types for domain concepts
**Improvement**: Use value objects for domain concepts

#### Implementation

```typescript
// Value Object: Money
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = "USD"
  ) {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
    if (!["USD", "EUR", "GBP"].includes(currency)) {
      throw new Error("Invalid currency");
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add different currencies");
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot subtract different currencies");
    }
    if (this.amount < other.amount) {
      throw new Error("Insufficient funds");
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

@Injectable()
export class SavingsService {
  async deposit(userId: string, amount: number) {
    const account = await this.getAccount(userId);
    const depositAmount = new Money(amount);
    const newBalance = new Money(account.balance).add(depositAmount);

    account.balance = newBalance.amount;
    return this.repository.save(account);
  }
}
```

**Benefits:**

- Type safety for domain concepts
- Encapsulated validation
- Immutable values
- Domain-driven design

---

### 6. Specification Pattern

**Current State**: Complex conditions in services
**Improvement**: Use specifications for complex business rules

#### Implementation

```typescript
// Base specification interface
export interface ISpecification<T> {
  isSatisfiedBy(entity: T): boolean;
}

// Credit approval specification
export class CreditApprovalSpecification implements ISpecification<User> {
  constructor(private requestedAmount: number) {}

  isSatisfiedBy(user: User): boolean {
    // Business rules
    if (user.creditScore < 600) return false;
    if (!user.isActive) return false;
    if (user.creditScore >= 700 && this.requestedAmount <= 10000) {
      return true; // Auto-approve
    }
    return user.creditScore >= 600; // Manual review
  }
}

// Use in service
@Injectable()
export class CreditService {
  async processRequest(userId: string, amount: number) {
    const user = await this.usersService.findById(userId);
    const spec = new CreditApprovalSpecification(amount);

    if (spec.isSatisfiedBy(user)) {
      return this.autoApprove(userId, amount);
    } else {
      return this.createPendingRequest(userId, amount);
    }
  }
}
```

**Benefits:**

- Complex rules encapsulated
- Reusable specifications
- Easy to test
- Clear business logic

---

### 7. Aggregate Root Pattern

**Current State**: Direct access to child entities
**Improvement**: Use aggregate roots for entity groups

#### Implementation

```typescript
// Aggregate Root: CreditRequest
@Entity()
export class CreditRequest {
  @OneToMany(() => CreditRepayment, (repayment) => repayment.creditRequest)
  repayments: CreditRepayment[];

  // Aggregate methods
  makeRepayment(amount: number): CreditRepayment {
    if (this.status !== "approved") {
      throw new Error("Cannot repay non-approved credit");
    }

    const repayment = new CreditRepayment();
    repayment.amount = amount;
    repayment.creditRequest = this;
    repayment.paymentDate = new Date();

    this.repayments.push(repayment);

    // Update aggregate state
    if (this.isFullyRepaid()) {
      this.status = "completed";
    }

    return repayment;
  }

  private isFullyRepaid(): boolean {
    const totalRepaid = this.repayments.reduce((sum, r) => sum + r.amount, 0);
    return totalRepaid >= this.approvedAmount;
  }
}
```

**Benefits:**

- Consistency boundaries
- Encapsulated business logic
- Single source of truth
- Transaction boundaries

---

### 8. Unit of Work Pattern

**Current State**: Individual repository calls
**Improvement**: Batch operations in single transaction

#### Implementation

```typescript
@Injectable()
export class UnitOfWork {
  private repositories: Map<string, any> = new Map();

  async beginTransaction() {
    return this.dataSource.transaction(async (manager) => {
      // Work with transaction manager
      return manager;
    });
  }

  async commit() {
    // Commit all changes
  }

  async rollback() {
    // Rollback all changes
  }
}

// Use in service
@Injectable()
export class CreditService {
  constructor(private unitOfWork: UnitOfWork) {}

  async approveAndNotify(id: string) {
    return this.unitOfWork.beginTransaction(async (manager) => {
      // Update credit request
      await manager.update(CreditRequest, { id }, { status: "approved" });

      // Create notification
      await manager.insert(Notification, {
        userId: request.userId,
        type: "credit_approved",
      });

      // Both operations in single transaction
    });
  }
}
```

**Benefits:**

- Transaction consistency
- Batch operations
- Rollback capability
- Performance optimization

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Add interface abstractions
- [ ] Implement base repository interface
- [ ] Create base service interface
- [ ] Update existing services to use interfaces

### Phase 2: Event-Driven (Week 3-4)

- [ ] Install and configure EventEmitter
- [ ] Convert direct calls to events
- [ ] Implement event listeners
- [ ] Add event logging

### Phase 3: Advanced Patterns (Week 5-6)

- [ ] Implement CQRS for read-heavy modules
- [ ] Add factory patterns for complex objects
- [ ] Create value objects for domain concepts
- [ ] Implement specification pattern

### Phase 4: Optimization (Week 7-8)

- [ ] Add aggregate root patterns
- [ ] Implement unit of work pattern
- [ ] Optimize database queries
- [ ] Add caching layer

---

## 📊 Benefits Summary

| Improvement            | Benefit                     | Priority |
| ---------------------- | --------------------------- | -------- |
| Interface Abstractions | Testability, Flexibility    | High     |
| Domain Events          | Loose Coupling, Scalability | High     |
| CQRS Pattern           | Performance, Scalability    | Medium   |
| Factory Pattern        | Code Reusability            | Medium   |
| Value Objects          | Type Safety, Validation     | Medium   |
| Specification Pattern  | Business Rules Clarity      | Low      |
| Aggregate Root         | Consistency                 | Low      |
| Unit of Work           | Transaction Management      | Low      |

---

## 🔧 Quick Wins

### 1. Add Interface Abstractions (1-2 days)

Create interfaces for key services and repositories.

### 2. Implement Event-Driven Pattern (3-5 days)

Convert notification and credit approval to events.

### 3. Add Factory Pattern (2-3 days)

Create factories for credit requests and savings accounts.

---

**See Main Architecture Guide**: `ARCHITECTURE.md`
