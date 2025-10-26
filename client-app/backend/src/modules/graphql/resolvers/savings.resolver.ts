import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SavingsService } from '../../savings/savings.service';
import {
  SavingsAccount,
  Transaction,
  DepositInput,
  WithdrawInput,
} from '../schemas/savings.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => SavingsAccount)
export class SavingsResolver {
  constructor(private readonly savingsService: SavingsService) {}

  @Query(() => SavingsAccount, { name: 'savingsAccount' })
  @UseGuards(JwtAuthGuard)
  async getSavingsAccount(@CurrentUser('id') userId: string): Promise<SavingsAccount> {
    return this.savingsService.getAccount(userId);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  @UseGuards(JwtAuthGuard)
  async getTransactions(
    @CurrentUser('id') userId: string,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<Transaction[]> {
    return this.savingsService.getTransactions(userId, limit);
  }

  @Mutation(() => Transaction, { name: 'deposit' })
  @UseGuards(JwtAuthGuard)
  async deposit(
    @CurrentUser('id') userId: string,
    @Args('input') input: DepositInput,
  ): Promise<Transaction> {
    return this.savingsService.deposit(userId, {
      amount: input.amount,
      description: input.description,
    });
  }

  @Mutation(() => Transaction, { name: 'withdraw' })
  @UseGuards(JwtAuthGuard)
  async withdraw(
    @CurrentUser('id') userId: string,
    @Args('input') input: WithdrawInput,
  ): Promise<Transaction> {
    return this.savingsService.withdraw(userId, {
      amount: input.amount,
      description: input.description,
    });
  }
}
