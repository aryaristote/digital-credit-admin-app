import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { SavingsRepository } from './savings.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSavingsAccountDto } from './dto/create-savings-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { SavingsAccountResponseDto } from './dto/savings-account-response.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { SavingsAccount } from './entities/savings-account.entity';
import { Transaction } from './entities/transaction.entity';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class SavingsService {
  constructor(
    private readonly savingsRepository: SavingsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createAccount(
    userId: string,
    createSavingsAccountDto: CreateSavingsAccountDto,
  ): Promise<SavingsAccountResponseDto> {
    // Check if user already has a savings account
    const existingAccount = await this.savingsRepository.findByUserId(userId);
    if (existingAccount) {
      throw new ConflictException('User already has a savings account');
    }

    // Generate account number
    const accountNumber = this.generateAccountNumber();

    // Create account
    const account = await this.savingsRepository.createAccount(
      userId,
      accountNumber,
      createSavingsAccountDto.initialDeposit || 0,
    );

    return this.toSavingsAccountResponseDto(account);
  }

  async getAccount(userId: string): Promise<SavingsAccountResponseDto> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }
    return this.toSavingsAccountResponseDto(account);
  }

  async deposit(
    userId: string,
    depositDto: DepositDto,
  ): Promise<TransactionResponseDto> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }

    if (account.status !== 'active') {
      throw new BadRequestException('Account is not active');
    }

    if (depositDto.amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than 0');
    }

    const transaction = await this.savingsRepository.executeDepositTransaction(
      account.id,
      depositDto.amount,
      depositDto.description || 'Deposit',
    );

    // Get updated account balance
    const updatedAccount = await this.savingsRepository.findByUserId(userId);

    // Create notification for deposit
    try {
      await this.notificationsService.createNotification(
        userId,
        'Deposit Successful',
        `Your deposit of ${depositDto.amount} has been processed. New balance: ${updatedAccount.balance}`,
        NotificationType.SUCCESS,
        '/savings',
        { transactionId: transaction.id, amount: depositDto.amount, balance: updatedAccount.balance },
      );
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Don't fail the deposit if notification fails
    }

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

    if (account.status !== 'active') {
      throw new BadRequestException('Account is not active');
    }

    if (withdrawDto.amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than 0');
    }

    if (Number(account.balance) < withdrawDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const transaction = await this.savingsRepository.executeWithdrawalTransaction(
      account.id,
      withdrawDto.amount,
      withdrawDto.description || 'Withdrawal',
    );

    // Get updated account balance
    const updatedAccount = await this.savingsRepository.findByUserId(userId);

    // Create notification for withdrawal
    try {
      await this.notificationsService.createNotification(
        userId,
        'Withdrawal Successful',
        `Your withdrawal of ${withdrawDto.amount} has been processed. New balance: ${updatedAccount.balance}`,
        NotificationType.SUCCESS,
        '/savings',
        { transactionId: transaction.id, amount: withdrawDto.amount, balance: updatedAccount.balance },
      );
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Don't fail the withdrawal if notification fails
    }

    return this.toTransactionResponseDto(transaction);
  }

  async getTransactions(userId: string): Promise<TransactionResponseDto[]> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }

    const transactions = await this.savingsRepository.getTransactions(account.id);
    return transactions.map((txn) => this.toTransactionResponseDto(txn));
  }

  async getBalance(userId: string): Promise<{ balance: number; accountNumber: string }> {
    const account = await this.savingsRepository.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Savings account not found');
    }

    return {
      balance: Number(account.balance),
      accountNumber: account.accountNumber,
    };
  }

  private generateAccountNumber(): string {
    const prefix = 'SAV';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  }

  private toSavingsAccountResponseDto(account: SavingsAccount): SavingsAccountResponseDto {
    return {
      id: account.id,
      userId: account.userId,
      accountNumber: account.accountNumber,
      balance: Number(account.balance),
      interestRate: Number(account.interestRate),
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  private toTransactionResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      savingsAccountId: transaction.savingsAccountId,
      type: transaction.type,
      amount: Number(transaction.amount),
      balanceAfter: Number(transaction.balanceAfter),
      status: transaction.status,
      description: transaction.description,
      reference: transaction.reference,
      createdAt: transaction.createdAt,
    };
  }
}

