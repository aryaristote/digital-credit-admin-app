# Digital Credit & Savings Platform - Client Backend

A scalable, production-ready backend API for the customer-facing Digital Credit & Savings Platform built with NestJS, PostgreSQL, and TypeORM.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (RBAC)
  - Session tracking and device management
  - Secure password hashing with bcrypt

- **Customer Services**
  - User registration and profile management
  - Credit score tracking and updates
  - Comprehensive user management

- **Savings Module**
  - Create and manage savings accounts
  - Deposit and withdrawal operations
  - Transaction history tracking
  - Real-time balance updates
  - Transactional consistency with database transactions

- **Credit Module**
  - Credit request submission
  - Automated approval/rejection based on credit score
  - Interest rate calculation
  - Repayment management
  - Payment history tracking

- **Notifications**
  - In-app notifications
  - Background email processing with Bull Queue
  - Welcome emails, credit approval/rejection notifications
  - Mark as read/unread functionality

## 🏗️ Architecture

The application follows a clean, modular architecture. See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

**Architecture Overview:**

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── config/                 # Configuration files
│   │   └── typeorm.config.ts
│   ├── common/                 # Shared utilities
│   │   ├── decorators/
│   │   ├── enums/
│   │   ├── filters/
│   │   └── interceptors/
│   └── modules/                # Feature modules
│       ├── auth/               # Authentication
│       ├── users/              # User management
│       ├── sessions/           # Session tracking
│       ├── savings/            # Savings accounts
│       ├── credit/             # Credit requests
│       └── notifications/      # Notifications
```

Each module follows the pattern:

- **Entity**: Database model
- **DTO**: Data Transfer Objects for API requests/responses
- **Repository**: Data access layer
- **Service**: Business logic
- **Controller**: API endpoints

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT, Passport
- **Queue**: Bull (Redis-based)
- **Email**: Nodemailer
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 6+ (for Bull Queue)

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the following variables:

```env
# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=digital_credit_client

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
EMAIL_FROM=noreply@digitalcredit.com
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
createdb digital_credit_client
```

Run migrations (if using production mode):

```bash
npm run migration:run
```

In development mode, TypeORM will auto-sync the schema.

### 4. Start Redis

Make sure Redis is running:

```bash
redis-server
```

### 5. Run the Application

Development mode with hot reload:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

### 6. Access API Documentation

Once the server is running, access Swagger documentation at:

```
http://localhost:3001/api/v1/docs
```

## 📚 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/logout-all` - Logout from all devices

### Users

- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/credit-score` - Get credit score
- `PUT /api/v1/users/credit-score/refresh` - Refresh credit score

### Savings

- `POST /api/v1/savings/account` - Create savings account
- `GET /api/v1/savings/account` - Get savings account
- `GET /api/v1/savings/balance` - Get account balance
- `POST /api/v1/savings/deposit` - Deposit money
- `POST /api/v1/savings/withdraw` - Withdraw money
- `GET /api/v1/savings/transactions` - Get transaction history

### Credit

- `POST /api/v1/credit/request` - Create credit request
- `GET /api/v1/credit/requests` - Get all credit requests
- `GET /api/v1/credit/requests/:id` - Get specific credit request
- `POST /api/v1/credit/requests/:id/repay` - Make repayment
- `GET /api/v1/credit/requests/:id/repayments` - Get repayment history

### Notifications

- `GET /api/v1/notifications` - Get all notifications
- `GET /api/v1/notifications/unread` - Get unread notifications
- `GET /api/v1/notifications/unread/count` - Get unread count
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

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
# Seed all test data
npm run seed

# Seed specific data
npm run seed:users
```

**Seed Data Includes:**

- Test users (john.doe@example.com, jane.smith@example.com)
- Savings accounts with initial balances
- Sample credit requests (pending, active, completed)
- Sample repayments

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

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Linting
npm run lint              # Lint and auto-fix
npm run lint:check        # Lint without fixing

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

### Test Structure

```
src/
├── modules/
│   └── feature/
│       ├── feature.service.ts
│       └── feature.service.spec.ts    # Unit tests
test/
├── integration/                       # Integration tests
└── e2e/                              # E2E tests
```

### Documentation

- 📘 [Code Quality Guide](../../CODE_QUALITY.md)
- 🧪 [Testing Guide](../../TESTING_GUIDE.md)
- ✅ [Code Quality Checklist](../../CODE_QUALITY_CHECKLIST.md)

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Refresh token rotation
- Session tracking and management
- Input validation with class-validator
- SQL injection prevention with TypeORM
- CORS configuration
- Request rate limiting (can be added)

## 📈 Performance Considerations

- Database indexing on foreign keys and frequently queried fields
- Transaction management for critical operations
- Background job processing with Bull Queue
- Connection pooling with TypeORM
- Efficient query design with proper relations

## 🚀 Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### Environment Variables

Ensure all production environment variables are properly configured:

- Use strong JWT secrets
- Configure production database credentials
- Set up production SMTP server
- Configure Redis connection

## 📝 Development Guidelines

1. **Code Style**: Follow NestJS conventions and TypeScript best practices
2. **Commits**: Use conventional commits (feat, fix, docs, etc.)
3. **Branching**: Use feature branches and pull requests
4. **Testing**: Write tests for all business logic
5. **Documentation**: Update Swagger docs for new endpoints

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📚 Documentation

- **Setup Guide**: See `SETUP_GUIDE.md` for detailed setup instructions
- **API Documentation**: See `API_DOCUMENTATION.md` for complete API reference
- **Swagger UI**: Visit `http://localhost:3001/api/v1/docs` for interactive API docs

## 👥 Support

For issues and questions, please create an issue in the repository.
