# Digital Credit & Savings Platform - Client Application

A full-stack financial management system for customers to manage savings accounts and credit requests with automated approval workflows.

## 📁 Repository Structure

```
client-app/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── modules/  # Feature modules
│   │   ├── config/   # Configuration
│   │   └── common/   # Shared utilities
│   └── README.md
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   └── README.md
└── .github/
    └── workflows/    # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run start:dev
```

Backend will be available at `http://localhost:3001`

API Documentation: `http://localhost:3001/api/v1/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🏗️ Architecture

### Backend Architecture

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with refresh tokens
- **Queue**: Bull (Redis-based) for background jobs
- **Email**: Nodemailer for notifications
- **Documentation**: Swagger/OpenAPI

**Modules**:

- Auth: JWT authentication with session tracking
- Users: Profile and credit score management
- Savings: Deposit, withdraw, transaction history
- Credit: Request, approval, repayment tracking
- Notifications: In-app and email notifications

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State**: Zustand for global state
- **Forms**: React Hook Form with validation
- **Styling**: Tailwind CSS
- **HTTP**: Axios with interceptors

## 🔐 Security Features

- Password hashing with bcrypt
- JWT access and refresh tokens
- Session tracking with device information
- Protected API routes with guards
- Input validation with class-validator
- SQL injection prevention (TypeORM)
- XSS protection
- CORS configuration

## 📊 Key Features

### For Customers

1. **Account Management**

   - Registration and login
   - Profile management
   - Credit score tracking

2. **Savings**

   - Create savings account
   - Deposit funds
   - Withdraw funds
   - View transaction history
   - Interest rate tracking

3. **Credit**

   - Submit credit requests
   - Automated approval based on credit score
   - Dynamic interest rates
   - Repayment tracking
   - Payment history

4. **Notifications**
   - In-app notifications
   - Email notifications
   - Transaction alerts

## 🧪 Testing

### Backend

```bash
cd backend
npm run test            # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage report
```

### Frontend

```bash
cd frontend
npm run lint           # ESLint
npm run type-check     # TypeScript
```

## 🚀 Deployment

### Docker Compose

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: digital_credit_client
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

Run with:

```bash
docker-compose up -d
```

## 📈 CI/CD

GitHub Actions workflow includes:

- Automated testing (backend + frontend)
- Linting and type checking
- Docker image building
- Deployment to staging/production

## 📝 API Endpoints

See backend Swagger documentation at `/api/v1/docs` for complete API reference.

**Key endpoints**:

- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/users/profile` - Get profile
- `POST /api/v1/savings/deposit` - Deposit funds
- `POST /api/v1/credit/request` - Request credit
- `GET /api/v1/notifications` - Get notifications

**Full Documentation**:

- **Backend API Docs**: See `backend/API_DOCUMENTATION.md`
- **Backend Setup**: See `backend/SETUP_GUIDE.md`
- **Frontend Setup**: See `frontend/SETUP_GUIDE.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues and questions, please create an issue in the repository.
