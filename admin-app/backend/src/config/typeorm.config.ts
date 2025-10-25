import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../shared/entities/user.entity';
import { CreditRequest } from '../shared/entities/credit-request.entity';
import { SavingsAccount } from '../shared/entities/savings-account.entity';
import { Transaction } from '../shared/entities/transaction.entity';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'root'),
  database: configService.get('DB_DATABASE', 'digital_credit_client'),
  entities: [User, CreditRequest, SavingsAccount, Transaction],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
});

