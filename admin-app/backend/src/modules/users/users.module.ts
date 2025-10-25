import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../../shared/entities/user.entity';
import { SavingsAccount } from '../../shared/entities/savings-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SavingsAccount])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

