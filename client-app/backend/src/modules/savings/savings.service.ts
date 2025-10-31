import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SavingsRepository } from './savings.repository';
import { CreateSavingsAccountDto } from './dto/create-savings-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { SavingsAccountResponseDto } from './dto/savings-account-response.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { SavingsAccount } from './entities/savings-account.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';

@Injectable()
export class SavingsService {
  constructor(private readonly savingsRepository: SavingsRepository) {}

  async createAccount(
    userId: string,
    createSavingsAccountDto: CreateSavingsAccountDto,
  ): Promise<SavingsAccountResponseDto> {
    // Check if user already has an account
    const existingAccount = await this.savingsRepository.findByUserId(userId);
    if (existingAccount) {
      throw new BadRequestException('User already has a savings account');
    }

    // Generate account number
    const accountNumber = this.generateAccountNumber();

    // Create account with optional initial deposit
    const initialDeposit = createSavingsAccountDto.initialDeposit || 0;
    const account = await this.savingsRepository.createAccount(
      userId,
      accountNumber,
      initialDeposit,
    );

    // If there's an initial deposit, create a transaction record
    if (initialDeposit > 0) {
      await this.savingsRepository.createTransaction(
        account.id,
        TransactionType.DEPOSIT,
        initialDeposit,
        initialDeposit,
        'Initial deposit',
      );
    }

    return this.toAccountResponseDto(account);
  }

  async getAccount(userId: string): Promise<SavingsAccountResponseDto> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }
    return this.toAccountResponseDto(account);
  }

  async getBalance(userId: string): Promise<{ balance: number }> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }
    return { balance: Number(account.balance) };
  }

  async deposit(userId: string, depositDto: DepositDto): Promise<TransactionResponseDto> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }

    if (depositDto.amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    const transaction = await this.savingsRepository.executeDepositTransaction(
      account.id,
      depositDto.amount,
      depositDto.description,
    );

    return this.toTransactionResponseDto(transaction);
  }

  async withdraw(
    userId: string,
    withdrawDto: WithdrawDto,
  ): Promise<TransactionResponseDto> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }

    if (withdrawDto.amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than zero');
    }

    const currentBalance = Number(account.balance);
    if (withdrawDto.amount > currentBalance) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = await this.savingsRepository.executeWithdrawalTransaction(
      account.id,
      withdrawDto.amount,
      withdrawDto.description,
    );

    return this.toTransactionResponseDto(transaction);
  }

  async getTransactions(
    userId: string,
    limit: number = 10,
  ): Promise<TransactionResponseDto[]> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }

    const transactions = await this.savingsRepository.getTransactions(account.id, limit);
    return transactions.map((tx) => this.toTransactionResponseDto(tx));
  }

  private generateAccountNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `SAV-${timestamp}-${random}`;
  }

  private toAccountResponseDto(account: SavingsAccount): SavingsAccountResponseDto {
    return plainToClass(SavingsAccountResponseDto, account);
  }

  private toTransactionResponseDto(transaction: Transaction): TransactionResponseDto {
    return plainToClass(TransactionResponseDto, transaction);
  }
}
