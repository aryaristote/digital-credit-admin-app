import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'digital_credit_client'),
  autoLoadEntities: true,
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
});

// For TypeORM CLI
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'digital_credit_client',
  entities: [join(__dirname, '..', 'modules', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
