# Digital Credit & Savings Platform - Admin Backend

Administrative backend API for managing users, approving credit requests, and monitoring system analytics.

## 🚀 Features

- **Admin Authentication**
  - Secure JWT-based login for administrators
  - Role-based access control (admin-only endpoints)

- **User Management**
  - View all customer accounts with pagination
  - View detailed user information
  - Activate/deactivate user accounts
  - Update credit scores manually

- **Credit Approval Workflow**
  - View pending credit requests
  - Approve or reject credit applications
  - Manual approval amount adjustment
  - Track all credit request statuses
  - Credit statistics and metrics

- **System Analytics**
  - Dashboard statistics (users, credits, financials)
  - Credit score distribution
  - Recent activity feed
  - Financial metrics (total disbursed, repaid, savings)

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL (shared with client app)
- **Authentication**: JWT, Passport
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+ (running with client app database)

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file:

```env
NODE_ENV=development
PORT=3002
API_PREFIX=api/v1

# Database (same as client app)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=digital_credit_client

# JWT
JWT_SECRET=your-super-secret-admin-jwt-key
JWT_EXPIRATION=15m

# Admin Credentials
ADMIN_EMAIL=admin@digitalcredit.com
ADMIN_PASSWORD=Admin@123
```

### 3. Start the Application

Development mode:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3002`

API Documentation: `http://localhost:3002/api/v1/docs`

## 📚 API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Admin login

### User Management

- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id/toggle-status` - Activate/deactivate user
- `PUT /api/v1/users/:id/credit-score` - Update credit score

### Credit Management

- `GET /api/v1/credit/pending` - Get pending requests
- `GET /api/v1/credit/all` - Get all requests (with filters)
- `GET /api/v1/credit/stats` - Get credit statistics
- `PUT /api/v1/credit/:id/approve` - Approve request
- `PUT /api/v1/credit/:id/reject` - Reject request

### Analytics

- `GET /api/v1/analytics/dashboard` - Dashboard stats
- `GET /api/v1/analytics/credit-score-distribution` - Score distribution
- `GET /api/v1/analytics/recent-activity` - Recent activity feed

## 🔐 Security

- Admin-only access via role-based guards
- JWT authentication required for all endpoints
- Shared database with read/write permissions
- Password hashing with bcrypt

## 🏗️ Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

**Architecture Overview:**

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   └── typeorm.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── enums/
│   │   └── guards/
│   ├── shared/              # Shared entities with client app
│   │   └── entities/
│   └── modules/
│       ├── auth/            # Admin authentication
│       ├── users/           # User management
│       ├── credit/          # Credit approvals
│       └── analytics/       # System analytics
└── package.json
```

## 🗄️ Database Migrations & Seeds

### Running Migrations

```bash
# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate migration from entity changes
npm run migration:generate -- MigrationName

# Show migration status
npm run migration:show
```

### Seeding Database

```bash
# Seed admin user
npm run seed

# Or use the admin creation script
npm run seed:admin
```

**Seed Data:**

- Admin user: admin@example.com / Admin123!

See [DATABASE_MIGRATIONS.md](../../DATABASE_MIGRATIONS.md) for complete guide.

## 🧪 Testing & Code Quality

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Debug tests
npm run test:debug
```

### Code Quality

```bash
# Linting
npm run lint              # Lint and auto-fix

# Formatting
npm run format            # Format all files

# Type checking
tsc --noEmit              # Check types without building
```

### Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Documentation

- 📘 [Code Quality Guide](../../CODE_QUALITY.md)
- 🧪 [Testing Guide](../../TESTING_GUIDE.md)
- ✅ [Code Quality Checklist](../../CODE_QUALITY_CHECKLIST.md)

## 📝 Default Admin Account

To create an admin user, manually insert into the database:

```sql
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive", "creditScore")
VALUES (
  'admin@digitalcredit.com',
  -- bcrypt hash of 'Admin@123'
  '$2b$10$...',
  'Admin',
  'User',
  'admin',
  true,
  0
);
```

Or use the seed script:

```bash
npm run seed:admin
```

## 📚 Documentation

- **Setup Guide**: See `ADMIN_SETUP_GUIDE.md` for detailed setup instructions
- **Create Admin Guide**: See `CREATE_ADMIN_GUIDE.md` for admin user creation
- **API Documentation**: See `API_DOCUMENTATION.md` for complete API reference
- **Swagger UI**: Visit `http://localhost:3002/api/v1/docs` for interactive API docs

## 📄 License

MIT License
