import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User } from '../../shared/entities/user.entity';
import { CreditRequest } from '../../shared/entities/credit-request.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CreditRequest, SavingsAccount])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

