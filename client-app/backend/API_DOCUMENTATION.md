# Client Backend API Documentation

Complete API reference for the Digital Credit & Savings Platform Client Backend.

**Base URL**: `http://localhost:3001/api/v1`  
**Swagger UI**: `http://localhost:3001/api/v1/docs`

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The API uses access tokens (short-lived, 15 minutes) and refresh tokens (long-lived, 7 days) for secure authentication.

---

## 📚 API Endpoints

### Authentication

#### Register User

```http
POST /api/v1/auth/register
```

Register a new customer account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "creditScore": 0,
    "isActive": true
  }
}
```

**Error Responses:**

- `409 Conflict` - User already exists
- `400 Bad Request` - Validation errors

#### Login User

```http
POST /api/v1/auth/login
```

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "creditScore": 750,
    "isActive": true
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid credentials

#### Refresh Access Token

```http
POST /api/v1/auth/refresh
```

Get a new access token using a refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```http
POST /api/v1/auth/logout
```

Logout from current device/session.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

#### Logout All Devices

```http
POST /api/v1/auth/logout-all
```

Logout from all devices and invalidate all sessions.

**Response (200 OK):**

```json
{
  "message": "Logged out from all devices successfully"
}
```

---

### Users

#### Get User Profile

```http
GET /api/v1/users/profile
```

Get current authenticated user's profile.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "creditScore": 750,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

#### Update User Profile

```http
PUT /api/v1/users/profile
```

Update current user's profile information.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "creditScore": 750,
  "isActive": true,
  "message": "Profile updated successfully"
}
```

#### Get Credit Score

```http
GET /api/v1/users/credit-score
```

Get current user's credit score.

**Response (200 OK):**

```json
{
  "creditScore": 750,
  "lastUpdated": "2024-01-15T00:00:00.000Z"
}
```

#### Refresh Credit Score

```http
PUT /api/v1/users/credit-score/refresh
```

Manually trigger a credit score refresh (calculates based on account activity).

**Response (200 OK):**

```json
{
  "creditScore": 760,
  "message": "Credit score refreshed successfully",
  "lastUpdated": "2024-01-15T00:00:00.000Z"
}
```

---

### Savings

#### Create Savings Account

```http
POST /api/v1/savings/account
```

Create a new savings account for the current user.

**Request Body:**

```json
{
  "accountType": "basic"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "accountNumber": "SAV-1234567890",
  "userId": "uuid",
  "balance": 0.0,
  "interestRate": 5.0,
  "accountType": "basic",
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

**Error Responses:**

- `409 Conflict` - User already has a savings account

#### Get Savings Account

```http
GET /api/v1/savings/account
```

Get current user's savings account details.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "accountNumber": "SAV-1234567890",
  "userId": "uuid",
  "balance": 5000.0,
  "interestRate": 5.0,
  "accountType": "basic",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` - No savings account found

#### Get Account Balance

```http
GET /api/v1/savings/balance
```

Get current account balance only.

**Response (200 OK):**

```json
{
  "balance": 5000.0,
  "currency": "USD"
}
```

#### Deposit Money

```http
POST /api/v1/savings/deposit
```

Deposit money into savings account.

**Request Body:**

```json
{
  "amount": 1000.0,
  "description": "Salary deposit"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "deposit",
  "amount": 1000.0,
  "balance": 6000.0,
  "description": "Salary deposit",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid amount or insufficient account

#### Withdraw Money

```http
POST /api/v1/savings/withdraw
```

Withdraw money from savings account.

**Request Body:**

```json
{
  "amount": 500.0,
  "description": "ATM withdrawal"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "withdrawal",
  "amount": 500.0,
  "balance": 5500.0,
  "description": "ATM withdrawal",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Insufficient balance or invalid amount

#### Get Transaction History

```http
GET /api/v1/savings/transactions
```

Get all transactions for the current user's savings account.

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "deposit",
    "amount": 1000.0,
    "balance": 6000.0,
    "description": "Salary deposit",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "withdrawal",
    "amount": 500.0,
    "balance": 5500.0,
    "description": "ATM withdrawal",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]
```

---

### Credit

#### Create Credit Request

```http
POST /api/v1/credit/request
```

Submit a new credit request.

**Request Body:**

```json
{
  "requestedAmount": 10000.0,
  "requestedInterestRate": 8.5,
  "requestedDurationMonths": 12,
  "purpose": "Business expansion"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "requestedAmount": 10000.0,
  "requestedInterestRate": 8.5,
  "requestedDurationMonths": 12,
  "status": "pending",
  "creditScore": 750,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request or insufficient credit score
- `409 Conflict` - User has pending credit request

#### Get All Credit Requests

```http
GET /api/v1/credit/requests
```

Get all credit requests for the current user.

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "requestedAmount": 10000.0,
    "approvedAmount": 10000.0,
    "interestRate": 8.5,
    "durationMonths": 12,
    "status": "approved",
    "disbursedAt": "2024-01-16T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get Credit Request Details

```http
GET /api/v1/credit/requests/:id
```

Get detailed information about a specific credit request.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "requestedAmount": 10000.0,
  "approvedAmount": 10000.0,
  "interestRate": 8.5,
  "durationMonths": 12,
  "status": "approved",
  "creditScore": 750,
  "disbursedAt": "2024-01-16T00:00:00.000Z",
  "repayments": [
    {
      "id": "uuid",
      "amount": 1000.0,
      "paymentDate": "2024-02-15T00:00:00.000Z",
      "status": "completed"
    }
  ],
  "totalRepaid": 1000.0,
  "remainingBalance": 9000.0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Make Repayment

```http
POST /api/v1/credit/requests/:id/repay
```

Make a repayment towards an approved credit.

**Request Body:**

```json
{
  "amount": 1000.0
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "creditRequestId": "uuid",
  "amount": 1000.0,
  "paymentDate": "2024-01-15T10:30:00.000Z",
  "status": "completed",
  "remainingBalance": 9000.0,
  "message": "Repayment successful"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid amount or insufficient funds
- `404 Not Found` - Credit request not found

#### Get Repayment History

```http
GET /api/v1/credit/requests/:id/repayments
```

Get repayment history for a specific credit request.

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "creditRequestId": "uuid",
    "amount": 1000.0,
    "paymentDate": "2024-01-15T10:30:00.000Z",
    "status": "completed"
  },
  {
    "id": "uuid",
    "creditRequestId": "uuid",
    "amount": 500.0,
    "paymentDate": "2024-02-15T00:00:00.000Z",
    "status": "completed"
  }
]
```

---

### Notifications

#### Get All Notifications

```http
GET /api/v1/notifications
```

Get all notifications for the current user.

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "credit_approved",
    "title": "Credit Request Approved",
    "message": "Your credit request of $10,000 has been approved",
    "isRead": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get Unread Notifications

```http
GET /api/v1/notifications/unread
```

Get only unread notifications.

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "credit_approved",
    "title": "Credit Request Approved",
    "message": "Your credit request of $10,000 has been approved",
    "isRead": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get Unread Count

```http
GET /api/v1/notifications/unread/count
```

Get count of unread notifications.

**Response (200 OK):**

```json
{
  "count": 5
}
```

#### Mark Notification as Read

```http
PUT /api/v1/notifications/:id/read
```

Mark a specific notification as read.

**Response (200 OK):**

```json
{
  "message": "Notification marked as read"
}
```

#### Mark All as Read

```http
PUT /api/v1/notifications/read-all
```

Mark all notifications as read.

**Response (200 OK):**

```json
{
  "message": "All notifications marked as read"
}
```

#### Delete Notification

```http
DELETE /api/v1/notifications/:id
```

Delete a specific notification.

**Response (200 OK):**

```json
{
  "message": "Notification deleted successfully"
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
  "message": "Forbidden resource",
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

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Resource already exists",
  "error": "Conflict"
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

1. **Register/Login**: POST `/api/v1/auth/register` or `/api/v1/auth/login`
2. **Receive Tokens**: Extract `accessToken` and `refreshToken` from response
3. **Use Access Token**: Include in `Authorization: Bearer <accessToken>` header
4. **Token Expiry**: Access tokens expire after 15 minutes
5. **Refresh Token**: Use refresh token endpoint when access token expires
6. **Logout**: Invalidate tokens using logout endpoints

---

## 🧪 Example Usage

### Using cURL

```bash
# Register
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'

# Get profile (with token)
curl -X GET http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Deposit money
curl -X POST http://localhost:3001/api/v1/savings/deposit \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000.00,
    "description": "Salary deposit"
  }'
```

### Using JavaScript/TypeScript

```typescript
const API_BASE = 'http://localhost:3001/api/v1';

// Register
const registerResponse = await fetch(`${API_BASE}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!',
    firstName: 'John',
    lastName: 'Doe',
  }),
});

const { accessToken, refreshToken } = await registerResponse.json();

// Store tokens securely (localStorage, secure cookie, etc.)
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Make authenticated request
const profileResponse = await fetch(`${API_BASE}/users/profile`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const profile = await profileResponse.json();
```

---

## 🔄 Token Refresh Pattern

```typescript
async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem('accessToken');

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If token expired, refresh it
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const { accessToken: newAccessToken } = await refreshResponse.json();
      localStorage.setItem('accessToken', newAccessToken);

      // Retry original request
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
    }
  }

  return response;
}
```

---

## 📚 Additional Resources

- **Swagger UI**: Visit `http://localhost:3001/api/v1/docs` for interactive API documentation
- **Backend README**: See `README.md`
- **Setup Guide**: See project root README

---

**Last Updated**: 2024-01-15
