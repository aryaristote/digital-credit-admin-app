# Admin Backend Architecture

Detailed architecture documentation for the Admin Application Backend.

---

## 🏗️ Architecture Overview

The Admin Backend follows a **layered architecture** with shared database access:

```
┌────────────────────────────────────────┐
│        Presentation Layer               │
│  Controllers, Admin Guards              │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        Business Logic Layer             │
│  Services, Analytics, Aggregations      │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│        Data Access Layer                │
│  TypeORM, Shared Entities              │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│    Shared Database (Client App DB)      │
│  PostgreSQL (TypeORM)                 │
└────────────────────────────────────────┘
```

---

## 📦 Module Architecture

### Module Structure

```
admin-app/backend/src/modules/
├── auth/                 # Admin Authentication
│   ├── strategies/      # JWT strategy
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── users/               # User Management (Admin View)
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── credit/              # Credit Approval Management
│   ├── credit.controller.ts
│   ├── credit.service.ts
│   └── credit.module.ts
│
├── analytics/           # System Analytics
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   └── analytics.module.ts
│
└── transactions/        # Transaction Monitoring
    ├── transactions.controller.ts
    ├── transactions.service.ts
    └── transactions.module.ts
```

### Shared Entities

The admin app uses shared entities from the client app database:

```
shared/entities/
├── user.entity.ts          # User entity
├── credit-request.entity.ts # Credit request entity
├── savings-account.entity.ts # Savings account entity
└── transaction.entity.ts    # Transaction entity
```

---

## 🎯 Module Responsibilities

### Auth Module

- Admin authentication
- JWT token generation
- Admin role verification

**Key Features:**

- Admin-only login
- Role-based access control
- Active account verification

### Users Module

- View all users (paginated)
- User details with related data
- Activate/deactivate users
- Manual credit score updates

**Admin Capabilities:**

- Full read access to all users
- Write access for user management
- User status control

### Credit Module

- View all credit requests
- Approve/reject credit requests
- Adjust approved amounts
- Credit statistics

**Admin Capabilities:**

- Override automated decisions
- Manual approval workflow
- Credit amount adjustments

### Analytics Module

- Dashboard statistics
- Credit score distribution
- Recent activity feed
- Performance metrics

**Key Features:**

- Aggregated queries
- Data visualization support
- Real-time metrics

### Transactions Module

- View all system transactions
- Transaction filtering
- Transaction statistics
- Financial reports

**Admin Capabilities:**

- Full transaction visibility
- Transaction type filtering
- Financial analysis

---

## 🔄 Data Flow

### Example: Credit Approval Flow

```
1. Controller (credit.controller.ts)
   PUT /api/v1/credit/:id/approve
   ↓
2. Admin Guard
   Verify admin role
   ↓
3. Service (credit.service.ts)
   - Get credit request
   - Validate status (must be pending)
   - Update status to approved
   - Set approved amount
   - Set approval metadata
   ↓
4. TypeORM (Database)
   - Update credit_request table
   - Set status = 'approved'
   - Set approvedBy, approvedAt
   ↓
5. Service (return response)
   - Return updated request
   ↓
6. Controller (return HTTP response)
```

---

## 🛡️ Security Architecture

### Admin Guard Pattern

**Implementation:**

```typescript
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}
```

**Application:**

```typescript
@UseGuards(AuthGuard("jwt"), AdminGuard)
@Controller("users")
export class UsersController {
  // All endpoints require admin access
}
```

---

## 📊 Analytics Architecture

### Analytics Service Pattern

**Query Optimization:**

```typescript
@Injectable()
export class AnalyticsService {
  async getDashboardStats() {
    // Parallel queries for performance
    const [users, credits, savings] = await Promise.all([
      this.getUserStats(),
      this.getCreditStats(),
      this.getSavingsStats(),
    ]);

    return { users, credits, savings };
  }

  private async getUserStats() {
    // Aggregated query
    return this.userRepository
      .createQueryBuilder("user")
      .select("COUNT(*)", "total")
      .addSelect("SUM(CASE WHEN isActive THEN 1 ELSE 0 END)", "active")
      .getRawOne();
  }
}
```

---

## 🔗 Shared Database Strategy

### Why Shared Database?

**Benefits:**

- ✅ Single source of truth
- ✅ No data synchronization needed
- ✅ Consistent data across apps
- ✅ Simplified architecture

**Considerations:**

- ⚠️ Admin app has full access
- ⚠️ Must handle concurrent access
- ⚠️ Database-level locking for critical operations

### Entity Sharing Pattern

```typescript
// Shared entity (read-only reference)
import { User } from "../../shared/entities/user.entity";

// Use in admin app
@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
```

---

## 🎯 Design Patterns

### Query Pattern (Analytics)

```typescript
// Complex queries in service
async getCreditScoreDistribution() {
  return this.userRepository
    .createQueryBuilder('user')
    .select('CASE')
    .addSelect('WHEN creditScore < 500 THEN \'0-500\'')
    .addSelect('WHEN creditScore < 600 THEN \'501-600\'')
    // ... more ranges
    .addSelect('END', 'range')
    .addSelect('COUNT(*)', 'count')
    .groupBy('range')
    .getRawMany();
}
```

### Service Aggregation Pattern

```typescript
// Aggregate data from multiple sources
async getDashboardStats() {
  return {
    users: await this.usersService.getStats(),
    credits: await this.creditService.getStats(),
    transactions: await this.transactionsService.getStats(),
  };
}
```

---

## 📊 Module Dependencies

### Dependency Graph

```
AppModule
│
├── AuthModule (no dependencies)
│
├── UsersModule
│   └── Shared Entities
│
├── CreditModule
│   └── Shared Entities
│
├── AnalyticsModule
│   ├── UsersModule (for stats)
│   ├── CreditModule (for stats)
│   └── TransactionsModule (for stats)
│
└── TransactionsModule
    └── Shared Entities
```

### Dependency Rules

1. **Minimal Dependencies**: Modules only import what's needed
2. **Shared Entities**: All modules use shared entities
3. **No Service Dependencies**: Analytics aggregates via direct queries
4. **Auth Independence**: Auth module has no dependencies

---

## 🚀 Performance Considerations

### 1. Query Optimization

- Aggregated queries for statistics
- Indexed columns for filtering
- Pagination for large datasets
- Parallel queries where possible

### 2. Caching Opportunities

- Dashboard statistics (Redis)
- User lists (short TTL)
- Analytics data (hourly refresh)

### 3. Database Indexing

```sql
-- Recommended indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_credit_status ON credit_request(status);
CREATE INDEX idx_transactions_type ON transaction(type);
CREATE INDEX idx_transactions_created ON transaction(created_at);
```

---

## 🔍 Code Quality Patterns

### 1. Admin Action Logging

```typescript
async approveRequest(id: string, adminId: string) {
  const request = await this.findById(id);

  // Log admin action
  logger.log(`Admin ${adminId} approved credit request ${id}`);

  // Update request
  request.status = 'approved';
  request.approvedBy = adminId;
  request.approvedAt = new Date();

  return this.save(request);
}
```

### 2. Error Handling

```typescript
async approveRequest(id: string) {
  const request = await this.findById(id);

  if (!request) {
    throw new NotFoundException('Credit request not found');
  }

  if (request.status !== 'pending') {
    throw new BadRequestException('Only pending requests can be approved');
  }

  // Approval logic
}
```

---

## 📚 Best Practices

### 1. Admin-Specific Patterns

- ✅ Admin guard on all endpoints
- ✅ Log all admin actions
- ✅ Validate admin permissions
- ✅ Track who performed actions

### 2. Query Patterns

- ✅ Use query builders for complex queries
- ✅ Aggregate at database level
- ✅ Use transactions for critical operations
- ✅ Paginate large result sets

### 3. Service Patterns

- ✅ Thin controllers, fat services
- ✅ Service composition for analytics
- ✅ Direct database access (no repositories for analytics)
- ✅ DTOs for API responses

---

## 🔄 Future Improvements

### 1. Admin Activity Logging

```typescript
// Track all admin actions
@Injectable()
export class AdminActivityService {
  async log(action: string, adminId: string, details: any) {
    // Store in audit log table
  }
}
```

### 2. Role-Based Permissions

```typescript
// Fine-grained permissions
@UseGuards(AdminGuard, PermissionGuard('credit.approve'))
async approveRequest() {
  // Only admins with credit.approve permission
}
```

### 3. Audit Trail

```typescript
// Track all changes
@Injectable()
export class AuditService {
  async logChange(entity: string, action: string, changes: any) {
    // Store in audit_log table
  }
}
```

---

**See Main Architecture Guide**: `../../ARCHITECTURE.md`
