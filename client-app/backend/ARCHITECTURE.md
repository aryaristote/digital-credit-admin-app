# Client Backend Architecture

Detailed architecture documentation for the Client Application Backend.

---

## 🏗️ Architecture Overview

The Client Backend follows **Clean Architecture** principles with clear separation between layers:

```
┌────────────────────────────────────────┐
│        Presentation Layer               │
│  Controllers, Guards, Interceptors      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        Business Logic Layer             │
│  Services, DTOs, Validators            │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        Data Access Layer                │
│  Repositories, Entities, Queries       │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        Database Layer                   │
│  PostgreSQL (TypeORM)                 │
└────────────────────────────────────────┘
```

---

## 📦 Module Architecture

### Module Structure

Each module is self-contained with:

```typescript
feature-module/
├── dto/                    # Data Transfer Objects
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── *-response.dto.ts
├── entities/              # Database entities
│   └── *.entity.ts
├── guards/                # Route guards (if module-specific)
├── *.controller.ts        # API endpoints
├── *.service.ts          # Business logic
├── *.repository.ts        # Data access
└── *.module.ts           # Module definition
```

### Module Responsibilities

#### Auth Module

- Authentication (login, register)
- JWT token generation
- Session management
- Password hashing

**Dependencies:**

- UsersModule (for user operations)
- SessionsModule (for session tracking)

**Exports:**

- AuthService
- JwtAuthGuard
- LocalAuthGuard

#### Users Module

- User CRUD operations
- Profile management
- Credit score calculation
- User validation

**Dependencies:**

- None (core module)

**Exports:**

- UsersService
- UsersRepository

#### Savings Module

- Savings account management
- Deposit/withdrawal operations
- Transaction history
- Balance calculations

**Dependencies:**

- NotificationsModule (for transaction notifications)

**Exports:**

- SavingsService

#### Credit Module

- Credit request submission
- Automated approval logic
- Repayment processing
- Credit tracking

**Dependencies:**

- UsersModule (for credit score)
- SavingsModule (for repayments)
- NotificationsModule (for notifications)

**Exports:**

- CreditService

#### Notifications Module

- In-app notifications
- Email notifications (via Bull Queue)
- Notification management

**Dependencies:**

- None

**Exports:**

- NotificationsService

#### Sessions Module

- Session tracking
- Refresh token management
- Device information storage
- Session invalidation

**Dependencies:**

- UsersModule (for user reference)

**Exports:**

- SessionsService

---

## 🔄 Data Flow

### Example: Deposit Flow

```
1. Controller (savings.controller.ts)
   POST /api/v1/savings/deposit
   ↓
2. DTO Validation (deposit.dto.ts)
   Validate amount, description
   ↓
3. Service (savings.service.ts)
   - Get user's savings account
   - Validate account exists
   - Calculate new balance
   - Create transaction record
   ↓
4. Repository (savings.repository.ts)
   - Update account balance (with transaction)
   - Save transaction record
   ↓
5. Database (PostgreSQL)
   - Atomic transaction
   - Update savings_account
   - Insert transaction
   ↓
6. Service (return response)
   - Transform to DTO
   - Return transaction details
   ↓
7. Controller (return HTTP response)
```

---

## 🎯 Design Patterns

### Repository Pattern

**Implementation:**

```typescript
@Injectable()
export class SavingsRepository {
  constructor(
    @InjectRepository(SavingsAccount)
    private readonly accountRepo: Repository<SavingsAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async deposit(userId: string, amount: number) {
    // Use transaction for atomicity
    return this.accountRepo.manager.transaction(async (manager) => {
      const account = await manager.findOne(SavingsAccount, {
        where: { userId },
      });

      account.balance += amount;
      await manager.save(account);

      const transaction = manager.create(Transaction, {
        userId,
        type: 'deposit',
        amount,
        balance: account.balance,
      });

      return manager.save(transaction);
    });
  }
}
```

### Service Pattern

**Implementation:**

```typescript
@Injectable()
export class SavingsService {
  constructor(
    private readonly savingsRepository: SavingsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async deposit(userId: string, dto: DepositDto) {
    // Business logic
    const transaction = await this.savingsRepository.deposit(userId, dto.amount);

    // Send notification
    await this.notificationsService.create({
      userId,
      type: 'deposit',
      message: `Deposit of $${dto.amount} successful`,
    });

    return transaction;
  }
}
```

---

## 🔗 Module Dependencies

### Dependency Graph

```
AppModule
│
├── AuthModule
│   ├── UsersModule
│   └── SessionsModule
│
├── UsersModule (core)
│
├── SavingsModule
│   └── NotificationsModule
│
├── CreditModule
│   ├── UsersModule
│   ├── SavingsModule
│   └── NotificationsModule
│
├── NotificationsModule
│
└── SessionsModule
    └── UsersModule
```

### Dependency Rules

1. **No Circular Dependencies**: Modules export only what's needed
2. **Core Modules First**: UsersModule has no dependencies
3. **Feature Modules Import**: CreditModule imports what it needs
4. **Service Exports**: Services exported for inter-module use

---

## 📊 Entity Relationships

### Entity Diagram

```
User (1) ────< (Many) Session
  │
  │ (1)
  │
  └───> (1) SavingsAccount ────< (Many) Transaction

User (1) ────< (Many) CreditRequest ────< (Many) CreditRepayment

User (1) ────< (Many) Notification
```

### Relationship Management

```typescript
// User Entity
@OneToMany(() => CreditRequest, (request) => request.user)
creditRequests: CreditRequest[];

// CreditRequest Entity
@ManyToOne(() => User, (user) => user.creditRequests)
user: User;
```

---

## 🚀 Scalability Features

### 1. Database Transactions

- Atomic operations for financial transactions
- Consistency guarantees
- Rollback on errors

### 2. Connection Pooling

- TypeORM manages connection pool
- Configurable pool size
- Efficient resource usage

### 3. Background Jobs

- Bull Queue for async processing
- Email notifications queued
- Non-blocking operations

### 4. Caching Opportunities

- Redis for session storage (optional)
- Query result caching (optional)
- Rate limiting (recommended)

---

## 🔍 Code Quality Patterns

### 1. Error Handling

```typescript
// Service with proper error handling
async getAccount(userId: string) {
  const account = await this.repository.findByUserId(userId);

  if (!account) {
    throw new NotFoundException('Savings account not found');
  }

  return account;
}
```

### 2. Input Validation

```typescript
// DTO with validation
export class DepositDto {
  @IsNumber()
  @Min(0.01)
  @Max(1000000)
  amount: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
```

### 3. Response Transformation

```typescript
// Response DTO (exclude sensitive data)
export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  creditScore: number;
  // password excluded via @Exclude()
}
```

---

## 📚 Best Practices

### 1. Module Organization

- ✅ One feature per module
- ✅ Clear module boundaries
- ✅ Explicit dependencies
- ✅ Service exports for reusability

### 2. Service Design

- ✅ Business logic in services
- ✅ No database access in controllers
- ✅ Use repositories for data access
- ✅ DTOs for data validation

### 3. Repository Design

- ✅ One repository per entity
- ✅ Encapsulate data access logic
- ✅ Use transactions for critical operations
- ✅ Return entities, not raw data

### 4. Controller Design

- ✅ Thin controllers (delegate to services)
- ✅ Request/response transformation
- ✅ Error handling
- ✅ API documentation (Swagger)

---

## 🔄 Future Improvements

### 1. Event-Driven Architecture

```typescript
// Publish events instead of direct calls
this.eventEmitter.emit('credit.approved', { requestId });
```

### 2. CQRS Pattern

```typescript
// Separate read and write models
CreditReadService; // Optimized for queries
CreditWriteService; // Optimized for commands
```

### 3. Domain Events

```typescript
// Domain-specific events
@DomainEvent()
export class CreditApprovedEvent {
  constructor(public readonly request: CreditRequest) {}
}
```

---

**See Main Architecture Guide**: `../../ARCHITECTURE.md`
