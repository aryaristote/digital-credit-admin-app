# Digital Credit & Savings Platform

A comprehensive, production-ready fintech system demonstrating scalable architecture, modular design, and secure API development. The platform consists of two separate applications: a **Client Application** for customers and an **Admin Application** for internal operations.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

This project demonstrates a full-stack financial management system with:

- **Scalable Architecture**: Modular, layered design following best practices
- **Domain Separation**: Clear boundaries between customer and admin operations
- **Security-First**: JWT authentication, role-based access, encrypted passwords
- **Production-Ready**: Complete with CI/CD, testing, and comprehensive documentation

### Applications

1. **Client Application** (`client-app/`)

   - Customer-facing platform
   - Savings account management
   - Credit request and repayment
   - Real-time notifications
   - Ports: Backend (3001), Frontend (3000)

2. **Admin Application** (`admin-app/`)
   - Internal management dashboard
   - User management and monitoring
   - Credit approval workflows
   - System analytics and metrics
   - Ports: Backend (3002), Frontend (3100)

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Application                         │
├────────────────────┬──────────────────┬────────────────────────┤
│   React Frontend   │   NestJS API     │   PostgreSQL DB        │
│   (Port 3000)      │   (Port 3001)    │   (Port 5432)          │
│   - Dashboard      │   - Auth         │   - Users              │
│   - Savings        │   - Savings      │   - Savings Accounts   │
│   - Credit         │   - Credit       │   - Credit Requests    │
│   - Notifications  │   - Notifs       │   - Transactions       │
└────────────────────┴──────────────────┴────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Admin Application                          │
├────────────────────┬──────────────────┬────────────────────────┤
│   React Frontend   │   NestJS API     │   Shared PostgreSQL    │
│   (Port 3100)      │   (Port 3002)    │   (Port 5432)          │
│   - Dashboard      │   - Auth         │   - Read/Write Access  │
│   - User Mgmt      │   - Users        │   - Full Permissions   │
│   - Credit Approvals│  - Credit        │                        │
│   - Analytics      │   - Analytics    │                        │
└────────────────────┴──────────────────┴────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Supporting Services                        │
├─────────────────────────────────────────────────────────────────┤
│   Redis (Port 6379) - Bull Queue for background jobs           │
│   Nodemailer - Email notifications                              │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Architecture Pattern

Both applications follow a clean, layered architecture:

```
Controller → Service → Repository → Database
     ↓          ↓          ↓
    DTO    Business    Data Access
          Logic
```

**Key Principles:**

- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Injection**: Loose coupling via NestJS DI container
- **DTO Pattern**: Data validation and transformation at boundaries
- **Repository Pattern**: Abstract data access logic
- **Guard-based Authorization**: Centralized security checks

## ✨ Features

### Client Application Features

#### 🔐 Authentication & Authorization

- Secure registration and login
- JWT access and refresh tokens
- Session tracking with device information
- Automatic token refresh

#### 💰 Savings Management

- Create savings accounts with unique account numbers
- Deposit and withdraw funds
- Real-time balance updates
- Complete transaction history
- Interest rate tracking

#### 💳 Credit Management

- Submit credit requests with custom terms
- Automated approval/rejection based on credit score
- Dynamic interest rate calculation
- Repayment tracking and management
- Payment history and progress visualization

#### 🔔 Notifications

- In-app notification center
- Background email processing via Bull Queue
- Welcome emails, credit approval/rejection notifications
- Mark as read/unread functionality

#### 👤 Profile Management

- Update personal information
- View credit score and account statistics
- Account settings

### Admin Application Features

#### 👥 User Management

- View all customer accounts with pagination
- Detailed user information and savings data
- Activate/deactivate user accounts
- Manual credit score adjustments
- User activity monitoring

#### ✅ Credit Approval Workflows

- Pending credit requests queue
- Approve or reject applications
- Adjust approved amounts
- Add rejection reasons
- View complete request history
- Credit statistics dashboard

#### 📊 System Analytics

- Dashboard with key metrics
  - Total users (active/inactive)
  - New users this month
  - Credit request statistics
  - Financial metrics
- Credit score distribution analysis
- Recent activity feed
- Financial health indicators

#### 🔒 Admin Security

- Role-based access control (admin-only)
- Separate JWT authentication
- Admin guards on all endpoints
- Audit trail for actions

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **Queue**: Bull (Redis)
- **Email**: Nodemailer
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend

- **Framework**: React 18
- **Language**: TypeScript 5.x
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

### DevOps

- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Complete Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd digital-credit-savings-platform
```

#### 2. Setup Client Application

```bash
# Backend
cd client-app/backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start:dev

# Frontend (in another terminal)
cd client-app/frontend
npm install
npm run dev
```

**Client URLs:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/v1/docs

#### 3. Setup Admin Application

```bash
# Backend
cd admin-app/backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start:dev
```

**Admin URLs:**

- Backend API: http://localhost:3002
- API Docs: http://localhost:3002/api/v1/docs

#### 4. Database Setup

```bash
# Create PostgreSQL database
createdb digital_credit_client

# The applications will auto-sync tables in development mode
# For production, run migrations
cd client-app/backend
npm run migration:run
```

#### 5. Create Admin User

```sql
-- Connect to PostgreSQL and run:
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive")
VALUES (
  'admin@digitalcredit.com',
  -- bcrypt hash of 'Admin@123' (generate using bcrypt.hash)
  '$2b$10$YourHashedPasswordHere',
  'Admin',
  'User',
  'admin',
  true
);
```

### Docker Setup

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
digital-credit-savings-platform/
├── client-app/                   # Customer-facing application
│   ├── backend/                  # NestJS API
│   │   ├── src/
│   │   │   ├── modules/          # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── savings/
│   │   │   │   ├── credit/
│   │   │   │   ├── notifications/
│   │   │   │   └── sessions/
│   │   │   ├── common/           # Shared utilities
│   │   │   ├── config/
│   │   │   └── main.ts
│   │   └── package.json
│   ├── frontend/                 # React application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── store/
│   │   │   └── lib/
│   │   └── package.json
│   └── .github/workflows/        # CI/CD pipelines
│
├── admin-app/                    # Admin/management application
│   ├── backend/                  # NestJS API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── credit/
│   │   │   │   └── analytics/
│   │   │   ├── shared/           # Shared entities
│   │   │   └── common/
│   │   └── package.json
│   └── README.md
│
├── docker-compose.yml            # Docker orchestration
├── README.md                     # This file
└── LICENSE
```

## 📚 API Documentation

### Client API

Complete documentation available at: `http://localhost:3001/api/v1/docs`

**Key Endpoints:**

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/profile` - Get user profile
- `POST /api/v1/savings/deposit` - Deposit funds
- `POST /api/v1/credit/request` - Request credit
- `GET /api/v1/notifications` - Get notifications

### Admin API

Complete documentation available at: `http://localhost:3002/api/v1/docs`

**Key Endpoints:**

- `POST /api/v1/auth/login` - Admin login
- `GET /api/v1/users` - List all users
- `GET /api/v1/credit/pending` - Get pending credit requests
- `PUT /api/v1/credit/:id/approve` - Approve credit request
- `GET /api/v1/analytics/dashboard` - Dashboard statistics

## 🔒 Security

### Authentication

- **JWT-based**: Access and refresh tokens
- **Token Rotation**: Automatic refresh token rotation
- **Secure Storage**: HttpOnly cookies (recommended for production)
- **Password Hashing**: bcrypt with 10 rounds

### Authorization

- **Role-Based Access Control (RBAC)**: Customer and Admin roles
- **Guards**: JWT and Admin guards protect routes
- **Session Tracking**: Device and IP tracking

### Data Security

- **Input Validation**: class-validator on all DTOs
- **SQL Injection Prevention**: TypeORM parameterized queries
- **XSS Protection**: Output encoding
- **CORS**: Configured origin restrictions

### Best Practices

- Environment variables for secrets
- No sensitive data in logs
- Rate limiting (recommended)
- HTTPS in production
- Regular dependency updates

## 🧪 Testing

### Backend Tests

```bash
# Client backend
cd client-app/backend
npm run test            # Unit tests
npm run test:e2e        # E2E tests
npm run test:cov        # Coverage

# Admin backend
cd admin-app/backend
npm run test
```

### Frontend Tests

```bash
# Client frontend
cd client-app/frontend
npm run lint
npm run type-check
```

### Test Coverage Goals

- Unit tests for services: >80%
- Integration tests for critical flows
- E2E tests for user journeys

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domains
- [ ] Set up environment variables
- [ ] Enable rate limiting
- [ ] Configure logging and monitoring
- [ ] Set up database backups
- [ ] Configure Redis for production
- [ ] Set up SMTP for emails

### Deployment Options

#### Heroku

```bash
# Deploy client backend
cd client-app/backend
heroku create app-client-api
git push heroku main

# Deploy frontend to Netlify/Vercel
cd client-app/frontend
# Connect to Netlify/Vercel via Git
```

#### AWS

- **Backend**: AWS Elastic Beanstalk or ECS
- **Frontend**: AWS S3 + CloudFront
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis

#### Docker

```bash
# Build images
docker build -t client-backend ./client-app/backend
docker build -t client-frontend ./client-app/frontend
docker build -t admin-backend ./admin-app/backend

# Deploy to container registry
docker push your-registry/client-backend:latest
```

## 📈 Performance Considerations

- **Database Indexing**: Indexed foreign keys and frequently queried fields
- **Query Optimization**: Efficient queries with proper relations
- **Caching**: Redis for session and frequent queries
- **Background Jobs**: Bull Queue for async processing
- **Connection Pooling**: TypeORM connection pooling
- **Code Splitting**: React lazy loading for routes
- **Asset Optimization**: Image optimization and minification

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow code style**: Run linters before committing
4. **Write tests**: Add tests for new features
5. **Update documentation**: Keep READMEs up to date
6. **Commit with meaningful messages**: Use conventional commits
7. **Submit a Pull Request**

### Commit Message Format

```
feat: add user export functionality
fix: resolve credit score calculation bug
docs: update API documentation
test: add savings service tests
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- NestJS for the excellent framework
- React team for the UI library
- PostgreSQL community
- All open source contributors

## 📧 Support

For issues, questions, or contributions:

- Create an issue in the repository
- Email: support@digitalcredit.com
- Documentation: See individual app READMEs

---

**Built with ❤️ using Node.js, React, and TypeScript**

## 🎓 Learning Resources

This project demonstrates:

- ✅ Clean Architecture and SOLID principles
- ✅ Repository and DTO patterns
- ✅ JWT authentication with refresh tokens
- ✅ Role-based authorization
- ✅ Background job processing
- ✅ Real-time notifications
- ✅ Comprehensive error handling
- ✅ API documentation with Swagger
- ✅ CI/CD with GitHub Actions
- ✅ Production-ready deployment strategies

Perfect for learning modern full-stack development!
