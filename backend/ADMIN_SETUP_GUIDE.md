# Admin Backend Setup Guide

## 🔧 Configuration

The admin backend connects to the **same database** as the client app to manage users, credits, and transactions.

### Important: Database Configuration

**The admin app uses the CLIENT database: `digital_credit_client`**

This is intentional! The admin manages the same users and data that customers use.

---

## 📋 Prerequisites

1. **PostgreSQL running**
2. **Client database exists:** `digital_credit_client`
3. **Admin user created in the users table**

---

## 🚀 Quick Setup

### Step 1: Ensure Client Database Exists

```bash
# Connect to PostgreSQL
psql -U postgres

# Check if database exists
\l

# If not, create it
CREATE DATABASE digital_credit_client;
\q
```

### Step 2: Create Admin User

```bash
cd admin-app/backend

# Install dependencies (if not done)
npm install

# Create admin user
npm run seed:admin
```

**Output:**
```
✅ Database connected
🎉 Admin user created successfully!
=====================================
Email:    admin@digitalcredit.com
Password: Admin@123456
=====================================
```

### Step 3: Start Backend

```bash
npm run dev
```

**Server runs on:** `http://localhost:3002`

### Step 4: Start Frontend

```bash
cd admin-app/frontend

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

**Frontend opens at:** `http://localhost:5174`

### Step 5: Login

- Go to: `http://localhost:5174/login`
- Email: `admin@digitalcredit.com`
- Password: `Admin@123456`

---

## ⚠️ Common Issues & Solutions

### Issue 1: "500 Internal Server Error" on Login

**Cause:** Database connection issue or admin user doesn't exist

**Solution:**
```bash
# Check if database exists
psql -U postgres -c "\l" | grep digital_credit_client

# If not, create it
psql -U postgres -c "CREATE DATABASE digital_credit_client;"

# Check if admin user exists
psql -U postgres -d digital_credit_client -c "SELECT email, role FROM users WHERE role = 'admin';"

# If not, create admin
cd admin-app/backend
npm run seed:admin
```

### Issue 2: "Cannot connect to database"

**Cause:** Wrong database credentials in `.env`

**Solution:**
Check `admin-app/backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_DATABASE=digital_credit_client  # ✅ Same as client app!
```

### Issue 3: "Admin user already exists"

**Cause:** You ran `npm run seed:admin` multiple times

**Solution:** This is normal! Just use the existing credentials:
- Email: `admin@digitalcredit.com`
- Password: `Admin@123456`

### Issue 4: Backend won't start

**Cause:** Port 3002 already in use

**Solution:**
```powershell
# Check what's using port 3002
netstat -ano | findstr :3002

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in .env
PORT=3003
```

### Issue 5: "Cannot find module 'bcrypt'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd admin-app/backend
npm install
```

---

## 🔐 Database Architecture

```
digital_credit_client (PostgreSQL Database)
│
├── users table
│   ├── Customer users (role = 'customer')
│   └── Admin users (role = 'admin')  ← Admin backend manages these
│
├── credit_request table
│   └── All credit requests  ← Admin approves/rejects
│
├── savings_account table
│   └── Customer savings  ← Admin monitors
│
└── credit_repayment table
    └── Payment history  ← Admin tracks
```

**Why same database?**
- Admins need to manage actual customer data
- Single source of truth
- Simplified architecture
- No data synchronization needed

---

## 📊 Verify Everything Works

### Check 1: Database Connection
```bash
cd admin-app/backend
npm run dev

# Should see:
# 🚀 Admin Application is running on: http://localhost:3002/api/v1
```

### Check 2: Admin User Exists
```bash
psql -U postgres -d digital_credit_client

SELECT id, email, "firstName", "lastName", role, "isActive" 
FROM users 
WHERE email = 'admin@digitalcredit.com';

\q
```

**Expected output:**
```
            id                |        email              | firstName | lastName | role  | isActive
------------------------------|---------------------------|-----------|----------|-------|----------
 <uuid>                       | admin@digitalcredit.com   | Super     | Admin    | admin | t
```

### Check 3: Login Works
```bash
# Test login endpoint
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@digitalcredit.com",
    "password": "Admin@123456"
  }'
```

**Expected response:**
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "<uuid>",
    "email": "admin@digitalcredit.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "admin"
  }
}
```

---

## 🔄 Full System Startup

### Terminal 1: Client Backend
```bash
cd client-app/backend
npm run dev
# Runs on http://localhost:3001
```

### Terminal 2: Client Frontend
```bash
cd client-app/frontend
npm run dev
# Opens http://localhost:5173
```

### Terminal 3: Admin Backend
```bash
cd admin-app/backend
npm run dev
# Runs on http://localhost:3002
```

### Terminal 4: Admin Frontend
```bash
cd admin-app/frontend
npm run dev
# Opens http://localhost:5174
```

---

## 📝 Environment Variables

### Client Backend (`.env`)
```env
DB_DATABASE=digital_credit_client
PORT=3001
```

### Admin Backend (`.env`)
```env
DB_DATABASE=digital_credit_client  # ✅ Same database!
PORT=3002
```

---

## 🎯 Quick Test Checklist

- [ ] PostgreSQL is running
- [ ] Database `digital_credit_client` exists
- [ ] Admin backend `.env` file exists with correct values
- [ ] Dependencies installed (`npm install`)
- [ ] Admin user created (`npm run seed:admin`)
- [ ] Admin backend starts without errors
- [ ] Admin frontend starts without errors
- [ ] Can login at `http://localhost:5174/login`
- [ ] Dashboard loads successfully

---

## 🆘 Still Having Issues?

### Enable Debug Logging

Edit `admin-app/backend/.env`:
```env
NODE_ENV=development  # Enables SQL logging
```

### Check Backend Logs

When you run `npm run dev`, watch for:
```
✅ Connected to database
✅ All entities loaded
🚀 Admin Application is running on: http://localhost:3002/api/v1
```

### Check Browser Console

Open browser DevTools (F12) and check:
- Network tab for API call details
- Console for any errors

---

## 📞 API Endpoints

- **Login:** `POST /api/v1/auth/login`
- **Get Users:** `GET /api/v1/users`
- **Get Credits:** `GET /api/v1/credit/all`
- **Approve Credit:** `POST /api/v1/credit/:id/approve`
- **Reject Credit:** `POST /api/v1/credit/:id/reject`
- **Analytics:** `GET /api/v1/analytics/dashboard`

**API Documentation:** `http://localhost:3002/api/v1/docs`

---

**Need help?** Check the main README.md or open an issue!

