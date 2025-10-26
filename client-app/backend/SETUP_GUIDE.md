# Client Backend Setup Guide

Complete setup guide for the Digital Credit & Savings Platform Client Backend.

---

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 14+ running
- **Redis** 6+ running (for Bull Queue)
- **SMTP Server** (for email notifications - optional, can use Mailtrap for development)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd client-app/backend
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

# Email (for notifications)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
EMAIL_FROM=noreply@digitalcredit.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
# Using psql
psql -U postgres
CREATE DATABASE digital_credit_client;
\q

# Or using createdb command
createdb -U postgres digital_credit_client
```

In development mode, TypeORM will auto-sync the schema. For production, use migrations:

```bash
npm run migration:run
```

### 4. Start Redis

Make sure Redis is running:

```bash
# On Linux/Mac
redis-server

# On Windows
# Use WSL or download Redis for Windows
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

The API will be available at `http://localhost:3001/api/v1`

Swagger documentation: `http://localhost:3001/api/v1/docs`

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── config/                 # Configuration files
│   │   └── typeorm.config.ts  # Database configuration
│   ├── common/                 # Shared utilities
│   │   ├── decorators/        # Custom decorators
│   │   ├── enums/             # Enumerations
│   │   ├── filters/           # Exception filters
│   │   └── interceptors/      # Response interceptors
│   └── modules/                # Feature modules
│       ├── auth/               # Authentication
│       ├── users/              # User management
│       ├── sessions/           # Session tracking
│       ├── savings/            # Savings accounts
│       ├── credit/             # Credit requests
│       └── notifications/      # Notifications
├── dist/                       # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env                        # Environment variables
```

---

## 🔧 Configuration

### Database Configuration

The database configuration is in `src/config/typeorm.config.ts`:

```typescript
export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};
```

**Note**: `synchronize: true` only in development. Use migrations in production.

### JWT Configuration

JWT tokens are configured with:

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token refresh

Update expiration times in `.env`:

```env
JWT_EXPIRATION=15m        # Access token expiration
JWT_REFRESH_EXPIRATION=7d # Refresh token expiration
```

### Redis Configuration

Redis is used for:

- Bull Queue (background job processing)
- Email notification queue
- Session management (if configured)

Ensure Redis is running before starting the backend.

### Email Configuration

For development, use **Mailtrap**:

1. Sign up at https://mailtrap.io
2. Get SMTP credentials from your inbox
3. Update `.env` with Mailtrap credentials

For production, use your SMTP server (Gmail, SendGrid, AWS SES, etc.)

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Database

Create a separate test database:

```bash
createdb -U postgres digital_credit_client_test
```

Update test configuration to use the test database.

---

## 🚀 Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "run", "start:prod"]
```

Build and run:

```bash
docker build -t client-backend .
docker run -p 3001:3001 --env-file .env client-backend
```

### Docker Compose

Add to `docker-compose.yml`:

```yaml
services:
  client-backend:
    build: ./client-app/backend
    ports:
      - '3001:3001'
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    depends_on:
      - postgres
      - redis
```

### Environment Variables for Production

Ensure all production environment variables are set:

```env
NODE_ENV=production
PORT=3001

# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=digital_credit_client

# JWT (use strong secrets!)
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# Email
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com

# Frontend
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to database

**Solution:**

1. Verify PostgreSQL is running: `pg_isready`
2. Check database credentials in `.env`
3. Ensure database exists: `psql -U postgres -l | grep digital_credit_client`
4. Check network connectivity

### Issue: Redis connection failed

**Solution:**

1. Verify Redis is running: `redis-cli ping` (should return PONG)
2. Check Redis host and port in `.env`
3. Test connection: `redis-cli -h localhost -p 6379`

### Issue: Port already in use

**Solution:**

```bash
# Find process using port 3001
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change PORT in .env
```

### Issue: JWT secret errors

**Solution:**

1. Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`
2. Use strong, random secrets (at least 32 characters)
3. Don't use the same secret for both tokens

### Issue: Email not sending

**Solution:**

1. Check SMTP credentials in `.env`
2. Verify Redis is running (emails use Bull Queue)
3. Check email queue logs
4. For development, use Mailtrap to test SMTP

### Issue: TypeORM entities not loading

**Solution:**

1. Check entity paths in `typeorm.config.ts`
2. Ensure entities are properly exported
3. Verify TypeScript compilation

---

## 📊 Monitoring

### Health Check

Add a health check endpoint:

```typescript
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
```

### Logging

The application uses NestJS built-in logger. Configure log levels:

```typescript
// In main.ts
app.useLogger(['error', 'warn', 'log']); // Production
app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']); // Development
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - Generate random strings
3. **Enable HTTPS in production** - Use reverse proxy (Nginx)
4. **Set up rate limiting** - Prevent brute force attacks
5. **Validate all inputs** - Use class-validator DTOs
6. **Use database migrations** - Don't use `synchronize: true` in production
7. **Regular updates** - Keep dependencies updated
8. **Monitor logs** - Set up log aggregation

---

## 📚 API Documentation

Once the server is running, access:

- **Swagger UI**: `http://localhost:3001/api/v1/docs`
- **API Documentation**: See `API_DOCUMENTATION.md`

---

## 🔗 Related Documentation

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Backend README**: See `README.md`
- **Client App README**: See `../README.md`

---

## 💡 Development Tips

1. **Hot Reload**: `npm run start:dev` enables automatic reloading
2. **Database Sync**: In development, TypeORM auto-syncs schema
3. **Debugging**: Use VS Code debugger with NestJS extension
4. **TypeScript**: Enable strict mode for better type safety
5. **Testing**: Write tests alongside features
6. **Swagger**: Keep API documentation updated

---

**Last Updated**: 2024-01-15
