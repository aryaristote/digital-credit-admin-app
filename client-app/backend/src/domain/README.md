# Domain Layer

This directory contains the Domain-Driven Design (DDD) core domain models, value objects, aggregates, and domain services.

## Structure

```
domain/
├── value-objects/          # Immutable value objects
│   ├── money.vo.ts        # Monetary amounts with currency
│   ├── credit-score.vo.ts # Credit score with validation
│   └── account-number.vo.ts # Account number with format validation
│
├── entities/               # Domain entities and aggregates
│   ├── credit-request.aggregate.ts # Credit request aggregate root
│   └── savings-account.aggregate.ts # Savings account aggregate root
│
├── services/               # Domain services
│   ├── credit-calculator.service.ts # Credit calculations
│   └── credit-scoring.service.ts   # Credit scoring logic
│
└── events/                 # Domain events
    └── domain-event.base.ts # Base event class and event bus
```

## Key Concepts

### Value Objects

Immutable objects defined by their attributes:

- **Money**: Handles monetary amounts with currency
- **CreditScore**: Validates and categorizes credit scores
- **AccountNumber**: Generates and validates account numbers

### Aggregates

Clusters of entities managed as a single unit:

- **CreditRequestAggregate**: Manages credit lifecycle
- **SavingsAccountAggregate**: Manages savings account operations

### Domain Services

Business logic that doesn't fit in entities:

- **CreditCalculatorService**: Loan calculations
- **CreditScoringService**: Credit score business rules

### Domain Events

Important business occurrences:

- CreditRequestApprovedEvent
- CreditRequestRejectedEvent
- CreditRepaymentProcessedEvent
- SavingsDepositedEvent
- SavingsWithdrawnEvent

## Usage

### Creating Value Objects

```typescript
import { Money } from './value-objects/money.vo';
import { CreditScore } from './value-objects/credit-score.vo';

const amount = new Money(1000, 'USD');
const creditScore = new CreditScore(720);
```

### Using Aggregates

```typescript
import { CreditRequestAggregate } from './entities/credit-request.aggregate';
import { Money } from './value-objects/money.vo';

const creditRequest = new CreditRequestAggregate(
  id,
  userId,
  new Money(10000),
  10.0,
  12,
  'Home improvement',
);

creditRequest.approve(adminId, new Money(10000));
```

### Domain Services

```typescript
import { CreditCalculatorService } from './services/credit-calculator.service';

const calculator = new CreditCalculatorService();
const monthlyPayment = calculator.calculateMonthlyPayment(
  principal,
  interestRate,
  termMonths,
);
```

## Principles

1. **Rich Domain Model**: Business logic is in domain objects
2. **Value Objects**: Immutable, self-validating
3. **Aggregates**: Consistency boundaries
4. **Domain Events**: Decouple components
5. **Ubiquitous Language**: Domain terms used throughout

See [DDD_ARCHITECTURE.md](../../../../DDD_ARCHITECTURE.md) for complete documentation.
