import { Injectable, Logger } from '@nestjs/common';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { SavingsService } from '../../savings/savings.service';
import {
  AccountResponse,
  TransactionResponse,
  TransactionsResponse,
  GetAccountRequest,
  GetTransactionsRequest,
  DepositRequest,
  WithdrawRequest,
} from '../proto/savings.pb';

@Injectable()
export class SavingsGrpcService {
  private readonly logger = new Logger(SavingsGrpcService.name);

  constructor(private readonly savingsService: SavingsService) {}

  async getAccount(
    call: ServerUnaryCall<GetAccountRequest, AccountResponse>,
    callback: sendUnaryData<AccountResponse>,
  ): Promise<void> {
    try {
      const { user_id } = call.request;
      const account = await this.savingsService.getAccount(user_id);

      callback(null, {
        id: account.id,
        user_id: account.userId,
        account_number: account.accountNumber,
        balance: account.balance,
        interest_rate: account.interestRate,
        status: account.status,
      });
    } catch (error) {
      this.logger.error(`gRPC GetAccount error: ${error.message}`);
      callback(error, null);
    }
  }

  async getTransactions(
    call: ServerUnaryCall<GetTransactionsRequest, TransactionsResponse>,
    callback: sendUnaryData<TransactionsResponse>,
  ): Promise<void> {
    try {
      const { user_id, limit } = call.request;
      const transactions = await this.savingsService.getTransactions(
        user_id,
        limit || 10,
      );

      const transactionsResponse = transactions.map((tx) => ({
        id: tx.id,
        savings_account_id: tx.savingsAccountId,
        type: tx.type,
        amount: tx.amount,
        balance_after: tx.balanceAfter,
        status: tx.status,
        created_at: tx.createdAt.toISOString(),
      }));

      callback(null, { transactions: transactionsResponse });
    } catch (error) {
      this.logger.error(`gRPC GetTransactions error: ${error.message}`);
      callback(error, null);
    }
  }

  async deposit(
    call: ServerUnaryCall<DepositRequest, TransactionResponse>,
    callback: sendUnaryData<TransactionResponse>,
  ): Promise<void> {
    try {
      const { user_id, amount, description } = call.request;
      const transaction = await this.savingsService.deposit(user_id, {
        amount,
        description: description || '',
      });

      callback(null, {
        id: transaction.id,
        savings_account_id: transaction.savingsAccountId,
        type: transaction.type,
        amount: transaction.amount,
        balance_after: transaction.balanceAfter,
        status: transaction.status,
        created_at: transaction.createdAt.toISOString(),
      });
    } catch (error) {
      this.logger.error(`gRPC Deposit error: ${error.message}`);
      callback(error, null);
    }
  }

  async withdraw(
    call: ServerUnaryCall<WithdrawRequest, TransactionResponse>,
    callback: sendUnaryData<TransactionResponse>,
  ): Promise<void> {
    try {
      const { user_id, amount, description } = call.request;
      const transaction = await this.savingsService.withdraw(user_id, {
        amount,
        description: description || '',
      });

      callback(null, {
        id: transaction.id,
        savings_account_id: transaction.savingsAccountId,
        type: transaction.type,
        amount: transaction.amount,
        balance_after: transaction.balanceAfter,
        status: transaction.status,
        created_at: transaction.createdAt.toISOString(),
      });
    } catch (error) {
      this.logger.error(`gRPC Withdraw error: ${error.message}`);
      callback(error, null);
    }
  }
}
