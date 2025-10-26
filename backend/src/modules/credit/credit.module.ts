import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditController } from './credit.controller';
import { CreditService } from './credit.service';
import { CreditRequest } from '../../shared/entities/credit-request.entity';
import { User } from '../../shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditRequest, User])],
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditModule {}
