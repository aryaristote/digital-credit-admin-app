import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { CreditModule } from '../credit/credit.module';
import { SavingsModule } from '../savings/savings.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CreditModule, SavingsModule, UsersModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
