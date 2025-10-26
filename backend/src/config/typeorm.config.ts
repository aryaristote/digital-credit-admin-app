import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { User } from '../shared/entities/user.entity';
import { CreditRequest } from '../shared/entities/credit-request.entity';
import { SavingsAccount } from '../shared/entities/savings-account.entity';
import { Transaction } from '../shared/entities/transaction.entity';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'root'),
  database: configService.get('DB_DATABASE', 'digital_credit_client'),
  entities: [User, CreditRequest, SavingsAccount, Transaction],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

// For TypeORM CLI
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'digital_credit_client',
  entities: [User, CreditRequest, SavingsAccount, Transaction],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
