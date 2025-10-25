import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { BullModule } from '@nestjs/bull'; // Temporarily disabled - requires Redis
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SavingsModule } from './modules/savings/savings.module';
import { CreditModule } from './modules/credit/credit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),

    // Bull Queue for background jobs (temporarily disabled - requires Redis)
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get('REDIS_HOST', 'localhost'),
    //       port: configService.get('REDIS_PORT', 6379),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),

    // Feature modules
    AuthModule,
    UsersModule,
    SavingsModule,
    CreditModule,
    NotificationsModule,
    SessionsModule,
  ],
})
export class AppModule {}
