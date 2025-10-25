# Creating Admin Users Guide

This guide explains how to create admin users for the Digital Credit Platform admin dashboard.

## Method 1: Using the Seed Script (Recommended) ⭐

### Step 1: Ensure database exists

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database if it doesn't exist
CREATE DATABASE digital_credit_admin;
\q
```

### Step 2: Run the seed script

```bash
cd admin-app/backend
npm run seed:admin
```

### Output:

```
✅ Database connected
🎉 Admin user created successfully!
=====================================
Email:    admin@digitalcredit.com
Password: Admin@123456
=====================================

⚠️  Please change the password after first login!
```

### Step 3: Login

- Go to: `http://localhost:5174/login`
- Email: `admin@digitalcredit.com`
- Password: `Admin@123456`

---

## Method 2: Using SQL Directly

### Step 1: Generate password hash

```bash
# Using Node.js
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourPassword123', 10).then(hash => console.log(hash));"
```

### Step 2: Insert into database

```sql
-- Connect to database
psql -U postgres -d digital_credit_admin

-- Insert admin user
INSERT INTO admin (
  id,
  email,
  password,
  "firstName",
  "lastName",
  role,
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$PASTE_HASH_HERE',  -- Replace with your generated hash
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

---

## Method 3: Using API Endpoint (One-Time Setup)

I can create a special setup endpoint that only works once:

### Step 1: Add setup endpoint (I'll create this for you)

### Step 2: Call the endpoint

```bash
curl -X POST http://localhost:3002/api/v1/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### Step 3: The endpoint disables itself after creating the first admin

---

## Method 4: Manual Database Insert

If you have a database GUI (like pgAdmin, DBeaver, or TablePlus):

1. Connect to `digital_credit_admin` database
2. Find the `admin` table
3. Insert a new row with:
   - `email`: Your email
   - `password`: A bcrypt hash (use method 2 to generate)
   - `firstName`: Your first name
   - `lastName`: Your last name
   - `role`: `admin`
   - `isActive`: `true`
   - `createdAt`: Current timestamp
   - `updatedAt`: Current timestamp

---

## Default Admin Credentials

After running `npm run seed:admin`, use these credentials:

```
Email:    admin@digitalcredit.com
Password: Admin@123456
```

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## Creating Additional Admins

### Option 1: Use existing admin to create new ones

Once you have one admin, you can add endpoints to create more admins from the dashboard.

### Option 2: Run seed script with different credentials

Modify `src/scripts/create-admin.ts` with new credentials and run again.

### Option 3: Create Admin Management in Dashboard

I can add an admin management page to create/manage other admins.

---

## Troubleshooting

### Error: "Admin user already exists"

- The script detected an existing admin
- Use the existing credentials or manually delete the admin from the database

### Error: "Database connection failed"

- Ensure PostgreSQL is running
- Check your `.env` file has correct database credentials
- Verify the database `digital_credit_admin` exists

### Error: "Cannot find module 'bcrypt'"

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

### Error: "Cannot find module 'ts-node'"

```bash
npm install --save-dev ts-node
```

---

## Security Best Practices

1. ✅ Always use strong passwords
2. ✅ Change default passwords immediately
3. ✅ Don't commit credentials to Git
4. ✅ Use environment variables for sensitive data
5. ✅ Limit admin access to trusted users only
6. ✅ Implement 2FA (future enhancement)
7. ✅ Log all admin actions (future enhancement)

---

## Quick Reference

```bash
# Create first admin
npm run seed:admin

# Check if admin exists
psql -U postgres -d digital_credit_admin -c "SELECT email, \"firstName\", \"lastName\" FROM admin;"

# Delete all admins (careful!)
psql -U postgres -d digital_credit_admin -c "DELETE FROM admin;"

# Reset admin password manually
# 1. Generate hash: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('NewPassword123', 10).then(hash => console.log(hash));"
# 2. Update: UPDATE admin SET password = 'HASH_HERE' WHERE email = 'admin@digitalcredit.com';
```

---

## Next Steps

After creating your admin user:

1. ✅ Login to admin dashboard (`http://localhost:5174`)
2. ✅ Change your password
3. ✅ Start using the admin features
4. ✅ Consider adding more admin management features

---

**Need help?** Check the main README or documentation files!
