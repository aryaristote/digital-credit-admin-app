# Architecture & Modular Design Guide

Comprehensive architecture documentation for the Digital Credit & Savings Platform.

---

## 🏗️ Architecture Overview

Both applications follow **Clean Architecture** principles with **Domain-Driven Design** (DDD) concepts, ensuring scalability, maintainability, and testability.

---

## 📐 Architectural Principles

### 1. Separation of Concerns

- **Layered Architecture**: Clear separation between presentation, business logic, and data access
- **Single Responsibility**: Each module handles one domain concern
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### 2. Modular Design

- **Feature Modules**: Each feature is a self-contained module
- **Shared Modules**: Common functionality extracted to shared modules
- **Loose Coupling**: Modules communicate through well-defined interfaces

### 3. SOLID Principles

- **S**ingle Responsibility: Each class has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Derived classes must be substitutable
- **I**nterface Segregation: Many specific interfaces vs one general
- **D**ependency Inversion: Depend on abstractions, not concretions

---

## 🏛️ Client Application Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Controllers  │  │   Guards     │  │ Interceptors │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Services   │  │   DTOs       │  │  Validators  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Repositories │  │   Entities    │  │   Queries    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│                    PostgreSQL (TypeORM)                      │
└─────────────────────────────────────────────────────────────┘
```

### Module Structure

```
client-app/backend/src/
├── main.ts                    # Application bootstrap
├── app.module.ts              # Root module
│
├── config/                    # Configuration
│   └── typeorm.config.ts     # Database configuration
│
├── common/                    # Shared utilities
│   ├── decorators/           # Custom decorators (@CurrentUser, @Roles)
│   ├── enums/                # Shared enumerations
│   ├── filters/              # Exception filters
│   └── interceptors/        # Response interceptors
│
└── modules/                   # Feature modules
    ├── auth/                 # Authentication & Authorization
    │   ├── dto/              # Data Transfer Objects
    │   ├── entities/         # Database entities
    │   ├── guards/           # Security guards
    │   ├── strategies/       # Passport strategies
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   └── auth.module.ts
    │
    ├── users/                # User Management
    │   ├── dto/
    │   ├── entities/
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── users.repository.ts
    │   └── users.module.ts
    │
    ├── savings/              # Savings Account Management
    │   ├── dto/
    │   ├── entities/
    │   ├── savings.controller.ts
    │   ├── savings.service.ts
    │   ├── savings.repository.ts
    │   └── savings.module.ts
    │
    ├── credit/               # Credit Request Management
    │   ├── dto/
    │   ├── entities/
    │   ├── credit.controller.ts
    │   ├── credit.service.ts
    │   ├── credit.repository.ts
    │   └── credit.module.ts
    │
    ├── notifications/        # Notification System
    │   ├── dto/
    │   ├── entities/
    │   ├── processors/       # Background job processors
    │   ├── notifications.controller.ts
    │   ├── notifications.service.ts
    │   ├── notifications.repository.ts
    │   └── notifications.module.ts
    │
    └── sessions/             # Session Management
        ├── entities/
        ├── sessions.service.ts
        ├── sessions.repository.ts
        └── sessions.module.ts
```

### Module Pattern

Each module follows a consistent structure:

```typescript
@Module({
  imports: [
    // Dependencies (other modules, TypeORM, external libs)
    TypeOrmModule.forFeature([Entity]),
    OtherModule,
  ],
  controllers: [FeatureController],
  providers: [
    FeatureService,
    FeatureRepository,
    // Other providers
  ],
  exports: [FeatureService], // Export for use in other modules
})
export class FeatureModule {}
```

---

## 🏛️ Admin Application Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Controllers  │  │ Admin Guards │  │ Interceptors │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Services   │  │   DTOs       │  │  Analytics   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                        │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  TypeORM     │  │ Shared Entities│                      │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Shared Database (Client App DB)                │
│                    PostgreSQL (TypeORM)                      │
└─────────────────────────────────────────────────────────────┘
```

### Module Structure

```
admin-app/backend/src/
├── main.ts                    # Application bootstrap
├── app.module.ts              # Root module
│
├── config/                    # Configuration
│   └── typeorm.config.ts     # Database configuration
│
├── common/                    # Shared utilities
│   ├── decorators/           # Custom decorators (@CurrentUser)
│   ├── enums/                # Shared enumerations
│   └── guards/               # Security guards (AdminGuard)
│
├── shared/                    # Shared entities (from client DB)
│   └── entities/             # User, CreditRequest, etc.
│
└── modules/                   # Feature modules
    ├── auth/                 # Admin Authentication
    │   ├── strategies/       # JWT strategy
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   └── auth.module.ts
    │
    ├── users/                # User Management (Admin View)
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── users.module.ts
    │
    ├── credit/               # Credit Approval Management
    │   ├── credit.controller.ts
    │   ├── credit.service.ts
    │   └── credit.module.ts
    │
    ├── analytics/            # System Analytics
    │   ├── analytics.controller.ts
    │   ├── analytics.service.ts
    │   └── analytics.module.ts
    │
    ├── transactions/          # Transaction Monitoring
    │   ├── transactions.controller.ts
    │   ├── transactions.service.ts
    │   └── transactions.module.ts
    │
    └── admins/               # Admin Management (Future)
        └── admins.module.ts
```

---

## 🎯 Design Patterns

### 1. Repository Pattern

**Purpose**: Abstract data access logic

**Implementation:**

```typescript
// Repository Interface
export interface IUsersRepository {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
}

// Repository Implementation
@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async findById(id: string): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }
  // ... other methods
}
```

**Benefits:**

- Testability: Easy to mock repositories
- Flexibility: Switch data sources without changing services
- Single Responsibility: Data access logic isolated

### 2. DTO Pattern

**Purpose**: Data validation and transformation

**Implementation:**

```typescript
// Request DTO
export class CreateCreditRequestDto {
  @IsNumber()
  @Min(1000)
  requestedAmount: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  requestedDurationMonths: number;
}

// Response DTO
export class CreditRequestResponseDto {
  id: string;
  requestedAmount: number;
  status: string;
  createdAt: Date;
  // Exclude sensitive data
}
```

**Benefits:**

- Validation: Ensure data integrity
- Security: Control what data is exposed
- Versioning: Easier API versioning

### 3. Service Pattern

**Purpose**: Business logic encapsulation

**Implementation:**

```typescript
@Injectable()
export class CreditService {
  constructor(
    private readonly creditRepository: CreditRepository,
    private readonly usersService: UsersService,
    private readonly savingsService: SavingsService
  ) {}

  async createRequest(userId: string, dto: CreateCreditRequestDto) {
    // Business logic here
    const user = await this.usersService.findById(userId);
    // Validation, calculations, etc.
    return this.creditRepository.create({ ...dto, userId });
  }
}
```

**Benefits:**

- Business Logic: Centralized in services
- Reusability: Services can be used by multiple controllers
- Testability: Easy to unit test

### 4. Guard Pattern

**Purpose**: Route protection and authorization

**Implementation:**

```typescript
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    return user && user.role === "admin";
  }
}
```

**Benefits:**

- Security: Centralized authorization
- Reusability: Apply to multiple routes
- Maintainability: Single point of control

### 5. Strategy Pattern

**Purpose**: Algorithm selection (authentication strategies)

**Implementation:**

```typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}

// Local Strategy
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  validate(email: string, password: string) {
    return this.authService.validateUser(email, password);
  }
}
```

**Benefits:**

- Flexibility: Switch authentication methods
- Extensibility: Add new strategies easily
- Separation: Each strategy is independent

---

## 🔄 Data Flow

### Request Flow

```
1. HTTP Request
   ↓
2. Guards (Authentication/Authorization)
   ↓
3. Controller (Request Handling)
   ↓
4. DTO Validation (Transform & Validate)
   ↓
5. Service (Business Logic)
   ↓
6. Repository (Data Access)
   ↓
7. Database (Query Execution)
   ↓
8. Repository (Data Mapping)
   ↓
9. Service (Response Transformation)
   ↓
10. Interceptor (Response Formatting)
   ↓
11. HTTP Response
```

### Example: Credit Request Flow

```typescript
// 1. Controller receives request
@Post('request')
async createRequest(
  @CurrentUser('id') userId: string,
  @Body() dto: CreateCreditRequestDto,
) {
  return this.creditService.createRequest(userId, dto);
}

// 2. Service business logic
async createRequest(userId: string, dto: CreateCreditRequestDto) {
  // Validate user
  const user = await this.usersService.findById(userId);

  // Business rules
  if (user.creditScore < 600) {
    throw new BadRequestException('Insufficient credit score');
  }

  // Create request
  return this.creditRepository.create({ ...dto, userId });
}

// 3. Repository data access
async create(data: CreateCreditRequestDto) {
  const request = this.repository.create(data);
  return this.repository.save(request);
}
```

---

## 🔗 Module Dependencies

### Client App Module Graph

```
AppModule
├── AuthModule
│   ├── UsersModule
│   └── SessionsModule
├── UsersModule
├── SavingsModule
│   └── NotificationsModule
├── CreditModule
│   ├── UsersModule
│   ├── SavingsModule
│   └── NotificationsModule
├── NotificationsModule
└── SessionsModule
    └── UsersModule
```

### Dependency Rules

1. **Cyclic Dependencies**: Avoided through proper module exports
2. **Shared Modules**: Common functionality extracted
3. **Forward References**: Used when necessary for circular dependencies

---

## 📦 Module Responsibilities

### Auth Module

- **Responsibilities**: Authentication, token generation, session management
- **Dependencies**: UsersModule, SessionsModule
- **Exports**: AuthService, Guards, Strategies

### Users Module

- **Responsibilities**: User CRUD, profile management, credit score
- **Dependencies**: None (core module)
- **Exports**: UsersService, UsersRepository

### Savings Module

- **Responsibilities**: Savings accounts, deposits, withdrawals, transactions
- **Dependencies**: NotificationsModule
- **Exports**: SavingsService

### Credit Module

- **Responsibilities**: Credit requests, approvals, repayments
- **Dependencies**: UsersModule, SavingsModule, NotificationsModule
- **Exports**: CreditService

### Notifications Module

- **Responsibilities**: In-app notifications, email notifications
- **Dependencies**: None
- **Exports**: NotificationsService

### Sessions Module

- **Responsibilities**: Session tracking, refresh token management
- **Dependencies**: UsersModule
- **Exports**: SessionsService

---

## 🎨 Architecture Improvements

### 1. Interface Abstractions

**Current**: Direct dependency on concrete classes
**Improved**: Use interfaces for better testability

```typescript
// Define interface
export interface ICreditService {
  createRequest(
    userId: string,
    dto: CreateCreditRequestDto
  ): Promise<CreditRequest>;
}

// Implement interface
@Injectable()
export class CreditService implements ICreditService {
  // Implementation
}
```

### 2. Domain Events

**Current**: Direct service calls
**Improved**: Event-driven for loose coupling

```typescript
// Event Publisher
@Injectable()
export class CreditService {
  constructor(private eventEmitter: EventEmitter2) {}

  async approveRequest(id: string) {
    const request = await this.updateStatus(id, 'approved');
    this.eventEmitter.emit('credit.approved', { request });
    return request;
  }
}

// Event Listener
@OnEvent('credit.approved')
handleCreditApproved(payload: any) {
  // Send notification, update analytics, etc.
}
```

### 3. Service Layer Abstractions

**Current**: Services directly use repositories
**Improved**: Use interfaces and dependency injection

```typescript
// Abstract repository interface
export interface IBaseRepository<T> {
  findById(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

### 4. Error Handling Strategy

**Current**: Exceptions thrown directly
**Improved**: Custom exception classes

```typescript
// Domain-specific exceptions
export class InsufficientBalanceException extends BadRequestException {
  constructor(balance: number, required: number) {
    super(
      `Insufficient balance. Available: $${balance}, Required: $${required}`
    );
  }
}

// Usage
if (balance < amount) {
  throw new InsufficientBalanceException(balance, amount);
}
```

### 5. Configuration Management

**Current**: Direct environment variable access
**Improved**: Configuration classes

```typescript
// Configuration class
@Injectable()
export class AppConfig {
  get dbConfig() {
    return {
      host: this.configService.get("DB_HOST"),
      port: this.configService.get("DB_PORT"),
      // ...
    };
  }
}
```

---

## 🚀 Scalability Considerations

### Horizontal Scaling

- ✅ Stateless API design (JWT tokens)
- ✅ Database connection pooling
- ✅ Session storage in database (not in-memory)
- ✅ Background job processing (Bull Queue)

### Vertical Scaling

- ✅ Efficient database queries
- ✅ Proper indexing strategy
- ✅ Caching opportunities (Redis)
- ✅ Lazy loading for relations

### Microservices Readiness

- ✅ Modular architecture (easy to extract)
- ✅ Clear module boundaries
- ✅ Event-driven communication potential
- ✅ API gateway compatibility

---

## 📊 Module Communication Patterns

### 1. Direct Module Import

```typescript
// Module A imports Module B
@Module({
  imports: [ModuleB],
})
export class ModuleA {}
```

### 2. Service Export/Import

```typescript
// Module B exports service
@Module({
  exports: [ServiceB],
})
export class ModuleB {}

// Module A imports service
@Module({
  imports: [ModuleB],
})
export class ModuleA {}
```

### 3. Shared Module Pattern

```typescript
// Shared module with common functionality
@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class SharedModule {}
```

---

## 🔍 Code Organization Best Practices

### 1. Feature Module Structure

```
feature/
├── dto/              # Data Transfer Objects
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── *-response.dto.ts
├── entities/         # Database entities
│   └── *.entity.ts
├── interfaces/       # TypeScript interfaces (optional)
│   └── *.interface.ts
├── guards/          # Route guards (if module-specific)
├── *.controller.ts  # API endpoints
├── *.service.ts     # Business logic
├── *.repository.ts  # Data access
└── *.module.ts      # Module definition
```

### 2. Naming Conventions

- **Controllers**: `feature.controller.ts`
- **Services**: `feature.service.ts`
- **Repositories**: `feature.repository.ts`
- **DTOs**: `verb-noun.dto.ts` (e.g., `create-user.dto.ts`)
- **Entities**: `noun.entity.ts` (e.g., `user.entity.ts`)
- **Guards**: `noun.guard.ts` (e.g., `admin.guard.ts`)

### 3. File Organization

- **One class per file**
- **Related types in same directory**
- **Shared code in `common/`**
- **Feature-specific code in `modules/`**

---

## 🧪 Testing Architecture

### Unit Testing Structure

```
feature/
├── *.spec.ts        # Service tests
├── *.controller.spec.ts  # Controller tests
└── *.repository.spec.ts  # Repository tests
```

### Test Organization

```typescript
describe("CreditService", () => {
  describe("createRequest", () => {
    it("should create credit request when valid", () => {});
    it("should reject when credit score too low", () => {});
  });
});
```

---

## 📚 Architectural Decisions

### 1. Why Repository Pattern?

- **Separation**: Business logic separated from data access
- **Testability**: Easy to mock repositories
- **Flexibility**: Switch ORMs without changing services

### 2. Why DTO Pattern?

- **Validation**: Ensure data integrity at boundaries
- **Security**: Control exposed data
- **Versioning**: Easier API evolution

### 3. Why Module System?

- **Encapsulation**: Feature boundaries clearly defined
- **Dependency Management**: Explicit dependencies
- **Scalability**: Easy to extract microservices

### 4. Why Shared Database?

- **Consistency**: Single source of truth
- **Simplicity**: No data synchronization needed
- **Performance**: No inter-service communication overhead

---

## 🔄 Migration Path to Microservices

### Current: Monolithic Modules

```
AppModule
├── AuthModule
├── UsersModule
├── SavingsModule
└── CreditModule
```

### Future: Microservices

```
API Gateway
├── Auth Service (Module → Service)
├── Users Service (Module → Service)
├── Savings Service (Module → Service)
└── Credit Service (Module → Service)
```

**Benefits:**

- Independent scaling
- Technology diversity
- Team autonomy
- Fault isolation

---

## 📖 Additional Resources

- [NestJS Architecture](https://docs.nestjs.com/fundamentals/module-ref)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Last Updated**: 2024-01-15
