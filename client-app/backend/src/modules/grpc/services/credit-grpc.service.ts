import { Injectable, Logger } from '@nestjs/common';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { CreditService } from '../../credit/credit.service';
import {
  CreditResponse,
  GetCreditRequest,
  GetUserCreditsRequest,
  CreateCreditRequestRequest,
  RepayCreditRequest,
  RepayCreditResponse,
  UserCreditsResponse,
} from '../proto/credit.pb';

@Injectable()
export class CreditGrpcService {
  private readonly logger = new Logger(CreditGrpcService.name);

  constructor(private readonly creditService: CreditService) {}

  async getCreditDetails(
    call: ServerUnaryCall<GetCreditRequest, CreditResponse>,
    callback: sendUnaryData<CreditResponse>,
  ): Promise<void> {
    try {
      const { credit_request_id, user_id } = call.request;
      const credit = await this.creditService.getCreditDetails(
        credit_request_id,
        user_id,
      );

      callback(null, {
        id: credit.id,
        user_id: credit.userId,
        requested_amount: credit.requestedAmount,
        approved_amount: credit.approvedAmount || 0,
        total_repaid: credit.totalRepaid,
        interest_rate: credit.interestRate,
        term_months: credit.termMonths,
        status: credit.status,
        purpose: credit.purpose || '',
        created_at: credit.createdAt.toISOString(),
      });
    } catch (error) {
      this.logger.error(`gRPC GetCreditDetails error: ${error.message}`);
      callback(error, null);
    }
  }

  async getUserCredits(
    call: ServerUnaryCall<GetUserCreditsRequest, UserCreditsResponse>,
    callback: sendUnaryData<UserCreditsResponse>,
  ): Promise<void> {
    try {
      const { user_id } = call.request;
      const credits = await this.creditService.getUserCredits(user_id);

      const creditsResponse = credits.map((credit) => ({
        id: credit.id,
        user_id: credit.userId,
        requested_amount: credit.requestedAmount,
        approved_amount: credit.approvedAmount || 0,
        total_repaid: credit.totalRepaid,
        interest_rate: credit.interestRate,
        term_months: credit.termMonths,
        status: credit.status,
        purpose: credit.purpose || '',
        created_at: credit.createdAt.toISOString(),
      }));

      callback(null, { credits: creditsResponse });
    } catch (error) {
      this.logger.error(`gRPC GetUserCredits error: ${error.message}`);
      callback(error, null);
    }
  }

  async createCreditRequest(
    call: ServerUnaryCall<CreateCreditRequestRequest, CreditResponse>,
    callback: sendUnaryData<CreditResponse>,
  ): Promise<void> {
    try {
      const { user_id, requested_amount, term_months, purpose } = call.request;
      const credit = await this.creditService.createCreditRequest(user_id, {
        requestedAmount: requested_amount,
        termMonths: term_months,
        purpose: purpose || '',
      });

      callback(null, {
        id: credit.id,
        user_id: credit.userId,
        requested_amount: credit.requestedAmount,
        approved_amount: credit.approvedAmount || 0,
        total_repaid: credit.totalRepaid,
        interest_rate: credit.interestRate,
        term_months: credit.termMonths,
        status: credit.status,
        purpose: credit.purpose || '',
        created_at: credit.createdAt.toISOString(),
      });
    } catch (error) {
      this.logger.error(`gRPC CreateCreditRequest error: ${error.message}`);
      callback(error, null);
    }
  }

  async repayCredit(
    call: ServerUnaryCall<RepayCreditRequest, RepayCreditResponse>,
    callback: sendUnaryData<RepayCreditResponse>,
  ): Promise<void> {
    try {
      const { user_id, credit_request_id, amount } = call.request;
      const result = await this.creditService.repayCredit(user_id, credit_request_id, {
        amount,
      });

      callback(null, {
        success: true,
        message: 'Repayment processed successfully',
        remaining_balance: result.remainingBalance || 0,
      });
    } catch (error) {
      this.logger.error(`gRPC RepayCredit error: ${error.message}`);
      callback(error, null);
    }
  }
}
