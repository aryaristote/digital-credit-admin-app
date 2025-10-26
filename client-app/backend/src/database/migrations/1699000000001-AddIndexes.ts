import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexes1699000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table indexes
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_ROLE',
        columnNames: ['role'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_CREDIT_SCORE',
        columnNames: ['creditScore'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );

    // Credit requests indexes
    await queryRunner.createIndex(
      'credit_requests',
      new TableIndex({
        name: 'IDX_CREDIT_USER_ID',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'credit_requests',
      new TableIndex({
        name: 'IDX_CREDIT_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'credit_requests',
      new TableIndex({
        name: 'IDX_CREDIT_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'credit_requests',
      new TableIndex({
        name: 'IDX_CREDIT_USER_STATUS',
        columnNames: ['userId', 'status'],
      }),
    );

    // Transactions indexes
    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'IDX_TRANSACTIONS_ACCOUNT_ID',
        columnNames: ['savingsAccountId'],
      }),
    );

    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'IDX_TRANSACTIONS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'IDX_TRANSACTIONS_TYPE',
        columnNames: ['type'],
      }),
    );

    // Savings accounts indexes
    await queryRunner.createIndex(
      'savings_accounts',
      new TableIndex({
        name: 'IDX_SAVINGS_USER_ID',
        columnNames: ['userId'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'savings_accounts',
      new TableIndex({
        name: 'IDX_SAVINGS_ACCOUNT_NUMBER',
        columnNames: ['accountNumber'],
        isUnique: true,
      }),
    );

    // Notifications indexes
    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_USER_ID',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_USER_READ',
        columnNames: ['userId', 'isRead'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes in reverse order
    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_CREATED_AT');
    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_USER_READ');
    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_USER_ID');

    await queryRunner.dropIndex('savings_accounts', 'IDX_SAVINGS_ACCOUNT_NUMBER');
    await queryRunner.dropIndex('savings_accounts', 'IDX_SAVINGS_USER_ID');

    await queryRunner.dropIndex('transactions', 'IDX_TRANSACTIONS_TYPE');
    await queryRunner.dropIndex('transactions', 'IDX_TRANSACTIONS_CREATED_AT');
    await queryRunner.dropIndex('transactions', 'IDX_TRANSACTIONS_ACCOUNT_ID');

    await queryRunner.dropIndex('credit_requests', 'IDX_CREDIT_USER_STATUS');
    await queryRunner.dropIndex('credit_requests', 'IDX_CREDIT_CREATED_AT');
    await queryRunner.dropIndex('credit_requests', 'IDX_CREDIT_STATUS');
    await queryRunner.dropIndex('credit_requests', 'IDX_CREDIT_USER_ID');

    await queryRunner.dropIndex('users', 'IDX_USERS_CREATED_AT');
    await queryRunner.dropIndex('users', 'IDX_USERS_CREDIT_SCORE');
    await queryRunner.dropIndex('users', 'IDX_USERS_ROLE');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
  }
}
