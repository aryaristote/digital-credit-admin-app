# Admin Backend API Documentation

Complete API reference for the Digital Credit & Savings Platform Admin Backend.

**Base URL**: `http://localhost:3002/api/v1`  
**Swagger UI**: `http://localhost:3002/api/v1/docs`

---

## 🔐 Authentication

All endpoints (except login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📚 API Endpoints

### Authentication

#### Admin Login

```http
POST /api/v1/auth/login
```

Authenticate as an admin user.

**Request Body:**

```json
{
  "email": "admin@digitalcredit.com",
  "password": "Admin@123456"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@digitalcredit.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "admin"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - User is not an admin

---

### User Management

#### Get All Users

```http
GET /api/v1/users?page=1&limit=10
```

Retrieve paginated list of all users.

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "creditScore": 750,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

#### Get User Details

```http
GET /api/v1/users/:id
```

Get detailed information about a specific user.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "creditScore": 750,
  "isActive": true,
  "savingsAccount": {
    "id": "uuid",
    "accountNumber": "SAV-123456",
    "balance": 5000.0,
    "interestRate": 5.0
  },
  "creditRequests": [
    {
      "id": "uuid",
      "requestedAmount": 10000,
      "status": "approved",
      "approvedAmount": 10000,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Toggle User Status

```http
PUT /api/v1/users/:id/toggle-status
```

Activate or deactivate a user account.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "isActive": false,
  "message": "User deactivated successfully"
}
```

#### Update Credit Score

```http
PUT /api/v1/users/:id/credit-score
```

Manually update a user's credit score.

**Request Body:**

```json
{
  "creditScore": 800
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "creditScore": 800,
  "message": "Credit score updated successfully"
}
```

---

### Credit Management

#### Get Pending Credit Requests

```http
GET /api/v1/credit/pending?page=1&limit=10
```

Retrieve all pending credit requests requiring approval.

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com",
        "creditScore": 750
      },
      "requestedAmount": 10000,
      "requestedInterestRate": 8.5,
      "requestedDurationMonths": 12,
      "status": "pending",
      "reason": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### Get All Credit Requests

```http
GET /api/v1/credit/all?page=1&limit=10&status=approved
```

Retrieve all credit requests with optional status filter.

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `status` (optional) - Filter by status: `pending`, `approved`, `rejected`, `disbursed`, `completed`

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      },
      "requestedAmount": 10000,
      "approvedAmount": 10000,
      "interestRate": 8.5,
      "durationMonths": 12,
      "status": "approved",
      "approvedBy": "admin-uuid",
      "approvedAt": "2024-01-02T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### Get Credit Statistics

```http
GET /api/v1/credit/stats
```

Get overall credit statistics.

**Response (200 OK):**

```json
{
  "totalRequests": 150,
  "pendingRequests": 5,
  "approvedRequests": 100,
  "rejectedRequests": 30,
  "disbursedAmount": 500000.0,
  "totalRepaid": 200000.0,
  "outstandingAmount": 300000.0
}
```

#### Approve Credit Request

```http
PUT /api/v1/credit/:id/approve
```

Approve a pending credit request. Can optionally adjust the approved amount.

**Request Body:**

```json
{
  "approvedAmount": 10000
}
```

**Note:** If `approvedAmount` is not provided, the requested amount will be approved.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "status": "approved",
  "approvedAmount": 10000,
  "approvedBy": "admin-uuid",
  "approvedAt": "2024-01-02T00:00:00.000Z",
  "message": "Credit request approved successfully"
}
```

#### Reject Credit Request

```http
PUT /api/v1/credit/:id/reject
```

Reject a pending credit request with a reason.

**Request Body:**

```json
{
  "reason": "Insufficient credit score or missing documentation"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "status": "rejected",
  "reason": "Insufficient credit score or missing documentation",
  "rejectedBy": "admin-uuid",
  "rejectedAt": "2024-01-02T00:00:00.000Z",
  "message": "Credit request rejected successfully"
}
```

---

### Analytics

#### Get Dashboard Statistics

```http
GET /api/v1/analytics/dashboard
```

Get comprehensive dashboard statistics.

**Response (200 OK):**

```json
{
  "users": {
    "total": 1000,
    "active": 950,
    "inactive": 50,
    "newThisMonth": 50
  },
  "credits": {
    "totalRequests": 500,
    "pending": 10,
    "approved": 400,
    "rejected": 90,
    "totalDisbursed": 2000000.0,
    "totalRepaid": 1500000.0,
    "outstanding": 500000.0
  },
  "savings": {
    "totalAccounts": 800,
    "totalBalance": 5000000.0,
    "averageBalance": 6250.0
  },
  "recentActivity": [
    {
      "type": "credit_approved",
      "description": "Credit request approved for John Doe",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Credit Score Distribution

```http
GET /api/v1/analytics/credit-score-distribution
```

Get distribution of credit scores across all users.

**Response (200 OK):**

```json
{
  "distribution": [
    { "range": "0-500", "count": 50 },
    { "range": "501-600", "count": 100 },
    { "range": "601-700", "count": 300 },
    { "range": "701-800", "count": 400 },
    { "range": "801-900", "count": 150 }
  ]
}
```

#### Get Recent Activity

```http
GET /api/v1/analytics/recent-activity?limit=10
```

Get recent system activity feed.

**Query Parameters:**

- `limit` (optional, default: 10) - Number of activities to return

**Response (200 OK):**

```json
{
  "activities": [
    {
      "type": "credit_approved",
      "description": "Credit request approved for John Doe ($10,000)",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "userId": "uuid",
      "adminId": "admin-uuid"
    },
    {
      "type": "user_registered",
      "description": "New user registered: jane@example.com",
      "timestamp": "2024-01-15T09:15:00.000Z",
      "userId": "uuid"
    }
  ]
}
```

#### Get Monthly Loan Disbursement

```http
GET /api/v1/analytics/monthly-disbursement
```

Get monthly loan disbursement data for chart visualization.

**Response (200 OK):**

```json
{
  "data": [
    { "month": "2024-01", "amount": 500000.0, "count": 25 },
    { "month": "2024-02", "amount": 600000.0, "count": 30 },
    { "month": "2024-03", "amount": 700000.0, "count": 35 }
  ]
}
```

#### Get Credit Distribution by Score

```http
GET /api/v1/analytics/credit-distribution
```

Get credit distribution analysis by credit score ranges.

**Response (200 OK):**

```json
{
  "distribution": [
    {
      "scoreRange": "0-500",
      "totalCredits": 10,
      "totalAmount": 50000.0,
      "averageAmount": 5000.0
    },
    {
      "scoreRange": "501-700",
      "totalCredits": 100,
      "totalAmount": 1000000.0,
      "averageAmount": 10000.0
    },
    {
      "scoreRange": "701-900",
      "totalCredits": 200,
      "totalAmount": 3000000.0,
      "averageAmount": 15000.0
    }
  ]
}
```

#### Get Performance Summary

```http
GET /api/v1/analytics/performance-summary
```

Get key performance indicators and summary metrics.

**Response (200 OK):**

```json
{
  "totalUsers": 1000,
  "activeUsers": 950,
  "totalSavings": 5000000.0,
  "totalCreditDisbursed": 2000000.0,
  "totalRepaid": 1500000.0,
  "defaultRate": 2.5,
  "averageCreditScore": 720,
  "monthlyGrowth": 5.2
}
```

---

### Transaction Management

#### Get All Transactions

```http
GET /api/v1/transactions?page=1&limit=50&type=deposit
```

Retrieve all system transactions with optional filtering.

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 50) - Items per page
- `type` (optional) - Filter by type: `deposit`, `withdrawal`, `credit_disbursement`, `repayment`

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      },
      "type": "deposit",
      "amount": 1000.0,
      "balance": 5000.0,
      "description": "Deposit to savings account",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 5000,
  "page": 1,
  "limit": 50,
  "totalPages": 100
}
```

#### Get Transaction Statistics

```http
GET /api/v1/transactions/stats
```

Get transaction statistics across the system.

**Response (200 OK):**

```json
{
  "totalTransactions": 5000,
  "totalDeposits": 3000,
  "totalWithdrawals": 2000,
  "totalDepositAmount": 10000000.0,
  "totalWithdrawalAmount": 5000000.0,
  "netAmount": 5000000.0,
  "averageTransactionAmount": 3000.0
}
```

---

## 🔒 Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource - Admin access required",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 📝 Authentication Flow

1. **Login**: POST `/api/v1/auth/login` with email and password
2. **Receive Token**: Extract `accessToken` from response
3. **Use Token**: Include in `Authorization: Bearer <token>` header for all subsequent requests
4. **Token Expiry**: Tokens expire after 15 minutes (default). Login again to get a new token.

---

## 🧪 Example Usage

### Using cURL

```bash
# Login
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@digitalcredit.com",
    "password": "Admin@123456"
  }'

# Get users (with token)
curl -X GET http://localhost:3002/api/v1/users?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Approve credit request
curl -X PUT http://localhost:3002/api/v1/credit/CREDIT_ID/approve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "approvedAmount": 10000
  }'
```

### Using JavaScript/TypeScript

```typescript
const API_BASE = "http://localhost:3002/api/v1";

// Login
const loginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@digitalcredit.com",
    password: "Admin@123456",
  }),
});

const { accessToken } = await loginResponse.json();

// Get users
const usersResponse = await fetch(`${API_BASE}/users?page=1&limit=10`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const users = await usersResponse.json();
```

---

## 📚 Additional Resources

- **Swagger UI**: Visit `http://localhost:3002/api/v1/docs` for interactive API documentation
- **Setup Guide**: See `ADMIN_SETUP_GUIDE.md`
- **Backend README**: See `README.md`

---

**Last Updated**: 2024-01-15
