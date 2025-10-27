# Troubleshooting Login Internal Server Error

## Problem

Getting "Internal Server Error" when trying to login with admin credentials in Docker.

## Possible Causes

### 1. Admin User Not Created in Docker Database

The Docker PostgreSQL database is separate from your local database. You need to seed it.

**Solution:**
Run this command in your terminal (from the project root):

```bash
docker compose exec backend npm run seed:admin-user
```

Or if using older docker-compose:

```bash
docker-compose exec backend npm run seed:admin-user
```

### 2. Database Tables Don't Exist

The database might not have the `users` table yet.

**Check if tables exist:**

```bash
# Connect to Docker database
docker compose exec postgres psql -U postgres -d digital_credit_client

# Inside psql, run:
\dt

# Exit with:
\q
```

**Solution:**
If tables don't exist, the backend should auto-create them with `synchronize: true` in development mode. Check `docker-compose.yml` has `NODE_ENV: development`.

### 3. Backend Logs Show Actual Error

Check the backend container logs for the actual error:

```bash
docker compose logs backend --tail=50
```

Look for error messages that explain what's failing.

### 4. Database Connection Issue

The backend might not be connecting to the database.

**Check backend logs:**

```bash
docker compose logs backend --tail=100 | grep -i "database\|connection\|error"
```

## Step-by-Step Fix

1. **Check if containers are running:**

   ```bash
   docker compose ps
   ```

2. **Check backend logs for errors:**

   ```bash
   docker compose logs backend --tail=100
   ```

3. **Verify database is accessible:**

   ```bash
   docker compose exec postgres pg_isready -U postgres
   ```

4. **Seed the admin user:**

   ```bash
   docker compose exec backend npm run seed:admin-user
   ```

5. **Verify admin was created:**

   ```bash
   docker compose exec postgres psql -U postgres -d digital_credit_client -c "SELECT email, role FROM users;"
   ```

6. **Try logging in again at:** `http://localhost:5174`

## Admin Credentials

- **Email:** `admin@digitalcredit.com`
- **Password:** `Admin@123456`

## Alternative: Reset Everything

If nothing works, reset the entire Docker environment:

```bash
# Stop and remove containers and volumes
docker compose down -v

# Start fresh
docker compose up -d

# Wait 10 seconds for postgres to be ready, then seed
docker compose exec backend npm run seed:admin-user
```

## Common Error Messages

### "User not found"

- Admin user doesn't exist in the database
- Run: `docker compose exec backend npm run seed:admin-user`

### "Invalid credentials"

- Password doesn't match
- Make sure you're using: `Admin@123456` (with capital A and @ symbol)

### "Connection refused"

- Backend can't connect to database
- Check `docker-compose.yml` has correct `DB_HOST=postgres`

### "Cannot find module"

- Missing dependencies in container
- Rebuild: `docker compose build backend`
