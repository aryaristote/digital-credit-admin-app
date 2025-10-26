# Domain-Driven Design (DDD) Architecture

Comprehensive documentation of the Domain-Driven Design implementation in both Client and Admin applications.

---

## 🎯 Overview

Both applications now follow **Domain-Driven Design (DDD)** principles, focusing on:

- **Domain Model**: Rich business logic encapsulated in domain entities
- **Value Objects**: Immutable, self-validating objects
- **Aggregates**: Clusters of entities managed as a single unit
- **Domain Services**: Business logic that doesn't fit in entities
- **Domain Events**: Important business occurrences
- **Bounded Contexts**: Clear boundaries between different domains

---

## 📐 DDD Structure

### Domain Layer Organization

```
domain/
├── value-objects/          # Immutable value objects
│   ├── money.vo.ts
│   ├── credit-score.vo.ts
│   └── account-number.vo.ts
├── entities/               # Domain entities and aggregates
│   ├── credit-request.aggregate.ts
│   └── savings-account.aggregate.ts
├── services/               # Domain services
│   ├── credit-calculator.service.ts
│   └── credit-scoring.service.ts
└── events/                 # Domain events
    └── domain-event.base.ts
```

---

## 🧩 Core DDD Components

### 1. Value Objects

**Purpose**: Immutable objects defined by their attributes, not identity.

#### Money Value Object

```typescript
const amount = new Money(1000, "USD");
const interest = amount.multiply(0.1); // Calculate 10% interest
const total = amount.add(interest); // Add amounts
```

**Features:**

- Immutable (cannot be changed)
- Self-validating (ensures positive amounts)
- Currency-aware operations
- Safe mathematical operations

#### Credit Score Value Object

```typescript
const creditScore = new CreditScore(720);
const category = creditScore.getCategory(); // Returns 'GOOD'
const interestRate = creditScore.calculateInterestRate(); // Returns 7.5%
```

**Features:**

- Validates score range (300-850)
- Categorizes scores (Excellent, Good, Fair, Poor, Very Poor)
- Calculates interest rates based on score
- Provides business logic methods

#### Account Number Value Object

```typescript
const accountNumber = AccountNumber.generate("SAV");
// Returns: 'SAV123456781234'
```

**Features:**

- Immutable identification
- Validation rules
- Generation methods
- Format consistency

---

### 2. Aggregates

**Purpose**: Clusters of entities treated as a single unit with one aggregate root.

#### Credit Request Aggregate

```typescript
const creditRequest = new CreditRequestAggregate(
  id,
  userId,
  requestedAmount,
  interestRate,
  termMonths,
  purpose
);

// Domain logic encapsulated in aggregate
creditRequest.approve(adminId, approvedAmount);
creditRequest.repay(repaymentAmount);
const remainingBalance = creditRequest.calculateRemainingBalance();
```

**Features:**

- Manages its own state transitions
- Enforces business rules
- Raises domain events
- Controls access to internal entities

**Business Rules Enforced:**

- Only PENDING requests can be approved/rejected
- Only ACTIVE requests can receive repayments
- Repayments cannot exceed remaining balance
- Status transitions are controlled

---

### 3. Domain Services

**Purpose**: Business logic that doesn't naturally fit in entities or value objects.

#### Credit Calculator Service

```typescript
const calculator = new CreditCalculatorService();
const monthlyPayment = calculator.calculateMonthlyPayment(
  principal,
  interestRate,
  termMonths
);
const schedule = calculator.generatePaymentSchedule(
  principal,
  interestRate,
  termMonths
);
```

**Responsibilities:**

- Loan calculations
- Payment schedule generation
- Interest calculations
- Financial formulas

#### Credit Scoring Service

```typescript
const scoringService = new CreditScoringService();
const meetsRequirement = scoringService.meetsMinimumRequirement(creditScore);
const shouldAutoApprove = scoringService.shouldAutoApprove(creditScore);
const recommendations =
  scoringService.getImprovementRecommendations(creditScore);
```

**Responsibilities:**

- Credit score validation
- Approval logic
- Health calculations
- Recommendations

---

### 4. Domain Events

**Purpose**: Capture important business occurrences that happened in the domain.

#### Event Types

1. **CreditRequestApprovedEvent**

   - Triggered when credit is approved
   - Contains: creditRequestId, userId

2. **CreditRequestRejectedEvent**

   - Triggered when credit is rejected
   - Contains: creditRequestId, userId, reason

3. **CreditRepaymentProcessedEvent**

   - Triggered when repayment is made
   - Contains: creditRequestId, userId, amount

4. **CreditRequestCompletedEvent**
   - Triggered when credit is fully repaid
   - Contains: creditRequestId, userId

#### Event Handling

```typescript
// Events are raised automatically when business actions occur
creditRequest.approve(adminId, amount);
// Automatically raises CreditRequestApprovedEvent

// Event bus handles events
await eventBus.publish(creditRequest.domainEvents);
```

---

## 🏗️ Architecture Layers

### Layered Architecture with DDD

```
┌─────────────────────────────────────────┐
│     Presentation Layer                  │
│  Controllers, DTOs, API Routes         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Application Layer                   │
│  Application Services, Use Cases        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Domain Layer (DDD Core)             │
│  Entities, Aggregates, Value Objects    │
│  Domain Services, Domain Events         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Infrastructure Layer                │
│  Repositories, TypeORM, External APIs   │
└─────────────────────────────────────────┘
```

---

## 📦 Bounded Contexts

### Credit Management Context

**Domain**: Credit requests, approvals, repayments

**Entities**:

- CreditRequestAggregate (Root)
- CreditRepayment

**Value Objects**:

- Money
- CreditScore

**Services**:

- CreditCalculatorService
- CreditScoringService

**Events**:

- CreditRequestApprovedEvent
- CreditRequestRejectedEvent
- CreditRepaymentProcessedEvent
- CreditRequestCompletedEvent

### Savings Management Context

**Domain**: Savings accounts, deposits, withdrawals

**Entities**:

- SavingsAccountAggregate (Root)
- Transaction

**Value Objects**:

- Money
- AccountNumber

**Services**:

- SavingsCalculatorService (future)

### User Management Context

**Domain**: User accounts, authentication, profiles

**Entities**:

- User (Root)

**Value Objects**:

- CreditScore
- Email (future)

---

## 🔄 Domain Model Transformation

### Before (Anemic Domain Model)

```typescript
// Entity is just data
@Entity()
export class CreditRequest {
  @Column() status: string;
  @Column() amount: number;

  // No business logic - logic is in service
}

// Service contains all logic
class CreditService {
  approve(request: CreditRequest) {
    if (request.status !== "PENDING") {
      throw new Error("Cannot approve");
    }
    request.status = "ACTIVE";
    // Business logic mixed with infrastructure
  }
}
```

### After (Rich Domain Model)

```typescript
// Aggregate contains business logic
export class CreditRequestAggregate {
  private _status: CreditStatus;
  private _requestedAmount: Money;

  // Business logic in aggregate
  approve(adminId: string, amount?: Money): void {
    if (this._status !== CreditStatus.PENDING) {
      throw new Error('Only pending requests can be approved');
    }
    this._status = CreditStatus.ACTIVE;
    this._approvedAmount = amount || this._requestedAmount;
    this.addDomainEvent(new CreditRequestApprovedEvent(...));
  }

  repay(amount: Money): void {
    // Validate and process repayment
    // Raise domain events
  }
}

// Service orchestrates domain objects
class CreditService {
  async approve(id: string, adminId: string) {
    const aggregate = await this.repository.findById(id);
    aggregate.approve(adminId);
    await this.repository.save(aggregate);
    await this.eventBus.publish(aggregate.domainEvents);
  }
}
```

---

## ✅ DDD Benefits

### 1. **Business Logic Centralization**

- Logic is in domain objects, not scattered in services
- Easier to find and understand business rules
- Changes are localized to domain model

### 2. **Type Safety**

- Value objects ensure correct types
- Compile-time validation
- Fewer runtime errors

### 3. **Testability**

- Domain logic can be tested in isolation
- No need for database or infrastructure
- Fast unit tests

### 4. **Maintainability**

- Clear boundaries between domains
- Self-documenting code
- Easier to reason about

### 5. **Event-Driven Architecture**

- Loose coupling between components
- Extensible event handlers
- Audit trail via events

---

## 🚀 Implementation Guidelines

### Creating Value Objects

```typescript
export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error("Invalid email");
    }
    this._value = value;
  }

  private isValid(email: string): boolean {
    // Validation logic
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
```

### Creating Aggregates

```typescript
export class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
```

### Using Domain Services

```typescript
// When logic doesn't fit in entity
export class CreditScoringService {
  calculateScore(user: User): CreditScore {
    // Complex calculation logic
  }
}
```

---

## 📚 Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Overall architecture
- [MODULAR_DESIGN_PRINCIPLES.md](MODULAR_DESIGN_PRINCIPLES.md) - Design principles
- [FUNCTIONALITY_IMPROVEMENTS.md](FUNCTIONALITY_IMPROVEMENTS.md) - Implementation details

---

## 🎯 Summary

The DDD implementation provides:

- ✅ Rich domain models with business logic
- ✅ Immutable value objects for type safety
- ✅ Aggregates for consistency boundaries
- ✅ Domain services for complex logic
- ✅ Domain events for decoupling
- ✅ Clear bounded contexts

This architecture ensures that business logic is encapsulated, testable, and maintainable, following Domain-Driven Design best practices.
