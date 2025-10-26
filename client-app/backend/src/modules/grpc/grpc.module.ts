import { Module } from '@nestjs/common';
import { CreditGrpcService } from './services/credit-grpc.service';
import { SavingsGrpcService } from './services/savings-grpc.service';
import { UsersGrpcService } from './services/users-grpc.service';
import { CreditModule } from '../credit/credit.module';
import { SavingsModule } from '../savings/savings.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CreditModule, SavingsModule, UsersModule],
  providers: [CreditGrpcService, SavingsGrpcService, UsersGrpcService],
  exports: [CreditGrpcService, SavingsGrpcService, UsersGrpcService],
})
export class GrpcModule {}
