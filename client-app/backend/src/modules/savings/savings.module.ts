import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { SavingsRepository } from './savings.repository';
import { SavingsAccount } from './entities/savings-account.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsAccount, Transaction])],
  controllers: [SavingsController],
  providers: [SavingsService, SavingsRepository],
  exports: [SavingsService],
})
export class SavingsModule {}

