import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreditService } from '../../credit/credit.service';
import {
  CreditRequest,
  CreateCreditRequestInput,
  RepayCreditInput,
} from '../schemas/credit.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => CreditRequest)
export class CreditResolver {
  constructor(private readonly creditService: CreditService) {}

  @Query(() => [CreditRequest], { name: 'myCredits' })
  @UseGuards(JwtAuthGuard)
  async getMyCredits(@CurrentUser('id') userId: string): Promise<any[]> {
    const credits = await this.creditService.getUserCredits(userId);
    return credits.map((credit) => ({
      id: credit.id,
      userId: credit.userId,
      requestedAmount: credit.requestedAmount,
      approvedAmount: credit.approvedAmount,
      totalRepaid: credit.totalRepaid,
      interestRate: credit.interestRate,
      termMonths: credit.termMonths,
      status: credit.status,
      purpose: credit.purpose,
      createdAt: credit.createdAt,
      updatedAt: credit.updatedAt,
    }));
  }

  @Query(() => CreditRequest, { name: 'credit' })
  @UseGuards(JwtAuthGuard)
  async getCredit(
    @Args('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<any> {
    const credit = await this.creditService.getCreditDetails(id, userId);
    return {
      id: credit.id,
      userId: credit.userId,
      requestedAmount: credit.requestedAmount,
      approvedAmount: credit.approvedAmount,
      totalRepaid: credit.totalRepaid,
      interestRate: credit.interestRate,
      termMonths: credit.termMonths,
      status: credit.status,
      purpose: credit.purpose,
      createdAt: credit.createdAt,
      updatedAt: credit.updatedAt,
    };
  }

  @Mutation(() => CreditRequest, { name: 'createCreditRequest' })
  @UseGuards(JwtAuthGuard)
  async createCreditRequest(
    @CurrentUser('id') userId: string,
    @Args('input') input: CreateCreditRequestInput,
  ): Promise<CreditRequest> {
    return this.creditService.createCreditRequest(userId, input);
  }

  @Mutation(() => CreditRequest, { name: 'repayCredit' })
  @UseGuards(JwtAuthGuard)
  async repayCredit(
    @Args('creditRequestId') creditRequestId: string,
    @Args('input') input: RepayCreditInput,
    @CurrentUser('id') userId: string,
  ): Promise<CreditRequest> {
    await this.creditService.repayCredit(userId, creditRequestId, {
      amount: input.amount,
    });
    return this.creditService.getCreditDetails(creditRequestId, userId);
  }
}
