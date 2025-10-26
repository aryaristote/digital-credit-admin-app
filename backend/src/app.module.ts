import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { UsersModule } from './modules/users/users.module';
import { CreditModule } from './modules/credit/credit.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (shared with client app)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    AdminsModule,
    UsersModule,
    CreditModule,
    AnalyticsModule,
    TransactionsModule,
  ],
})
export class AppModule {}

