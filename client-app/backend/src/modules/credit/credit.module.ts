import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditController } from './credit.controller';
import { CreditService } from './credit.service';
import { CreditRepository } from './credit.repository';
import { CreditRequest } from './entities/credit-request.entity';
import { CreditRepayment } from './entities/credit-repayment.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditRequest, CreditRepayment]),
    UsersModule,
  ],
  controllers: [CreditController],
  providers: [CreditService, CreditRepository],
  exports: [CreditService],
})
export class CreditModule {}

