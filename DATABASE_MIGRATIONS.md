# Database Migrations & Seed Scripts

Comprehensive guide for managing database migrations and seed data in both Client and Admin applications.

---

## 🎯 Overview

Both applications use **TypeORM migrations** for database schema management and **seed scripts** for initial/test data setup.

---

## 📦 Migration System

### Client App Migrations

**Location**: `client-app/backend/src/database/migrations/`

**Configuration**: `client-app/backend/src/config/typeorm.config.ts`

### Admin App Migrations

**Location**: `admin-app/backend/src/database/migrations/`

**Configuration**: `admin-app/backend/src/config/typeorm.config.ts`

---

## 🚀 Migration Commands

### Generate Migration

Create a new migration from entity changes:

```bash
# Client App
cd client-app/backend
npm run migration:generate -- MigrationName

# Admin App
cd admin-app/backend
npm run migration:generate -- MigrationName
```

### Create Empty Migration

Create a new empty migration file:

```bash
# Client App
cd client-app/backend
npm run migration:create -- MigrationName

# Admin App
cd admin-app/backend
npm run migration:create -- MigrationName
```

### Run Migrations

Apply pending migrations:

```bash
# Client App
cd client-app/backend
npm run migration:run

# Admin App
cd admin-app/backend
npm run migration:run
```

### Revert Migration

Revert the last migration:

```bash
# Client App
cd client-app/backend
npm run migration:revert

# Admin App
cd admin-app/backend
npm run migration:revert
```

### Show Migration Status

View migration status:

```bash
# Client App
cd client-app/backend
npm run migration:show

# Admin App
cd admin-app/backend
npm run migration:show
```

---

## 🌱 Seed Scripts

### Client App Seeds

**Location**: `client-app/backend/src/database/seeds/`

**Available Seeds**:

- `users.seed.ts` - Test users
- `savings.seed.ts` - Savings accounts
- `credits.seed.ts` - Credit requests and repayments

**Run All Seeds**:

```bash
cd client-app/backend
npm run seed
```

**Run Specific Seed**:

```bash
cd client-app/backend
npm run seed:users
```

### Admin App Seeds

**Location**: `admin-app/backend/src/database/seeds/`

**Available Seeds**:

- `admin.seed.ts` - Admin users

**Run Seeds**:

```bash
cd admin-app/backend
npm run seed
```

**Create Admin**:

```bash
cd admin-app/backend
npm run seed:admin
```

---

## 📋 Seed Data Details

### Client App Seed Data

#### Users

- **john.doe@example.com** / Password123!

  - Credit Score: 750 (Excellent)
  - Role: Customer
  - Verified: Yes

- **jane.smith@example.com** / Password123!

  - Credit Score: 680 (Fair)
  - Role: Customer
  - Verified: Yes

- **test.user@example.com** / Password123!
  - Credit Score: 720 (Good)
  - Role: Customer
  - Verified: No

#### Savings Accounts

- One account per user
- Random initial balance (1000-11000)
- Account numbers: SAV + timestamp + random

#### Credit Requests

- Active credit (10,000, partially repaid)
- Completed credit (5,000, fully repaid)
- Pending credit (15,000, awaiting approval)

### Admin App Seed Data

#### Admin Users

- **admin@example.com** / Admin123!
  - Role: Admin
  - Verified: Yes
  - Active: Yes

---

## 🔧 Migration Best Practices

### 1. **Always Generate Migrations**

Don't rely on `synchronize: true` in production:

```typescript
// ❌ Bad: Only for development
synchronize: true;

// ✅ Good: Use migrations
synchronize: false;
migrations: ["src/database/migrations/*.ts"];
```

### 2. **Name Migrations Clearly**

```typescript
// ✅ Good
1699000000000 - InitialSchema.ts;
1699000000001 - AddIndexToUsers.ts;
1699000000002 - AddAccountStatusEnum.ts;

// ❌ Bad
Migration1.ts;
Update.ts;
Fix.ts;
```

### 3. **Test Migrations**

Always test both `up` and `down` migrations:

```bash
npm run migration:run    # Test up
npm run migration:revert # Test down
npm run migration:run    # Test up again
```

### 4. **Keep Migrations Reversible**

Ensure `down()` method properly reverses `up()`:

```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
  // Drop in reverse order
  await queryRunner.dropTable('child_table', true);
  await queryRunner.dropTable('parent_table', true);
}
```

### 5. **Use Transactions**

TypeORM runs migrations in transactions automatically.

---

## 📝 Creating a New Migration

### Step 1: Make Entity Changes

```typescript
// Add new column to entity
@Column({ nullable: true })
newField: string;
```

### Step 2: Generate Migration

```bash
npm run migration:generate -- AddNewFieldToUsers
```

### Step 3: Review Generated Migration

```typescript
export class AddNewFieldToUsers1699000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "newField",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "newField");
  }
}
```

### Step 4: Run Migration

```bash
npm run migration:run
```

---

## 🔄 Database Setup Workflow

### Initial Setup

```bash
# 1. Setup database
createdb digital_credit_client

# 2. Run migrations
cd client-app/backend
npm run migration:run

# 3. Seed data
npm run seed

# 4. Setup admin (if needed)
cd admin-app/backend
npm run seed:admin
```

### Development Workflow

```bash
# 1. Make entity changes
# Edit entity files

# 2. Generate migration
npm run migration:generate -- DescribeChanges

# 3. Test migration
npm run migration:run
npm run migration:revert
npm run migration:run

# 4. Commit migration
git add src/database/migrations/
git commit -m "Add migration: DescribeChanges"
```

### Production Deployment

```bash
# 1. Ensure migrations are committed
git pull origin main

# 2. Run migrations
npm run migration:run

# 3. Verify migration status
npm run migration:show
```

---

## 🧹 Clean Seed Script

### Client App

Create `client-app/backend/src/database/seeds/clean-seed.ts`:

```typescript
import { DataSource } from "typeorm";
import { dataSourceOptions } from "../../config/typeorm.config";

async function cleanDatabase() {
  const dataSource = new DataSource(dataSourceOptions);

  try {
    await dataSource.initialize();

    // Drop and recreate database
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    console.log("✅ Database cleaned successfully");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
  } finally {
    await dataSource.destroy();
  }
}

cleanDatabase();
```

---

## 📊 Migration Status

### Check Migration Status

```bash
npm run migration:show
```

**Output**:

```
[X] 1699000000000-InitialSchema.ts
[ ] 1699000000001-AddIndexToUsers.ts
```

---

## ⚠️ Common Issues

### Issue: Migration Already Exists

**Error**: `Migration AlreadyExistsError`

**Solution**: Remove old migration or rename it

### Issue: Database Not Found

**Error**: `database "digital_credit_client" does not exist`

**Solution**: Create database first:

```bash
createdb digital_credit_client
```

### Issue: Connection Refused

**Error**: `ECONNREFUSED`

**Solution**: Check PostgreSQL is running and credentials are correct

### Issue: Migration Failed Mid-Way

**Solution**: Manually fix database state or revert:

```bash
npm run migration:revert
```

---

## 🎯 Migration Checklist

- [ ] Generate migration after entity changes
- [ ] Test `up()` migration
- [ ] Test `down()` migration
- [ ] Review migration SQL
- [ ] Test on development database
- [ ] Commit migration file
- [ ] Document breaking changes
- [ ] Run migrations on staging
- [ ] Run migrations on production

---

## 📚 Related Documentation

- [SETUP_GUIDE.md](client-app/backend/SETUP_GUIDE.md) - Setup instructions
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview
- [DDD_ARCHITECTURE.md](DDD_ARCHITECTURE.md) - Domain-driven design

---

## ✅ Summary

Both applications now have:

- ✅ **Migration System**: TypeORM migrations for schema changes
- ✅ **Seed Scripts**: Automated test data generation
- ✅ **Migration Commands**: Easy-to-use npm scripts
- ✅ **Documentation**: Complete migration guide
- ✅ **Best Practices**: Guidelines for safe migrations

The migration system ensures:

- Version-controlled database schema
- Consistent database state across environments
- Safe schema changes
- Easy rollback capabilities
- Automated test data setup
