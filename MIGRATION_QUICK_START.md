# Migration & Seed Quick Start

Quick reference guide for database migrations and seeding.

---

## 🚀 Quick Start

### Client App

```bash
cd client-app/backend

# 1. Setup database
createdb digital_credit_client

# 2. Run migrations
npm run migration:run

# 3. Seed test data
npm run seed
```

### Admin App

```bash
cd admin-app/backend

# 1. Run migrations (uses same database)
npm run migration:run

# 2. Seed admin user
npm run seed
```

---

## 📋 Common Commands

### Migrations

```bash
# Generate migration from entity changes
npm run migration:generate -- AddUserIndex

# Create empty migration
npm run migration:create -- CustomMigration

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Seeds

```bash
# Client App - Seed all data
npm run seed

# Admin App - Seed admin
npm run seed
```

---

## 🎯 Seed Data

### Client App Test Users

- **john.doe@example.com** / Password123!

  - Credit Score: 750
  - Has savings account
  - Has active credit

- **jane.smith@example.com** / Password123!

  - Credit Score: 680
  - Has savings account

- **test.user@example.com** / Password123!
  - Credit Score: 720
  - Has savings account

### Admin App

- **admin@example.com** / Admin123!
  - Role: Admin
  - Full access

---

## ⚠️ Important Notes

1. **Development**: `synchronize: true` auto-creates tables
2. **Production**: Always use migrations (`synchronize: false`)
3. **Seeds**: Safe to run multiple times (checks for existing data)
4. **Migrations**: Test both `up()` and `down()` before committing

---

## 📚 Full Documentation

See [DATABASE_MIGRATIONS.md](DATABASE_MIGRATIONS.md) for complete guide.
