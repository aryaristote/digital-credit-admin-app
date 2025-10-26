# Digital Credit & Savings Platform - Admin Application

Administrative interface for managing the Digital Credit & Savings Platform. Provides tools for user management, credit approvals, and system monitoring.

## 📁 Repository Structure

```
admin-app/
├── backend/          # NestJS API server (Port 3002)
│   ├── src/
│   │   ├── modules/  # Admin feature modules
│   │   ├── shared/   # Shared entities from client DB
│   │   └── common/   # Guards, decorators, enums
│   └── README.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (running with client app database)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run start:dev
```

Backend will be available at `http://localhost:3002`

API Documentation: `http://localhost:3002/api/v1/docs`

## 🏗️ Architecture

The Admin Application connects to the **same database** as the Client Application but provides administrative endpoints for:

1. **User Management**: View, activate/deactivate users, update credit scores
2. **Credit Approvals**: Review and approve/reject pending credit requests
3. **Analytics**: System-wide metrics and statistics
4. **Monitoring**: Track user activity and financial metrics

### Key Differentiators from Client App

- **Admin-only authentication**: Only users with `role='admin'` can access
- **Read/Write access**: Full access to all user data
- **Approval workflows**: Manual credit request approval/rejection
- **System analytics**: Dashboard with comprehensive metrics
- **User management**: Activate/deactivate accounts, adjust credit scores

## 🔐 Security

- Role-based access control (RBAC)
- Admin guard on all endpoints
- JWT authentication
- Separate admin JWT secret
- No public registration (admins created manually)

## 📊 Key Features

### 1. Dashboard

- Total users (active/inactive)
- Credit request statistics
- Financial metrics (disbursed, repaid, savings)
- Recent activity feed

### 2. User Management

- Paginated user list
- User detail view with savings account info
- Toggle user active status
- Manual credit score adjustment

### 3. Credit Management

- Pending requests queue
- Approve/reject with notes
- Adjust approved amounts
- View request history
- Credit statistics

### 4. Analytics

- Credit score distribution
- User growth metrics
- Financial health indicators
- Activity monitoring

## 🚀 Deployment

### Docker Compose

```yaml
version: "3.8"
services:
  admin-backend:
    build: ./backend
    ports:
      - "3002:3002"
    environment:
      DB_HOST: postgres
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
```

## 📝 API Documentation

Complete API documentation is available via Swagger at `/api/v1/docs`.

**Key Endpoints**:

- `POST /api/v1/auth/login` - Admin login
- `GET /api/v1/users` - List all users
- `GET /api/v1/credit/pending` - Pending credit requests
- `PUT /api/v1/credit/:id/approve` - Approve credit
- `GET /api/v1/analytics/dashboard` - Dashboard stats

**Full Documentation**:

- **Backend API Docs**: See `backend/API_DOCUMENTATION.md`
- **Backend Setup**: See `backend/ADMIN_SETUP_GUIDE.md`
- **Frontend Setup**: See `frontend/SETUP_GUIDE.md`

## 🤝 Contributing

1. Follow the same contribution guidelines as the Client Application
2. Ensure all admin endpoints have proper guards
3. Test authorization thoroughly
4. Update Swagger documentation

## 📄 License

MIT License - see LICENSE file for details
