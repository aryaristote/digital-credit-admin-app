# Seeding Docker Database

## Quick Start

After starting your Docker containers, you need to seed the admin user:

```bash
# Run the seed command in the backend container
docker-compose exec backend npm run seed:admin-user
```

## Admin Credentials

After seeding, you can login with:

- **Email**: `admin@digitalcredit.com`
- **Password**: `Admin@123456`

## What This Does

1. Connects to the PostgreSQL database running in Docker
2. Creates an admin user in the `users` table with role `ADMIN`
3. Hashes the password using bcrypt
4. Sets the user as active

## Troubleshooting

### Database not ready?

Make sure PostgreSQL container is healthy:

```bash
docker-compose ps
```

Wait for postgres to show as "healthy" before seeding.

### Seed already exists?

The script will detect if the admin user already exists and skip creation.

### Connection refused?

Make sure the database container is running:

```bash
docker-compose up postgres
```

Then run the seed command.

## Manual Database Access

If you need to manually access the database:

```bash
# Connect to PostgreSQL in Docker
docker-compose exec postgres psql -U postgres -d digital_credit_client

# Check users table
SELECT email, "firstName", "lastName", role FROM users;
```

## Reset Database

To completely reset the database and re-seed:

```bash
# Stop and remove containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d postgres

# Wait for postgres to be healthy (about 10 seconds)
# Then seed
docker-compose exec backend npm run seed:admin-user

# Or start all services
docker-compose up
```

## Alternative: Update docker-compose.yml

You can also add an initialization script to run seeds automatically when postgres starts. Add to the postgres service:

```yaml
postgres:
  ...
  environment:
    ...
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./backend/src/database/init:/docker-entrypoint-initdb.d
```

This would run any SQL or shell scripts in the `init` directory when the database first initializes.
