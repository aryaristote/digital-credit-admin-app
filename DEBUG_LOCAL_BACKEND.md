# Debugging Local Backend Login Issue

## Steps to Debug

### 1. Start the backend locally

```bash
cd backend
npm run dev
```

The backend should start on `http://localhost:5430` (or port 3002 if not updated).

### 2. Check if the backend is running

Visit: `http://localhost:5430/api/v1/docs` (Swagger documentation)

If it doesn't load, the backend isn't running properly.

### 3. Try to login and watch the logs

After you try to login from the frontend, check the backend terminal. You should see detailed logs like:

```
🔄 Login attempt for: admin@digitalcredit.com
🔍 Searching for user with email: admin@digitalcredit.com
✅ User found: abc-123, Role: admin, Active: true
🔐 Validating password for user: admin@digitalcredit.com
✅ Password validated successfully for: admin@digitalcredit.com
🎫 Generating JWT token for: admin@digitalcredit.com
✅ Login successful for: admin@digitalcredit.com
```

### 4. What to Look For

**If you see "User not found":**

- The admin user doesn't exist in your local database
- Run: `npm run seed:admin-user` (or whatever seed command you have)

**If you see "User is not an admin":**

- The user exists but doesn't have role 'admin'
- Check the database or seed script

**If you see "Invalid password":**

- The password doesn't match what's stored
- Try running the seed again with the correct password

**If you see "Account is deactivated":**

- The user has `isActive: false`
- Update in database: `UPDATE users SET "isActive" = true WHERE email = 'admin@digitalcredit.com';`

### 5. Check Your Database

Make sure your local PostgreSQL has the admin user:

```sql
-- Connect to your local database
psql -U postgres -d digital_credit_client

-- Check if admin exists
SELECT email, role, "isActive" FROM users WHERE email = 'admin@digitalcredit.com';

-- If not exists, you can manually create it:
-- (Password: Admin@123456 - already hashed with bcrypt)
```

### 6. Common Issues

**Backend not connecting to database:**

- Check `.env` file in `backend/` folder
- Make sure `DB_HOST=localhost` (not `postgres`)
- Make sure PostgreSQL is running locally on port 5432

**CORS errors:**

- Check `backend/src/main.ts` includes your frontend URL
- Frontend should be on `http://localhost:5174`

**Validation errors:**

- Check browser console for validation errors
- Make sure email format is correct
- Make sure password is at least 8 characters

### 7. Test the Login Endpoint Directly

You can also test the login endpoint directly with curl or Postman:

```bash
curl -X POST http://localhost:5430/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@digitalcredit.com",
    "password": "Admin@123456"
  }'
```

Expected response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "admin@digitalcredit.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "admin"
  }
}
```

## Quick Fix: Reset and Seed

If nothing works, reset your local database and seed fresh data:

```bash
# Drop and recreate database (or manually drop in pgAdmin)
dropdb digital_credit_client
createdb digital_credit_client

# Run migrations (if you have any)
cd backend
npm run migration:run

# Seed the admin user
npm run seed:admin-user
```

Then try logging in again!
