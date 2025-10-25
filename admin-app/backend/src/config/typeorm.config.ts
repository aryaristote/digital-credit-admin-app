import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'digital_credit_client'),
  entities: [join(__dirname, '..', 'modules', '**', '*.entity{.ts,.js}')],
  // Import shared entities from client app
  synchronize: false, // Admin app shouldn't modify schema
  logging: configService.get('NODE_ENV') === 'development',
});

